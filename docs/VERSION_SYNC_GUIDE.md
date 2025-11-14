# 📦 VERSION SYNCHRONIZATION GUIDE

> **Purpose**: Maintain consistent version numbers across the entire Linkfy project  
> **Last Updated**: November 14, 2025  
> **Current Version**: 2.5.0  
> **Tool**: `scripts/sync-versions.sh`

---

## 🎯 OVERVIEW

Version synchronization is critical in Linkfy because the version number appears in **multiple files**:

- `package.json` (root, client, server)
- `README.md` (upcoming releases section)
- Documentation files (sprint plans, status, references)
- Release notes and changelogs

**Without synchronization**, these files can get out of sync, causing:
- ❌ Confusion about what version is current
- ❌ Broken documentation links
- ❌ Inconsistent release information
- ❌ CI/CD deployment issues

---

## 📍 FILES THAT CONTAIN VERSION NUMBERS

### **TIER 1 CRITICAL** (Must be synchronized)

| File | Location | Contains | Example |
|------|----------|----------|---------|
| **package.json** | Root | `"version": "2.5.0"` | Core project version |
| **README.md** | Root | `- **v2.5.0** (Nov 24)` | Upcoming releases list |
| **Q4_2025_SPRINT_PLAN.md** | docs/ | Table references, release dates | Master plan version |

### **TIER 2 IMPORTANT** (Should be synchronized)

| File | Location | Contains | Example |
|------|----------|----------|---------|
| **QUICK_REFERENCE.md** | docs/ | `Target Release: v2.5.0` | Quick lookup |
| **SPRINT_5_6_REORGANIZADO.md** | docs/ | `Versión: v2.5.0 → v2.6.0` | Sprint details |
| **Q4_2025_SPRINT_STATUS_OVERVIEW.md** | docs/ | Release version references | Status dashboard |

### **TIER 3 SUPPORT** (Nice to synchronize)

| File | Location | Contains |
|------|----------|----------|
| **SPRINT_SUMMARY_CURRENT.md** | docs/ | Sprint descriptions |
| **FILES_TO_UPDATE_CHECKLIST.md** | docs/ | Examples |
| **PRODUCT_OWNER_GUIDE.md** | docs/ | Release tracking |

---

## 🔧 HOW TO USE THE SYNC SCRIPT

### **Automatic Synchronization** (Recommended)

```bash
# Make script executable (first time only)
chmod +x scripts/sync-versions.sh

# Run the synchronizer
./scripts/sync-versions.sh 2.6.0
```

The script will:
1. ✅ Validate version format (X.Y.Z)
2. ✅ Update all package.json files
3. ✅ Update all documentation files
4. ✅ Verify consistency
5. ✅ Show summary of changes

### **What the Script Does**

```
Current: 2.5.0 → Target: 2.6.0
├─ package.json          ✓ Updated
├─ client/package.json   ✓ Updated
├─ server/package.json   ✓ Updated
├─ README.md             ✓ Updated
├─ docs/Q4_2025_SPRINT_PLAN.md       ✓ Updated
├─ docs/QUICK_REFERENCE.md           ✓ Updated
├─ docs/SPRINT_5_6_REORGANIZADO.md   ✓ Updated
└─ docs/Q4_2025_SPRINT_STATUS_OVERVIEW.md ✓ Updated

Verification: ✅ ALL PASSED
```

---

## 📋 VERSION NUMBERING SCHEME

Linkfy uses **Semantic Versioning**: `MAJOR.MINOR.PATCH`

### **Version Increment Rules**

| Type | Increment | When | Example |
|------|-----------|------|---------|
| **MAJOR** | X.0.0 | Breaking changes, API changes | 1.0.0 → 2.0.0 |
| **MINOR** | x.Y.0 | New features (non-breaking) | 2.4.0 → 2.5.0 |
| **PATCH** | x.y.Z | Bug fixes, patches | 2.5.0 → 2.5.1 |

