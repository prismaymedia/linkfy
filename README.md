<div align="center">

# 🎵 Linkfy

**The ultimate tool for seamless music platform conversion**

*Convert YouTube Music URLs to Spotify URLs with real-time preview and authentic metadata extraction*

[![GitHub license](https://img.shields.io/github/license/prismaymedia/linkfy?style=for-the-badge)](https://github.com/prismaymedia/linkfy/blob/master/LICENSE)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)

[🚀 App](https://prismaymedia.github.io/linkfy/) • [📖 Documentation](https://github.com/prismaymedia/linkfy/wiki) • [💬 Report Bug](https://github.com/prismaymedia/linkfy/issues) • [✨ Request Feature](https://github.com/prismaymedia/linkfy/issues)

![Linkfy Demo](./assets/demo.gif)

</div>

---

## 🌟 Why Linkfy?

In the era of multiple music streaming platforms, sharing music between friends using different services has never been more challenging. **Linkfy** bridges this gap by providing instant, accurate conversions between YouTube Music and Spotify with authentic metadata extraction.

### ✨ Key Features

- 🎯 **Real-time Track Preview** - See song information instantly as you type
- 🔗 **Authentic API Integration** - Uses official YouTube Data API v3 and Spotify Web API
- 🎵 **Smart Track Matching** - Advanced algorithms for accurate track identification
- 📱 **Chrome Extension Ready** - Seamless browser integration
- 🎨 **Modern UI/UX** - Clean, responsive design with platform-native styling
- � **Privacy-First** - No data storage, no tracking, completely secure
- 🌐 **Multi-language Support** - Available in multiple languages
- ⚡ **Lightning Fast** - Optimized performance with smart caching

### 🎯 Use Cases

- **Music Discovery** - Found a great song on YouTube Music? Share it with Spotify friends instantly
- **Playlist Migration** - Convert individual tracks when moving between platforms  
- **Social Sharing** - Share music across different streaming platforms seamlessly
- **Content Creation** - Perfect for DJs, music bloggers, and content creators

## 🚀 Quick Start

<div align="center">

[![Use App](https://img.shields.io/badge/🎵_Use_App-Live_Demo-1DB954?style=for-the-badge&logo=spotify)](https://prismaymedia.github.io/linkfy/)
[![Self Hosting](https://img.shields.io/badge/🚀_Self_Hosting-Deploy_Guide-FF6B35?style=for-the-badge&logo=docker)](https://github.com/prismaymedia/linkfy/wiki/Self-Hosting-Guide)

**New to Linkfy?** [📖 Check out our complete guide](https://github.com/prismaymedia/linkfy/wiki) in the wiki!

</div>

## 🏛️ Architecture & Tech Stack

<div align="center">

![Architecture Diagram](./assets/architecture.png)

</div>

### Frontend Stack
- **⚛️ React 18** - Modern UI library with hooks
- **📘 TypeScript** - Type-safe development
- **⚡ Vite** - Lightning-fast build tool
- **🎨 Tailwind CSS** - Utility-first styling
- **🧩 shadcn/ui** - Beautiful, accessible components
- **🔄 TanStack Query** - Powerful data fetching & caching
- **🌐 React Router** - Client-side routing
- **🌍 React i18next** - Internationalization

### Backend Stack
- **🚀 NestJS** - Scalable Node.js framework
- **📘 TypeScript** - End-to-end type safety
- **🔍 Zod** - Runtime type validation
- **🔑 Supabase Auth** - Authentication & user management
- **📊 Drizzle ORM** - Type-safe database operations
- **🐘 PostgreSQL** - Robust relational database
- **📈 Sentry** - Error monitoring & performance

### External APIs
- **🔴 YouTube Data API v3** - Video metadata extraction
- **🟢 Spotify Web API** - Music catalog search & matching
- **🔐 Google OAuth 2.0** - Secure authentication

### Development & DevOps
- **📦 Yarn Workspaces** - Monorepo management
- **🧪 Jest + Vitest** - Comprehensive testing
- **📏 ESLint + Prettier** - Code quality & formatting
- **🐳 Docker** - Containerization support
- **🚀 GitHub Actions** - CI/CD automation

## 🧩 Chrome Extension

<details>
<summary><strong>🌐 Browser Extension Details - Click to expand</strong></summary>

Linkfy includes a fully-featured Chrome extension for seamless browser integration:

### Features
- 🔗 **One-click conversion** from any YouTube Music page
- 📋 **Smart URL detection** in browser tabs
- 🎯 **Context menu integration** for right-click conversion
- 🎨 **Native browser UI** with consistent styling
- ⚡ **Manifest v3 compliance** for modern Chrome compatibility

### Installation
1. Build the extension: `yarn build:extension:client`
2. Open Chrome Extensions (`chrome://extensions/`)
3. Enable "Developer mode"
4. Click "Load unpacked" and select `client/dist-extension/`

</details>

## 🤝 Contributing

<details>
<summary><strong>🚀 How to Contribute - Click to expand</strong></summary>

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/linkfy.git
   cd linkfy
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Set Up Development Environment**
   ```bash
   yarn install
   # Follow setup instructions above
   ```

4. **Make Changes & Test**
   ```bash
   yarn test:client
   yarn test:server
   ```

5. **Submit Pull Request**

### Code Guidelines

- ✅ Follow TypeScript strict mode
- ✅ Use conventional commits
- ✅ Add tests for new features  
- ✅ Update documentation
- ✅ Ensure all checks pass

### Areas for Contribution

- 🎵 **New Music Platforms** - Add support for Apple Music, Amazon Music, etc.
- 🌍 **Internationalization** - Translate to new languages
- 🎨 **UI/UX Improvements** - Enhanced user interface
- 🔧 **Performance Optimization** - Faster conversions and caching
- 📱 **Mobile App** - React Native implementation
- 🧪 **Testing** - Increase test coverage

</details>

## �📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🔒 Security & Privacy

- 🔐 **Zero Data Storage** - No user data or URLs are stored
- 🛡️ **API Key Protection** - Credentials secured via environment variables
- 🔒 **HTTPS Only** - All communications encrypted
- 🚫 **No Tracking** - Completely privacy-focused
- ✅ **Input Validation** - All endpoints protected against injection

## 📞 Support & Community

[![GitHub Issues](https://img.shields.io/github/issues/prismaymedia/linkfy?style=for-the-badge)](https://github.com/prismaymedia/linkfy/issues)


### When Reporting Issues

Please include:
- 📝 Detailed description of the problem
- 🔄 Steps to reproduce the issue
- 🎯 Expected vs actual behavior  
- 🖥️ Browser/OS information
- 📊 Console logs (if applicable)

---

<div align="center">

**⭐ Star this repository if Linkfy helped you!**

*Made with ❤️ by [Prisma y Media](https://github.com/prismaymedia)*

</div>
