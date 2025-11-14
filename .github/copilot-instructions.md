# Copilot Instructions for Linkfy

## Project Overview

Universal music streaming URL converter. Convert links between Spotify, YouTube Music, Apple Music, and other platforms with real-time track preview and metadata extraction. Built with TypeScript.

- **Frontend**: React (Vite, TypeScript, Tailwind CSS, shadcn/ui)
- **Backend**: NestJS (TypeScript)
- **Browser Extensions**: Addons for popular browsers (Chrome, Firefox, Edge, Safari) - Manifest v3 compatible, shares code with client
- **Public API**: Monetizable REST API for third-party integrations and developers
- **External APIs**: Integrates YouTube Data API v3 and Spotify Web API

## Key Directories

- `client/`: React app, UI components, hooks, API calls, localization
- `server/`: NestJS backend, controllers, services, API integration, public API endpoints
- `shared/`: Common schemas and types
- `chrome-addon/`: Browser extension files (background, manifest, icons) - adaptable for multiple browsers

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
- **Extensions**: Browser addons use code from `client/` for UI consistency across platforms
- **Public API**: RESTful endpoints designed for monetization with rate limiting, authentication, and usage tracking

## Integration Points

- **YouTube API**: Requires API key in `server/.env`, used in `server/src/services/youtube.service.ts`
- **Spotify API**: Requires client ID/secret in `server/.env`, used in `server/src/services/spotify.service.ts`
- **Supabase**: Used for storage/auth, configured in `client/src/lib/supabaseClient.ts` and `server/src/supabase/`
- **Public API**: Monetizable endpoints with authentication, rate limiting, and usage analytics for third-party developers

## Examples

- To add a new music service, create a service in `server/src/services/`, update API endpoints in `server/src/controllers/`, and add UI in `client/src/components/`
- For new UI patterns, extend shadcn/ui components in `client/src/components/ui/`
- To adapt extension for new browsers, modify manifest and build configuration in `chrome-addon/` and `client/vite.extension.config.ts`
- For public API endpoints, ensure proper authentication, rate limiting, and monetization tracking are implemented

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

## ClickUp Task Management

### Creating Sprint Tasks

When instructed to create ClickUp tasks for a sprint, use the existing automation scripts located in `backlog/`:

**Environment Setup** (One-time):
```bash
export CLICKUP_MCP_API_KEY="your-api-key-here"
```

**Method 1: Create Custom Sprint Tasks** (Recommended for new sprints)

1. **Create task preview document**: Generate markdown file (`docs/SPRINT_X_Y_CLICKUP_PREVIEW.md`) with:
   - Sprint name and date range
   - All 16+ tasks with titles, descriptions, and hours
   - TIER 1 (must-have) and TIER 2 (should-have) breakdown
   - Complete subtasks and acceptance criteria for each task

2. **Run creation script**:
   ```bash
   # Make sure API key is set
   export CLICKUP_MCP_API_KEY="your-key"
   
   # Create tasks from preview using helper functions
   source backlog/clickup-helpers.sh
   
   # Examples:
   clickup_task "Task Title" "Description" 2 Q4-2025 sprint-5-6 feat client effort-large
   clickup_feature "Dark Mode" "Implement theme system" client effort-large
   clickup_bug "Fix bug title" "Description" client effort-medium
   clickup_perf "Redis Caching" "Add caching layer" api effort-medium
   ```

3. **Helper Functions Available**:
   - `clickup_task()` - Full custom task creation
   - `clickup_feature()` - Quick feature creation with tags
   - `clickup_bug()` - Quick bug fix creation
   - `clickup_perf()` - Quick performance task creation
   - `clickup_infra()` - Quick infrastructure task creation

**Method 2: Bulk Task Creation from JSON**

Use the pre-built script for standard sprints:
```bash
# For Sprint 3-4 tasks (already configured):
source backlog/create-clickup-tasks.sh

# This will create 8 pre-configured tasks with all details
```

**Key Files**:
- `backlog/clickup-helpers.sh` - Reusable helper functions (150+ lines)
- `backlog/create-clickup-tasks.sh` - Sprint 3-4 task template (173 lines)
- `docs/SPRINT_X_Y_CLICKUP_PREVIEW.md` - Task preview/checklist before creation

**List ID for Linkfy**: `901111127909`

**Task Priority Levels**:
- Priority 1 (🔥 HIGHEST): Critical features
- Priority 2 (🟠 HIGH): Important features
- Priority 3 (🟡 MEDIUM): Nice-to-have features
- Priority 4 (🟢 LOW): Future enhancements

**Tags Convention**:
- Sprint: `sprint-5-6`, `sprint-7-8`, etc.
- Type: `feat`, `fix`, `perf`, `refactor`, `chore`
- Scope: `client`, `api`, `extension`, `infra`
- Effort: `effort-small` (≤6h), `effort-medium` (6-12h), `effort-large` (12h+)
- Status: `Q4-2025`, `Q1-2026`, etc.

### Workflow Example

```bash
# 1. Create preview document (write as markdown)
docs/SPRINT_5_6_CLICKUP_PREVIEW.md

# 2. Source helper functions
source backlog/clickup-helpers.sh

# 3. Create tasks using helper functions
clickup_feature "Dark Mode Implementation" "Full theme system..." client effort-large
clickup_feature "Conversion Preview" "Real-time metadata..." client effort-medium
clickup_feature "Favorites System" "Save and manage favorites..." client effort-medium

# 4. Verify tasks created in ClickUp
# (Check ClickUp web interface for task list)
```

## Useful References

- `README.md`: Setup, API, architecture overview
- `shared/schema.ts`: Data models and validation
- `client/src/lib/queryClient.ts`: API state management
- `server/src/services/`: External API logic
- `backlog/clickup-helpers.sh`: ClickUp task automation
- `docs/SPRINT_*_CLICKUP_PREVIEW.md`: Sprint task checklists

---

For unclear conventions or missing details, ask for clarification or review the README and key files above.
