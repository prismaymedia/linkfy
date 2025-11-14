#!/bin/bash

# ClickUp Task Creator - Sprint 5-6 Tasks
# This script creates 16 tasks for Sprint 5-6 (Nov 13-24, 2025)
# Dependencies: CLICKUP_MCP_API_KEY environment variable must be set

# Configuration
CLICKUP_API_KEY="${CLICKUP_MCP_API_KEY}"
LIST_ID="901111127909"  # Linkfy list
API_URL="https://api.clickup.com/api/v2/list/${LIST_ID}/task"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Check if API key is set
if [ -z "$CLICKUP_API_KEY" ]; then
    echo -e "${RED}❌ ERROR: CLICKUP_MCP_API_KEY environment variable not set${NC}"
    echo "Set it with: export CLICKUP_MCP_API_KEY='your-api-key'"
    exit 1
fi

echo -e "${BLUE}🚀 Starting Sprint 5-6 Task Creation in ClickUp${NC}"
echo -e "${BLUE}Sprint: 5-6 (Nov 13-24, 2025) | v2.5.0 Release${NC}"
echo "═════════════════════════════════════════════════════════════"

# Array of tasks
declare -a TASKS=(
    # TIER 1: MUST HAVE (58 hours)
    
    # Task 1: Dark Mode Implementation (14h) ⭐ PRIORITY #1
    '{
        "name": "Dark Mode Implementation - Theme system with persistence",
        "description": "Complete dark mode with CSS variables, toggle, persistence.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 1 - MUST HAVE ⭐ PRIORIDAD #1\n**Effort**: 14 hours\n**Scope**: Frontend/UI\n\n**Description**:\nImplement complete dark mode using CSS variables, theme system, component updates, and localStorage persistence.\n\n**Acceptance Criteria**:\n- ✅ All components support dark mode\n- ✅ Toggle saves to localStorage\n- ✅ System preference respected\n- ✅ No visual bugs in dark mode\n- ✅ 50%+ user adoption target\n\n**Subtasks**:\n- CSS variables for color themes (light/dark) (5h)\n- Toggle button in settings (3h)\n- localStorage persistence (2h)\n- Auto-detect system preference (2h)\n- Smooth transitions & animations (1h)\n- Full component testing (1h)\n\n**Technical Notes**:\n- File: client/src/index.css (CSS variables)\n- File: client/src/components/ (component updates)\n- Use Tailwind dark: utilities\n- Test on all pages and components",
        "priority": 1,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "client", "ui", "user-experience", "effort-large"],
        "time_estimate": 50400000
    }'
    
    # Task 2: Conversion Preview (10h)
    '{
        "name": "Conversion Preview - Real-time metadata display",
        "description": "Real-time preview of conversion results with track metadata.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 1 - MUST HAVE\n**Effort**: 10 hours\n**Scope**: Frontend/Feature\n\n**Description**:\nImplement real-time preview functionality showing song information, artwork, and conversion details.\n\n**Acceptance Criteria**:\n- ✅ Preview updates as user types\n- ✅ Artwork displays correctly\n- ✅ All metadata shown (title, artist, duration)\n- ✅ Mobile responsive\n- ✅ Error state handling\n\n**Subtasks**:\n- Real-time metadata fetching (4h)\n- Track artwork display (2h)\n- Song information display (2h)\n- Responsive preview layout (1h)\n- Error state handling (1h)\n\n**Technical Notes**:\n- File: client/src/components/conversion-preview.tsx\n- Integrate with conversion-form.tsx\n- Use existing API calls",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "client", "user-experience", "effort-medium"],
        "time_estimate": 36000000
    }'
    
    # Task 3: Favorites/Bookmarks System (10h)
    '{
        "name": "Favorites/Bookmarks System - Save and manage conversions",
        "description": "Save and manage favorite conversions with quick access.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 1 - MUST HAVE\n**Effort**: 10 hours\n**Scope**: Frontend + Backend/Feature\n\n**Description**:\nCreate favorites system allowing users to save and quickly access favorite conversions.\n\n**Acceptance Criteria**:\n- ✅ Can save to favorites\n- ✅ Favorites persist across sessions\n- ✅ Can remove favorites\n- ✅ Quick access sidebar working\n- ✅ Supabase storage working\n\n**Subtasks**:\n- Star/favorite button on results (3h)\n- Favorites list/sidebar (3h)\n- Remove favorite functionality (2h)\n- Supabase storage integration (2h)\n\n**Technical Notes**:\n- File: client/src/components/favorites-button.tsx (new)\n- File: client/src/components/favorites-sidebar.tsx (new)\n- Use existing Supabase integration\n- Database schema for favorites table",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "client", "user-experience", "effort-medium"],
        "time_estimate": 36000000
    }'
    
    # Task 4: User Menu Position Review (6h)
    '{
        "name": "User Menu Position Review - Responsive positioning fix",
        "description": "Review and optimize user menu positioning for all devices.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 1 - MUST HAVE\n**Effort**: 6 hours\n**Scope**: Frontend/UI\n\n**Description**:\nAudit and fix user menu positioning, alignment, and mobile responsiveness.\n\n**Acceptance Criteria**:\n- ✅ Menu doesn''t overflow on mobile\n- ✅ Responsive across devices\n- ✅ Touch-friendly on mobile\n- ✅ Proper alignment (desktop/mobile)\n- ✅ Visual consistency\n\n**Subtasks**:\n- Responsive positioning (desktop/mobile) (3h)\n- Mobile menu adjustments (2h)\n- Prevent overflow issues (1h)\n\n**Technical Notes**:\n- File: client/src/components/header.tsx\n- Use Radix UI dropdown positioning\n- Test on mobile viewports (320px, 768px, 1024px)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "fix", "client", "ui", "mobile", "effort-medium"],
        "time_estimate": 21600000
    }'
    
    # Task 5: Conversion History (10h)
    '{
        "name": "Conversion History - Store and display conversion timeline",
        "description": "Store and display user conversion history with search and filtering.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 1 - MUST HAVE\n**Effort**: 10 hours\n**Scope**: Frontend + Backend/Feature\n\n**Description**:\nImplement conversion history tracking with database storage, timeline UI, and search functionality.\n\n**Acceptance Criteria**:\n- ✅ History saved to database\n- ✅ Timeline displays in UI\n- ✅ Can search history\n- ✅ Can clear history\n- ✅ Timestamp tracking\n\n**Subtasks**:\n- Database schema for history (3h)\n- History timeline UI (3h)\n- Search/filter history (2h)\n- Clear history function (1h)\n- Timestamp tracking (1h)\n\n**Technical Notes**:\n- File: client/src/components/history-timeline.tsx (new)\n- Database: Add history table to Supabase\n- File: server/src/services/history.service.ts (new)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "client", "user-experience", "effort-medium"],
        "time_estimate": 36000000
    }'
    
    # Task 6: Right-Click Context Menu (Extension) (8h)
    '{
        "name": "Right-Click Context Menu (Extension) - Quick conversion",
        "description": "Add right-click context menu for quick music URL conversion.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 1 - MUST HAVE\n**Effort**: 8 hours\n**Scope**: Browser Extension\n\n**Description**:\nImplement right-click context menu handler for quick URL conversion without opening extension popup.\n\n**Acceptance Criteria**:\n- ✅ Right-click menu visible on music links\n- ✅ Quick convert working\n- ✅ Results displayed correctly\n- ✅ Works on all supported music platforms\n\n**Subtasks**:\n- Register context menu handler (3h)\n- Detect YouTube Music/Spotify URLs (2h)\n- One-click conversion via context menu (2h)\n- Results popup/tab handling (1h)\n\n**Technical Notes**:\n- File: chrome-addon/background.js (update)\n- File: chrome-addon/manifest.json (add context_menus permission)\n- Test on Chrome, Firefox, Safari",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "extension", "user-experience", "effort-medium"],
        "time_estimate": 28800000
    }'
    
    # Task 7: Auto URL Detection (Extension) (8h)
    '{
        "name": "Auto URL Detection (Extension) - Smart suggestion popup",
        "description": "Auto-detect music URLs and show conversion suggestion.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 1 - MUST HAVE\n**Effort**: 8 hours\n**Scope**: Browser Extension\n\n**Description**:\nImplement background script to detect music service URLs on any web page and show conversion suggestion.\n\n**Acceptance Criteria**:\n- ✅ URLs detected on any page\n- ✅ Suggestion popup shows\n- ✅ One-click conversion works\n- ✅ Supports multiple platforms\n- ✅ No false positives\n\n**Subtasks**:\n- Background script URL detection (3h)\n- Page content scanning (2h)\n- Conversion suggestion popup (2h)\n- One-click conversion from suggestion (1h)\n\n**Technical Notes**:\n- File: chrome-addon/background.js (create detector)\n- File: client/src/AppExtension.tsx (popup component)\n- Use content script for page scanning",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "extension", "user-experience", "effort-medium"],
        "time_estimate": 28800000
    }'
    
    # Task 8: Settings Panel (8h)
    '{
        "name": "Settings Panel - Complete UI with all options",
        "description": "Complete settings UI with theme, language, history, and more.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 1 - MUST HAVE\n**Effort**: 8 hours\n**Scope**: Frontend/Feature\n\n**Description**:\nCreate comprehensive settings panel with all user preferences and configuration options.\n\n**Acceptance Criteria**:\n- ✅ All settings functional\n- ✅ Settings persist\n- ✅ Clear data works\n- ✅ Responsive layout\n- ✅ Theme and language options\n\n**Subtasks**:\n- Theme selector (light/dark) (2h)\n- Language selector (2h)\n- History retention settings (2h)\n- Clear all data button (1h)\n- Extension permissions UI (1h)\n\n**Technical Notes**:\n- File: client/src/pages/settings.tsx (new)\n- File: client/src/components/settings-panel.tsx (new)\n- Use shadcn/ui components\n- Integrate with existing preference system",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "client", "user-experience", "effort-medium"],
        "time_estimate": 28800000
    }'
    
    # Task 9: Notifications & Feedback (6h)
    '{
        "name": "Notifications & Feedback - Toast system for user actions",
        "description": "Implement toast notifications for user feedback on all actions.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 1 - MUST HAVE\n**Effort**: 6 hours\n**Scope**: Frontend/UI\n\n**Description**:\nCreate toast notification system for user feedback on conversions, errors, and actions.\n\n**Acceptance Criteria**:\n- ✅ Toasts display correctly\n- ✅ All states covered (success, error, info)\n- ✅ Auto-dismiss working\n- ✅ Accessible notifications\n- ✅ Copy-to-clipboard feedback\n\n**Subtasks**:\n- Toast component (2h)\n- Success notifications (2h)\n- Error notifications (1h)\n- Copy-to-clipboard feedback (1h)\n\n**Technical Notes**:\n- File: client/src/components/toast.tsx (update)\n- Use shadcn/ui toast component\n- Implement toastManager hook",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "client", "user-experience", "effort-medium"],
        "time_estimate": 21600000
    }'
    
    # TIER 2: SHOULD HAVE (22 hours)
    
    # Task 10: Error Handling & Input Highlighting (4h)
    '{
        "name": "Error Handling & Input Highlighting - UX improvement",
        "description": "Improve error messages and input field highlighting.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 2 - SHOULD HAVE\n**Effort**: 4 hours\n**Scope**: Frontend/UX\n\n**Description**:\nEnhance error handling with clear messages and visual input highlighting for better UX.\n\n**Acceptance Criteria**:\n- ✅ Errors clearly visible\n- ✅ Inputs highlighted on error\n- ✅ Messages are helpful\n- ✅ Visual consistency\n\n**Subtasks**:\n- Error message styling (1h)\n- Input highlight on error (1h)\n- Clear error messages (1h)\n- Helpful error guidance (1h)",
        "priority": 3,
        "tags": ["Q4-2025", "sprint-5-6", "fix", "client", "ui", "user-experience", "effort-small"],
        "time_estimate": 14400000
    }'
    
    # Task 11: Login Modal (5h)
    '{
        "name": "Login Modal - Frictionless authentication popup",
        "description": "Convert login to popup modal instead of full page redirect.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 2 - SHOULD HAVE\n**Effort**: 5 hours\n**Scope**: Frontend/UI\n\n**Description**:\nRefactor login flow to use modal popup for frictionless authentication.\n\n**Acceptance Criteria**:\n- ✅ Login modal appears\n- ✅ No full page redirect\n- ✅ Works with OAuth\n- ✅ Smooth transitions\n- ✅ Error handling in modal\n\n**Subtasks**:\n- Modal component (2h)\n- Login form in modal (2h)\n- OAuth integration in modal (1h)\n\n**Technical Notes**:\n- File: client/src/components/login-modal.tsx (new)\n- File: client/src/pages/login.tsx (update)\n- Use shadcn/ui dialog component",
        "priority": 3,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "client", "ui", "auth", "effort-small"],
        "time_estimate": 18000000
    }'
    
    # Task 12: Link Cursor & Hover Effects (4h)
    '{
        "name": "Link Cursor & Hover Effects - Visual feedback polish",
        "description": "Improve cursor and hover feedback across UI.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 2 - SHOULD HAVE\n**Effort**: 4 hours\n**Scope**: Frontend/UI\n\n**Description**:\nAdd proper link cursors and smooth hover effects for better visual feedback.\n\n**Acceptance Criteria**:\n- ✅ Proper cursors throughout\n- ✅ Hover effects smooth\n- ✅ Visual consistency\n- ✅ Animation performance\n\n**Subtasks**:\n- Link cursor on clickables (1h)\n- Hover effect animations (2h)\n- Button hover states (1h)\n\n**Technical Notes**:\n- File: client/src/index.css (update cursor classes)\n- Use Tailwind utilities\n- Test on all components",
        "priority": 3,
        "tags": ["Q4-2025", "sprint-5-6", "style", "client", "ui", "user-experience", "effort-small"],
        "time_estimate": 14400000
    }'
    
    # Task 13: Database Persistence (History + Favorites) (8h)
    '{
        "name": "Database Persistence - Ensure all data saves correctly",
        "description": "Ensure history and favorites data persists reliably to database.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 2 - SHOULD HAVE\n**Effort**: 8 hours\n**Scope**: Backend/Database\n\n**Description**:\nImplement and test database persistence layer for history and favorites.\n\n**Acceptance Criteria**:\n- ✅ Data saves to DB\n- ✅ No data loss\n- ✅ Sync reliable\n- ✅ Error handling for DB operations\n- ✅ Proper indexing\n\n**Subtasks**:\n- Supabase schema finalization (3h)\n- Insert/update/delete functions (3h)\n- Error handling for DB operations (1h)\n- Sync strategy (1h)\n\n**Technical Notes**:\n- File: server/src/services/database.service.ts\n- Database: Supabase\n- Add proper indexes for queries",
        "priority": 3,
        "tags": ["Q4-2025", "sprint-5-6", "feat", "api", "database", "effort-medium"],
        "time_estimate": 28800000
    }'
    
    # Task 14: Security - URL Sanitization (4h)
    '{
        "name": "Security - URL Sanitization - XSS prevention",
        "description": "Ensure all external URLs are properly sanitized.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 2 - SHOULD HAVE\n**Effort**: 4 hours\n**Scope**: Backend/Security\n\n**Description**:\nImplement URL sanitization to prevent XSS attacks and malicious input.\n\n**Acceptance Criteria**:\n- ✅ All URLs validated\n- ✅ No XSS vulnerabilities\n- ✅ Security tests pass\n- ✅ Input validation on all endpoints\n\n**Subtasks**:\n- URL validation utility (2h)\n- Sanitization in API (1h)\n- Input validation (1h)\n\n**Technical Notes**:\n- File: server/src/utils/url-sanitizer.ts (new)\n- Use URL parsing library\n- Add security tests",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "fix", "api", "security", "effort-small"],
        "time_estimate": 14400000
    }'
    
    # Task 15: CORS Configuration (3h)
    '{
        "name": "CORS Configuration - Restrictive whitelist setup",
        "description": "Configure CORS with restrictive whitelist for security.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 2 - SHOULD HAVE\n**Effort**: 3 hours\n**Scope**: Backend/Config\n\n**Description**:\nConfigure CORS middleware with proper whitelist for extension and API.\n\n**Acceptance Criteria**:\n- ✅ Extension can access API\n- ✅ Third-party blocked\n- ✅ All tests passing\n- ✅ Production ready\n\n**Subtasks**:\n- CORS middleware setup (1.5h)\n- Whitelist configuration (1h)\n- Testing with extension (0.5h)\n\n**Technical Notes**:\n- File: server/src/main.ts (CORS setup)\n- File: server/src/config/cors.config.ts (new)\n- Environment-specific configuration",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-5-6", "chore", "api", "config", "security", "effort-small"],
        "time_estimate": 10800000
    }'
    
    # Task 16: Additional UX Polish (4h)
    '{
        "name": "Additional UX Polish - Miscellaneous improvements",
        "description": "Final UX improvements and polish touches.\n\n**Sprint**: Sprint 5-6 (Nov 13-24, 2025)\n**Priority Tier**: TIER 2 - SHOULD HAVE\n**Effort**: 4 hours\n**Scope**: Frontend/UI\n\n**Description**:\nMiscellaneous UX improvements including UI element cleanup and enhancement.\n\n**Acceptance Criteria**:\n- ✅ All items implemented\n- ✅ No breaking changes\n- ✅ UX improved\n- ✅ Visual consistency\n\n**Subtasks**:\n- GitHub repo link in header (1h)\n- Dashboard link for logged-in users (1h)\n- Remove unnecessary UI elements (1h)\n- Improve URL detection error messages (1h)\n\n**Technical Notes**:\n- File: client/src/components/header.tsx (update)\n- File: client/src/components/dashboard.tsx (update)\n- Review UI for cleanup",
        "priority": 3,
        "tags": ["Q4-2025", "sprint-5-6", "style", "client", "ui", "user-experience", "effort-small"],
        "time_estimate": 14400000
    }'
)

