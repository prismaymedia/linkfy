importScripts('config.js');

let jwtToken = null;
let tokenExpiry = null;

async function loadTokenFromStorage() {
  try {
    const result = await chrome.storage.local.get([
      'jwt_token',
      'token_expiry',
    ]);
    jwtToken = result.jwt_token || null;
    tokenExpiry = result.token_expiry || null;

    console.log(
      '[Auth] Token loaded from storage:',
      jwtToken ? 'Exists' : 'None',
    );
  } catch (err) {
    console.error('[Auth] Error loading token:', err);
  }
}

// Store token securely
async function storeToken(token, expiresIn = 3600) {
  jwtToken = token;
  tokenExpiry = Date.now() + expiresIn * 1000;

  await chrome.storage.local.set({
    jwt_token: jwtToken,
    token_expiry: tokenExpiry,
  });

  console.log('[Auth] Token stored, expires in', expiresIn, 'seconds');
}

// Validate token
function isTokenValid() {
  const valid = jwtToken && tokenExpiry && Date.now() < tokenExpiry;
  return valid;
}

// Make authenticated API request
async function makeAPIRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (isTokenValid()) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  } else {
    console.warn('[API] No valid token available');
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[API] Request error:', errorData);
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return await response.json();
}

const detectedUrlsByTab = new Map();

// Load detected URLs from storage on startup
async function loadDetectedUrlsFromStorage() {
  try {
    const result = await chrome.storage.local.get('detected_urls_by_tab');
    if (result.detected_urls_by_tab) {
      const allTabs = await chrome.tabs.query({});
      const existingTabIds = new Set(allTabs.map((tab) => tab.id));

      Object.entries(result.detected_urls_by_tab).forEach(([tabId, data]) => {
        const tabIdNum = Number(tabId);
        if (existingTabIds.has(tabIdNum)) {
          detectedUrlsByTab.set(tabIdNum, data);
          updateBadge(tabIdNum, data.urls.length);
        }
      });
    }
  } catch (err) {
    console.error('[BG] Error loading detected URLs:', err);
  }
}

// Save detected URLs to storage
async function saveDetectedUrlsToStorage() {
  try {
    const urlsObj = {};
    detectedUrlsByTab.forEach((data, tabId) => {
      urlsObj[tabId] = data;
    });
    await chrome.storage.local.set({ detected_urls_by_tab: urlsObj });
  } catch (err) {
    console.error('[BG] Error saving detected URLs:', err);
  }
}

importScripts('utils.js');

function filterValidUrls(urls) {
  return urls.filter((url) => isValidMusicUrl(url));
}

function updateBadge(tabId, urlCount) {
  try {
    if (urlCount > 0) {
      chrome.action.setBadgeText({
        tabId,
        text: urlCount.toString(),
      });
      chrome.action.setBadgeBackgroundColor({
        tabId,
        color: '#1DB954',
      });
    } else {
      chrome.action.setBadgeText({ tabId, text: '' });
    }
  } catch (err) {
    console.debug('[BG] Could not update badge for tab:', tabId);
  }
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (!jwtToken) await loadTokenFromStorage();

    try {
      const { action, data } = message;

      switch (action) {
        case 'SET_TOKEN':
          await storeToken(data.token, data.expiresIn);
          sendResponse({ success: true });
          break;

        case 'GET_AUTH_STATUS':
          sendResponse({
            success: true,
            data: { isAuthenticated: isTokenValid() },
          });
          break;

        case 'API_REQUEST':
          if (!isTokenValid()) throw new Error('No valid token');
          const result = await makeAPIRequest(data.endpoint, data.options);
          sendResponse({ success: true, data: result });
          break;

        case 'MUSIC_URLS_DETECTED': {
          const validUrls = filterValidUrls(data.urls || []);
          if (validUrls.length > 0 && sender.tab) {
            const tabId = sender.tab.id;
            detectedUrlsByTab.set(tabId, {
              urls: validUrls,
              pageUrl: data.pageUrl,
              pageTitle: data.pageTitle,
              timestamp: Date.now(),
            });
            updateBadge(tabId, validUrls.length);
            await saveDetectedUrlsToStorage();
          }
          sendResponse({ success: true, count: validUrls.length });
          break;
        }

        case 'GET_DETECTED_URLS': {
          if (sender.tab) {
            const tabData = detectedUrlsByTab.get(sender.tab.id);
            sendResponse({
              success: true,
              data: tabData || { urls: [], pageUrl: '', pageTitle: '' },
            });
          } else {

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs[0]) {
                const tabData = detectedUrlsByTab.get(tabs[0].id);
                sendResponse({
                  success: true,
                  data: tabData || { urls: [], pageUrl: '', pageTitle: '' },
                });
              } else {
                sendResponse({
                  success: true,
                  data: { urls: [], pageUrl: '', pageTitle: '' },
                });
              }
            });
            return true;
          }
          break;
        }

        case 'CLEAR_DETECTED_URLS': {
          if (sender.tab) {
            detectedUrlsByTab.delete(sender.tab.id);
            updateBadge(sender.tab.id, 0);
            await saveDetectedUrlsToStorage();
            sendResponse({ success: true });
          } else {

            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
              detectedUrlsByTab.delete(tabs[0].id);
              updateBadge(tabs[0].id, 0);
            }
            await saveDetectedUrlsToStorage();
            sendResponse({ success: true });
          }
          break;
        }

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  })();

  return true;
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  detectedUrlsByTab.delete(tabId);
  await saveDetectedUrlsToStorage();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

  if (changeInfo.url) {
    const storedData = detectedUrlsByTab.get(tabId);
    if (storedData && changeInfo.url !== storedData.pageUrl) {
      detectedUrlsByTab.delete(tabId);
      updateBadge(tabId, 0);
      await saveDetectedUrlsToStorage();
    }
  }
});

