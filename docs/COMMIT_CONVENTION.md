# Commit Convention

## Summary

To ensure consistency in the commit history and to automate the creation of releases and changelogs, this project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

The format of each commit message is crucial for tools like `release-please` to automatically determine the type of change (fix, new feature, breaking change) and calculate the next software version.

## Message Format

The commit message should have the following structure:

```
<type>(optional scope): <description>

[optional body]

[optional footer(s)]
```

## Type

Must be one of the following prefixes:

*   **feat**: A new feature you're adding to the project.
    *   *Triggers a **MINOR** version bump (e.g., 1.2.3 -> 1.3.0).*
*   **fix**: A bug fix.
    *   *Triggers a **PATCH** version bump (e.g., 1.2.3 -> 1.2.4).*
*   **chore**: Changes to maintenance tasks, build processes, configuration, etc. Does not affect user-facing code.
*   **docs**: Changes to documentation only (README, guides, etc.).
*   **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.).
*   **refactor**: A code change that neither fixes a bug nor adds a feature.
*   **perf**: A code change that improves performance.
*   **test**: Adding missing tests or correcting existing tests.

## Scope

Use scope when applicable - common scopes in this Linkfy project:

- **`api`**: Backend/server changes (`server/` directory)
- **`client`**: Frontend React app changes (`client/` directory)
- **`extension`**: Chrome extension changes (`chrome-addon/` directory)
- **`shared`**: Shared schemas/types changes (`shared/` directory)
- **`auth`**: Authentication related changes
- **`ui`**: User interface components
- **`config`**: Configuration files

## Description Requirements

- Use **imperative mood** ("add feature" not "added feature")
- Start with **lowercase letter**
- **No period** at the end
- Maximum **50 characters** for the first line

## Breaking Changes

A change that breaks backward compatibility must be indicated in one of these two ways to trigger a **MAJOR** version bump (e.g., 1.2.3 -> 2.0.0):

1.  Append a `!` after the type: `feat!: <description>`
2.  Add a `BREAKING CHANGE:` footer at the end of the commit body.

## Practical Examples

### ✅ Good commit messages for Linkfy:

```
feat(api): add spotify playlist conversion endpoint
fix(client): resolve duplicate conversion requests  
chore(deps): update dependencies to latest versions
docs: update API documentation with new endpoints
refactor(auth): simplify token validation logic
perf(client): optimize music service selector rendering
test(api): add unit tests for youtube service
feat!: require authentication for all API endpoints
```

### ❌ Bad commit messages (avoid these):

```
Added new feature
Fix bug
Update code
Changes made
WIP
.
```

### Detailed Examples

#### **Commit for a new feature:**

```
feat(api): add endpoint to get user profile
```

#### **Commit for a bug fix:**

```
fix: prevent form from submitting twice on double-click
```

#### **Commit with more detail in the body:**

```
refactor(auth): simplify authentication service

The `AuthService` has been refactored to reduce code duplication
and improve readability. Token validation logic is now
centralized in a single method.
```

#### **Commit for a breaking change:**

```
feat!: require API key to access all endpoints

BREAKING CHANGE: As of this version, all API requests
must include a valid API key in the `X-Api-Key` header. Requests
without this header will be rejected with a 401 error.
```

#### **Multi-file commit example:**

```
feat(api): add real-time track preview functionality

Implements WebSocket connection for streaming track previews.
Also updates client components to handle real-time data.

Affects:
- server/src/services/preview.service.ts
- client/src/components/track-preview.tsx
- shared/schema.ts (new preview types)
```

## Context-Aware Guidelines

When creating commits, analyze the changed files to determine:

1. **Appropriate type** based on the nature of changes
2. **Relevant scope** based on directory/file patterns:
   - Changes in `client/` → use `client` scope
   - Changes in `server/` → use `api` scope  
   - Changes in `chrome-addon/` → use `extension` scope
   - Changes in `shared/` → use `shared` scope
   - Changes in `*.md` files → use `docs` type
   - Changes in config files → use `chore` type

3. **Breaking change detection**:
   - API endpoint changes that break compatibility
   - Schema changes in `shared/schema.ts`
   - Major dependency updates
   - Authentication requirement changes