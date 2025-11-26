function extractUrlsFromText(text) {
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
  const matches = text.match(urlRegex) || [];
  return matches.filter((url) => isValidMusicUrl(url));
}

function scanPageForMusicUrls() {
  const detectedUrls = new Set();

  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    const href = link.href;
    if (href && isValidMusicUrl(href)) {
      detectedUrls.add(href);
    }
  });

  const contentSelectors = [
    'article',
    'main',
    '[role="article"]',
    '.post',
    '.content',
    'p',
  ];
  contentSelectors.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        const text = el.textContent || '';
        const urls = extractUrlsFromText(text);
        urls.forEach((url) => detectedUrls.add(url));
      });
    } catch (e) {}
  });

  return Array.from(detectedUrls);
}

function reportDetectedUrls() {
  const urls = scanPageForMusicUrls();

  if (urls.length > 0) {
    chrome.runtime
      .sendMessage({
        action: 'MUSIC_URLS_DETECTED',
        data: {
          urls,
          pageUrl: window.location.href,
          pageTitle: document.title,
        },
      })
      .catch(() => {});
  }
}

// Debounce reporting to avoid excessive messages on dynamic pages
let reportTimeout;
const debouncedReport = () => {
  clearTimeout(reportTimeout);
  reportTimeout = setTimeout(reportDetectedUrls, 1500);
};

// Initial scan after page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', debouncedReport);
} else {
  debouncedReport();
}

// Observe DOM changes to detect dynamically loaded content
const observer = new MutationObserver(debouncedReport);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
