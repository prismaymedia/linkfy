# ClickUp Task Creation System

## ✅ Setup Complete!

The ClickUp task creation system with full tag support is now configured.

## 🚀 Quick Start

### 1. Helper functions are already loaded in your shell

Open a new terminal or run:
```bash
source ~/.zshrc
# Or manually (from project root):
source ./backlog/clickup-helpers.sh
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

### Standard Functions (No ROADMAP sync)

#### `clickup_task` - Full control
```bash
clickup_task "title" "description" priority tag1 tag2 tag3...
```

#### `clickup_bug` - Quick bug creation
```bash
clickup_bug "title" "description" [scope] [effort]
```
Default: scope=client, effort=effort-medium

#### `clickup_feature` - Quick feature creation
```bash
clickup_feature "title" "description" [scope] [effort]
```
Default: scope=client, effort=effort-medium

#### `clickup_perf` - Quick performance task
```bash
clickup_perf "title" "description" [scope] [effort]
```
Default: scope=api, effort=effort-medium

#### `clickup_infra` - Quick infrastructure task
```bash
clickup_infra "title" "description" [effort]
```
Default: effort=effort-medium

---

### ✨ NEW: Functions with ROADMAP Sync (Recommended)

These functions automatically update ROADMAP.md with task links and status.

#### `clickup_task_with_sync` - Full control with ROADMAP sync
```bash
clickup_task_with_sync "title" "description" priority tag1 tag2 tag3...
```

#### `clickup_bug_sync` - Quick bug with sync
```bash
clickup_bug_sync "title" "description" [scope] [effort] [assignee]
```

#### `clickup_feature_sync` - Quick feature with sync
```bash
clickup_feature_sync "title" "description" [scope] [effort] [assignee]
```

#### `clickup_perf_sync` - Quick performance with sync
```bash
clickup_perf_sync "title" "description" [scope] [effort] [assignee]
```

#### `clickup_infra_sync` - Quick infrastructure with sync
```bash
clickup_infra_sync "title" "description" [effort] [assignee]
```

### 📝 ROADMAP Management Functions

#### `update_roadmap` - Manually update ROADMAP.md
```bash
update_roadmap "task_name" "task_id" "task_url" "[status]" "[assignee]"
```
Status: 🔄 (in progress), 👀 (review), ✅ (completed), 🚧 (blocked), 📅 (scheduled)

#### `mark_completed` - Mark task as done
```bash
mark_completed "task_name"
```

#### `mark_review` - Mark task in review
```bash
mark_review "task_name"
```

#### `mark_blocked` - Mark task as blocked
```bash
mark_blocked "task_name"
```

---

## 📁 Files

- `backlog/clickup-config.md` - Complete configuration documentation
- `backlog/clickup-helpers.sh` - Helper functions script
- `backlog/CLICKUP_SETUP.md` - This file (quick start guide)
- `ROADMAP.md` - Development roadmap (auto-updated by sync functions)
- `docs/Q4_2025_SPRINT_PLAN.md` - Sprint plan with task breakdown
- `~/.zshrc` - Auto-loads helpers on shell start

## 🎯 Priority Values

- `1` = Urgent (red) - Production issues
- `2` = High (yellow) - Important work
- `3` = Normal (blue) - Standard tasks
- `4` = Low (gray) - Nice to have

## 📝 Examples

### Standard Creation (No ROADMAP sync)

#### Bug Fix Example
```bash
clickup_bug "Fix authentication timeout" "Session expires too quickly" auth effort-small
```

#### Feature Example
```bash
clickup_feature "Add playlist export" "Export playlists to CSV" client effort-large
```

#### Performance Example
```bash
clickup_perf "Optimize database queries" "Add indexes for common queries" database effort-medium
```

#### Infrastructure Example
```bash
clickup_infra "Setup GitHub Actions" "CI/CD pipeline for tests and deployment" effort-large
```

---

### ✨ NEW: With ROADMAP Sync (Recommended)

#### Bug Fix with Sync
```bash
clickup_bug_sync "Fix mobile responsive layout" "Fix layout issues on iPhone" client effort-medium
# ✅ Task created in ClickUp
# ✅ ROADMAP.md updated with: - [ ] Fix mobile responsive layout → [#123](url) 🔄
```

#### Feature with Sync
```bash
clickup_feature_sync "Add dark mode" "Implement theme toggle with Tailwind" client effort-small "dev1"
# ✅ Task created and assigned to dev1
# ✅ ROADMAP.md updated with assignee
```

#### Performance with Sync
```bash
clickup_perf_sync "Implement Redis caching" "Add caching layer for API responses" api effort-medium "dev2"
# ✅ Task created
# ✅ ROADMAP.md automatically updated
```

#### Update Task Status
```bash
# Mark as completed
mark_completed "Fix mobile responsive layout"
# Updates: - [x] Fix mobile responsive layout → [#123](url) ✅

# Mark as in review
mark_review "Add dark mode"
# Updates: - [ ] Add dark mode → [#124](url) 👀

# Mark as blocked
mark_blocked "Implement API integration"
# Updates: - [ ] Implement API integration → [#125](url) 🚧
```

#### Manual ROADMAP Update
```bash
update_roadmap "Task name" "abc123" "https://app.clickup.com/t/abc123" "🔄" "dev1"
```

---

## 🔄 Workflow with ROADMAP Sync

1. **Create task with sync function**:
   ```bash
   clickup_bug_sync "Fix mobile layout" "Description..." client effort-medium
   ```

2. **ROADMAP.md is automatically updated**:
   ```markdown
   - [ ] Fix mobile layout → [#abc123](https://...) 🔄
   ```

3. **Work on the task** in ClickUp

4. **When completed**, mark it:
   ```bash
   mark_completed "Fix mobile layout"
   ```

5. **Commit the changes**:
   ```bash
   git add ROADMAP.md
   git commit -m "docs(roadmap): update task status for Sprint X"
   ```

---

## ✨ Why This Approach?

1. **Full Tag Support** - ClickUp API supports tags, MCP tools don't
2. **Faster Creation** - One command vs multiple steps
3. **Consistent Tagging** - Auto-applies standard tags
4. **Better Organization** - Tasks are properly categorized from creation
5. **Time Saving** - No manual tag assignment in UI
6. **✨ NEW: ROADMAP Sync** - Auto-update roadmap with task links and status
7. **✨ NEW: Progress Tracking** - Easy to see what's in progress vs completed
8. **✨ NEW: Team Visibility** - Everyone knows what's being worked on

## 🔄 Updating

To update helper functions:
1. Edit `backlog/clickup-helpers.sh`
2. Run `source ~/.zshrc` to reload

## 📚 Documentation

- **Full documentation**: `backlog/clickup-config.md`
- **Roadmap**: `ROADMAP.md`
- **Sprint Plan**: `docs/Q4_2025_SPRINT_PLAN.md`

