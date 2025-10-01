# Changelog

## [2.3.0](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.2.0...linkfy-v2.3.0) (2025-10-01)


### Features

* **clickup:** add automatic ROADMAP sync when creating tasks ([8b83435](https://github.com/prismaymedia/linkfy/commit/8b83435abed6b4cada099c515412e77dfee1f99e))
* **clickup:** add ClickUp task creation helper functions and configuration documentation ([165fcde](https://github.com/prismaymedia/linkfy/commit/165fcdecfa8d2ea0b5726d61714e6b6d5bc5ccc5))
* **clickup:** update file paths in ClickUp setup documentation for clarity ([5b4af5c](https://github.com/prismaymedia/linkfy/commit/5b4af5cb83bf1f02db37d12d6e392b1430a59269))
* **config:** add initial configuration for ClickUp server in mcp.json ([5dba73b](https://github.com/prismaymedia/linkfy/commit/5dba73be29af9ac37116fde407a175eedce2cc2b))
* **docs:** add ClickUp MCP configuration template and setup instructions ([0d2bf81](https://github.com/prismaymedia/linkfy/commit/0d2bf81fea80490bd4ab018e279814ba2a2cccf3))
* **gitignore:** add ClickUp tasks folder to .gitignore ([ca591e2](https://github.com/prismaymedia/linkfy/commit/ca591e2df97abfdcadb4a2d75bef553375cf8ad2))
* **roadmap:** enhance URL detection and validation section with new tasks and features ([5b4af5c](https://github.com/prismaymedia/linkfy/commit/5b4af5cb83bf1f02db37d12d6e392b1430a59269))
* **roadmap:** update development roadmap with ClickUp integration and organized task categories ([69e9d7a](https://github.com/prismaymedia/linkfy/commit/69e9d7a9644992950239cfc3a041a759be9f1807))
* **tasks:** create tasks.md for future development considerations and enhancements ([69e9d7a](https://github.com/prismaymedia/linkfy/commit/69e9d7a9644992950239cfc3a041a759be9f1807))


### Bug Fixes

* **client:** resolve GitHub Pages SPA routing issues ([e424b94](https://github.com/prismaymedia/linkfy/commit/e424b94ff4cd36c34c19bee67a5099715b31372d))
* **config:** correct Vite plugin syntax for 404.html generation ([f4b8c0f](https://github.com/prismaymedia/linkfy/commit/f4b8c0fcf6d67fe93d286abceb86df2c652ecddc))
* **docs:** update README and add initial ROADMAP for project planning ([233aec8](https://github.com/prismaymedia/linkfy/commit/233aec8e64deca00f1df5fe761aec28a370623c2))


### Code Refactoring

* **gitignore:** remove ClickUp tasks folder from .gitignore ([69e9d7a](https://github.com/prismaymedia/linkfy/commit/69e9d7a9644992950239cfc3a041a759be9f1807))


### Documentation

* add comprehensive ROADMAP sync guide with examples ([1012d07](https://github.com/prismaymedia/linkfy/commit/1012d07eb51677b3a4fc8b00015ab17e00384870))
* add Q4 2025 sprint plan with agile workflow for 2 fullstack devs ([ee80407](https://github.com/prismaymedia/linkfy/commit/ee80407b48afbcc50f6d0b7a6041f08924e50e93))

## [2.2.0](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.1.2...linkfy-v2.2.0) (2025-09-30)


### Features

* **docs:** add auto-generation of architecture diagrams using Mermaid ([c60decb](https://github.com/prismaymedia/linkfy/commit/c60decb9390700dfc31ca4fe72c99a17a8d7777c))


### Bug Fixes

* **ci:** resolve puppeteer sandbox issues in diagram generation ([195be11](https://github.com/prismaymedia/linkfy/commit/195be110af6ed1acb782303f920abb5025725ba9))
* **docs:** remove unnecessary div wrapper around issue reporting badge in README ([d4b4367](https://github.com/prismaymedia/linkfy/commit/d4b4367c8ce041c84c80e076a5e0af89aa0a4d19))
* **docs:** update issue reporting badge in README for better visibility ([d67069e](https://github.com/prismaymedia/linkfy/commit/d67069ec14bae787281a57588cbdb89372212853))

## [2.1.2](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.1.1...linkfy-v2.1.2) (2025-09-30)


### Bug Fixes

* **docs:** correct table of contents formatting in CONTRIBUTING.md ([9f9bca0](https://github.com/prismaymedia/linkfy/commit/9f9bca06745161c7f454f5b70111d149decaaa49))
* **docs:** update badge text for live demo link in README.md ([b19e803](https://github.com/prismaymedia/linkfy/commit/b19e80330f8e87494c6b214af4298548f2aa67db))
* **docs:** update badge text from "Use App" to "Launch App" in README.md ([75635ae](https://github.com/prismaymedia/linkfy/commit/75635ae63585997eaa73c61bfa6998945e24f5e5))
* **docs:** update help section wording in CONTRIBUTING.md for clarity ([3dafd15](https://github.com/prismaymedia/linkfy/commit/3dafd15e23537ed47be7812dc8905929bd95226e))

## [2.1.1](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.1.0...linkfy-v2.1.1) (2025-09-30)


### Documentation

* add CODEOWNERS file for repository structure ([70ac906](https://github.com/prismaymedia/linkfy/commit/70ac9063c0d3518aad3a0bdcd3af2344ba20502a))

## [2.1.0](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.0.0...linkfy-v2.1.0) (2025-09-30)


### Features

* **auth:** redirect to dashboard after login in GitHub Pages ([693e4dd](https://github.com/prismaymedia/linkfy/commit/693e4dd23bae217e105dcd04aa5aa5263a798971))


### Bug Fixes

* **auth:** use correct redirect URL for GitHub Pages ([92c5556](https://github.com/prismaymedia/linkfy/commit/92c55567ab1818b9bf8045607419bcda36cfd1c8))

## [2.0.0](https://github.com/prismaymedia/linkfy/compare/linkfy-v1.1.1...linkfy-v2.0.0) (2025-09-30)


### ⚠ BREAKING CHANGES

* .copilotrc.md file removed, use docs/COMMIT_CONVENTION.md instead

### Bug Fixes

* **config:** move GitHub community files to root for tab visibility ([15c2f35](https://github.com/prismaymedia/linkfy/commit/15c2f357dbdd76e0afd295185d84b1a5f06bf180))


### Documentation

* consolidate and improve project documentation structure ([c6d83ec](https://github.com/prismaymedia/linkfy/commit/c6d83ec2af7887de27ac603a7a9e6546506ec72b))

## [1.1.1](https://github.com/prismaymedia/linkfy/compare/linkfy-v1.1.0...linkfy-v1.1.1) (2025-09-30)


### Code Refactoring

* **config:** reorganize project structure into folders ([0cae80c](https://github.com/prismaymedia/linkfy/commit/0cae80c7df3ce0a51cf86939b89813a7653b7e2c))
