# Linkfy

A React application that converts YouTube Music URLs to Spotify URLs with real-time track preview and authentic metadata extraction.

[![Run on Replit](https://replit.com/badge/github/YOUR_USERNAME/linkfy)](https://replit.com/new/github/YOUR_USERNAME/linkfy)

## Features

- **Real-time Track Preview**: Shows song information as you type YouTube Music URLs
- **Authentic API Integration**: Uses YouTube Data API v3 and Spotify Web API for real track data
- **Smart Track Matching**: Advanced search algorithms to find accurate Spotify matches
- **One-click Copy**: Copy Spotify URLs directly to clipboard
- **Chrome Extension Ready**: Built with extension compatibility in mind
- **Clean UI**: Modern design with Spotify branding

## Demo

1. Paste a YouTube Music URL (e.g., `https://music.youtube.com/watch?v=dQw4w9WgXcQ`)
2. See instant track preview with thumbnail and metadata
3. Click "Convert to Spotify" to find the matching track
4. Copy the Spotify URL with one click

## Setup

### Prerequisites

- Node.js 20+
- YouTube Data API v3 key
- Spotify API credentials (Client ID & Secret)

### Quick Start with Replit

Click the "Run on Replit" button above to instantly fork and run this project in your browser. No local setup required!

### Local Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd linkfy
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Add your API credentials to `.env`:
```env
YOUTUBE_API_KEY=your_youtube_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Getting API Keys

#### YouTube Data API v3
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

#### Spotify Web API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy Client ID and Client Secret
4. Add to your `.env` file

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## API Endpoints

### `POST /api/youtube-info`
Get YouTube track metadata without conversion.

**Request:**
```json
{
  "youtubeUrl": "https://music.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "trackName": "Never Gonna Give You Up",
  "artistName": "Rick Astley",
  "thumbnailUrl": "https://i.ytimg.com/vi/VIDEO_ID/mqdefault.jpg",
  "originalTitle": "Never Gonna Give You Up (4K Remaster)"
}
```

### `POST /api/convert`
Convert YouTube Music URL to Spotify track.

**Request:**
```json
{
  "youtubeUrl": "https://music.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "spotifyUrl": "https://open.spotify.com/track/TRACK_ID",
  "trackName": "Never Gonna Give You Up",
  "artistName": "Rick Astley",
  "albumName": "Whenever You Need Somebody",
  "thumbnailUrl": "https://i.scdn.co/image/ab67616d0000b273..."
}
```

## Architecture

- **Frontend**: React + TypeScript with Vite
- **Backend**: Express.js with TypeScript
- **APIs**: YouTube Data API v3, Spotify Web API
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: TanStack Query for API state management
- **Validation**: Zod schemas for type-safe API calls

## Chrome Extension Compatibility

The application is structured for easy Chrome extension conversion:

- Single-page application design
- No external dependencies in content scripts
- Popup-friendly responsive layout
- Manifest v3 ready architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Security

- API keys are protected via environment variables
- No sensitive data is logged or stored
- CORS protection enabled
- Input validation on all endpoints

## Support

For issues or questions, please open a GitHub issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- API error logs (if applicable)