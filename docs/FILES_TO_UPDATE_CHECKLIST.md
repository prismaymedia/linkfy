# 🔄 FILES TO UPDATE CHECKLIST - Future Reference

> **Purpose**: Quick reference for what to update every time there's a sprint reorganization  
> **Last Verified**: November 14, 2025  
> **Status**: ✅ All files synchronized
> **Current Version**: v2.5.0

---

## 📋 THE 8 FILES YOU MUST UPDATE

### **BEFORE YOU START: SYNCHRONIZE VERSIONS** ⭐

```bash
# Step 1: Check current version
grep '"version"' package.json | head -1

# Step 2: If updating version, run:
./scripts/sync-versions.sh <new-version>

# Step 3: Verify consistency
./scripts/verify-versions.sh
```

**Files Updated Automatically**:
- ✅ package.json (root, client, server)
- ✅ All documentation files
- ✅ README.md

**Then continue with the steps below...**

---

## 📋 THE 7 DOCUMENTATION FILES YOU MUST UPDATE

### **EVERY TIME you make sprint changes, update these files in order:**

#### 1️⃣ **README.md** (5 min)
   - Location: `/README.md`
   - Section: "Upcoming Releases"
   - What to update:
     - Release dates
     - Release descriptions
     - Status indicators (✅ COMPLETED, 🚀 IN PROGRESS, 📅 PLANNED)
   - Example:
     ```
     - **v2.5.0** (Nov 24) - 💎 Dark mode, history, favorites & extension
     ```

#### 2️⃣ **Q4_2025_SPRINT_PLAN.md** (15 min)
   - Location: `docs/Q4_2025_SPRINT_PLAN.md`
   - Sections: Quarter overview table, Sprint details, Effort distribution
   - What to update:
     - Quarter overview table (dates, status, release versions)
     - Individual sprint sections
     - Success metrics
     - Effort distribution

#### 3️⃣ **SPRINT_5_6_REORGANIZADO.md** (or active sprint) (15 min)
   - Location: `docs/SPRINT_5_6_REORGANIZADO.md`
   - Sections: TIER 1, TIER 2, Drag & Drop status
   - What to update:
     - Sprint dates
     - Feature lists
     - Hours allocation
     - Deferred items and their destination

#### 4️⃣ **Q4_2025_SPRINT_STATUS_OVERVIEW.md** (10 min)
   - Location: `docs/Q4_2025_SPRINT_STATUS_OVERVIEW.md`
   - Sections: Sprint status summary, upcoming sprints, progress chart
   - What to update:
     - Status indicators for each sprint
     - Timeline
     - Progress percentages
     - Upcoming sprint details

#### 5️⃣ **SPRINT_SUMMARY_CURRENT.md** (10 min)
   - Location: `docs/SPRINT_SUMMARY_CURRENT.md`
   - Sections: Completed sprints, current sprint, upcoming sprints
   - What to update:
     - Completed sprint details
     - Current sprint breakdown
     - Success metrics
     - Key changes section

#### 6️⃣ **QUICK_REFERENCE.md** (5 min)
   - Location: `docs/QUICK_REFERENCE.md`
   - Sections: Status table, current sprint, next sprints
   - What to update:
     - Sprint status table
     - What's done section
     - Current sprint details
     - Quick stats

#### 7️⃣ **REORGANIZATION_SUMMARY.txt** (10 min)
   - Location: `docs/REORGANIZATION_SUMMARY.txt`
   - Sections: Changes made, breakdown, drag & drop strategy
   - What to update:
     - Changes made
     - Sprint breakdown details
     - Timeline
     - Q4 progress

---

## ⏱️ ESTIMATED TIME

**Total Time**: ~70 minutes for complete reorganization

- README.md: 5 min
- Q4_2025_SPRINT_PLAN.md: 15 min
- Current Sprint Doc: 15 min
- Status Overview: 10 min
- Summary: 10 min
- Quick Reference: 5 min
- Reorganization Summary: 10 min

---

## ✅ VERIFICATION CHECKLIST

After updating all files, run:

```bash
bash scripts/sprint-update-checklist.sh
```

This will verify:
- ✅ All files exist
- ✅ All key content is present
- ✅ Dates are consistent
- ✅ Status indicators are correct
- ✅ Hours add up correctly

---

## 🎯 QUICK UPDATE FLOWCHART

```
Sprint Reorganization Needed?
    ↓
[1] Update README.md (Upcoming Releases)
    ↓
[2] Update Q4_2025_SPRINT_PLAN.md (Main doc)
    ↓
[3] Update SPRINT_5_6_REORGANIZADO.md (Active sprint)
    ↓
[4] Update Q4_2025_SPRINT_STATUS_OVERVIEW.md (Status)
    ↓
[5] Update SPRINT_SUMMARY_CURRENT.md (Summary)
    ↓
[6] Update QUICK_REFERENCE.md (Quick ref)
    ↓
[7] Update REORGANIZATION_SUMMARY.txt (Detailed)
    ↓
Run: bash scripts/sprint-update-checklist.sh
    ↓
All Checks Pass? ✅
    ↓
Done! Documentation is synchronized.
```

---

## 🔍 WHAT NOT TO UPDATE

❌ Don't update these when doing sprint reorganizations:
- `ROADMAP.md` (only for major roadmap changes)
- `CHANGELOG.md` (only when releasing)
- Individual sprint task JSON files (only when adding new tasks)
- `SPRINT_UPDATE_PROTOCOL.md` (only when process changes)

---

## 💡 PRO TIPS

1. **Update in the order listed** - This ensures dependencies are satisfied
2. **Copy dates consistently** - Use format: `Nov 24` not `November 24`
3. **Use emoji consistently** - ✅, 🚀, 📅 (copy-paste from this file)
4. **Cross-reference** - Make sure links between files are correct
5. **Verify each section** - Check that totals add up (esp. hours)
6. **Test the script** - Run `scripts/sprint-update-checklist.sh` after updates

---

## 📞 IF YOU FORGET

If you can't remember which files to update:

1. Open this file: `docs/FILES_TO_UPDATE_CHECKLIST.md`
2. Follow the order (1️⃣ through 7️⃣)
3. Run the verification script
4. Done!

---

## 📝 NEXT REORGANIZATION TEMPLATE

When you reorganize sprints next time, follow this:

```
SPRINT REORGANIZATION - [DATE]
────────────────────────────────

Change: [Describe the change]
Reason: [Why this change was made]

Files Updated:
✅ README.md - [what changed]
✅ Q4_2025_SPRINT_PLAN.md - [what changed]
✅ SPRINT_5_6_REORGANIZADO.md - [what changed]
✅ Q4_2025_SPRINT_STATUS_OVERVIEW.md - [what changed]
✅ SPRINT_SUMMARY_CURRENT.md - [what changed]
✅ QUICK_REFERENCE.md - [what changed]
✅ REORGANIZATION_SUMMARY.txt - [what changed]

Verification: ✅ PASSED
────────────────────────────────
```

---

**Last Updated**: November 14, 2025  
**Created By**: Copilot  
**Protocol**: SPRINT_UPDATE_PROTOCOL.md

Remember: **Keep documentation synchronized = Keep team aligned** ✅
