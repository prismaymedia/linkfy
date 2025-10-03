# Contributing to Linkfy

First off, thank you for considering contributing to Linkfy! 🎉 It's people like you that make the open source community such an amazing place to learn, inspire, and create.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [How to Contribute](#-how-to-contribute)
- [Development Workflow](#-development-workflow)
- [Style Guidelines](#-style-guidelines)
- [Commit Messages](#-commit-messages)
- [Pull Request Process](#-pull-request-process)

## 📖 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Yarn (recommended) or npm
- Git
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/linkfy.git`
3. Install dependencies: `yarn install`
4. Set up environment variables (see main README.md)
5. Start development servers: `yarn dev:client` & `yarn dev:server`

## 🤝 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Node version)

### 💡 Suggesting Features

Enhancement suggestions are welcome! Please:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **Include mockups or examples if applicable**

### 🔧 Code Contributions

We welcome code contributions! Here are areas where we especially need help:

- 🎵 **New Music Platforms** - Adding support for Apple Music, Amazon Music, etc.
- 🌍 **Internationalization** - Translating the app to new languages
- 🎨 **UI/UX Improvements** - Enhancing the user interface
- 📱 **Mobile Responsiveness** - Improving mobile experience
- 🧪 **Testing** - Adding unit and integration tests
- 📚 **Documentation** - Improving guides and API docs

## 💻 Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Adding tests

### Making Changes

1. Create a new branch: `git checkout -b feature/amazing-feature`
2. Make your changes
3. Add/update tests if applicable
4. Ensure all tests pass: `yarn test`
5. Run linting: `yarn lint`
6. Commit your changes (see commit message guidelines)
7. Push to your branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📏 Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer functional programming patterns
- Use Zod for runtime validation

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow existing naming conventions
- Use shadcn/ui components when possible

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing using Tailwind's system
- Use semantic color names from the theme

## 📝 Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code refactoring
- `test:` - Adding missing tests
- `chore:` - Updating build tasks, package manager configs, etc.

### Examples
```
feat(conversion): add support for YouTube playlist URLs
fix(api): handle spotify rate limiting errors
docs(readme): update installation instructions
test(services): add unit tests for youtube service
```

## 🔍 Pull Request Process

1. **Fill out the PR template** completely
2. **Update documentation** if you've changed APIs
3. **Add or update tests** for your changes
4. **Ensure all checks pass** (tests, linting, type checking)
5. **Request reviews** from maintainers
6. **Address feedback** promptly and professionally
7. **Keep PRs focused** - one feature or fix per PR

### PR Title Format
Use the same format as commit messages:
```
feat(scope): add amazing new feature
```

### PR Description Template
```markdown
## What does this PR do?
Brief description of changes

## Type of change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run client tests
yarn test:client

# Run server tests  
yarn test:server

# Run tests in watch mode
yarn test:client --watch
```

### Writing Tests

- Write tests for all new features and bug fixes
- Use descriptive test names that explain the behavior
- Follow the existing test patterns
- Mock external API calls
- Test both happy path and error cases

## 🚀 Deployment

### Production Deployments

- Production deployments are triggered automatically when PRs are merged to `master`
- Only maintainers can deploy to production
- Production URLs:
  - Client: Deployed via Vercel
  - Server: Deployed via Railway

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)

## 💬 Getting Help

- 🐛 **Report Issues**: [GitHub Issues](https://github.com/prismaymedia/linkfy/issues)
- 💡 **Request Features**: [GitHub Issues](https://github.com/prismaymedia/linkfy/issues)
- ❓ **Ask Questions**: [GitHub Issues](https://github.com/prismaymedia/linkfy/issues)
- 💬 **Contact Maintainers**: Create an issue and tag the maintainers

## 🙏 Recognition

All contributors will be recognized in our README and release notes. Thank you for making Linkfy better!

---

Remember: The best contribution is one that helps users accomplish their goals more effectively. Whether it's a bug fix, new feature, or improved documentation, every contribution matters! 🌟