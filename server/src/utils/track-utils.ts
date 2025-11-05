export function parseTrackInfo(title: string, channelTitle: string) {
  let trackName = title;
  let artistName = channelTitle;

  if (title.includes(' - ')) {
    const parts = title.split(' - ');
    if (parts.length >= 2) {
      artistName = parts[0].trim();
      trackName = parts.slice(1).join(' - ').trim();
    }
  } else if (title.includes(' by ')) {
    const parts = title.split(' by ');
    if (parts.length >= 2) {
      trackName = parts[0].trim();
      artistName = parts[1].trim();
    }
  }

  trackName = trackName
    .replace(/\s*\(Official.*?\)/gi, '')
    .replace(/\s*\[Official.*?\]/gi, '')
    .replace(/\s*- Official.*$/gi, '')
    .replace(/\s*\(Audio\)/gi, '')
    .replace(/\s*\[Audio\]/gi, '')
    .replace(/\s*\(Lyric.*?\)/gi, '')
    .replace(/\s*\[Lyric.*?\]/gi, '')
    .replace(/\s*\(HD\)/gi, '')
    .replace(/\s*\[HD\]/gi, '')
    .replace(/\s*\(4K.*?\)/gi, '')
    .replace(/\s*\[4K.*?\]/gi, '')
    .trim();

  return { trackName, artistName };
}

export function generateSpotifyStyleId(
  trackName: string,
  artistName: string,
): string {
  const input = `${trackName.toLowerCase()}-${artistName.toLowerCase()}`;
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 22; i++) {
    const charIndex = (input.charCodeAt(i % input.length) + i) % chars.length;
    result += chars[charIndex];
  }

  return result;
}