// Initialize token and detected URLs on extension startup or installation
chrome.runtime.onStartup.addListener(() => {
  loadTokenFromStorage();
  loadDetectedUrlsFromStorage();
});

chrome.runtime.onInstalled.addListener(() => {
  loadTokenFromStorage();
  loadDetectedUrlsFromStorage();

  // Create context menu
  chrome.contextMenus.create(
    {
      id: 'quickConvert',
      title: 'Convert Music',
      contexts: ['link'],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.log('[BG] Context menu error (ignored):', chrome.runtime.lastError.message);
      }
    }
  );
});

const conversionResults = new Map();

// Function to handle URL conversion
async function convertUrl(url) {
  const notificationId = `conversion-${Date.now()}`;

  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Linkfy',
    message: 'Converting link...',
    priority: 1
  });

  try {
    const result = await makeAPIRequest('/api/convert', {
      method: 'POST',
      body: JSON.stringify({ url, targetPlatform: 'spotify' })
    });

    // Clear progress notification
    chrome.notifications.clear(notificationId);

    // Show success notification
    const successNotificationId = `success-${Date.now()}`;

    // Store result for potential click handling
    conversionResults.set(successNotificationId, result);

    chrome.notifications.create(successNotificationId, {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Conversion Successful',
      message: `Opening: ${result.trackName} - ${result.artistName}`,
      priority: 1
    });

    setTimeout(() => {
      chrome.tabs.create({ url: result.spotifyUrl });
      setTimeout(() => {
        chrome.notifications.clear(successNotificationId);
      }, 2000);
    }, 500);

  } catch (error) {
    console.error('[BG] Conversion error:', error);
    chrome.notifications.clear(notificationId);

    const errorNotificationId = `error-${Date.now()}`;
    chrome.notifications.create(errorNotificationId, {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Conversion Error',
      message: error.message || 'An error occurred while converting the link.',
      priority: 2
    });
    setTimeout(() => {
      chrome.notifications.clear(errorNotificationId);
    }, 5000);
  }
}

// Auto-dismiss success notifications after 3 seconds
chrome.notifications.onClosed.addListener((notificationId) => {
  if (notificationId.startsWith('success-')) {
    conversionResults.delete(notificationId);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'quickConvert') {
    const url = info.linkUrl;
    console.log('[BG] Context menu clicked. URL:', url);

    if (url && isValidMusicUrl(url)) {
      // Call convertUrl directly
      convertUrl(url);
    } else {
      console.log('[BG] Invalid music URL:', url);
      chrome.notifications.create(`invalid-${Date.now()}`, {
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Invalid Link',
        message: 'The selected link is not a supported music link.',
        priority: 1
      });
    }
  }
});

console.log('[BG] Background script loaded');
