# ClickUp MCP Configuration Template

## Setup Instructions

This project is configured to work with ClickUp MCP server for task management integration.

### Prerequisites

1. **Install ClickUp MCP server**:
   ```bash
   uvx --from git+https://github.com/DiversioTeam/clickup-mcp.git clickup-mcp
   ```

2. **Get your ClickUp API Key**:
   - Go to ClickUp Settings > Apps > API
   - Generate a Personal API Token
   - Configure it: `uvx clickup-mcp set-api-key YOUR_API_KEY`

3. **VS Code Configuration**:
   - The `.vscode/mcp.json` file is already configured
   - Restart VS Code after setting up your API key

### Creating Tasks via GitHub Copilot

Once configured, you can create tasks using natural language:

```
"Create a task in ClickUp for implementing user authentication"
"Add a bug report task about login issues"
"Create a high-priority task for code review"
```

### Available MCP Commands

- **Task Management**: Create, read, update, delete tasks
- **Search & Filter**: Find tasks by criteria
- **Comments**: Add and read task comments  
- **Time Tracking**: Log work hours
- **Bulk Operations**: Update multiple tasks
- **Analytics**: Team workload and metrics

### Configuration

Create your own `.vscode/clickup-config.md` file with your specific:
- Workspace ID
- Space ID  
- List ID
- Available statuses and priorities

> **Note**: The `clickup-config.md` file is gitignored as it contains private workspace information.

### Useful Resources

- [ClickUp MCP Documentation](https://github.com/DiversioTeam/clickup-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [ClickUp API Documentation](https://clickup.com/api)