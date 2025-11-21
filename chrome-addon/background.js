const API_BASE_URL = 'https://linkfy-production.up.railway.app';

let jwtToken = null;
let tokenExpiry = null;

// Load token from storage
async function loadTokenFromStorage() {
  try {
    const result = await chrome.storage.local.get([
      'jwt_token',
      'token_expiry',
    ]);
    jwtToken = result.jwt_token || null;
    tokenExpiry = result.token_expiry || null;

    // Log only if token exists
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

// Store detected URLs per tab (in-memory cache)
const detectedUrlsByTab = new Map();

// Load detected URLs from storage on startup
async function loadDetectedUrlsFromStorage() {
  try {
    const result = await chrome.storage.local.get('detected_urls_by_tab');
    if (result.detected_urls_by_tab) {
      // Verify tabs still exist before restoring
      const allTabs = await chrome.tabs.query({});
      const existingTabIds = new Set(allTabs.map(tab => tab.id));
      
      Object.entries(result.detected_urls_by_tab).forEach(([tabId, data]) => {
        const tabIdNum = Number(tabId);
        // Only restore if tab still exists
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

// URL validation patterns
const VALID_HOSTS = [
  'music.youtube.com',
  'youtube.com',
  'youtu.be',
  'm.youtube.com',
  'open.spotify.com',
  'deezer.com',
  'link.deezer.com',
  'music.apple.com',
  'itunes.apple.com',
];

function isValidMusicUrl(urlString) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    const { pathname, searchParams } = url;

    if (!VALID_HOSTS.includes(hostname)) {
      return false;
    }

    if (hostname.includes('youtube') || hostname === 'youtu.be') {
      if (pathname.startsWith('/@') || pathname.startsWith('/channel/')) {
        return false;
      }
      if (pathname === '/watch' && searchParams.has('v')) return true;
      if (hostname === 'youtu.be' && /^\/[a-zA-Z0-9_-]+$/.test(pathname)) return true;
      if (pathname.startsWith('/embed/')) return true;
      if (pathname.startsWith('/shorts/')) return true;
      if (pathname.startsWith('/playlist') && searchParams.has('list')) return true;
      return false;
    }

    if (hostname === 'open.spotify.com') {
      return /^\/(track|album|playlist)\/[a-zA-Z0-9]+$/.test(pathname);
    }

    if (hostname.includes('deezer.com')) {
      if (hostname === 'link.deezer.com') {
        return /^\/s\/[a-zA-Z0-9]+$/.test(pathname);
      }
      return /^\/(track|album|playlist|artist)\/[0-9]+$/.test(pathname);
    }

    if (hostname.includes('music.apple.com') || hostname.includes('itunes.apple.com')) {
      return /^\/([a-z]{2}\/)?(album|song|playlist)\//.test(pathname);
    }

    return false;
  } catch {
    return false;
  }
}

function filterValidUrls(urls) {
  return urls.filter(url => isValidMusicUrl(url));
}

function updateBadge(tabId, urlCount) {
  try {
    if (urlCount > 0) {
      chrome.action.setBadgeText({
        tabId,
        text: urlCount.toString(),
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#1DB954',
      });
    } else {
      chrome.action.setBadgeText({ tabId, text: '' });
    }
  } catch (err) {
    // Tab may not exist anymore, ignore error
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

        case 'MUSIC_URLS_DETECTED':
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

        case 'GET_DETECTED_URLS':
          if (sender.tab) {
            const tabData = detectedUrlsByTab.get(sender.tab.id);
            sendResponse({
              success: true,
              data: tabData || { urls: [], pageUrl: '', pageTitle: '' },
            });
          } else {
            // Get active tab when message comes from popup
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
            return true; // Keep channel open for async response
          }
          break;

        case 'CLEAR_DETECTED_URLS':
          if (sender.tab) {
            detectedUrlsByTab.delete(sender.tab.id);
            updateBadge(sender.tab.id, 0);
            await saveDetectedUrlsToStorage();
            sendResponse({ success: true });
          } else {
            // Get active tab when message comes from popup
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
              if (tabs[0]) {
                detectedUrlsByTab.delete(tabs[0].id);
                updateBadge(tabs[0].id, 0);
              }
              await saveDetectedUrlsToStorage();
              sendResponse({ success: true });
            });
            return true; // Keep channel open for async response
          }
          break;

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

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    detectedUrlsByTab.delete(tabId);
    updateBadge(tabId, 0);
    await saveDetectedUrlsToStorage();
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
});

// Load on startup
loadDetectedUrlsFromStorage();

console.log('[BG] Background script loaded');
