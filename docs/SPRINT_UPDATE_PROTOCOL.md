# 📋 PROTOCOL: Sprint Planning & Documentation Updates

> **Effective Date**: November 14, 2025  
> **Version**: 1.0  
> **Status**: ACTIVE

---

## 🎯 PURPOSE

Ensure that **ALL sprint planning changes are automatically reflected** across documentation, README, and project tracking systems.

---

## 📋 MASTER CHECKLIST FOR EVERY SPRINT REORGANIZATION

Whenever you make sprint planning decisions, **you MUST update these files in this exact order**:

### **STEP 0: VERSION SYNCHRONIZATION (FIRST!)**

- [ ] **Check current version**
  ```bash
  grep '"version"' package.json | head -1
  ```

- [ ] **If updating to new version, run:**
  ```bash
  ./scripts/sync-versions.sh <new-version>
  ```
  Example: `./scripts/sync-versions.sh 2.6.0`

- [ ] **Verify version consistency**
  ```bash
  ./scripts/verify-versions.sh
  ```
  Expected output: ✅ VERIFICATION PASSED

- [ ] **Understand version history**
  - Read: `docs/VERSION_HISTORY.md`
  - Current: v2.5.0
  - Completed: v2.3.0, v2.4.0

### **TIER 1: CRITICAL (Must Update)**

- [ ] **README.md** - "Upcoming Releases" section
  - Update release dates
  - Update release descriptions
  - Mark completed sprints with ✅
  - Update links to current sprint status

- [ ] **docs/Q4_2025_SPRINT_PLAN.md** - Main planning document
  - Update quarter overview table
  - Update sprint status
  - Update all sprint details
  - Update effort distribution
  - Mark completed sprints

- [ ] **docs/SPRINT_5_6_REORGANIZADO.md** (or current sprint)
  - Update with new TIER 1 & TIER 2 structure
  - Update hours allocation
  - Update feature descriptions
  - Update deferred items

### **TIER 2: IMPORTANT (Context & Tracking)**

- [ ] **docs/Q4_2025_SPRINT_STATUS_OVERVIEW.md** - Status dashboard
  - Update sprint status indicators
  - Update progress percentages
  - Update upcoming sprints
  - Update timeline

- [ ] **docs/SPRINT_SUMMARY_CURRENT.md** - Comprehensive summary
  - Update completed/in-progress/planned status
  - Update key deliverables
  - Update success metrics
  - Update documentation links

- [ ] **docs/QUICK_REFERENCE.md** - Quick lookup
  - Update sprint status table
  - Update current priorities
  - Update timeline
  - Update capacity summary

### **TIER 3: SUPPORT (Nice to Have)**

- [ ] **docs/REORGANIZATION_SUMMARY.txt** - Detailed text summary
  - Document all changes made
  - Timestamp the reorganization
  - List all modified files

- [ ] **CHANGELOG.md** - Project changelog
  - Add entry for sprint reorganization
  - Link to updated documentation

- [ ] **backlog/SPRINT_*_QUICK_REFERENCE.md** - Sprint quick references
  - Create/update for affected sprints

---

## 📝 UPDATE SEQUENCE (Step by Step)

### **Step 1: README.md Updates** (5 min)

```markdown
## 📅 What's Coming in Q4 2025

### Upcoming Releases
- **v2.X.X** (DATE) - EMOJI Description ✅ STATUS
```

**What to update**:
- Release dates
- Release descriptions
- Status indicators (✅ COMPLETED, 🚀 IN PROGRESS, 📅 PLANNED)
- Link to current sprint quick reference

---

### **Step 2: Main Sprint Plan** (15 min)

Update `docs/Q4_2025_SPRINT_PLAN.md`:

1. **Quarter Overview Table**
   - Update sprint status column
   - Update release dates
   - Update themes

2. **Sprint Details**
   - Mark completed sprints with ✅
   - Update feature lists for active/upcoming sprints
   - Update success metrics

3. **Effort Distribution**
   - Recalculate if necessary
   - Update totals

---

### **Step 3: Current Sprint Document** (15 min)

Update the active sprint's detailed document:

1. **Title & Status**
   - Update sprint dates
   - Update capacity hours
   - Update status indicator

2. **TIER 1 Features (Must Have)**
   - List all core features
   - Update hours
   - Prioritize correctly

