# 📋 PREVIEW: CLICKUP TASKS - SPRINT 5-6 (ACTUAL)

> **Sprint**: 5-6 (Nov 13 - Nov 24, 2025) - 🚀 IN PROGRESS  
> **Theme**: Dark Mode + Extension + User Engagement 💎  
> **Release**: v2.5.0  
> **Total Hours**: 80h (40h per developer)

---

## 🎯 SPRINT OVERVIEW

**Goal**: Complete Dark Mode, Browser Extension, History/Favorites, and 13 UX optimizations

**Focus Areas**:
1. 🌙 Dark Mode implementation (CSS variables, toggle, persistence)
2. 🧩 Browser Extension complete (context menu, URL detection, settings)
3. ⭐ User Engagement (history, favorites, notifications)
4. 🎨 UX Optimizations (error handling, auth modal, UI polish)

---

## 📌 TASK STRUCTURE

### **TIER 1: MUST HAVE** (58 hours)

#### Week 1 - Dark Mode + Core Features (40h)

**Task 1: Dark Mode Implementation** ⭐⭐⭐ PRIORITY #1
- **Points**: 14 hours
- **Type**: Frontend Feature
- **Description**: Complete dark mode with CSS variables, toggle, persistence
- **Subtasks**:
  - CSS variables for color themes (light/dark)
  - Toggle button in settings
  - localStorage persistence
  - Auto-detect system preference
  - Smooth transitions & animations
  - Full component testing
- **Priority**: 🔥 HIGHEST
- **Acceptance Criteria**:
  - ✅ All components support dark mode
  - ✅ Toggle saves to localStorage
  - ✅ System preference respected
  - ✅ No visual bugs in dark mode
  - ✅ 50%+ user adoption target

**Task 2: Conversion Preview**
- **Points**: 10 hours
- **Type**: Frontend Feature
- **Description**: Real-time preview of conversion results
- **Subtasks**:
  - Real-time metadata fetching
  - Track artwork display
  - Song information display (title, artist, duration)
  - Responsive preview layout
  - Error state handling
- **Priority**: 🟠 HIGH
- **Acceptance Criteria**:
  - ✅ Preview updates as user types
  - ✅ Artwork displays correctly
  - ✅ All metadata shown
  - ✅ Mobile responsive

**Task 3: Favorites/Bookmarks System**
- **Points**: 10 hours
- **Type**: Frontend + Backend Feature
- **Description**: Save and manage favorite conversions
- **Subtasks**:
  - Star/favorite button on results
  - Favorites list/sidebar
  - Remove favorite functionality
  - Supabase storage integration
  - Quick access sidebar UI
- **Priority**: 🟠 HIGH
- **Acceptance Criteria**:
  - ✅ Can save to favorites
  - ✅ Favorites persist across sessions
  - ✅ Can remove favorites
  - ✅ Quick access sidebar working

**Task 4: User Menu Position Review**
- **Points**: 6 hours
- **Type**: Frontend UI
- **Description**: Review and optimize user menu positioning
- **Subtasks**:
  - Responsive positioning (desktop/mobile)
  - Mobile menu adjustments
  - Prevent overflow issues
  - Accessibility improvements
- **Priority**: 🟡 MEDIUM
- **Acceptance Criteria**:
  - ✅ Menu doesn't overflow on mobile
  - ✅ Responsive across devices
  - ✅ Touch-friendly on mobile

#### Week 2 - Extension Complete + Notifications (40h)

**Task 5: Conversion History**
- **Points**: 10 hours
- **Type**: Frontend + Backend Feature
- **Description**: Store and display conversion history
- **Subtasks**:
  - Database schema for history
  - History timeline UI
  - Search/filter history
  - Clear history function
  - Timestamp tracking
- **Priority**: 🟠 HIGH
- **Acceptance Criteria**:
  - ✅ History saved to database
  - ✅ Timeline displays in UI
  - ✅ Can search history
  - ✅ Can clear history

**Task 6: Right-Click Context Menu (Extension)**
- **Points**: 8 hours
- **Type**: Browser Extension Feature
- **Description**: Add context menu for quick conversion
- **Subtasks**:
  - Register context menu handler
  - Detect YouTube Music URLs
  - One-click conversion via context menu
  - Results popup/tab handling
