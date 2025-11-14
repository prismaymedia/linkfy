#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# 🔍 VERSION VERIFICATION SCRIPT - Linkfy Project
# ═══════════════════════════════════════════════════════════════════════════════
#
# Purpose: Verify that all version numbers are consistent across the project
# Usage: ./scripts/verify-versions.sh
#
# This script checks:
# ✓ All package.json files have the same version
# ✓ Documentation reflects the correct version
# ✓ No orphaned version references exist
#
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

get_version_from_file() {
    local file=$1
    if [ ! -f "$file" ]; then
        echo "NOT_FOUND"
        return
    fi
    
    # Try to extract version from package.json
    if [[ $file == *"package.json"* ]]; then
        grep '"version"' "$file" | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/' 2>/dev/null || echo "ERROR"
    else
        # For other files, look for v-prefixed versions or numeric versions
        grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' "$file" | head -1 | sed 's/v//' 2>/dev/null || echo "NOT_FOUND"
    fi
}

check_package_json_files() {
    print_info "Checking package.json files..."
    echo ""
    
    local root_version=$(get_version_from_file "$PROJECT_ROOT/package.json")
    local client_version=$(get_version_from_file "$PROJECT_ROOT/client/package.json")
    local server_version=$(get_version_from_file "$PROJECT_ROOT/server/package.json")
    
    echo "  Root:   $root_version"
    echo "  Client: $client_version"
    echo "  Server: $server_version"
    echo ""
    
    # Check consistency
    local all_match=true
    
    if [ "$root_version" != "$client_version" ]; then
        print_warning "Root ($root_version) ≠ Client ($client_version)"
        all_match=false
    else
        print_success "Root ≈ Client: $root_version"
    fi
    
    if [ "$root_version" != "$server_version" ]; then
        print_warning "Root ($root_version) ≠ Server ($server_version)"
        all_match=false
    else
        print_success "Root ≈ Server: $root_version"
    fi
    
    if [ "$all_match" = true ]; then
        echo ""
        print_success "All package.json files are synchronized"
        echo ""
        return 0
    else
        echo ""
        print_error "package.json files are NOT synchronized"
        echo ""
        return 1
    fi
}

check_documentation_consistency() {
    print_info "Checking documentation files..."
    echo ""
    
    # Get version from root package.json (source of truth)
    local expected_version=$(get_version_from_file "$PROJECT_ROOT/package.json")
    
    local errors=0
    
    # Critical files
    local critical_files=(
        "README.md"
        "docs/Q4_2025_SPRINT_PLAN.md"
        "docs/QUICK_REFERENCE.md"
    )
    
    print_info "TIER 1 CRITICAL files (must have v$expected_version):"
    for file in "${critical_files[@]}"; do
        if [ -f "$PROJECT_ROOT/$file" ]; then
            local count=$(grep -c "v$expected_version" "$PROJECT_ROOT/$file" 2>/dev/null || echo 0)
            if [ $count -gt 0 ]; then
                print_success "$file: Found $count reference(s) ✓"
            else
                print_error "$file: No references to v$expected_version"
                ((errors++))
            fi
        fi
    done
    
    echo ""
    
    # Important files
    local important_files=(
        "docs/SPRINT_5_6_REORGANIZADO.md"
        "docs/Q4_2025_SPRINT_STATUS_OVERVIEW.md"
        "docs/SPRINT_SUMMARY_CURRENT.md"
    )
    
    print_info "TIER 2 IMPORTANT files (should have v$expected_version):"
    for file in "${important_files[@]}"; do
        if [ -f "$PROJECT_ROOT/$file" ]; then
            local count=$(grep -c "v$expected_version" "$PROJECT_ROOT/$file" 2>/dev/null || echo 0)
            if [ $count -gt 0 ]; then
                print_success "$file: Found $count reference(s) ✓"
            else
                print_warning "$file: No references to v$expected_version"
            fi
        fi
    done
    
    echo ""
    
    if [ $errors -eq 0 ]; then
        print_success "All documentation files are consistent"
        echo ""
        return 0
    else
        print_error "Found $errors inconsistency/inconsistencies in documentation"
        echo ""
        return 1
    fi
}

check_orphaned_versions() {
    print_info "Checking for orphaned version references..."
    echo ""
    
    # Get current version
    local current_version=$(get_version_from_file "$PROJECT_ROOT/package.json")
    
    # Historical versions (these are OK to have in documentation)
    local historical_versions=(
        "2.3.0"
        "2.2.0"
        "2.1.0"
    )
    
    print_warning "Note: Historical versions (2.3.0, 2.4.0) are expected in documentation"
    print_info "These appear in version history tables and are NOT errors"
    echo ""
    
    # Check for truly orphaned versions (versions in future that shouldn't be there)
    local future_versions=(
        "3.0.0"
        "2.9.0"
    )
    
    local found_orphaned=false
    
    for version in "${future_versions[@]}"; do
        local count=$(grep -r "v$version" "$PROJECT_ROOT/docs/" "$PROJECT_ROOT/README.md" 2>/dev/null | wc -l)
        if [ $count -gt 0 ]; then
            print_warning "Found unexpected future version reference: v$version"
            found_orphaned=true
        fi
    done
    
    if [ "$found_orphaned" = false ]; then
        print_success "No unexpected version references found"
        echo ""
        return 0
    else
        echo ""
        return 1
    fi
}

show_version_report() {
    print_header "📊 VERSION VERIFICATION REPORT"
    
    local expected_version=$(get_version_from_file "$PROJECT_ROOT/package.json")
    
    echo "Expected Version: ${GREEN}v$expected_version${NC}"
    echo ""
    echo "Files Checked:"
    echo "  ✓ package.json files"
    echo "  ✓ Documentation files"
    echo "  ✓ Orphaned references"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    print_header "🔍 LINKFY VERSION VERIFICATION"
    
    local total_errors=0
    
    # Show report header
    show_version_report
    
    # Check package.json files
    if ! check_package_json_files; then
        ((total_errors++))
    fi
    
    # Check documentation consistency
    if ! check_documentation_consistency; then
        ((total_errors++))
    fi
    
    # Check for orphaned versions
    if ! check_orphaned_versions; then
        ((total_errors++))
    fi
    
    # Final summary
    echo ""
    if [ $total_errors -eq 0 ]; then
        print_header "✅ VERIFICATION PASSED"
        echo "All version numbers are synchronized and consistent!"
        echo ""
        echo "Next steps:"
        echo "  • Proceed with development"
        echo "  • Run: ${YELLOW}yarn dev${NC}"
        echo "  • Or commit changes: ${YELLOW}git add . && git commit${NC}"
        exit 0
    else
        print_header "❌ VERIFICATION FAILED"
        echo "Found inconsistencies in version numbers."
        echo ""
        echo "To fix, run:"
        echo "  ${YELLOW}./scripts/sync-versions.sh <version>${NC}"
        echo ""
        exit 1
    fi
}

# Run main function
main "$@"
