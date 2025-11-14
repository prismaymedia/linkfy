# ClickUp Task Automation Scripts

This directory contains bash scripts for automating ClickUp task creation for Linkfy sprints.

## Quick Start

```bash
# 1. Set your ClickUp API key (one-time setup)
export CLICKUP_MCP_API_KEY="your-api-key-here"

# 2. Run the sprint task creation script
source backlog/create-sprint-5-6-tasks.sh

# Or use helper functions for custom tasks
source backlog/clickup-helpers.sh
clickup_feature "Feature Name" "Description" client effort-large
```

## Files

### 📄 clickup-helpers.sh
**Reusable helper functions** for creating individual ClickUp tasks.

**Key Functions**:
- `clickup_task()` - Full custom task creation with tags
- `clickup_feature()` - Quick feature task creation
- `clickup_bug()` - Quick bug fix creation
- `clickup_perf()` - Quick performance task creation
- `clickup_infra()` - Quick infrastructure task creation

**Usage Example**:
```bash
source backlog/clickup-helpers.sh

# Create a feature task
clickup_feature "Dark Mode Implementation" "Implement theme system with CSS variables" client effort-large

# Create a bug fix task
clickup_bug "Fix login button" "Button not responding on mobile" client effort-medium

# Create a performance task
clickup_perf "Redis Caching Layer" "Add caching for API responses" api effort-large
```

### 📄 create-clickup-tasks.sh
**Sprint 3-4 task creation script** (already completed sprint).

Creates 8 pre-configured tasks for Sprint 3-4:
- Universal /api/convert endpoint (14h)
- Dynamic service icons (8h)
- Clean icon with hover actions (6h)
- Replace Get Started with Music Converter (10h)
- User menu position review (6h)
- Change /api/user-info category (8h)
- Dark mode implementation (14h)
- Smart URL handling features (14h)

**Usage**:
```bash
export CLICKUP_MCP_API_KEY="your-api-key"
source backlog/create-clickup-tasks.sh
```

### 📄 create-sprint-5-6-tasks.sh ⭐ **CURRENT SPRINT**
**Sprint 5-6 task creation script** (active sprint: Nov 13-24, 2025).

Creates 16 tasks organized by priority tier:

**TIER 1: MUST HAVE** (9 tasks, 58 hours)
1. Dark Mode Implementation (14h) ⭐ PRIORITY #1
2. Conversion Preview (10h)
3. Favorites/Bookmarks System (10h)
4. User Menu Position Review (6h)
5. Conversion History (10h)
6. Right-Click Context Menu - Extension (8h)
7. Auto URL Detection - Extension (8h)
8. Settings Panel (8h)
9. Notifications & Feedback (6h)

**TIER 2: SHOULD HAVE** (7 tasks, 22 hours)
10. Error Handling & Input Highlighting (4h)
11. Login Modal (5h)
12. Link Cursor & Hover Effects (4h)
13. Database Persistence (8h)
14. Security - URL Sanitization (4h)
15. CORS Configuration (3h)
16. Additional UX Polish (4h)

**Usage**:
```bash
export CLICKUP_MCP_API_KEY="your-api-key"
source backlog/create-sprint-5-6-tasks.sh
```

## Configuration