- **Priority**: 🟠 HIGH
- **Acceptance Criteria**:
  - ✅ Right-click menu visible
  - ✅ Quick convert working
  - ✅ Results displayed correctly

**Task 7: Auto URL Detection (Extension)**
- **Points**: 8 hours
- **Type**: Browser Extension Feature
- **Description**: Auto-detect URLs and show conversion suggestion
- **Subtasks**:
  - Background script URL detection
  - Page content scanning
  - Conversion suggestion popup
  - One-click conversion from suggestion
- **Priority**: 🟠 HIGH
- **Acceptance Criteria**:
  - ✅ URLs detected on any page
  - ✅ Suggestion popup shows
  - ✅ One-click conversion works

**Task 8: Settings Panel**
- **Points**: 8 hours
- **Type**: Frontend Feature
- **Description**: Complete settings UI with all options
- **Subtasks**:
  - Theme selector (light/dark)
  - Language selector
  - History retention settings
  - Clear all data button
  - Extension permissions UI
- **Priority**: 🟠 HIGH
- **Acceptance Criteria**:
  - ✅ All settings functional
  - ✅ Settings persist
  - ✅ Clear data works
  - ✅ Responsive layout

**Task 9: Notifications & Feedback**
- **Points**: 6 hours
- **Type**: Frontend UI
- **Description**: Toast notifications for user feedback
- **Subtasks**:
  - Toast component
  - Success notifications
  - Error notifications
  - Copy-to-clipboard feedback
  - Auto-dismiss timing
- **Priority**: 🟡 MEDIUM
- **Acceptance Criteria**:
  - ✅ Toasts display correctly
  - ✅ All states covered
  - ✅ Auto-dismiss working
  - ✅ Accessible notifications

---

### **TIER 2: SHOULD HAVE - UX OPTIMIZATIONS** (22 hours)

**Task 10: Error Handling & Input Highlighting**
- **Points**: 4 hours
- **Type**: Frontend UX
- **Description**: Improve error messages and input highlighting
- **Subtasks**:
  - Error message styling
  - Input highlight on error
  - Clear error messages
  - Helpful error guidance
- **Priority**: 🟡 MEDIUM
- **Acceptance Criteria**:
  - ✅ Errors clearly visible
  - ✅ Inputs highlighted on error
  - ✅ Messages are helpful

**Task 11: Login as Popup Modal**
- **Points**: 5 hours
- **Type**: Frontend UI
- **Description**: Convert login to frictionless popup modal
- **Subtasks**:
  - Modal component
  - Login form in modal
  - Close on success
  - OAuth integration in modal
- **Priority**: 🟡 MEDIUM
- **Acceptance Criteria**:
  - ✅ Login modal appears
  - ✅ No full page redirect
  - ✅ Works with OAuth

**Task 12: Link Cursor & Hover Effects**
- **Points**: 4 hours
- **Type**: Frontend UI
- **Description**: Improve cursor and hover feedback
- **Subtasks**:
  - Link cursor on clickables
  - Hover effect animations
  - Button hover states
  - Visual feedback consistency
- **Priority**: 🟡 MEDIUM
- **Acceptance Criteria**:
  - ✅ Proper cursors throughout
  - ✅ Hover effects smooth
  - ✅ Visual consistency

**Task 13: Database Persistence (History + Favorites)**
- **Points**: 8 hours
- **Type**: Backend Feature
- **Description**: Ensure all data persists to database
- **Subtasks**:
  - Supabase schema finalization
  - Insert/update/delete functions
  - Error handling for DB operations
  - Sync strategy (real-time or periodic)
- **Priority**: 🟠 HIGH
- **Acceptance Criteria**:
  - ✅ Data saves to DB
  - ✅ No data loss
  - ✅ Sync reliable

**Task 14: Security - URL Sanitization**
- **Points**: 4 hours
- **Type**: Backend Security
- **Description**: Ensure all external URLs are sanitized
- **Subtasks**:
  - URL validation utility
  - Sanitization in API
  - Input validation
  - XSS prevention
- **Priority**: 🟠 HIGH
- **Acceptance Criteria**:
  - ✅ All URLs validated
  - ✅ No XSS vulnerabilities
  - ✅ Security tests pass

