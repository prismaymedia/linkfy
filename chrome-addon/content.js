document.addEventListener('copy', async () => {
  try {
    const text = await navigator.clipboard.readText();
    console.log('[Content] Texto copiado:', text);

    // Mandar al background
    chrome.runtime.sendMessage({ type: 'SAVE_COPIED', text });
  } catch (err) {
    console.error('Error al leer portapapeles:', err);
  }
});
