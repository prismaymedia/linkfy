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
      if (hostname === 'youtu.be' && /^\/[a-zA-Z0-9_-]+$/.test(pathname))
        return true;
      if (pathname.startsWith('/embed/')) return true;
      if (pathname.startsWith('/shorts/')) return true;
      if (pathname.startsWith('/playlist') && searchParams.has('list'))
        return true;
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

    if (
      hostname.includes('music.apple.com') ||
      hostname.includes('itunes.apple.com')
    ) {
      return /^\/([a-z]{2}\/)?(album|song|playlist)\//.test(pathname);
    }

    return false;
  } catch {
    return false;
  }
}

function extractUrlsFromText(text) {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(reportDetectedUrls, 1000);
  });
} else {
  setTimeout(reportDetectedUrls, 1000);
}

const observer = new MutationObserver(() => {
  setTimeout(reportDetectedUrls, 2000);
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