3. **TIER 2 Features (Should Have)**
   - List optimization/constructive tasks
   - Update hours
   - Ensure they fit within 80h total

4. **Deferred Items**
   - List what's moving to future sprints
   - Explain why

---

### **Step 4: Status Dashboard** (10 min)

Update `docs/Q4_2025_SPRINT_STATUS_OVERVIEW.md`:

- Update completed sprints section
- Update current sprint details
- Update upcoming sprints
- Update progress percentages
- Update timeline checkpoints

---

### **Step 5: Quick Reference** (5 min)

Update `docs/QUICK_REFERENCE.md`:

- Update status table
- Update immediate priorities
- Update timeline
- Update statistics

---

### **Step 6: Summary Document** (10 min)

Update `docs/SPRINT_SUMMARY_CURRENT.md`:

- Document all changes
- Update deliverables
- Update success metrics
- Update links

---

## ✅ VERIFICATION CHECKLIST

After updating, verify:

- [ ] README.md dates match sprint plan
- [ ] All sprints have status indicators (✅ or 🚀 or 📅)
- [ ] Total hours in TIER 1 + TIER 2 = exactly 80h (or capacity for that sprint)
- [ ] Deferred items clearly listed with destination sprint
- [ ] Timeline is consistent across all documents
- [ ] Links between documents are correct
- [ ] No orphaned features (features without sprint assignment)
- [ ] Progress percentages add up correctly

---

## 🔄 WHEN TO UPDATE

**Update IMMEDIATELY when**:
- Moving features between sprints
- Changing sprint dates
- Completing a sprint
- Reorganizing sprint priorities
- Adding/removing features from a sprint

**Update DURING**:
- Sprint planning meetings
- Sprint kickoff
- Mid-sprint checkpoint reviews
- Sprint retrospectives

**Update AT**:
- End of each sprint (mark as completed)
- Start of new sprint (mark as in progress)
- Any time scope changes

---

## 🎯 EXAMPLE: What Happened on Nov 14, 2025

**Trigger**: Sprint reorganization request

**Changes Made**:

| File | Change | Time |
|------|--------|------|
| README.md | Updated v2.4.0 date, added descriptions, marked as COMPLETED | 5 min |
| Q4_2025_SPRINT_PLAN.md | Updated quarter table, marked Sprint 3-4 COMPLETED, updated 5-6 | 15 min |
| SPRINT_5_6_REORGANIZADO.md | Created complete TIER 1/2 structure with 80h breakdown | 15 min |
| Q4_2025_SPRINT_STATUS_OVERVIEW.md | Created status dashboard with all sprints | 10 min |
| SPRINT_SUMMARY_CURRENT.md | Created comprehensive summary | 10 min |
| QUICK_REFERENCE.md | Created quick lookup card | 5 min |
| REORGANIZATION_SUMMARY.txt | Created detailed text summary | 10 min |

**Total Time**: ~70 minutes for complete reorganization

---

## 💡 TIPS FOR MAINTAINABILITY

1. **Use a consistent format** - Make dates, hours, and statuses uniform across documents
2. **Cross-reference** - Link documents to each other
3. **Use emoji consistently** - ✅ COMPLETED, 🚀 IN PROGRESS, 📅 PLANNED
4. **Update in order** - Start with README (most visible), then drill down to details
5. **Verify after updating** - Check that all files are synchronized
6. **Keep timestamps** - Note when reorganizations were made
7. **Document the why** - Always explain why features moved to different sprints

---

## 🚀 AUTOMATION OPPORTUNITY

**Future improvement**: Create a script that:
- Reads from a single source-of-truth JSON/YAML
- Generates all documentation files
- Updates README.md automatically
- Validates consistency

**File**: `scripts/generate-sprint-docs.sh` (to be created)

---

## 📞 QUESTIONS?

If unsure whether to update a file, ask: **"Will someone looking at this file see the new sprint changes?"**

- If YES → Update it
- If NO → Skip it

---

## ✅ SIGNED OFF

**Protocol Created**: November 14, 2025  
**Valid for**: All Q4 2025 sprints and beyond  
**Review**: Every sprint reorganization  
**Last Updated**: November 14, 2025

---

**Remember**: Documentation is a living system. Every sprint change should be reflected in ALL relevant documents immediately.