### ClickUp API Key
Get your API key from [ClickUp Account Settings](https://app.clickup.com/account/settings):

```bash
# Set environment variable (one-time per terminal session)
export CLICKUP_MCP_API_KEY="pk_..."

# Or add to ~/.zshrc for permanent setup
echo 'export CLICKUP_MCP_API_KEY="pk_..."' >> ~/.zshrc
source ~/.zshrc
```

### List ID
The scripts use the Linkfy ClickUp list:
- **List ID**: `901111127909`
- **Workspace**: Linkfy (prismaymedia)

To find your list ID:
1. Open ClickUp and navigate to your list
2. Copy the URL: `https://app.clickup.com/1234567/v/li/901111127909`
3. The number at the end is your list ID

## Tag Convention

Tags are automatically applied to organize tasks:

**Sprint Tags**:
- `sprint-5-6` - Current sprint (Nov 13-24, 2025)
- `sprint-7-8` - Next sprint (Nov 27 - Dec 8, 2025)

**Type Tags**:
- `feat` - Feature implementation
- `fix` - Bug fixes
- `perf` - Performance improvements
- `refactor` - Code refactoring
- `chore` - Maintenance/config

**Scope Tags**:
- `client` - Frontend/React changes
- `api` - Backend/NestJS changes
- `extension` - Browser extension changes
- `infra` - Infrastructure/DevOps
- `database` - Database changes
- `security` - Security improvements

**Effort Tags**:
- `effort-small` - ≤ 6 hours
- `effort-medium` - 6-12 hours
- `effort-large` - 12+ hours

**Priority Tags**:
- `critical-fix` - Critical bug fixes
- `user-experience` - UX improvements
- `performance` - Performance optimizations

**Status Tags**:
- `Q4-2025` - Q4 2025 sprint
- `Q1-2026` - Q1 2026 planning

## Priority Levels

```
Priority 1 (🔥 HIGHEST) - Critical/blocker tasks
Priority 2 (🟠 HIGH) - Important tasks
Priority 3 (🟡 MEDIUM) - Nice-to-have tasks
Priority 4 (🟢 LOW) - Future enhancements
```

## Creating Custom Tasks

Use the helper functions to create individual tasks:

```bash
source backlog/clickup-helpers.sh

# Full custom task with all parameters
clickup_task "Task Title" "Task description" 2 Q4-2025 sprint-5-6 feat client effort-large

# Quick feature task
clickup_feature "Dark Mode" "Implement theme toggle" client effort-large

# Quick bug fix
clickup_bug "Login button broken" "Button not clickable on mobile" client effort-medium

# Quick performance improvement
clickup_perf "Add Redis caching" "Cache API responses" api effort-large
```

## Task Documentation

Each task includes:
- ✅ **Title** - Clear, descriptive task name
- ✅ **Priority** - 1-4 scale (1 = highest)
- ✅ **Effort** - Time estimate in hours
- ✅ **Scope** - Which part of the project
- ✅ **Tags** - Auto-categorized by sprint, type, effort
- ✅ **Description** - Detailed task information
- ✅ **Acceptance Criteria** - Definition of done
- ✅ **Subtasks** - Breakdown of work items
- ✅ **Technical Notes** - Implementation hints

## Preview Documents

Before creating tasks, a preview document is created:
- `docs/SPRINT_5_6_CLICKUP_PREVIEW.md` - Current sprint preview

This preview includes all task details for review before creation.

## Error Handling

If tasks fail to create:

1. **Check API key**:
   ```bash
   echo $CLICKUP_MCP_API_KEY
   ```

2. **Verify list ID** - Make sure `LIST_ID` is set correctly

3. **Check rate limits** - ClickUp has rate limits; add delays between requests

4. **Review error message** - Script will show the error from ClickUp API

## Verifying Created Tasks

After running a script, verify tasks in ClickUp:

1. Go to [ClickUp Dashboard](https://app.clickup.com)
2. Navigate to the Linkfy workspace
3. Check the task list for newly created tasks
4. Verify task properties (priority, tags, time estimates)

## Sprint Workflow

### New Sprint Creation Workflow

1. **Create Preview Document**:
   ```bash
   # Create docs/SPRINT_X_Y_CLICKUP_PREVIEW.md with all tasks
   ```

2. **Review Preview**:
   - Check task titles, descriptions, estimates
   - Verify TIER 1/TIER 2 breakdown
   - Ensure total hours match sprint capacity

3. **Create Script**:
   ```bash
   # Copy create-sprint-5-6-tasks.sh to create-sprint-X-Y-tasks.sh
   # Update sprint dates, version, and task details
   ```

4. **Execute Script**:
   ```bash
   export CLICKUP_MCP_API_KEY="pk_..."
   source backlog/create-sprint-X-Y-tasks.sh
   ```

5. **Verify in ClickUp**:
   - Check all tasks created
   - Verify task properties
   - Add team member assignments

## Integration with Copilot

When instructed to create ClickUp tasks, Copilot will:

1. Create a preview document (`docs/SPRINT_X_Y_CLICKUP_PREVIEW.md`)
2. Source the appropriate creation script
3. Execute the script to create all tasks
4. Provide summary and task IDs

The workflow is documented in `.github/copilot-instructions.md`.

## Support

For issues or questions:

1. Check ClickUp API documentation: https://clickup.com/api/
2. Review task preview before creation
3. Verify API key and list ID
4. Check rate limiting (wait 1s between requests)

## Future Sprints

To add support for future sprints:

1. Create `docs/SPRINT_X_Y_CLICKUP_PREVIEW.md`
2. Create `backlog/create-sprint-X-Y-tasks.sh`
3. Update `.github/copilot-instructions.md`
4. Test script before committing

---

**Last Updated**: November 14, 2025  
**Current Sprint**: Sprint 5-6 (Nov 13-24, 2025)  
**Release Target**: v2.5.0
