# Changelog

## [2.6.0](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.5.0...linkfy-v2.6.0) (2025-12-15)


### Features

* **auth:** implement frictionless login modal and fix auth redirect flow ([305fb1c](https://github.com/prismaymedia/linkfy/commit/305fb1c0475080109a52341d5847ff1d1c02b082))
* **backend/config:** move CORS to config file with whitelist ([2c59762](https://github.com/prismaymedia/linkfy/commit/2c597629afc9560b45fb0ecf275df89d8b49c45b))
* **config:** improve CORS config and whitelist handling ([f7d5b91](https://github.com/prismaymedia/linkfy/commit/f7d5b919c13a87c84d7821a920fade9d71a493f9))
* **db:** implement persistent storage for history and favorites ([abd74dc](https://github.com/prismaymedia/linkfy/commit/abd74dc8b81d62c8749f92e2348d8dd4faa0c25d))
* Enhanced Toast Notification System ([7b9bbf0](https://github.com/prismaymedia/linkfy/commit/7b9bbf069aff6e63bac6c51503c377ec1406c0a3))
* **extension:** add environment configuration ([c584e35](https://github.com/prismaymedia/linkfy/commit/c584e35103aa954a368afd06002124790a720042))
* **extension:** add environment configuration ([8831a65](https://github.com/prismaymedia/linkfy/commit/8831a6598308fb90aa4534bf21b02ef9de97fa07))
* **extension:** implement full URL detection workflow and suggestion popup ([7cf6ebb](https://github.com/prismaymedia/linkfy/commit/7cf6ebbdcc21a80d4c4944a967758cd4cd059c98))
* **favorites:** add full favorites system for quick access to saved conversions ([3b1226e](https://github.com/prismaymedia/linkfy/commit/3b1226ea7ebb1dbfb7a1c681b7056f2868adcd2d))
* **Frontend/UI:** add header repo link, enable user dashboard access, and remove unused UI elements ([63b9d1e](https://github.com/prismaymedia/linkfy/commit/63b9d1e032c750ba7802ae530844d994b1f51579))
* **history:** store, display, search and clear user conversion history ([1f6aa47](https://github.com/prismaymedia/linkfy/commit/1f6aa47b0dc14bd7e788a539e8be1a42c43b6677))
* Implement comprehensive version synchronization system ([2202204](https://github.com/prismaymedia/linkfy/commit/220220490f2141f36a9aa4d150c96ac7db84da28))
* **security:** add external URL sanitization and validation ([24c4f57](https://github.com/prismaymedia/linkfy/commit/24c4f5730fe741b736114646d0358f8cc4f6f0c7))
* **settings:** implement complete Settings Panel with all configuration options ([2c52388](https://github.com/prismaymedia/linkfy/commit/2c523880b483df8fbc8b9c361b6f2021f86041fc))
* **ui:** add input error handling system ([e18081c](https://github.com/prismaymedia/linkfy/commit/e18081c293396c959ed45e84668727beb79a9e07))


### Bug Fixes

* align failed-history recording with validated convert flag ([dfdca61](https://github.com/prismaymedia/linkfy/commit/dfdca61a44dcd792df2db2e570de483f73cf319b))
* apply code quality improvements ([c19750c](https://github.com/prismaymedia/linkfy/commit/c19750c44ce53af74fd952f7818cc8bfc6ef173c))
* apply ESLint/Prettier formatting and replace hardcoded text with i18n ([d415c78](https://github.com/prismaymedia/linkfy/commit/d415c785c0e9bbfa24df1919027dbac47f4eb6ce))
* **ci:** correct file_pattern in format workflow ([a6ade4c](https://github.com/prismaymedia/linkfy/commit/a6ade4c8ffaff8e286942cca66b17f1e1ccd2d7b))
* **client:** safely handle createdAt and payload fields in history timeline ([28e21be](https://github.com/prismaymedia/linkfy/commit/28e21bee9bb2c1ac09a44b0780e3ec1bd5a8e22d))
* code improvements and better error handling ([e25ebaf](https://github.com/prismaymedia/linkfy/commit/e25ebaf63620f5c605895d74bae7286e63504246))
* code improvements in favorites module ([4289d97](https://github.com/prismaymedia/linkfy/commit/4289d9799fa5d80c8d05288480132413450367ea))
* CodeRabbit suggestions for ErrorMessage accessibility and duplicate URL warning ([ed0e2a9](https://github.com/prismaymedia/linkfy/commit/ed0e2a99ac0f302e2c75f7f9a4fb2a9e3bfbfa89))
* Correct alignment and formatting issues in README.md ([5330888](https://github.com/prismaymedia/linkfy/commit/5330888908f67f73aa5079c204a31c1b6891ccca))
* correct API decorator for favorites remove endpoint ([cc6ff74](https://github.com/prismaymedia/linkfy/commit/cc6ff7432568813436ffe3f2a89bfe819294e05b))
* **database:** apply formatting suggestions for imports and custom error class ([6d7b0ea](https://github.com/prismaymedia/linkfy/commit/6d7b0ea38e9f1507cd7bd0b1404604a5985dc3d0))
* **database:** Improve history update and fix imports ([e8f9be7](https://github.com/prismaymedia/linkfy/commit/e8f9be7db149f742ebeffc8aa8930e8e2bc95277))
* **database:** prevent unintended overwrite in history sync conflict updates ([d7a6689](https://github.com/prismaymedia/linkfy/commit/d7a668989c709e2e3d1c058841a0cc4db7f80e51))
* **extension:** wrap switch-case scope and update Deezer match patterns ([664afbf](https://github.com/prismaymedia/linkfy/commit/664afbfc0554dc4c9eddea67ed7b423f13bf0c2b))
* **history:** fix i18n interpolation and clean up unused error variable ([19f5558](https://github.com/prismaymedia/linkfy/commit/19f5558870c2613b3cc3470792efb457c95e8695))
* **history:** replace template literals with proper i18n interpolation ([234793f](https://github.com/prismaymedia/linkfy/commit/234793fad7f726a8005a9bcd83a398b4277846c3))
* implement improvements and apply final updates ([aef9b31](https://github.com/prismaymedia/linkfy/commit/aef9b3168cb3cf0c8bde160a649d24bcb66f8c90))
* implement suggested updates and missing i18n keys ([fb0c776](https://github.com/prismaymedia/linkfy/commit/fb0c7767d0a1c11ad45264acc165528f08941aeb))
* improve user menu responsive positioning and prevent overflow on mobile ([d05bace](https://github.com/prismaymedia/linkfy/commit/d05bace9cc581a8d14c92bf655124eaea09d901f))
* **manifest, background:** wrap case blocks to prevent scope leakage and update manifest accordingly ([9667986](https://github.com/prismaymedia/linkfy/commit/9667986d58494e9020d52ff19eef05e8684db926))
* **manifest:** remove unnecessary utils.js entry from web_accessible_resources ([ee75c65](https://github.com/prismaymedia/linkfy/commit/ee75c65d4a04f28456c699a70ddd5359deb273ae))
* remove orphan functions in history page and resolve duplicate translation key ([b2ca5ab](https://github.com/prismaymedia/linkfy/commit/b2ca5aba9319652b8c5b5091a785b501aca53912))
* remove push trigger and exclude workflow files from auto-format ([3837c3e](https://github.com/prismaymedia/linkfy/commit/3837c3efa7a10b45ef079b8968c5065814f20cad))
* remove redundant auth check and improve favorites controller flow ([a31ba2b](https://github.com/prismaymedia/linkfy/commit/a31ba2b5c17ce93546db176f7562c7a3c7974c15))
* resolve header overflow on mobile and tablet devices ([3207a1b](https://github.com/prismaymedia/linkfy/commit/3207a1b4bfbb2bbe7e18b1c07c93000b5f5d524f))
* secure external GitHub links in header and navigation ([a015450](https://github.com/prismaymedia/linkfy/commit/a0154503c858aa2f84cbd676383bef1b8536bfcb))
* **url-sanitizer:** add locale support to Deezer path regex ([3fd197d](https://github.com/prismaymedia/linkfy/commit/3fd197dae34e782a2af333ce381126dcf8ae8af0))
* **url-sanitizer:** correct error message to match supported URL patterns ([69bd039](https://github.com/prismaymedia/linkfy/commit/69bd039cd7fbeaf867c8993deedf453ce609e991))
* **url-sanitizer:** correct HTTPS validation and improve XSS detection ([5fdb262](https://github.com/prismaymedia/linkfy/commit/5fdb262dd4a03900d6c9489601793aca297d3ed7))
* **url-schema:** enhance URL validation and XSS filtering ([d1d4514](https://github.com/prismaymedia/linkfy/commit/d1d451476d555dc373ae86f7a9d8166365f54cf9))


### Code Refactoring

* apply UI review improvements and enhance component consistency ([9cdce92](https://github.com/prismaymedia/linkfy/commit/9cdce927d504d3c7c5483046a7e876ada3aebbd5))
* **auth:** apply Copilot and CodeRabbit recommendations ([0646f54](https://github.com/prismaymedia/linkfy/commit/0646f54be58c268229a37560935d770e63619b18))
* **chrome-addon:** code improvements and optimizations ([f9a6991](https://github.com/prismaymedia/linkfy/commit/f9a6991f757e4b40d8ca4691634fbb561c24fa00))
* **chrome-addon:** improve background script and config ([de6bd84](https://github.com/prismaymedia/linkfy/commit/de6bd84f59943701fb9ee0ece5aeebdc47b2b310))
* **preferences:** unify settings management and migrate components to usePreferences ([bc64c97](https://github.com/prismaymedia/linkfy/commit/bc64c97a5f11ba80045859c6eb4d1a82f8cf93c6))
* switch server database driver from Neon serverless to node-postgres and adjust client provider order ([742840d](https://github.com/prismaymedia/linkfy/commit/742840d05764972c5d8f0cb4e35ca3d6ad1b9a5b))
* **toast:** improve toast variants and cleanup unused error variable ([2f782c7](https://github.com/prismaymedia/linkfy/commit/2f782c77f0d1eb7cc51a01f1db6a25e571aa3c31))
* **toasts:** apply CodeRabbit suggestions, reorganize toast manager, and fix variant typing ([cb5b2e8](https://github.com/prismaymedia/linkfy/commit/cb5b2e870c080f3ad353601072bf42665ed603df))

## [2.5.0](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.4.0...linkfy-v2.5.0) (2025-11-11)


### Features

* **api:** implement universal /api/convert endpoint with platform auto-routing ([6787ce6](https://github.com/prismaymedia/linkfy/commit/6787ce6a4746ac49907f69872b2de40f30cfcfd6))
* **client:** add mocks and update conversion form for universal API support ([c164cc7](https://github.com/prismaymedia/linkfy/commit/c164cc78ce19d1f095278e4057275a14c2973173))
* Complete Q4 2025 Reorganization for Sprint 3-4 ([137bdcc](https://github.com/prismaymedia/linkfy/commit/137bdcca56fdc15da508fded08f432205667ba9b))
* **config:** add GitHub Codespaces development environment ([f959a7d](https://github.com/prismaymedia/linkfy/commit/f959a7d5aa98514dfc8b0195ac02f750af4d3054))
* **config:** add GitHub Codespaces development environment with Python/uv support ([2a898cc](https://github.com/prismaymedia/linkfy/commit/2a898cc86f37b308391bdbe5a9a49ad67555bac4))
* **config:** add Python 3.12 and uv package manager support to devcontainer ([cfaf491](https://github.com/prismaymedia/linkfy/commit/cfaf491c3ab0a73020dda696bcadf031b7078fac))
* **conversion-form:** enhance error handling, duplicate prevention, and user feedback ([56f072e](https://github.com/prismaymedia/linkfy/commit/56f072e07fca42f736105e3501d23733ad935020))
* **conversion:** implement request deduplication and caching to improve performance ([758a069](https://github.com/prismaymedia/linkfy/commit/758a0692d619babb556ad7f88c14825c44146681))
* **dynamic-service-icons:** implement URL-based icon switching for music platforms ([f37d052](https://github.com/prismaymedia/linkfy/commit/f37d052162836ea7044d1dc628ecd352c8eca808))
* improve responsive UI and touch targets across components ([663defe](https://github.com/prismaymedia/linkfy/commit/663defe64a40e4eff4a4e8c0d6084985c3b3477e))
* **ui:** add trash icon with hover actions ([3a630be](https://github.com/prismaymedia/linkfy/commit/3a630be8325adeb154c0f8a1a2af82875f8685a1))


### Bug Fixes

* **conversion-form:** apply Copilot suggestions for accessibility and focus styles ([11f650c](https://github.com/prismaymedia/linkfy/commit/11f650c1c3c47395a7ad8799e1bed980d39bf429))
* **conversion:** apply Copilot suggestions and fix failing tests ([3913eca](https://github.com/prismaymedia/linkfy/commit/3913eca7e1e2b55a1770e4eef7803e8e6eaa4c90))
* **conversion:** resolve debounce and preview issues in conversion form ([aef562d](https://github.com/prismaymedia/linkfy/commit/aef562dfc6b250b78c82e54e2b5e726e8ab0345e))
* **dynamic-service-icon:** remove unused import and update translation strings ([c2767a5](https://github.com/prismaymedia/linkfy/commit/c2767a523687c329c1b27af628b3af6c14aef593))
* improve mobile layout, navigation and form accessibility ([1370016](https://github.com/prismaymedia/linkfy/commit/13700165963766a69143f7912f9a2bc6502978e8))
* **queryClient:** resolve failing test in queryClient.test.ts ([1ef9c2d](https://github.com/prismaymedia/linkfy/commit/1ef9c2d09db919d9dce0f98d671e3868e3608e6a))


### Code Refactoring

* **api:** reorganize /api/user-info endpoint structure and module organization ([dc6e7f8](https://github.com/prismaymedia/linkfy/commit/dc6e7f8dc651aecfd67ce428c5b336f27829ff49))
* **conversion:** improve deduplication logic and remove redundant logs ([0716653](https://github.com/prismaymedia/linkfy/commit/0716653f2e62df7074598820b398c56f645cc471))
* **conversion:** unify logic and shared schema for multi-platform detection ([94e9258](https://github.com/prismaymedia/linkfy/commit/94e92585954f0e044d6576efeeb39388b0c02c1f))
* **music-converter:** replace Get Started with Music Converter component ([cc44067](https://github.com/prismaymedia/linkfy/commit/cc440678a0805ab70c1511ecc5bc126c5fdf0537))
* **ui:** apply Copilot code review suggestions for class handling and layout improvements ([e480304](https://github.com/prismaymedia/linkfy/commit/e480304d29b29e0c3b14a74cf13edbc75f5772f9))
* **user:** align user controller route with API versioning convention ([4c9ca13](https://github.com/prismaymedia/linkfy/commit/4c9ca13b6baaf068bc493d3ce818e0230f49947d))

## [2.4.0](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.3.2...linkfy-v2.4.0) (2025-10-22)


### Features

* add color variants and handle warning toast via useEffect ([05d3470](https://github.com/prismaymedia/linkfy/commit/05d34709c3e89870473ee69ceccdcdfb3f06f05b))
* Add Grafana Cloud integration with Prometheus metrics ([f6f5088](https://github.com/prismaymedia/linkfy/commit/f6f5088f456a14054af96b1fd9098065e43d98c2))
* add Vercel Analytics integration and update dependencies ([d65651f](https://github.com/prismaymedia/linkfy/commit/d65651f5186c2425c3620cf15672d3cc5d15b1fe))
* **api:** implement user-facing alerts for conversion failures ([c6cccad](https://github.com/prismaymedia/linkfy/commit/c6cccad35262114837ed3ec40a897d281de8698e))
* **api:** integrate Drizzle ORM for database operations ([9e67d3d](https://github.com/prismaymedia/linkfy/commit/9e67d3d7c41da57343233292be15bcc81a316676))
* **client:** implement homepage with header, login button and language switcher ([70541e9](https://github.com/prismaymedia/linkfy/commit/70541e9ddef2c71b4fa7db695119b6d4f4e787e7))
* **config:** add Vercel deployment configuration and workflow ([84bc180](https://github.com/prismaymedia/linkfy/commit/84bc1802ab6226716c47564de0df4240a44f7a43))
* **conversion:** display user-facing alert on failed song conversion ([ead11b8](https://github.com/prismaymedia/linkfy/commit/ead11b8fefd3b25ae36a1132b2ab10f199d204a9))
* **i18n:** enhance language switcher UX, persistence and accessibility ([457c8cd](https://github.com/prismaymedia/linkfy/commit/457c8cda8f58c8005fd60bab5f50bfce758713f6))
* **sentry:** integrate and verify error tracking in client and server ([a6db90e](https://github.com/prismaymedia/linkfy/commit/a6db90ed4e7986022883f648495ae929e15cc8a1))


### Bug Fixes

* add SHELL environment variable for build steps in Vercel deployment ([8ed26c4](https://github.com/prismaymedia/linkfy/commit/8ed26c4330105cfcd2b407d8154ce598b8ba09c2))
* **api:** prevent response body double-read and correct Sentry DSN variable ([8fb0fed](https://github.com/prismaymedia/linkfy/commit/8fb0fed8e350785c178e293ac96d020b7f304e74))
* **auth:** add production URL to CORS and frontend environment config… ([cd74590](https://github.com/prismaymedia/linkfy/commit/cd74590d88d9fcc9106df2db7975d5c6ca556410))
* **auth:** add production URL to CORS and frontend environment configuration ([495a5c2](https://github.com/prismaymedia/linkfy/commit/495a5c2b7ad8118ed1d385a224a1804eb6d2b668))
* **auth:** improve error typing and message handling in catch blocks ([2f272dc](https://github.com/prismaymedia/linkfy/commit/2f272dcd4bc4bd042b187f98f275bd198c9410ae))
* **auth:** improve Supabase authentication flow ([e383166](https://github.com/prismaymedia/linkfy/commit/e383166cd23b37dd40c9bd8f4e01d2b70bbcd044))
* **breadcrumb:** resolve component structure ([8b0c84d](https://github.com/prismaymedia/linkfy/commit/8b0c84dd0241e025fe2c45253d6e35bb5e7fdf2e))
* **breadcrumb:** resolve visual and functional issues in breadcrumb navigation ([d5dce93](https://github.com/prismaymedia/linkfy/commit/d5dce9301b097590af923c96f4617b74f20041fa))
* **ci:** Resolve e2e test failures on ESM modules ([f2672d5](https://github.com/prismaymedia/linkfy/commit/f2672d5818c9540cf4c8f5747f986ff21ea2fd14))
* **client:** resolve vercel spa routing and auth callback handling ([2a186dd](https://github.com/prismaymedia/linkfy/commit/2a186ddb47ea0d7d441616138df5d275983b55da))
* **conversion:** improve toast handling and duplicate URL logic in tests ([ff188b3](https://github.com/prismaymedia/linkfy/commit/ff188b3163ecdf224e52623ef4b6a9928c3b2d5b))
* correct Vercel project ID environment variable in deployment workflow ([fed7443](https://github.com/prismaymedia/linkfy/commit/fed7443c9ffe8e17d896e186bf3d8c41804c3977))
* correct Vercel project ID secret reference in deployment workflow ([1653461](https://github.com/prismaymedia/linkfy/commit/165346112499aa669b2e92199809f1e7a0816973))
* **e2e:** adjust Jest config to support ESM dependencies in tests ([08125c3](https://github.com/prismaymedia/linkfy/commit/08125c3aeaf3db4fbfcba2b615b3ddc769d66201))
* **env:** set correct production API URL for Linkfy backend ([2dff60c](https://github.com/prismaymedia/linkfy/commit/2dff60c2011cffdf89110ecea09be1094fd2079c))
* keep master version of yarn.lock to resolve merge conflict ([2d62e0c](https://github.com/prismaymedia/linkfy/commit/2d62e0c7adb4bc9b95c303cdca0a7fa30921eb33))
* **navigation:** adjust mobile menu alignment and layout ([21fc3cc](https://github.com/prismaymedia/linkfy/commit/21fc3cc53781724676ada740b0eb0768b79cf0ce))
* remove SHELL environment variable from build steps in Vercel deployment ([024cde3](https://github.com/prismaymedia/linkfy/commit/024cde391c3b4d2da9ca7fe2561203dab3406e33))
* remove VERCEL_TOKEN from deployment workflow and update project name in Vercel configuration ([67ac3e2](https://github.com/prismaymedia/linkfy/commit/67ac3e2ff44fa17d30b99c5a5fdef76eccaf424a))
* resolve Jest e2e test configuration for ES6 modules ([c8a7d0b](https://github.com/prismaymedia/linkfy/commit/c8a7d0b8b1719b4872d5f05c6aff152a29ff1231))
* **result-card:** apply ui and error handling adjustments ([eb4036c](https://github.com/prismaymedia/linkfy/commit/eb4036cab8a43b31b20b899a75f46c7b4cf30879))
* **router:** simplify base path configuration in main.tsx and vite.config.ts ([0585b48](https://github.com/prismaymedia/linkfy/commit/0585b4890f648374a0ffd1668857da914841800d))
* **routing:** configure Wouter to serve main app only on root path ([b6fc442](https://github.com/prismaymedia/linkfy/commit/b6fc4423e698f2ef7d42a6fc47fbe5f1a3f264d3))
* **routing:** remove /linkfy base path to load app from root ([d0d414a](https://github.com/prismaymedia/linkfy/commit/d0d414ac3b220c407bd504a52cb09afe9f04d6d6))
* **sentry:** update DSN configuration to use correct project endpoin ([674d3ad](https://github.com/prismaymedia/linkfy/commit/674d3ad1bbdac6b63d9ebf7b162207aff88bded4))
* separate build steps for Vercel deployment into distinct preview and production jobs ([1aa0c2e](https://github.com/prismaymedia/linkfy/commit/1aa0c2ea3ce3f8e30bef38945ee6b7061ec70a98))
* **server:** correct Drizzle schema import and remove Supabase module usage ([fe4ec98](https://github.com/prismaymedia/linkfy/commit/fe4ec9836d91433d1874a71bae3498af865525dc))
* simplify build command in Vercel deployment workflow ([94c2b76](https://github.com/prismaymedia/linkfy/commit/94c2b76dc107f96cfdd0406015e1a3ef95e46aca))
* streamline Vercel deployment workflow and update configuration ([5996448](https://github.com/prismaymedia/linkfy/commit/5996448f62eef44b467110d1a6dabf7299cf40d3))
* **tests:** adjust Vitest configuration and setup file ([e6a31ae](https://github.com/prismaymedia/linkfy/commit/e6a31aeec8b4686110724cec3004d818cd432bf1))
* **tests:** fix queryclient test ([f74f4f5](https://github.com/prismaymedia/linkfy/commit/f74f4f520ed28c5812addaa69cfcc0690c1202c4))
* **tests:** resolve failing test cases ([9f29695](https://github.com/prismaymedia/linkfy/commit/9f29695eee3c9d1cb45ee42f76529b4ecc49e9b5))
* update application name in Vercel configuration ([e4822d4](https://github.com/prismaymedia/linkfy/commit/e4822d46e4bc447b38d1a4e3c1ce685a9e4bce50))
* update build command in Vercel deployment workflow to handle pull requests correctly ([dca327f](https://github.com/prismaymedia/linkfy/commit/dca327f4fca2f4532df96a5a5e19958379eafa60))
* update Node.js setup to use npm cache and install dependencies correctly ([56e7510](https://github.com/prismaymedia/linkfy/commit/56e7510228264f3fe933a24bcd1098147f36967c))
* update preview deployment details to use context variables for branch, commit, and actor ([a648256](https://github.com/prismaymedia/linkfy/commit/a6482569e8bb204c7d4e3167e537b4ec3f2f064e))
* **validation:** improve URL detection and validation for YouTube Music and Spotify ([a138d3d](https://github.com/prismaymedia/linkfy/commit/a138d3d72b97d49adf1e2be435cbe25811a0fabb))
* **validation:** update schema message, tests, and jest-e2e config ([9b6850e](https://github.com/prismaymedia/linkfy/commit/9b6850ef6f045b0884dcdc57d18ce6ce064008b4))
* **youtube:** fix YouTube URL detection regex patterns ([87c4d30](https://github.com/prismaymedia/linkfy/commit/87c4d3005d0e93abab1d483bb6e8dbc5e4a95d26))
* **youtube:** handle album URLs safely and improve duplicate URL validation ([8986b5d](https://github.com/prismaymedia/linkfy/commit/8986b5dc7a2fda0c8b5f8c3863317ab0260157af))


### Code Refactoring

* **i18n:** centralize document direction handling and improve class readability ([bd09108](https://github.com/prismaymedia/linkfy/commit/bd09108fcd44193885db1f6d424fe550da9afaf8))


### Documentation

* add comprehensive Drizzle ORM integration documentation ([85c1613](https://github.com/prismaymedia/linkfy/commit/85c1613c49565815e76ab79b045a0d35c9b3a382))
* add comprehensive implementation summary ([7b555e6](https://github.com/prismaymedia/linkfy/commit/7b555e6774caee6dc4a2af93bfcfecac39c24afd))
* add deployment checklist and update contributing guide ([045c736](https://github.com/prismaymedia/linkfy/commit/045c7360af61c287441d2c9a4c5b4a39e678e8b2))
* add Drizzle ORM quick start guide ([8a8aabc](https://github.com/prismaymedia/linkfy/commit/8a8aabcc651806742b99f771c4e17e6855b04cf9))
* add quick start guide and deployment workflow diagram ([2d3eccd](https://github.com/prismaymedia/linkfy/commit/2d3eccdc03341d524906509bdf32b5531b5d22e2))

## [2.3.2](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.3.1...linkfy-v2.3.2) (2025-10-01)


### Bug Fixes

* enhance project documentation for multi-browser support and user experience improvements ([3602658](https://github.com/prismaymedia/linkfy/commit/3602658bd6db835f8b813deef965ebcc9cc57848))
* update project overview to clarify Linkfy's functionality as a universal music streaming URL converter ([f617fa6](https://github.com/prismaymedia/linkfy/commit/f617fa66b385d2829c044042cc4ea0d386c8b088))

## [2.3.1](https://github.com/prismaymedia/linkfy/compare/linkfy-v2.3.0...linkfy-v2.3.1) (2025-10-01)


### Bug Fixes

* update bug fix tasks with ClickUp references for v2.3.0 ([935d1b3](https://github.com/prismaymedia/linkfy/commit/935d1b3cc48039d4f5579dea4dbdb7255fb9e994))


### Documentation

* update q4 sprint plan with december capacity, holidays and language policy ([1df4dfd](https://github.com/prismaymedia/linkfy/commit/1df4dfdd8535e343aac54d926ab4462c961548c0))

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
