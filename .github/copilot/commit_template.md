# GitHub Copilot Commit Message Instructions

When generating commit messages for this repository, follow these rules:

## Format (MANDATORY)
```
<type>(scope): description
```

## Types
- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump) 
- `chore`: Maintenance, dependencies, config
- `docs`: Documentation only
- `style`: Formatting, whitespace
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Tests

## Scopes (based on file locations)
- `api` - server/ directory
- `client` - client/ directory
- `extension` - chrome-addon/ directory  
- `shared` - shared/ directory
- `ui` - UI components
- `auth` - authentication
- `config` - configuration files

## Examples
```
feat(client): add spotify track preview
fix(api): resolve youtube API timeout
chore(deps): update typescript to v5
docs: update API documentation
style(client): format components with prettier
refactor(auth): simplify token validation
perf(api): optimize database queries
test(client): add unit tests for hooks
```

## Breaking Changes
Add `!` after type: `feat!: require authentication`

## Rules
- Imperative mood ("add" not "added")
- Lowercase description
- No period at end
- Max 50 characters
- Be specific and descriptive