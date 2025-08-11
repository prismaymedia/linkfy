console.log('Background script running');

// Aquí puedes agregar lógica para manejar eventos de la extensión
chrome.runtime.onInstalled.addListener(() => {
  console.log('Linkfy extension installed');
});
