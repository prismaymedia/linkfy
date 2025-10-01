# ClickUp Task Creation System

## ✅ Setup Complete!

The ClickUp task creation system with full tag support is now configured.

## 🚀 Quick Start

### 1. Helper functions are already loaded in your shell

Open a new terminal or run:
```bash
source ~/.zshrc
```

### 2. Create tasks with one command

**Bug fixes** (Priority: High, Auto-tags: Q4-2025, phase-1, fix, critical-fix):
```bash
clickup_bug "Fix mobile layout" "Responsive issues on iPhone" client effort-medium
```

**New features** (Priority: Normal, Auto-tags: Q1-2026, phase-1, feat, user-experience):
```bash
clickup_feature "Add dark mode" "Theme toggle with Tailwind" client effort-small
```

**Performance** (Priority: High, Auto-tags: Q1-2026, phase-1, perf, performance):
```bash
clickup_perf "Add Redis cache" "Cache API responses" api effort-medium
```

**Infrastructure** (Priority: High, Auto-tags: Q4-2025, phase-1, chore, infrastructure):
```bash
clickup_infra "Setup Vercel" "Production deployment" effort-medium
```

### 3. Custom tasks with full control

```bash
clickup_task "Task title" "Description" 2 Q4-2025 phase-1 chore infra infrastructure effort-medium
```

## 📋 Available Tag Categories

### Quarter/Timeline
- `Q4-2025`, `Q1-2026`, `Q2-2026`, `Q3-2026`, `Q4-2026`, `Q1-2027`

### Phase
- `phase-1` (Foundation & Critical Fixes)
- `phase-2` (Feature Expansion & Quality)
- `phase-3` (Platform Expansion & AI)
- `phase-4` (Enterprise & Infrastructure)

### Type (Commit Convention)
- `feat` - New features
- `fix` - Bug fixes
- `chore` - Maintenance
- `perf` - Performance
- `refactor` - Code restructuring
- `docs` - Documentation
- `test` - Testing
- `style` - Formatting

### Scope
- `api` - Backend
- `client` - Frontend
- `extension` - Chrome addon
- `shared` - Shared code
- `auth` - Authentication
- `ui` - User interface
- `config` - Configuration
- `database` - Database
- `infra` - Infrastructure

### Category
- `critical-fix` - Critical bugs
- `performance` - Optimizations
- `user-experience` - UX improvements
- `testing` - Test coverage
- `platform-integration` - New platforms
- `security` - Security fixes
- `analytics` - Tracking
- `mobile` - Mobile features
- `accessibility` - A11y

### Effort
- `effort-small` (1-2 days)
- `effort-medium` (3-5 days)
- `effort-large` (1-2 weeks)
- `effort-xl` (2+ weeks)

### Dependencies (when applicable)
- `blocked` - Waiting on dependency
- `api-dependent` - Needs API changes
- `design-needed` - Needs design
- `review-required` - Needs review

## 🔧 Helper Functions Reference

### `clickup_task` - Full control
```bash
clickup_task "title" "description" priority tag1 tag2 tag3...
```

### `clickup_bug` - Quick bug creation
```bash
clickup_bug "title" "description" [scope] [effort]
```
Default: scope=client, effort=effort-medium

### `clickup_feature` - Quick feature creation
```bash
clickup_feature "title" "description" [scope] [effort]
```
Default: scope=client, effort=effort-medium

### `clickup_perf` - Quick performance task
```bash
clickup_perf "title" "description" [scope] [effort]
```
Default: scope=api, effort=effort-medium

### `clickup_infra` - Quick infrastructure task
```bash
clickup_infra "title" "description" [effort]
```
Default: effort=effort-medium

## 📁 Files

- `.vscode/clickup-config.md` - Complete configuration documentation
- `.vscode/clickup-helpers.sh` - Helper functions script
- `~/.zshrc` - Auto-loads helpers on shell start

## 🎯 Priority Values

- `1` = Urgent (red) - Production issues
- `2` = High (yellow) - Important work
- `3` = Normal (blue) - Standard tasks
- `4` = Low (gray) - Nice to have

## 📝 Examples

### Bug Fix Example
```bash
clickup_bug "Fix authentication timeout" "Session expires too quickly" auth effort-small
```

### Feature Example
```bash
clickup_feature "Add playlist export" "Export playlists to CSV" client effort-large
```

### Performance Example
```bash
clickup_perf "Optimize database queries" "Add indexes for common queries" database effort-medium
```

### Infrastructure Example
```bash
clickup_infra "Setup GitHub Actions" "CI/CD pipeline for tests and deployment" effort-large
```

## ✨ Why This Approach?

1. **Full Tag Support** - ClickUp API supports tags, MCP tools don't
2. **Faster Creation** - One command vs multiple steps
3. **Consistent Tagging** - Auto-applies standard tags
4. **Better Organization** - Tasks are properly categorized from creation
5. **Time Saving** - No manual tag assignment in UI

## 🔄 Updating

To update helper functions:
1. Edit `.vscode/clickup-helpers.sh`
2. Run `source ~/.zshrc` to reload

## 📚 Documentation

Full documentation in `.vscode/clickup-config.md`
