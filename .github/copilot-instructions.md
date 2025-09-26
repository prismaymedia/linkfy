# Copilot Instructions for Linkfy

## Project Overview
Linkfy is a full-stack TypeScript project for converting YouTube Music URLs to Spotify URLs, featuring real-time track preview and metadata extraction. It consists of:
- **Frontend**: React (Vite, TypeScript, Tailwind CSS, shadcn/ui)
- **Backend**: NestJS (TypeScript)
- **Chrome Extension**: Manifest v3 compatible, shares code with client
- **APIs**: Integrates YouTube Data API v3 and Spotify Web API

## Key Directories
- `client/`: React app, UI components, hooks, API calls, localization
- `server/`: NestJS backend, controllers, services, API integration
- `shared/`: Common schemas and types
- `chrome-addon/`: Chrome extension files (background, manifest, icons)

## Developer Workflows
- **Install dependencies**: `yarn install` (root manages yarn workspace)
- **Start dev server**: `yarn dev` (client)
- **Run backend**: `yarn start` (server)
- **Environment setup**: Copy `.env.example` to `.env` in both `server/` and `client/` folders
- **Test endpoints**: Use HTTP files in `requests/` or Jest tests in `server/src/test/`

## Patterns & Conventions
- **API requests**: Use TanStack Query in frontend (`client/src/lib/queryClient.ts`)
- **Validation**: Zod schemas for request/response types (`shared/schema.ts`)
- **Service boundaries**: Backend services in `server/src/services/` handle external API logic
- **Error handling**: Centralized filter in `server/src/global.filter.ts`
- **UI**: Use shadcn/ui components from `client/src/components/ui/`
- **Localization**: Add translations in `client/src/locales/`
- **Extension**: Chrome extension uses code from `client/` for UI consistency

## Integration Points
- **YouTube API**: Requires API key in `server/.env`, used in `server/src/services/youtube.service.ts`
- **Spotify API**: Requires client ID/secret in `server/.env`, used in `server/src/services/spotify.service.ts`
- **Supabase**: Used for storage/auth, configured in `client/src/lib/supabaseClient.ts` and `server/src/supabase/`

## Examples
- To add a new music service, create a service in `server/src/services/`, update API endpoints in `server/src/controllers/`, and add UI in `client/src/components/`
- For new UI patterns, extend shadcn/ui components in `client/src/components/ui/`

## Security & Testing
- API keys/secrets must be in `.env` files (server/.env, client/.env) - never hardcoded
- All endpoints validate input with Zod
- Use Jest for backend tests (`server/src/test/`)

## Useful References
- `README.md`: Setup, API, architecture overview
- `shared/schema.ts`: Data models and validation
- `client/src/lib/queryClient.ts`: API state management
- `server/src/services/`: External API logic

---
For unclear conventions or missing details, ask for clarification or review the README and key files above.