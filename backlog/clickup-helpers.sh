#!/bin/bash

# ClickUp Task Creator Helper Functions
# Add these to your ~/.zshrc or source this file: source .vscode/clickup-helpers.sh

# ClickUp Configuration
export CLICKUP_LIST_ID="901111127909"  # Linkfy list

# Create task with tags (Full version)
clickup_task() {
  local title="$1"
  local description="$2"
  local priority="${3:-3}"  # Default: normal (3)
  shift 3
  local tags=("$@")
  
  # Build tags JSON array
  local tags_json="["
  for tag in "${tags[@]}"; do
    tags_json+="\"$tag\","
  done
  tags_json="${tags_json%,}]"  # Remove trailing comma
  
  echo "Creating task: $title"
  echo "Priority: $priority"
  echo "Tags: ${tags[*]}"
  echo ""
  
  curl -s -X POST "https://api.clickup.com/api/v2/list/$CLICKUP_LIST_ID/task" \
    -H "Authorization: $CLICKUP_MCP_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$title\",
      \"description\": \"$description\",
      \"priority\": $priority,
      \"tags\": $tags_json
    }" | jq -r '
      "✅ Task Created:",
      "ID: \(.id)",
      "Title: \(.name)",
      "URL: \(.url)",
      "Tags: \(.tags | map(.name) | join(", "))",
      "Status: \(.status.status)",
      "Priority: \(.priority.priority)"
    '
}

# Quick bug fix task creator
clickup_bug() {
  local title="$1"
  local description="$2"
  local scope="${3:-client}"  # Default: client
  local effort="${4:-effort-medium}"  # Default: medium
  
  clickup_task "$title" "$description" 2 \
    "Q4-2025" "phase-1" "fix" "$scope" "critical-fix" "$effort"
}

# Quick feature task creator
clickup_feature() {
  local title="$1"
  local description="$2"
  local scope="${3:-client}"  # Default: client
  local effort="${4:-effort-medium}"  # Default: medium
  
  clickup_task "$title" "$description" 3 \
    "Q1-2026" "phase-1" "feat" "$scope" "user-experience" "$effort"
}

# Quick performance task creator
clickup_perf() {
  local title="$1"
  local description="$2"
  local scope="${3:-api}"  # Default: api
  local effort="${4:-effort-medium}"  # Default: medium
  
  clickup_task "$title" "$description" 2 \
    "Q1-2026" "phase-1" "perf" "$scope" "performance" "$effort"
}

# Quick infrastructure/devops task creator
clickup_infra() {
  local title="$1"
  local description="$2"
  local effort="${3:-effort-medium}"  # Default: medium
  
  clickup_task "$title" "$description" 2 \
    "Q4-2025" "phase-1" "chore" "infra" "infrastructure" "$effort"
}

# Usage Examples:
# 
# Full task with custom tags:
# clickup_task "Fix mobile layout" "Fix responsive issues" 2 Q4-2025 phase-1 fix client ui critical-fix mobile effort-medium
#
# Quick bug fix:
# clickup_bug "Fix login button" "Button not responding on mobile" client effort-small
#
# Quick feature:
# clickup_feature "Add dark mode" "Implement theme toggle with Tailwind" client effort-small
#
# Quick performance:
# clickup_perf "Implement Redis caching" "Add caching layer for API responses" api effort-medium
#
# Quick infrastructure:
# clickup_infra "Setup Vercel deployment" "Configure production deployment pipeline" effort-medium

# ============================================
# ROADMAP SYNCHRONIZATION FUNCTIONS
# ============================================

# Update ROADMAP.md with ClickUp task link and status
update_roadmap() {
    local task_name="$1"
    local task_id="$2"
    local task_url="$3"
    local status="${4:-🔄}"  # Default: in progress
    local assignee="${5:-}"  # Optional assignee
    
    local roadmap_file="ROADMAP.md"
    
    # Check if ROADMAP.md exists
    if [ ! -f "$roadmap_file" ]; then
        echo "❌ Error: ROADMAP.md not found"
        return 1
    fi
    
    # Build the replacement string
    local replacement="- [ ] $task_name → [#$task_id]($task_url) $status"
    if [ -n "$assignee" ]; then
        replacement="$replacement **@$assignee**"
    fi
    
    # Update the roadmap (macOS compatible)
    sed -i.bak "s|- \[ \] $task_name|$replacement|g" "$roadmap_file"
    
    # Remove backup file
    rm -f "${roadmap_file}.bak"
    
    echo "✅ Updated ROADMAP.md: $task_name → $status"
}

