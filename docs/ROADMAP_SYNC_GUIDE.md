# 🔄 ROADMAP Sync Guide

## Overview

This guide explains how to keep ROADMAP.md synchronized with ClickUp tasks for better team visibility and progress tracking.

## 🎯 Why Sync ROADMAP with ClickUp?

### Benefits:
- ✅ **Team Visibility** - Everyone sees what's actively being worked on
- ✅ **Easy Tracking** - Find ClickUp tasks directly from the roadmap
- ✅ **Git History** - Track development progress over time
- ✅ **No Manual Work** - Automatic updates with helper functions
- ✅ **Status at a Glance** - Visual indicators show task status

---

## 📊 Status Indicators

| Indicator | Meaning | When to Use |
|-----------|---------|-------------|
| `🔄` | In Progress | Task is actively being worked on |
| `👀` | In Review | Pull request is under review |
| `✅` | Completed | Task is done and merged |
| `🚧` | Blocked | Waiting on dependencies |
| `📅` | Scheduled | Planned but not started |

---

## 🚀 Quick Start

### 1. Create Task with Auto-Sync

```bash
# Bug fix with sync
clickup_bug_sync "Fix mobile responsive layout" "Fix layout issues on iPhone" client effort-medium

# Feature with sync and assignee
clickup_feature_sync "Add dark mode" "Theme toggle with Tailwind" client effort-small "dev1"

# Performance task with sync
clickup_perf_sync "Implement Redis caching" "Add caching layer" api effort-medium "dev2"
```

**Result in ROADMAP.md:**
```markdown
- [ ] Fix mobile responsive layout → [#abc123](https://app.clickup.com/t/abc123) 🔄
- [ ] Add dark mode → [#abc124](https://app.clickup.com/t/abc124) 🔄 **@dev1**
- [ ] Implement Redis caching → [#abc125](https://app.clickup.com/t/abc125) 🔄 **@dev2**
```

### 2. Update Task Status

```bash
# When task is in review
mark_review "Fix mobile responsive layout"

# When task is completed
mark_completed "Fix mobile responsive layout"

# When task is blocked
mark_blocked "Implement API integration"
```

**Result in ROADMAP.md:**
```markdown
- [ ] Fix mobile responsive layout → [#abc123](url) 👀  # In review
- [x] Fix mobile responsive layout → [#abc123](url) ✅  # Completed
- [ ] Implement API integration → [#abc126](url) 🚧     # Blocked
```

### 3. Commit Changes

```bash
git add ROADMAP.md
git commit -m "docs(roadmap): update Sprint 1-2 task status

- Mark 'Fix mobile layout' as completed ✅
- Mark 'Add dark mode' as in review 👀
- Update progress indicators"
```

---

## 📝 Complete Workflow Example

### Sprint 1-2: Critical Stability

**Initial State (ROADMAP.md):**
```markdown
### Sprint 1-2 (Oct 1-15, 2025) - Critical Stability 🔴

**Status**: 📅 Not Started | **Progress**: 0/6 tasks completed

#### Week 1 - High Impact Bug Fixes
- [ ] Fix mobile responsive layout issues (8h)
- [ ] Fix YouTube URL detection regex patterns (4h)
- [ ] Prevent duplicate conversion requests (4h)
- [ ] Fix authentication flow edge cases (6h)
- [ ] Fix loading states consistency (4h)
- [ ] Fix breadcrumb navigation styling (4h)
```

### Day 1: Sprint Start

**Create Tasks with Sync:**
```bash
# Developer 1 picks up first task
clickup_bug_sync "Fix mobile responsive layout issues" \
  "Fix layout issues on mobile devices, particularly iPhone and Android tablets" \
  client effort-medium "dev1"

# Developer 2 picks up second task  
clickup_bug_sync "Fix YouTube URL detection regex patterns" \
  "Update regex to properly detect all YouTube URL formats" \
  client effort-small "dev2"
```

