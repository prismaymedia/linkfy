#!/bin/bash

# ClickUp Task Creator - Sprint 3-4 Tasks
# This script creates 8 tasks via ClickUp API with proper tags and formatting

# Configuration
CLICKUP_API_KEY="${CLICKUP_MCP_API_KEY}"
LIST_ID="901111127909"  # Linkfy list
API_URL="https://api.clickup.com/api/v2/list/${LIST_ID}/task"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if API key is set
if [ -z "$CLICKUP_API_KEY" ]; then
    echo -e "${RED}❌ ERROR: CLICKUP_MCP_API_KEY environment variable not set${NC}"
    echo "Set it with: export CLICKUP_MCP_API_KEY='your-api-key'"
    exit 1
fi

echo -e "${BLUE}🚀 Starting Sprint 3-4 Task Creation in ClickUp${NC}"
echo "═════════════════════════════════════════════════════════════"

# Array of tasks
declare -a TASKS=(
    # Task 1: Universal /api/convert endpoint
    '{
        "name": "Universal /api/convert endpoint - Multi-platform support",
        "description": "Implement universal /api/convert endpoint for multi-platform music URL conversion.\n\n**Sprint**: Sprint 3-4 (Oct 28 - Nov 10)\n**Priority Tier**: TIER 1 - Notion Backlog\n**Effort**: 14 hours\n**Scope**: Backend/API\n\n**Description**:\nCreate a unified API endpoint that auto-detects the source platform and routes conversions to appropriate service handlers.\n\n**Acceptance Criteria**:\n- Auto-detect source platform from URL (YouTube, Spotify, Apple Music, etc.)\n- Route to appropriate service handler based on detection\n- Zod validation for multiple platform URL formats\n- Support at least 3+ platform URL formats\n- Return consistent JSON response format\n- Handle edge cases and malformed URLs gracefully\n\n**Technical Notes**:\n- File: server/src/controllers/convert.controller.ts\n- Create new unified endpoint: POST /api/convert\n- Use existing service modules\n- Add Zod schemas in shared/schema.ts\n\n**Subtasks**:\n- Auto-detect platform logic (6h)\n- Route to handler implementation (5h)\n- Zod validation schemas (3h)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-3-4", "feat", "api", "platform-integration", "effort-large"],
        "time_estimate": 50400000
    }'
    
    # Task 2: Dynamic service icons
    '{
        "name": "Dynamic service icons - URL-based icon switching",
        "description": "Implement dynamic service icons that update based on detected music platform.\n\n**Sprint**: Sprint 3-4 (Oct 28 - Nov 10)\n**Priority Tier**: TIER 1 - Notion Backlog\n**Effort**: 8 hours\n**Scope**: Frontend/Client\n\n**Description**:\nCreate dynamic icon system that detects the current service from input URL and updates display icon accordingly.\n\n**Acceptance Criteria**:\n- Detect current service from URL in real-time\n- Update icon as user types/pastes URL\n- Support icons for: YouTube Music, Spotify, Apple Music, Deezer\n- Icons update within 100ms of input change\n- Smooth visual transitions between icons\n- Accessible icon labels\n\n**Technical Notes**:\n- File: client/src/components/music-service-selector.tsx\n- Use existing icon library from shadcn/ui\n- Integrate with conversion-form component\n\n**Subtasks**:\n- Platform detection logic (3h)\n- Icon update mechanism (4h)\n- Testing & edge cases (1h)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-3-4", "feat", "client", "ui", "user-experience", "effort-medium"],
        "time_estimate": 28800000
    }'
    
    # Task 3: Clean icon with hover actions
    '{
        "name": "Clean icon with hover actions - Input field controls",
        "description": "Implement clean icon with hover actions for clearing input field.\n\n**Sprint**: Sprint 3-4 (Oct 28 - Nov 10)\n**Priority Tier**: TIER 1 - Notion Backlog\n**Effort**: 6 hours\n**Scope**: Frontend/UI\n\n**Description**:\nAdd a clean/clear button icon that appears on hover over the input field.\n\n**Acceptance Criteria**:\n- Icon appears on hover (input field only)\n- Clear button resets form completely\n- Clear action confirmed (no accidental resets)\n- Smooth fade-in/out animation on hover\n- Mobile-friendly (tap to show, then tap to clear)\n- Visual feedback on hover and click\n\n**Technical Notes**:\n- File: client/src/components/conversion-form.tsx\n- Use Lucide icon for clear/trash icon\n- Add Framer Motion for animations\n\n**Subtasks**:\n- Icon hover display (3h)\n- Clear functionality (2h)\n- Visual feedback & animations (1h)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-3-4", "feat", "client", "ui", "user-experience", "effort-medium"],
        "time_estimate": 21600000
    }'
    
    # Task 4: Replace Get Started with Music Converter component
    '{
        "name": "Replace Get Started with Music Converter component",
        "description": "Refactor to extract and reuse Music Converter component throughout app.\n\n**Sprint**: Sprint 3-4 (Oct 28 - Nov 10)\n**Priority Tier**: TIER 1 - Notion Backlog\n**Effort**: 10 hours\n**Scope**: Frontend/Refactor\n\n**Description**:\nExtract the conversion form into a reusable Music Converter component. Replace \"Get Started\" sections and hardcoded forms.\n\n**Acceptance Criteria**:\n- Extract conversion form to new MusicConverterComponent\n- Component is reusable and composable\n- Replace at least 3 existing forms with component\n- Support different sizes (compact, full)\n- Works on dashboard, home, and other pages\n- Maintains all functionality\n\n**Technical Notes**:\n- File: client/src/components/music-converter.tsx (new)\n- Extract from: client/src/components/conversion-form.tsx\n- Usage: client/src/pages/home.tsx, dashboard.tsx\n\n**Subtasks**:\n- Extract to component (6h)\n- Create flexible props system (3h)\n- Integration & testing (1h)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-3-4", "refactor", "client", "ui", "effort-large"],
        "time_estimate": 36000000
    }'
    
    # Task 5: User menu position review
    '{
        "name": "User menu position review - Responsive positioning fix",
        "description": "Review and adjust user menu positioning for better UX and mobile responsiveness.\n\n**Sprint**: Sprint 3-4 (Oct 28 - Nov 10)\n**Priority Tier**: TIER 1 - Notion Backlog\n**Effort**: 6 hours\n**Scope**: Frontend/UI\n\n**Description**:\nAudit current user menu positioning, identify issues with alignment, overflow, and mobile responsiveness.\n\n**Acceptance Criteria**:\n- Review menu positioning on desktop and mobile\n- Fix alignment issues with dropdown\n- Prevent menu overflow on small screens\n- Ensure touch-friendly on mobile\n- Consistent padding and spacing\n- Menu closes appropriately on selection or outside click\n\n**Technical Notes**:\n- File: client/src/components/header.tsx\n- Use Radix UI dropdown positioning\n- Test on mobile viewports (320px, 768px, 1024px)\n\n**Subtasks**:\n- Position audit & review (4h)\n- Mobile responsive fixes (2h)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-3-4", "fix", "client", "ui", "mobile", "effort-medium"],
        "time_estimate": 21600000
    }'
    
    # Task 6: Change /api/user-info category
    '{
        "name": "Change /api/user-info category - API reorganization",
        "description": "Reorganize /api/user-info endpoint category and structure for better API organization.\n\n**Sprint**: Sprint 3-4 (Oct 28 - Nov 10)\n**Priority Tier**: TIER 1 - Notion Backlog\n**Effort**: 8 hours\n**Scope**: Backend/API\n\n**Description**:\nRestructure the /api/user-info endpoint to fit better into API organization hierarchy.\n\n**Acceptance Criteria**:\n- Reorganize endpoint path structure\n- Update Swagger/OpenAPI documentation\n- Update all client-side API calls\n- Maintain backward compatibility if possible\n- Add API versioning if needed\n- Update unit tests for endpoint\n\n**Technical Notes**:\n- File: server/src/controllers/user.controller.ts\n- Update: client/src/lib/queryClient.ts\n- Review: API documentation (Swagger)\n\n**Subtasks**:\n- Reorganize endpoint structure (5h)\n- Update client calls (2h)\n- Tests & documentation (1h)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-3-4", "refactor", "api", "effort-medium"],
        "time_estimate": 28800000
    }'
    
    # Task 7: Dark mode implementation
    '{
        "name": "Dark mode implementation - Theme system with persistence",
        "description": "Implement dark mode for the entire application with theme system and persistence.\n\n**Sprint**: Sprint 3-4 (Oct 28 - Nov 10)\n**Priority Tier**: TIER 2 - Original Features\n**Effort**: 14 hours\n**Scope**: Frontend/UI\n\n**Description**:\nCreate complete dark mode implementation using CSS variables, theme system, component updates, and localStorage persistence.\n\n**Acceptance Criteria**:\n- CSS variables for theme colors\n- Dark mode toggle in settings\n- Apply dark theme to all components\n- Persist user preference in localStorage\n- System preference detection (prefers-color-scheme)\n- Smooth transitions between themes\n- No layout shifts or visual issues in dark mode\n\n**Technical Notes**:\n- File: client/src/index.css (CSS variables)\n- File: client/src/components/ (component updates)\n- Use Tailwind dark: utilities\n- Test on all pages and components\n\n**Subtasks**:\n- CSS variables & theme system (5h)\n- Component dark mode updates (6h)\n- Persistence & detection (2h)\n- Testing across app (1h)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-3-4", "feat", "client", "ui", "user-experience", "effort-large"],
        "time_estimate": 50400000
    }'
    
    # Task 8: Smart URL handling features
    '{
        "name": "Smart URL handling features - Copy detection & clipboard",
        "description": "Implement smart URL handling with copy action detection and clipboard auto-detection.\n\n**Sprint**: Sprint 3-4 (Oct 28 - Nov 10)\n**Priority Tier**: TIER 2 - Original Features\n**Effort**: 14 hours\n**Scope**: Frontend\n\n**Description**:\nCreate intelligent URL handling system that detects when users copy music service URLs and automatically pastes them.\n\n**Acceptance Criteria**:\n- Detect copy action (Ctrl+C, Cmd+C) on music service URLs\n- Auto-fill input field with copied URL\n- Real-time URL validation as user types/pastes\n- Show progress indicator during conversion\n- Handle multiple platforms (YouTube, Spotify, Apple Music)\n- Toast notifications for copy detection\n- Works on desktop and mobile\n\n**Technical Notes**:\n- File: client/src/components/conversion-form.tsx\n- Use Clipboard API for modern browsers\n- Add keyboard event listeners\n- Toast notifications from existing hook\n\n**Subtasks**:\n- Copy action detection (4h)\n- Clipboard auto-detection (6h)\n- Real-time URL validation (3h)\n- Progress indicator UI (1h)",
        "priority": 2,
        "tags": ["Q4-2025", "sprint-3-4", "feat", "client", "user-experience", "effort-large"],
        "time_estimate": 50400000
    }'
)