# Create tasks
TASK_COUNT=0
SUCCESS_COUNT=0
FAILURE_COUNT=0
CREATED_TASK_IDS=()

for task_json in "${TASKS[@]}"; do
    TASK_COUNT=$((TASK_COUNT + 1))
    
    # Extract task name for display
    TASK_NAME=$(echo "$task_json" | grep -o '"name":"[^"]*"' | head -1 | sed 's/"name":"//' | sed 's/"$//' | cut -c1-70)
    
    # Determine color based on priority
    if [[ "$TASK_COUNT" -le 9 ]]; then
        PRIORITY_COLOR=$MAGENTA
        PRIORITY_TEXT="TIER 1"
    else
        PRIORITY_COLOR=$YELLOW
        PRIORITY_TEXT="TIER 2"
    fi
    
    echo -e "\n${PRIORITY_COLOR}📝 Task ${TASK_COUNT}/16 [${PRIORITY_TEXT}]${NC}"
    echo "   Title: $TASK_NAME"
    
    # Make API request
    RESPONSE=$(curl -s -X POST "$API_URL" \
        -H "Authorization: $CLICKUP_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$task_json")
    
    # Check if successful
    if echo "$RESPONSE" | grep -q '"id"'; then
        TASK_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//' | sed 's/"$//')
        CREATED_TASK_IDS+=("$TASK_ID")
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        echo -e "   ${GREEN}✅ Created (ID: $TASK_ID)${NC}"
    else
        FAILURE_COUNT=$((FAILURE_COUNT + 1))
        ERROR_MSG=$(echo "$RESPONSE" | grep -o '"err":"[^"]*"' | head -1 | sed 's/"err":"//' | sed 's/"$//' || echo "Unknown error")
        echo -e "   ${RED}❌ Failed${NC}"
        echo "   Error: $ERROR_MSG"
    fi
    
    # Small delay between requests
    sleep 1