**Updated ROADMAP.md:**
```markdown
### Sprint 1-2 (Oct 1-15, 2025) - Critical Stability 🔴

**Status**: 🔄 In Progress | **Progress**: 0/6 tasks completed

#### Week 1 - High Impact Bug Fixes
- [ ] Fix mobile responsive layout issues (8h) → [#101](url) 🔄 **@dev1**
- [ ] Fix YouTube URL detection regex patterns (4h) → [#102](url) 🔄 **@dev2**
- [ ] Prevent duplicate conversion requests (4h)
- [ ] Fix authentication flow edge cases (6h)
- [ ] Fix loading states consistency (4h)
- [ ] Fix breadcrumb navigation styling (4h)
```

### Day 3: First PR Ready

```bash
# dev2 finished, PR is in review
mark_review "Fix YouTube URL detection regex patterns"
```

**Updated ROADMAP.md:**
```markdown
- [ ] Fix YouTube URL detection regex patterns (4h) → [#102](url) 👀 **@dev2**
```

### Day 4: First Task Merged

```bash
# PR merged, task completed
mark_completed "Fix YouTube URL detection regex patterns"

# dev2 picks up next task
clickup_bug_sync "Prevent duplicate conversion requests" \
  "Add debouncing to conversion requests" \
  client effort-small "dev2"
```

**Updated ROADMAP.md:**
```markdown
**Status**: 🔄 In Progress | **Progress**: 1/6 tasks completed

#### Week 1 - High Impact Bug Fixes
- [ ] Fix mobile responsive layout issues (8h) → [#101](url) 🔄 **@dev1**
- [x] Fix YouTube URL detection regex patterns (4h) → [#102](url) ✅ **@dev2**
- [ ] Prevent duplicate conversion requests (4h) → [#103](url) 🔄 **@dev2**
```

### End of Week 1

**Final State:**
```markdown
### Sprint 1-2 (Oct 1-15, 2025) - Critical Stability 🔄

**Status**: 🔄 In Progress | **Progress**: 3/6 tasks completed

#### Week 1 - High Impact Bug Fixes
- [x] Fix mobile responsive layout issues (8h) → [#101](url) ✅ **@dev1**
- [x] Fix YouTube URL detection regex patterns (4h) → [#102](url) ✅ **@dev2**
- [x] Prevent duplicate conversion requests (4h) → [#103](url) ✅ **@dev2**
- [ ] Fix authentication flow edge cases (6h) → [#104](url) 🔄 **@dev1**
- [ ] Fix loading states consistency (4h) → [#105](url) 📅
- [ ] Fix breadcrumb navigation styling (4h) → [#106](url) 📅
```

---

## 🔧 Advanced Usage

### Manual Roadmap Update

If you create a task in ClickUp UI or via API:

```bash
update_roadmap \
  "Task name from ROADMAP" \
  "task_id_from_clickup" \
  "https://app.clickup.com/t/xxxxx" \
  "🔄" \
  "dev1"
```

### Bulk Status Update

Update multiple tasks at once:

```bash
# Mark multiple as completed
mark_completed "Fix mobile responsive layout issues"
mark_completed "Fix YouTube URL detection regex patterns"
mark_completed "Prevent duplicate conversion requests"

# Commit in batch
git add ROADMAP.md
git commit -m "docs(roadmap): complete Week 1 tasks from Sprint 1-2

- Mark 3 bug fixes as completed ✅
- Update sprint progress: 3/6 tasks done"
```

### Sprint Progress Tracking

Update sprint status section:

```markdown
### Sprint 1-2 (Oct 1-15, 2025) - Critical Stability 🔴

**Status**: ✅ Completed | **Progress**: 6/6 tasks completed  
**Released**: v2.3.0 on Oct 15, 2025

#### Week 1 - High Impact Bug Fixes ✅
- [x] Fix mobile responsive layout issues (8h) → [#101](url) ✅ **@dev1**
- [x] Fix YouTube URL detection regex patterns (4h) → [#102](url) ✅ **@dev2**
- [x] Prevent duplicate conversion requests (4h) → [#103](url) ✅ **@dev2**
- [x] Fix authentication flow edge cases (6h) → [#104](url) ✅ **@dev1**
- [x] Fix loading states consistency (4h) → [#105](url) ✅ **@dev2**
- [x] Fix breadcrumb navigation styling (4h) → [#106](url) ✅ **@dev1**
```

---

## 📊 Progress Dashboard Example

Track overall progress in ROADMAP.md:

