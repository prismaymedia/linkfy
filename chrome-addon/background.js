const API_BASE_URL = 'https://linkfy-production.up.railway.app/';

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

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  })();

  return true;
});

// Initialize token on extension startup or installation
chrome.runtime.onStartup.addListener(loadTokenFromStorage);
chrome.runtime.onInstalled.addListener(loadTokenFromStorage);

console.log('[BG] Background script loaded');