**Task 15: CORS Configuration**
- **Points**: 3 hours
- **Type**: Backend Config
- **Description**: Configure CORS with restrictive whitelist
- **Subtasks**:
  - CORS middleware setup
  - Whitelist configuration
  - Testing with extension
- **Priority**: 🟠 HIGH
- **Acceptance Criteria**:
  - ✅ Extension can access API
  - ✅ Third-party blocked
  - ✅ All tests passing

**Task 16: Additional UX Polish**
- **Points**: 4 hours
- **Type**: Frontend UI
- **Description**: Miscellaneous UX improvements
- **Subtasks**:
  - GitHub repo link in header
  - Dashboard link for logged-in users
  - Remove unnecessary UI elements
  - Improve URL detection error messages
  - Language selector positioning
- **Priority**: 🟡 MEDIUM
- **Acceptance Criteria**:
  - ✅ All items implemented
  - ✅ No breaking changes
  - ✅ UX improved

---

## 📊 TASK SUMMARY TABLE

| # | Task | Hours | Priority | Type | Status |
|---|------|-------|----------|------|--------|
| 1 | Dark Mode Implementation | 14h | 🔥 HIGHEST | Frontend | In Progress |
| 2 | Conversion Preview | 10h | 🟠 HIGH | Frontend | Not Started |
| 3 | Favorites/Bookmarks System | 10h | 🟠 HIGH | Feature | Not Started |
| 4 | User Menu Position Review | 6h | 🟡 MEDIUM | UI | Not Started |
| 5 | Conversion History | 10h | 🟠 HIGH | Feature | Not Started |
| 6 | Right-Click Context Menu | 8h | 🟠 HIGH | Extension | Not Started |
| 7 | Auto URL Detection | 8h | 🟠 HIGH | Extension | Not Started |
| 8 | Settings Panel | 8h | 🟠 HIGH | Feature | Not Started |
| 9 | Notifications & Feedback | 6h | 🟡 MEDIUM | UI | Not Started |
| 10 | Error Handling & Highlighting | 4h | 🟡 MEDIUM | UX | Not Started |
| 11 | Login Modal | 5h | 🟡 MEDIUM | UI | Not Started |
| 12 | Link Cursor & Hover Effects | 4h | 🟡 MEDIUM | UI | Not Started |
| 13 | Database Persistence | 8h | 🟠 HIGH | Backend | Not Started |
| 14 | URL Sanitization | 4h | 🟠 HIGH | Security | Not Started |
| 15 | CORS Configuration | 3h | 🟠 HIGH | Backend | Not Started |
| 16 | Additional UX Polish | 4h | 🟡 MEDIUM | UI | Not Started |

**Total**: 80 hours | **Tasks**: 16 | **Days**: 10 (Nov 13-24)

---

## 🎯 SUCCESS METRICS

- ✅ Dark mode fully implemented & 50% adoption
- ✅ Extension complete with all features
- ✅ History & Favorites working
- ✅ All 13 UX optimizations integrated
- ✅ Zero critical bugs
- ✅ v2.5.0 released on Nov 24

---

## 📅 TIMELINE

```
Nov 13 (Wed) ← Sprint Kickoff
  ├─ Days 1-5: Dark Mode + Core Features (Preview, Favorites, Menu)
  ├─ Days 6-10: Extension + History + Settings + UX Polish
Nov 24 (Sun) → Sprint End / v2.5.0 Release
```

---

## ⚠️ NOTES

1. **Current Status**: Sprint IN PROGRESS (Day 1 of 10)
2. **Developer Availability**: Full capacity (100%)
3. **Risk Level**: 🟡 MEDIUM (Dark mode + Extension can be complex)
4. **Drag & Drop**: ❌ NOT in this sprint (moved to Sprint 9-10)
5. **Deferred**: Service worker offline support (moved to Sprint 7-8)

---

## ✅ READY TO CREATE?

These 16 tasks total **80 hours** and cover:
- ✅ Dark Mode (14h) - Priority #1
- ✅ Browser Extension (24h) - Complete feature set
- ✅ User Engagement (26h) - History, Favorites, Settings
- ✅ UX Optimizations (16h) - Error handling, UI polish, security

**Total Coverage**: 100% of Sprint 5-6 capacity (80h)

---

**Shall I create these tasks in ClickUp now?** (y/n)