```markdown
## 📊 Q4 2025 Progress Dashboard

### Overall Status
- **Total Sprints**: 10
- **Completed Sprints**: 2
- **Current Sprint**: 3-4 (Quick Value Features)
- **Total Tasks**: 80
- **Completed**: 16 ✅
- **In Progress**: 8 🔄
- **In Review**: 4 👀
- **Blocked**: 2 🚧
- **Scheduled**: 50 📅

### Sprint Status
| Sprint | Dates | Status | Progress | Release |
|--------|-------|--------|----------|---------|
| 1-2 | Oct 1-15 | ✅ Done | 6/6 | v2.3.0 |
| 3-4 | Oct 16-31 | 🔄 Active | 2/8 | v2.4.0 |
| 5-6 | Nov 1-15 | 📅 Planned | 0/8 | v2.5.0 |

### Team Workload
- **@dev1**: 4 tasks 🔄, 8 completed ✅
- **@dev2**: 4 tasks 🔄, 8 completed ✅
```

---

## 🎯 Best Practices

### 1. **Always Use Sync Functions**
```bash
# ✅ Good: Automatic sync
clickup_bug_sync "Fix bug" "Description" client effort-small

# ❌ Avoid: Manual task creation without sync
curl -X POST ... # No roadmap update!
```

### 2. **Update Status Promptly**
```bash
# When starting PR review
mark_review "Task name"

# When merging PR
mark_completed "Task name"

# When blocked
mark_blocked "Task name"
```

### 3. **Commit Regularly**
```bash
# Daily or after each status change
git add ROADMAP.md
git commit -m "docs(roadmap): update task status"
```

### 4. **Keep Task Names Consistent**
Ensure the task name in ClickUp matches exactly with ROADMAP.md:

**ROADMAP.md:**
```markdown
- [ ] Fix mobile responsive layout issues
```

**ClickUp Task:**
```bash
clickup_bug_sync "Fix mobile responsive layout issues" ...
                  ^^^ Must match exactly ^^^
```

### 5. **Review Weekly**
At the end of each week:
- Update sprint progress percentages
- Mark completed tasks with ✅
- Update team workload stats
- Commit all changes together

---

## 🚨 Troubleshooting

### Task Name Doesn't Match

**Problem:** `update_roadmap` doesn't find the task

**Solution:** Ensure exact match, including capitalization and punctuation
```bash
# Check ROADMAP.md first
grep "Fix mobile" ROADMAP.md

# Use exact name in function
clickup_bug_sync "Fix mobile responsive layout issues" ...
```

### Multiple Matches

**Problem:** Same task name appears multiple times

**Solution:** Be more specific or use manual update with line numbers
```bash
# Option 1: Make task names unique in ROADMAP
- [ ] Fix mobile layout (iOS)
- [ ] Fix mobile layout (Android)

# Option 2: Manual sed with line range
sed -i.bak '45s|^- \[ \]|- [ ] ... → [#123](url) 🔄|' ROADMAP.md
```

### Status Not Updating

**Problem:** `mark_completed` doesn't update

**Solution:** Check current status indicator exists
```bash
# Status indicator must exist first
- [ ] Task → [#123](url) 🔄  # Has indicator
- [ ] Task → [#123](url)     # No indicator - won't update!

# Fix: Add indicator first
update_roadmap "Task" "123" "url" "🔄"
# Then mark completed
mark_completed "Task"
```

---

## 📚 Related Documentation

- [ROADMAP.md](../ROADMAP.md) - Main development roadmap
- [Q4 2025 Sprint Plan](./Q4_2025_SPRINT_PLAN.md) - Detailed sprint breakdown
- [ClickUp Setup](../backlog/CLICKUP_SETUP.md) - Task creation guide
- [ClickUp Config](../backlog/clickup-config.md) - Full configuration (gitignored)

---

## 🎉 Success Stories

### Before Sync:
- ❌ Manual roadmap updates forgotten
- ❌ Hard to find ClickUp tasks
- ❌ No visibility on active work
- ❌ Unclear sprint progress

### After Sync:
- ✅ Automatic roadmap updates
- ✅ Direct links to ClickUp tasks
- ✅ Clear status indicators
- ✅ Real-time progress tracking
- ✅ Better team coordination

---

<div align="center">

**Keep your roadmap in sync for better team collaboration! 🚀**

</div>
