#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# 🔄 VERSION SYNCHRONIZER - Linkfy Project
# ═══════════════════════════════════════════════════════════════════════════════
#
# Purpose: Automatically synchronize version numbers across all files in the project
# Usage: ./scripts/sync-versions.sh <new-version>
# Example: ./scripts/sync-versions.sh 2.5.0
#
# This script updates:
# ✓ package.json (root and workspaces)
# ✓ README.md (upcoming releases section)
# ✓ All documentation files mentioning versions
# ✓ Validates consistency after updates
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

# Validate version format
validate_version() {
    local version=$1
    if [[ ! $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        print_error "Invalid version format: $version"
        echo "  Expected format: X.Y.Z (e.g., 2.5.0)"
        return 1
    fi
    return 0
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

get_current_version() {
    # Extract version from root package.json
    local current=$(grep '"version"' "$PROJECT_ROOT/package.json" | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
    echo "$current"
}

sync_package_json() {
    local new_version=$1
    print_info "Updating package.json files..."
    
    # Update root package.json
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$new_version\"/" "$PROJECT_ROOT/package.json"
        print_success "Updated root package.json"
    fi
    
    # Update client package.json
    if [ -f "$PROJECT_ROOT/client/package.json" ]; then
        sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$new_version\"/" "$PROJECT_ROOT/client/package.json"
        print_success "Updated client/package.json"
    fi
    
    # Update server package.json
    if [ -f "$PROJECT_ROOT/server/package.json" ]; then
        sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$new_version\"/" "$PROJECT_ROOT/server/package.json"
        print_success "Updated server/package.json"
    fi
}

get_version_info() {
    local version=$1
    local major=$(echo $version | cut -d. -f1)
    local minor=$(echo $version | cut -d. -f2)
    local patch=$(echo $version | cut -d. -f3)
    
    # Calculate release date (8 days after current sprint start, assuming Nov 14 current date)
    # This is a placeholder - adjust based on your sprint calendar
    local days_from_sprint_start=$((8))
    local release_date=$(date -u -v+${days_from_sprint_start}d +"%b %d, %Y" 2>/dev/null || date -d "+${days_from_sprint_start} days" +"%b %d, %Y" 2>/dev/null || echo "TBD")
    
    echo "{\"version\": \"$version\", \"major\": $major, \"minor\": $minor, \"patch\": $patch}"
}

sync_documentation() {
    local new_version=$1
    local old_version=$2
    
    print_info "Updating documentation files..."
    
    # Files to update in docs directory
    local doc_files=(
        "docs/Q4_2025_SPRINT_PLAN.md"
        "docs/Q4_2025_SPRINT_STATUS_OVERVIEW.md"
        "docs/SPRINT_5_6_REORGANIZADO.md"
        "docs/QUICK_REFERENCE.md"
        "docs/SPRINT_SUMMARY_CURRENT.md"
        "docs/FILES_TO_UPDATE_CHECKLIST.md"
        "docs/VERSION_SYNC_GUIDE.md"
    )
    
    for file in "${doc_files[@]}"; do
        if [ -f "$PROJECT_ROOT/$file" ]; then
            # Replace version pattern (e.g., v2.4.0 with v2.5.0)
            sed -i '' "s/v$old_version/v$new_version/g" "$PROJECT_ROOT/$file"
            # Replace version without 'v' prefix
            sed -i '' "s/\b$old_version\b/$new_version/g" "$PROJECT_ROOT/$file"
            print_success "Updated $file"
        fi
    done
    
    # Special handling for README.md (more careful to avoid breaking content)
    if [ -f "$PROJECT_ROOT/README.md" ]; then
        sed -i '' "s/\*\*v$old_version\*\*/\*\*v$new_version\*\*/g" "$PROJECT_ROOT/README.md"
        sed -i '' "s/- \*\*v$old_version\*\*/- \*\*v$new_version\*\*/g" "$PROJECT_ROOT/README.md"
        print_success "Updated README.md"
    fi
}

verify_version_consistency() {
    local expected_version=$1
    print_info "Verifying version consistency..."
    
    local errors=0
    local warnings=0
    
    # Check package.json files
    echo ""
    print_info "Checking package.json files:"
    
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        local root_version=$(grep '"version"' "$PROJECT_ROOT/package.json" | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
        if [ "$root_version" = "$expected_version" ]; then
            print_success "Root package.json: $root_version ✓"
        else
            print_error "Root package.json: $root_version (expected $expected_version)"
            ((errors++))
        fi
    fi
    
    if [ -f "$PROJECT_ROOT/client/package.json" ]; then
        local client_version=$(grep '"version"' "$PROJECT_ROOT/client/package.json" | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
        if [ "$client_version" = "$expected_version" ]; then
            print_success "Client package.json: $client_version ✓"
        else
            print_warning "Client package.json: $client_version (expected $expected_version)"
            ((warnings++))
        fi
    fi
    
    if [ -f "$PROJECT_ROOT/server/package.json" ]; then
        local server_version=$(grep '"version"' "$PROJECT_ROOT/server/package.json" | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
        if [ "$server_version" = "$expected_version" ]; then
            print_success "Server package.json: $server_version ✓"
        else
            print_warning "Server package.json: $server_version (expected $expected_version)"
            ((warnings++))
        fi
    fi
    
    # Check documentation files
    echo ""
    print_info "Checking documentation files:"
    
    local doc_files=(
        "README.md"
        "docs/Q4_2025_SPRINT_PLAN.md"
        "docs/QUICK_REFERENCE.md"
    )
    
    for file in "${doc_files[@]}"; do
        if [ -f "$PROJECT_ROOT/$file" ]; then
            local count=$(grep -c "v$expected_version" "$PROJECT_ROOT/$file" 2>/dev/null || echo 0)
            if [ $count -gt 0 ]; then
                print_success "$file: Found $count reference(s) to v$expected_version"
            else
                print_warning "$file: No references to v$expected_version found"
                ((warnings++))
            fi
        fi
    done
    
    echo ""
    if [ $errors -eq 0 ]; then
        print_success "Version consistency check passed!"
        return 0
    else
        print_error "Found $errors critical error(s)"
        return 1
    fi
}

show_summary() {
    local old_version=$1
    local new_version=$2
    
    print_header "📊 UPDATE SUMMARY"
    
    echo "Updated version from: ${YELLOW}v$old_version${NC} → ${GREEN}v$new_version${NC}"
    echo ""
    echo "Files updated:"
    echo "  ✓ package.json (root, client, server)"
    echo "  ✓ README.md"
    echo "  ✓ Documentation files (docs/*.md)"
    echo ""
    echo "Next steps:"
    echo "  1. Review changes: ${YELLOW}git diff${NC}"
    echo "  2. Test the application: ${YELLOW}yarn dev${NC}"
    echo "  3. Commit changes: ${YELLOW}git add . && git commit -m 'chore: bump version to v$new_version'${NC}"
    echo "  4. Create git tag: ${YELLOW}git tag v$new_version${NC}"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    print_header "🔄 LINKFY VERSION SYNCHRONIZER"
    
    # Get current version
    local current_version=$(get_current_version)
    print_info "Current version: ${YELLOW}v$current_version${NC}"
    
    # Validate input
    if [ $# -ne 1 ]; then
        print_error "Missing version argument"
        echo ""
        echo "Usage: ./scripts/sync-versions.sh <new-version>"
        echo "Example: ./scripts/sync-versions.sh 2.5.0"
        echo ""
        echo "Current version: v$current_version"
        exit 1
    fi
    
    local new_version=$1
    
    # Validate version format
    if ! validate_version "$new_version"; then
        exit 1
    fi
    
    # Check if version is the same
    if [ "$current_version" = "$new_version" ]; then
        print_warning "New version is the same as current version ($new_version)"
        echo "No changes needed."
        exit 0
    fi
    
    # Confirm action
    echo ""
    echo -e "Update version from ${YELLOW}v$current_version${NC} to ${GREEN}v$new_version${NC}? (y/n)"
    read -r response
    
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_info "Update cancelled"
        exit 0
    fi
    
    # Perform updates
    echo ""
    sync_package_json "$new_version"
    echo ""
    sync_documentation "$new_version" "$current_version"
    echo ""
    
    # Verify consistency
    if verify_version_consistency "$new_version"; then
        show_summary "$current_version" "$new_version"
        print_success "All version synchronization completed successfully!"
        exit 0
    else
        print_error "Version synchronization completed with warnings. Please review manually."
        exit 1
    fi
}

# Run main function
main "$@"
