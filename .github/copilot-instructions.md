# Copilot Instructions for Linkfy

## Project Overview

Universal music streaming URL converter. Convert links between Spotify, YouTube Music, Apple Music, and other platforms with real-time track preview and metadata extraction. Built with TypeScript.

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

## Commit Convention - MANDATORY

**ALWAYS** follow the Conventional Commits specification detailed in `docs/COMMIT_CONVENTION.md`:

### Required Format
```
<type>(optional scope): <description>

[optional body]

[optional footer(s)]
```

### Types and Version Impact
- **`feat`**: New features → MINOR version bump (1.2.3 → 1.3.0)
- **`fix`**: Bug fixes → PATCH version bump (1.2.3 → 1.2.4)  
- **`chore`**: Maintenance, build, config → no version bump
- **`docs`**: Documentation only
- **`style`**: Formatting, whitespace
- **`refactor`**: Code restructuring without feature/bug changes
- **`perf`**: Performance improvements
- **`test`**: Test additions or corrections

### Scopes for Linkfy
- **`api`**: server/ directory changes
- **`client`**: client/ directory changes  
- **`extension`**: chrome-addon/ directory changes
- **`shared`**: shared/ directory changes
- **`auth`**: Authentication related
- **`ui`**: User interface components
- **`config`**: Configuration files

### Description Requirements
- Use **imperative mood** ("add feature" not "added feature")
- Start with **lowercase letter**
- **No period** at the end
- Maximum **50 characters**

### Breaking Changes
- Add `!` after type: `feat!: description`
- OR add `BREAKING CHANGE:` in footer
- Triggers **MAJOR** version bump (1.2.3 → 2.0.0)

### Auto-detection for Copilot

| File Pattern | → Type | → Scope |
|-------------|--------|---------|
| `server/src/**` | `feat`/`fix`/`refactor` | `api` |
| `client/src/**` | `feat`/`fix`/`refactor` | `client` |
| `chrome-addon/**` | `feat`/`fix`/`chore` | `extension` |
| `shared/**` | `feat`/`fix`/`refactor` | `shared` |
| `*.md` files | `docs` | none |
| Config files | `chore` | `config` |

### Common Templates
```bash
feat(api): add [feature description]
fix(client): resolve [issue description]  
chore(deps): update [package] to v[version]
docs: update [section] documentation
refactor(auth): simplify [component]
```

## Useful References

- `README.md`: Setup, API, architecture overview
- `shared/schema.ts`: Data models and validation
- `client/src/lib/queryClient.ts`: API state management
- `server/src/services/`: External API logic

---

For unclear conventions or missing details, ask for clarification or review the README and key files above.
