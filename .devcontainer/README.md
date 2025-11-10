# GitHub Codespaces Development Environment

This directory contains the configuration for GitHub Codespaces, enabling cloud-based development for Linkfy.

## What's Included

- **Node.js 22**: Latest LTS version with TypeScript support
- **Python 3.12**: With uv (fast Python package manager)
- **Yarn**: Package manager for monorepo workspace management
- **Git & GitHub CLI**: Version control and GitHub integration
- **VS Code Extensions**: Pre-configured extensions for React, NestJS, TypeScript, Tailwind CSS, Python, and more

## Automatic Setup

When you open this repository in GitHub Codespaces, the following happens automatically:

1. **Python Setup**: `uv` (fast Python package manager) is installed
2. **Dependencies Installation**: `yarn install` runs to install all workspace dependencies
3. **Environment Files**: `.env.example` files are copied to `.env` in both client and server directories
4. **Port Forwarding**: Ports 3000 (backend) and 5173 (frontend) are automatically forwarded

## Getting Started

### 1. Configure Environment Variables

After the Codespace is created, update the environment files with your actual credentials:

**Server (`server/.env`):**
```bash
YOUTUBE_API_KEY=your-actual-youtube-api-key
SPOTIFY_CLIENT_ID=your-actual-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-actual-spotify-client-secret
SUPABASE_URL=your-actual-supabase-url
SUPABASE_ANON_KEY=your-actual-supabase-anon-key
DATABASE_URL=your-actual-database-url
```

**Client (`client/.env`):**
```bash
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your-actual-supabase-url
VITE_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
```

### 2. Start Development Servers

You can start the development servers using the following commands:

```bash
# Start both client and server
yarn dev:client &
yarn dev:server

# Or start them separately in different terminals
# Terminal 1:
yarn dev:server

# Terminal 2:
yarn dev:client
```

### 3. Access Your Application

- **Frontend**: Click on the "Ports" tab in VS Code and open the forwarded port 5173
- **Backend API**: Access via port 3000
- Both ports will be automatically forwarded and you'll receive notifications

## Available Commands

### Development
- `yarn dev:client` - Start frontend development server
- `yarn dev:server` - Start backend development server

### Building
- `yarn build:client` - Build frontend for production
- `yarn build:server` - Build backend for production
- `yarn build:extension:client` - Build Chrome extension

### Testing
- `yarn test:client` - Run frontend tests
- `yarn test:server` - Run backend tests
- `yarn test:e2e:server` - Run end-to-end tests

### Code Quality
- `yarn lint` - Lint all workspaces
- `yarn prettier:format` - Format code with Prettier

### Python (with uv)
- `uv venv` - Create a virtual environment
- `uv pip install <package>` - Install Python packages (much faster than pip)
- `uv pip compile requirements.in -o requirements.txt` - Compile dependencies
- `python --version` - Check Python version

## Pre-configured VS Code Extensions

The following extensions are automatically installed:

**JavaScript/TypeScript:**
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Enhanced TypeScript support

**Python:**
- **Python**: Official Python extension
- **Pylance**: Fast, feature-rich Python language server
- **Ruff**: Fast Python linter and formatter

**Frameworks & Tools:**
- **Tailwind CSS IntelliSense**: Tailwind class name completion
- **ES7+ React Snippets**: React code snippets
- **Prisma**: Database schema support

**Productivity:**
- **GitLens**: Enhanced Git integration
- **GitHub Copilot**: AI-powered code completion (if you have access)

## Troubleshooting

### Dependencies not installed
If dependencies aren't installed automatically, run:
```bash
yarn install
```

### Environment variables not set
Make sure you've updated both `.env` files with your actual credentials:
```bash
# Check server .env
cat server/.env

# Check client .env
cat client/.env
```

### Ports not forwarding
1. Open the "Ports" tab in VS Code
2. Check if ports 3000 and 5173 are listed
3. If not, manually add them using the "+" button

### Services not starting
Check the logs in the terminal for any error messages:
```bash
# Check if Node.js is installed
node --version

# Check if Yarn is installed
yarn --version

# Try starting services manually
yarn dev:server
yarn dev:client
```

## Learn More

- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Dev Containers Documentation](https://containers.dev/)
- [Linkfy Documentation](../README.md)
- [Contributing Guide](../CONTRIBUTING.md)

## Support

If you encounter any issues with the Codespaces setup:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the [GitHub Codespaces logs](https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-creation-and-deletion-of-codespaces)
3. [Open an issue](https://github.com/prismaymedia/linkfy/issues) with details about your problem