### **Q4 2025 Release Cycle**

| Sprint | Version | Release Date | Features |
|--------|---------|--------------|----------|
| 1-2 | v2.3.0 | Oct 15 | Stability fixes |
| 3-4 | v2.4.0 | Nov 10 | Universal API |
| **5-6** | **v2.5.0** | **Nov 24** | **Dark Mode, Extension** |
| 7-8 | v2.6.0 | Dec 8 | Performance & Redis |
| 9 | v2.7.0 | Dec 22 | Music Player + Phase 1 |
| 10 | v2.8.0 | Dec 31 | Polish + Phase 2 |

---

## 🔄 MANUAL SYNCHRONIZATION (If script doesn't work)

### **Step 1: Update package.json**

```bash
# Root package.json
sed -i '' 's/"version": "2.5.0"/"version": "2.6.0"/' package.json

# Client package.json
sed -i '' 's/"version": "2.5.0"/"version": "2.6.0"/' client/package.json

# Server package.json
sed -i '' 's/"version": "2.5.0"/"version": "2.6.0"/' server/package.json
```

### **Step 2: Update README.md**

Find the "Upcoming Releases" section and update:

```markdown
# Before
- **v2.5.0** (Nov 24) - 💎 Dark mode, history, favorites & extension

# After
- **v2.6.0** (Dec 8) - ⚡ 2x faster with Redis caching & performance
```

### **Step 3: Update Documentation Files**

For each file in TIER 1 and 2:

```bash
# Replace all occurrences
sed -i '' 's/v2.5.0/v2.6.0/g' docs/Q4_2025_SPRINT_PLAN.md
sed -i '' 's/v2.5.0/v2.6.0/g' docs/QUICK_REFERENCE.md
sed -i '' 's/v2.5.0/v2.6.0/g' docs/SPRINT_5_6_REORGANIZADO.md
```

### **Step 4: Verify**

```bash
# Check all updated files
grep -r "v2.6.0" --include="*.md" --include="*.json" | grep -v node_modules
```

---

## ✅ VERIFICATION CHECKLIST

After updating versions, verify:

- [ ] **package.json** (root) has new version
- [ ] **client/package.json** has new version
- [ ] **server/package.json** has new version
- [ ] **README.md** has new version in "Upcoming Releases"
- [ ] **Q4_2025_SPRINT_PLAN.md** updated
- [ ] **QUICK_REFERENCE.md** updated
- [ ] **SPRINT_5_6_REORGANIZADO.md** (or active sprint doc) updated
- [ ] **Q4_2025_SPRINT_STATUS_OVERVIEW.md** updated
- [ ] No old version appears in critical files: `grep -r "v2.5.0" docs/ README.md`
- [ ] Git diff shows expected changes: `git diff`

---

## 🚀 WHEN TO SYNCHRONIZE VERSIONS

### **Scenario 1: Starting a New Sprint**

```
Timeline:
├─ Start Sprint 5-6 (Nov 13) → Version already 2.5.0 ✓
├─ Release v2.5.0 (Nov 24) → Update to 2.6.0 preparation
└─ End Sprint 5-6 (Nov 24) → Sync versions for Sprint 7-8

Command:
./scripts/sync-versions.sh 2.6.0
```

### **Scenario 2: Planning Release**

```
Timeline:
├─ Monday: Plan release features
├─ Wednesday: Update version in code
└─ Friday: Release with new version

Command:
./scripts/sync-versions.sh <new-version>
```

### **Scenario 3: Hotfix Release**

```
Timeline:
├─ Emergency bug discovered (v2.5.0)
├─ Create hotfix branch
├─ Update version to 2.5.1
└─ Release immediately

Command:
./scripts/sync-versions.sh 2.5.1
```

---

## 🔗 INTEGRATION WITH SPRINT_UPDATE_PROTOCOL

The version synchronization should be part of every sprint reorganization:

