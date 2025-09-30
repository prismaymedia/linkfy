For commit messages in this repository, ALWAYS follow Conventional Commits:

Format: <type>(scope): description

TYPES (REQUIRED):
- feat: new feature 
- fix: bug fix
- chore: maintenance
- docs: documentation
- style: formatting
- refactor: code restructuring  
- perf: performance
- test: testing

SCOPES for this project:
- api: server/ changes
- client: client/ changes  
- extension: chrome-addon/ changes
- shared: shared/ changes
- ui: UI components
- auth: authentication
- config: configuration

RULES:
- Use imperative mood ("add" not "added") 
- Start lowercase
- No period at end
- Max 50 characters
- Add ! for breaking changes (feat!:)

EXAMPLES:
- feat(client): add track preview component
- fix(api): resolve spotify timeout
- chore(deps): update typescript
- docs: update installation guide
- feat!: require auth for all endpoints

NEVER use generic messages like "update", "fix", "changes"