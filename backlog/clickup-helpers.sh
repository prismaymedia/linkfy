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
