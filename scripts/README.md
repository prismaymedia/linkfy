# 🛠️ Linkfy Scripts

This directory contains helper scripts for development, deployment, and maintenance tasks.

## Available Scripts

### 🚀 setup-vercel.sh

**Purpose**: Interactive script to help set up Vercel deployment for Linkfy

**Usage**:
```bash
./scripts/setup-vercel.sh
```

**What it does**:
- Checks if Vercel CLI is installed (installs if needed)
- Guides you through Vercel login
- Links both client and server projects to Vercel
- Displays project IDs needed for GitHub secrets
- Provides next steps for completing the setup

**Prerequisites**:
- Node.js and npm installed
- Vercel account created
- GitHub repository access

**Output**: 
The script will display:
- Vercel Org ID
- Client Project ID  
- Server Project ID

These values are needed to configure GitHub Actions for automated deployments.

---

## Creating New Scripts

When adding new scripts to this directory:

1. **Make it executable**: `chmod +x scripts/your-script.sh`
2. **Add a comment header** explaining the script's purpose
3. **Document it in this README**
4. **Use descriptive names** that clearly indicate the script's function
5. **Add error handling** with `set -e` for bash scripts
6. **Include usage examples** in comments

### Example Script Template

```bash
#!/bin/bash

# 🎯 Script Name and Purpose
# This script does X, Y, and Z
# Usage: ./scripts/your-script.sh [options]

set -e  # Exit on error

echo "Starting script..."

# Your script logic here

echo "✅ Script completed successfully!"
```

---

## Best Practices

- **Keep scripts simple**: One script, one purpose
- **Add descriptive output**: Use emojis and clear messages
- **Handle errors gracefully**: Check for prerequisites
- **Make scripts idempotent**: Safe to run multiple times
- **Document dependencies**: List required tools/env vars
- **Test thoroughly**: Test on fresh environments

---

**Maintained by**: Prisma y Media Team  
**Last Updated**: October 2024