### **In SPRINT_UPDATE_PROTOCOL.md, add this step:**

```markdown
## STEP 0: Update Versions (BEFORE other updates)

1. Run version synchronizer:
   bash scripts/sync-versions.sh <new-version>

2. Verify output shows all files updated ✓

3. Continue with sprint documentation updates
```

### **Timing in Sprint Cycle:**

```
Sprint Kickoff (Day 1)
├─ No version update needed
│
Sprint Mid-point (Day 7)
├─ No version update needed
│
Sprint End (Day 14)
├─ 🔴 PREPARE NEXT SPRINT DOCUMENTATION
├─ Run: ./scripts/sync-versions.sh <next-version>
├─ Update all 7 documentation files
└─ Verify synchronization
```

---

## 📊 VERSION TRACKING MATRIX

Use this to track which version is in which documentation:

```markdown
# Current Version Status (Nov 14, 2025)

| File | Current | Status | Last Updated |
|------|---------|--------|--------------|
| package.json (root) | 2.5.0 | ✅ | Nov 14 |
| package.json (client) | 2.5.0 | ✅ | Nov 14 |
| package.json (server) | 2.5.0 | ✅ | Nov 14 |
| README.md | 2.5.0 | ✅ | Nov 14 |
| Q4_2025_SPRINT_PLAN.md | 2.5.0 | ✅ | Nov 14 |
| QUICK_REFERENCE.md | 2.5.0 | ✅ | Nov 14 |
| SPRINT_5_6_REORGANIZADO.md | 2.5.0 | ✅ | Nov 14 |
| Q4_2025_SPRINT_STATUS_OVERVIEW.md | 2.5.0 | ✅ | Nov 14 |
```

---

## 🛠️ TROUBLESHOOTING

### **Problem: Script says "version not found"**

```bash
# Check current version
grep "version" package.json | head -1

# Update script path
cd /Users/jonathan/Documents/code/linkfy
./scripts/sync-versions.sh 2.6.0
```

### **Problem: sed command not working**

The script uses macOS sed syntax (`-i ''`). For Linux, modify:

```bash
# macOS
sed -i '' 's/old/new/g' file.txt

# Linux
sed -i 's/old/new/g' file.txt
```

### **Problem: Version not updated in some files**

```bash
# Find all occurrences
grep -r "v2.5.0" docs/ README.md

# Manually update missing files
nano docs/filename.md
```

---

## 💡 BEST PRACTICES

1. **Always run sync script FIRST** before other documentation updates
2. **Verify immediately** using `git diff` to review changes
3. **Commit versions separately**: `git commit -m "chore: bump version to v2.6.0"`
4. **Tag releases**: `git tag v2.6.0`
5. **Keep TIER 1 files in sync** (critical for users)
6. **Document version changes** in CHANGELOG.md

---

## 📞 QUICK REFERENCE

```bash
# View current version
grep '"version"' package.json | head -1

# Update to new version
./scripts/sync-versions.sh 2.6.0

# Verify synchronization
grep -r "v2.6.0" docs/ README.md package.json

# Check what changed
git diff

# Commit changes
git add . && git commit -m "chore: bump version to v2.6.0"

# Create release tag
git tag v2.6.0
git push origin v2.6.0
```

---

## 🔐 COMMIT MESSAGE FORMAT

When committing version updates, follow Conventional Commits:

```bash
# Standard version bump
git commit -m "chore: bump version to v2.6.0"

# With release notes
git commit -m "chore: bump version to v2.6.0

- Updated all package.json files
- Synchronized documentation
- Ready for v2.6.0 release on Dec 8"
```

---

**Last Updated**: November 14, 2025  
**Tool Location**: `scripts/sync-versions.sh`  
**Integration**: SPRINT_UPDATE_PROTOCOL.md  
**Status**: ✅ Active

Remember: **Keep versions synchronized = Keep project clarity** ✅