done

# Summary
echo ""
echo "═════════════════════════════════════════════════════════════"
echo -e "${BLUE}📊 Sprint 5-6 Task Creation Summary${NC}"
echo "═════════════════════════════════════════════════════════════"
echo -e "Total tasks:          ${BLUE}${TASK_COUNT}${NC}"
echo -e "Successfully created: ${GREEN}${SUCCESS_COUNT}${NC}"
echo -e "Failed:               ${RED}${FAILURE_COUNT}${NC}"
echo ""
echo -e "${MAGENTA}TIER 1 (MUST HAVE): 9 tasks | 58 hours${NC}"
echo -e "${YELLOW}TIER 2 (SHOULD HAVE): 7 tasks | 22 hours${NC}"
echo "═════════════════════════════════════════════════════════════"

# Display created task IDs
if [ ${#CREATED_TASK_IDS[@]} -gt 0 ]; then
    echo -e "\n${GREEN}✅ Successfully created tasks:${NC}"
    for i in "${!CREATED_TASK_IDS[@]}"; do
        echo "   $((i+1)). ${CREATED_TASK_IDS[$i]}"
    done
fi

echo ""
echo "🎯 Sprint 5-6 tasks created successfully!"
echo "📅 Sprint dates: Nov 13-24, 2025"
echo "🎯 Release target: v2.5.0 (Nov 24)"
