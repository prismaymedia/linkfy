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
      // Playlists are not supported - only individual tracks and albums
      if (pathname.startsWith('/playlist')) {
        return false;
      }
      if (pathname === '/watch' && searchParams.has('v')) return true;
      if (hostname === 'youtu.be' && /^\/[a-zA-Z0-9_-]+$/.test(pathname))
        return true;
      if (pathname.startsWith('/embed/')) return true;
      if (pathname.startsWith('/shorts/')) return true;
      return false;
    }

    if (hostname === 'open.spotify.com') {
      return /^\/(track|album)\/[a-zA-Z0-9]+$/.test(pathname);
    }

    if (hostname.includes('deezer.com')) {
      if (hostname === 'link.deezer.com') {
        return /^\/s\/[a-zA-Z0-9]+$/.test(pathname);
      }
      return /^\/(track|album)\/[0-9]+$/.test(pathname);
    }

    if (
      hostname.includes('music.apple.com') ||
      hostname.includes('itunes.apple.com')
    ) {
      return /^\/([a-z]{2}\/)?(album|song)\//.test(pathname);
    }

    return false;
  } catch {
    return false;
  }
}
