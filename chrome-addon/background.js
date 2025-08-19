// Checks if the text is a YouTube Music or Spotify URL
function isMusicUrl(text) {
  const regex = /^https?:\/\/(music\.youtube\.com|open\.spotify\.com)\/.+$/i;
  return regex.test(text.trim());
}

let lastCopied = '';

// When the extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  console.log('Background ready 🚀');
});

// Listens for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_COPIED') {
    if (isMusicUrl(message.text)) {
      lastCopied = message.text;
      console.log('✅ URL saved:', lastCopied);

      chrome.storage.local.set({ lastCopied });
    } else {
      console.log('❌ Not a valid URL:', message.text);
    }
  }

  if (message.type === 'GET_LAST_COPIED') {
    sendResponse({ url: lastCopied });
  }
});
