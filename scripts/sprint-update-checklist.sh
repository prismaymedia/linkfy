#!/bin/bash

# 📋 Sprint Documentation Update Checklist Script
# Purpose: Interactive checklist to ensure all docs are updated during sprint reorganization
# Usage: bash scripts/sprint-update-checklist.sh

clear
cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║         📋 SPRINT DOCUMENTATION UPDATE CHECKLIST               ║
║                                                                ║
║  Ensure ALL sprint planning changes are reflected in docs     ║
╚════════════════════════════════════════════════════════════════╝

This script will help you verify that all documentation files
have been updated with your sprint reorganization changes.

EOF

echo ""
echo "📝 Starting verification..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track completion
completed=0
failed=0

# Helper function
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $description"
        ((completed++))
    else
        echo -e "${RED}❌${NC} $description"
        echo "   File not found: $file"
        ((failed++))
    fi
}

# Helper function to verify content
check_content() {
    local file=$1
    local search_term=$2
    local description=$3
    
    if grep -q "$search_term" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $description"
        ((completed++))
    else
        echo -e "${YELLOW}⚠️${NC}  $description"
        echo "   Search term not found: '$search_term'"
        ((failed++))
    fi
}

echo "TIER 1: CRITICAL FILES"
echo "═══════════════════════════════════════════════════════════"
check_file "README.md" "README.md exists"
check_file "docs/Q4_2025_SPRINT_PLAN.md" "Main sprint plan exists"
check_file "docs/SPRINT_5_6_REORGANIZADO.md" "Current sprint document exists"

echo ""
echo "TIER 2: STATUS & TRACKING"
echo "═══════════════════════════════════════════════════════════"
check_file "docs/Q4_2025_SPRINT_STATUS_OVERVIEW.md" "Status dashboard exists"
check_file "docs/SPRINT_SUMMARY_CURRENT.md" "Summary document exists"
check_file "docs/QUICK_REFERENCE.md" "Quick reference exists"

echo ""
echo "TIER 3: SUPPORT FILES"
echo "═══════════════════════════════════════════════════════════"
check_file "docs/REORGANIZATION_SUMMARY.txt" "Reorganization summary exists"
check_file "docs/SPRINT_UPDATE_PROTOCOL.md" "Update protocol document exists"

echo ""
echo "CONTENT VERIFICATION"
echo "═══════════════════════════════════════════════════════════"
check_content "README.md" "v2.5.0" "README.md mentions v2.5.0"
check_content "README.md" "COMPLETED" "README.md marks completed sprints"
check_content "docs/Q4_2025_SPRINT_PLAN.md" "COMPLETED" "Sprint plan marks completed sprints"
check_content "docs/SPRINT_5_6_REORGANIZADO.md" "TIER 1" "Current sprint has TIER 1 structure"
check_content "docs/SPRINT_5_6_REORGANIZADO.md" "TIER 2" "Current sprint has TIER 2 structure"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "All sprint documentation is properly updated and synchronized."
else
    echo -e "${YELLOW}⚠️ SOME CHECKS FAILED OR INCOMPLETE${NC}"
    echo ""
    echo "Please review the items above and ensure all files are updated."
fi

echo ""
echo "Summary: $completed verified, $failed failed/incomplete"
echo ""
echo "Next steps:"
echo "1. Review any failed checks"
echo "2. Update missing files following SPRINT_UPDATE_PROTOCOL.md"
echo "3. Run this script again to verify"
echo ""
EOF
