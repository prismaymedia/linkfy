document.addEventListener('copy', async () => {
  try {
    const text = await navigator.clipboard.readText();
    console.log('[Content] Copied text:', text);

    // Send to background
    chrome.runtime.sendMessage({ type: 'SAVE_COPIED', text });
  } catch (err) {
    console.error('Error reading clipboard:', err);
  }
});