# Create tasks
TASK_COUNT=0
SUCCESS_COUNT=0
FAILURE_COUNT=0
CREATED_TASK_IDS=()

for task_json in "${TASKS[@]}"; do
    TASK_COUNT=$((TASK_COUNT + 1))
    
    echo -e "\n${YELLOW}📝 Creating Task ${TASK_COUNT}/8...${NC}"
    
    # Extract task name for display
    TASK_NAME=$(echo "$task_json" | grep -o '"name":"[^"]*"' | head -1 | sed 's/"name":"//' | sed 's/"$//' | cut -c1-60)
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
        echo -e "   ${GREEN}✅ Task created successfully (ID: $TASK_ID)${NC}"
    else
        FAILURE_COUNT=$((FAILURE_COUNT + 1))
        ERROR_MSG=$(echo "$RESPONSE" | grep -o '"err":"[^"]*"' | head -1 | sed 's/"err":"//' | sed 's/"$//' || echo "Unknown error")
        echo -e "   ${RED}❌ Failed to create task${NC}"
        echo "   Error: $ERROR_MSG"
        echo "   Response: ${RESPONSE:0:200}"
    fi
    
    # Small delay between requests
    sleep 1
done

# Summary
echo ""
echo "═════════════════════════════════════════════════════════════"
echo -e "${BLUE}📊 Task Creation Summary${NC}"
echo "═════════════════════════════════════════════════════════════"
echo -e "Total tasks:     ${BLUE}${TASK_COUNT}${NC}"
echo -e "Successfully created: ${GREEN}${SUCCESS_COUNT}${NC}"
echo -e "Failed:          ${RED}${FAILURE_COUNT}${NC}"

if [ ${#CREATED_TASK_IDS[@]} -gt 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Created Task IDs:${NC}"
    for i in "${!CREATED_TASK_IDS[@]}"; do
        echo "   Task $((i+1)): ${CREATED_TASK_IDS[$i]}"
    done
    
    # Save IDs to file
    echo "${CREATED_TASK_IDS[@]}" > /Users/jonathan/Documents/code/linkfy/backlog/sprint-3-4-task-ids.txt
    echo ""
    echo -e "${GREEN}💾 Task IDs saved to: sprint-3-4-task-ids.txt${NC}"
fi

if [ $FAILURE_COUNT -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tasks created successfully!${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Some tasks failed. Check errors above.${NC}"
    exit 1
fi