# Create task and automatically sync with ROADMAP.md
clickup_task_with_sync() {
    local title="$1"
    local description="$2"
    local priority="${3:-3}"
    shift 3
    local tags=("$@")
    
    # Build tags JSON array
    local tags_json="["
    for tag in "${tags[@]}"; do
        tags_json+="\"$tag\","
    done
    tags_json="${tags_json%,}]"
    
    echo "Creating task: $title"
    echo "Priority: $priority"
    echo "Tags: ${tags[*]}"
    echo ""
    
    # Create task and capture response
    local response=$(curl -s -X POST "https://api.clickup.com/api/v2/list/$CLICKUP_LIST_ID/task" \
        -H "Authorization: $CLICKUP_MCP_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
          \"name\": \"$title\",
          \"description\": \"$description\",
          \"priority\": $priority,
          \"tags\": $tags_json
        }")
    
    # Extract task details
    local task_id=$(echo "$response" | jq -r '.id')
    local task_url=$(echo "$response" | jq -r '.url')
    local task_status=$(echo "$response" | jq -r '.status.status')
    
    # Display task info
    echo "$response" | jq -r '
      "✅ Task Created:",
      "ID: \(.id)",
      "Title: \(.name)",
      "URL: \(.url)",
      "Tags: \(.tags | map(.name) | join(", "))",
      "Status: \(.status.status)",
      "Priority: \(.priority.priority)"
    '
    
    echo ""
    
    # Update ROADMAP.md
    update_roadmap "$title" "$task_id" "$task_url" "🔄"
    
    echo ""
    echo "📝 Don't forget to commit ROADMAP.md changes:"
    echo "   git add ROADMAP.md"
    echo "   git commit -m 'docs(roadmap): add ClickUp task link for $title'"
}

# Enhanced bug task with sync
clickup_bug_sync() {
    local title="$1"
    local description="$2"
    local scope="${3:-client}"
    local effort="${4:-effort-medium}"
    local assignee="${5:-}"
    
    clickup_task_with_sync "$title" "$description" 2 \
        "Q4-2025" "phase-1" "fix" "$scope" "critical-fix" "$effort"
}

# Enhanced feature task with sync
clickup_feature_sync() {
    local title="$1"
    local description="$2"
    local scope="${3:-client}"
    local effort="${4:-effort-medium}"
    local assignee="${5:-}"
    
    clickup_task_with_sync "$title" "$description" 3 \
        "Q1-2026" "phase-1" "feat" "$scope" "user-experience" "$effort"
}

# Enhanced performance task with sync
clickup_perf_sync() {
    local title="$1"
    local description="$2"
    local scope="${3:-api}"
    local effort="${4:-effort-medium}"
    local assignee="${5:-}"
    
    clickup_task_with_sync "$title" "$description" 2 \
        "Q1-2026" "phase-1" "perf" "$scope" "performance" "$effort"
}

# Enhanced infrastructure task with sync
clickup_infra_sync() {
    local title="$1"
    local description="$2"
    local effort="${3:-effort-medium}"
    local assignee="${4:-}"
    
    clickup_task_with_sync "$title" "$description" 2 \
        "Q4-2025" "phase-1" "chore" "infra" "infrastructure" "$effort"
}

# Mark task as completed in ROADMAP
mark_completed() {
    local task_name="$1"
    local roadmap_file="ROADMAP.md"
    
    # Update checkbox and add ✅
    sed -i.bak "s|- \[ \] $task_name|- [x] $task_name|g" "$roadmap_file"
    sed -i.bak "s|$task_name → \(.*\) 🔄|$task_name → \1 ✅|g" "$roadmap_file"
    sed -i.bak "s|$task_name → \(.*\) 👀|$task_name → \1 ✅|g" "$roadmap_file"
    
    rm -f "${roadmap_file}.bak"
    
    echo "✅ Marked as completed in ROADMAP.md: $task_name"
    echo "📝 Don't forget to commit:"
    echo "   git add ROADMAP.md"
    echo "   git commit -m 'docs(roadmap): mark $task_name as completed'"
}

# Mark task as in review
mark_review() {
    local task_name="$1"
    local roadmap_file="ROADMAP.md"
    
    sed -i.bak "s|$task_name → \(.*\) 🔄|$task_name → \1 👀|g" "$roadmap_file"
    
    rm -f "${roadmap_file}.bak"
    
    echo "👀 Marked as in review in ROADMAP.md: $task_name"
}

# Mark task as blocked
mark_blocked() {
    local task_name="$1"
    local roadmap_file="ROADMAP.md"
    
    sed -i.bak "s|$task_name → \(.*\) 🔄|$task_name → \1 🚧|g" "$roadmap_file"
    
    rm -f "${roadmap_file}.bak"
    
    echo "🚧 Marked as blocked in ROADMAP.md: $task_name"
}

# ============================================
# USAGE EXAMPLES WITH SYNC
# ============================================
#
# Create task with automatic ROADMAP sync:
# clickup_task_with_sync "Fix mobile layout" "Fix responsive issues" 2 Q4-2025 phase-1 fix client ui critical-fix mobile effort-medium
#
# Quick bug with sync:
# clickup_bug_sync "Fix login button" "Button not responding on mobile" client effort-small
#
# Quick feature with sync:
# clickup_feature_sync "Add dark mode" "Implement theme toggle" client effort-small
#
# Update roadmap manually:
# update_roadmap "Task name" "task_id" "https://app.clickup.com/t/..." "🔄" "dev1"
#
# Mark task status:
# mark_completed "Fix mobile layout"
# mark_review "Add dark mode"
# mark_blocked "Implement API integration"

