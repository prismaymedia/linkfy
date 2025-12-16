function extractUrlsFromText(text) {
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
  const matches = text.match(urlRegex) || [];
  return matches.filter((url) => isValidMusicUrl(url));
}

function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);

    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname === 'youtu.be') {
      let videoId = null;

      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1).split('?')[0];
      }
      else if (urlObj.pathname === '/watch') {
        videoId = urlObj.searchParams.get('v');
      }
      else if (urlObj.pathname.startsWith('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1].split('?')[0];
      }
      else if (urlObj.pathname.startsWith('/shorts/')) {
        videoId = urlObj.pathname.split('/shorts/')[1].split('?')[0];
      }

      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }

    // For Spotify URLs, extract track/album ID
    if (urlObj.hostname === 'open.spotify.com') {
      const match = urlObj.pathname.match(/^\/(track|album)\/([a-zA-Z0-9]+)/);
      if (match) {
        return `https://open.spotify.com/${match[1]}/${match[2]}`;
      }
    }
    return url;
  } catch {
    return url;
  }
}

function scanPageForMusicUrls() {
  const detectedUrls = new Map();

  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;

  const isSearchOrBrowsePage =
    currentPath.includes('/results') ||
    currentPath.includes('/search') ||
    currentPath.includes('/browse') ||
    currentPath.includes('/playlist') ||
    currentPath.startsWith('/@') ||
    currentPath.startsWith('/channel/');

  if (!isSearchOrBrowsePage && isValidMusicUrl(currentUrl)) {
    const normalized = normalizeUrl(currentUrl);
    detectedUrls.set(normalized, currentUrl);
  }

  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    const href = link.href;
    if (href && isValidMusicUrl(href)) {
      const normalized = normalizeUrl(href);
      if (!detectedUrls.has(normalized)) {
        detectedUrls.set(normalized, href);
      }
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
        urls.forEach((url) => {
          const normalized = normalizeUrl(url);
          if (!detectedUrls.has(normalized)) {
            detectedUrls.set(normalized, url);
          }
        });
      });
    } catch (e) { console.debug('[Content] Error extracting text:', e); }
  });

  return Array.from(detectedUrls.values());
}

function reportDetectedUrls() {
  const urls = scanPageForMusicUrls();

  if (urls.length > 0) {
    if (!chrome.runtime?.id) {
      console.debug('[Content] Extension context invalidated, skipping URL report');
      return;
    }

    chrome.runtime
      .sendMessage({
        action: 'MUSIC_URLS_DETECTED',
        data: {
          urls,
          pageUrl: window.location.href,
          pageTitle: document.title,
        },
      })
      .catch((error) => {
        if (error.message?.includes('Extension context invalidated')) {
          console.debug('[Content] Extension was reloaded');
        }
      });
  }
}

let reportTimeout;
const debouncedReport = () => {
  clearTimeout(reportTimeout);
  reportTimeout = setTimeout(reportDetectedUrls, 1500);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', debouncedReport);
} else {
  debouncedReport();
}

const observer = new MutationObserver(debouncedReport);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
