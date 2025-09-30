# Changelog

## [1.1.0](https://github.com/prismaymedia/linkfy/compare/linkfy-v1.0.0...linkfy-v1.1.0) (2025-09-30)


### Features

* **auth:** implement Google sign-in flow and session management with Supabase ([88753e2](https://github.com/prismaymedia/linkfy/commit/88753e284ce34fea492fbfa522057408df215594))
* **auth:** implement secure login with Supabase ([0c52338](https://github.com/prismaymedia/linkfy/commit/0c523384ffaace58a4e9f8b2b178621ca142670b))
* **auth:** protect backend routes with SupabaseAuthGuard and add user context ([0f8adfc](https://github.com/prismaymedia/linkfy/commit/0f8adfcdcbeff88619c89a3d81ea7e77db725251))
* **chrome-addon:** create base structure for Chrome extension ([37c6d78](https://github.com/prismaymedia/linkfy/commit/37c6d7835195030ac98231620f042af440f3dbd5))
* **ci:** automate tests to run as part of CI/CD pipeline ([66f0a27](https://github.com/prismaymedia/linkfy/commit/66f0a277d1f053c54ec18d61c32f828009473eeb))
* **client:** add .env.example and ignore .env.development ([2c783d8](https://github.com/prismaymedia/linkfy/commit/2c783d8f8a63d7d4628d623535e4163260a023b0))
* **client:** use VITE_API_URL from env in queryClient ([8b0b129](https://github.com/prismaymedia/linkfy/commit/8b0b1297771785ffca845c1cbd92a09a85471079))
* **controller:** unify youtube-info and convert into a single endpoint ([8debf01](https://github.com/prismaymedia/linkfy/commit/8debf0157606839b37ba3615746c87855cd7e1ba))
* **conversion-form:** prevent duplicate API calls for same URL ([bcdbb52](https://github.com/prismaymedia/linkfy/commit/bcdbb52169e6258b6071cbe94e57da9b6f71bf9a))
* **conversion:** validate YouTube URL before starting conversion ([b422bd0](https://github.com/prismaymedia/linkfy/commit/b422bd0539410a84d5e0b852878c54a860b075f9))
* **extension:** add icons to chrome extension ([c1fb172](https://github.com/prismaymedia/linkfy/commit/c1fb172f9376d3c246095256d6aeb2b3e155a534))
* **frontend:** implement URL change detection in conversion-form to enable/disable Convert button ([003ed29](https://github.com/prismaymedia/linkfy/commit/003ed29609ac177790a7c184c139864abebb030d))
* **i18n:** add i18n import to extension files for translation support ([91bf2e5](https://github.com/prismaymedia/linkfy/commit/91bf2e5f6056ef2382c3e53801329a5fc49536ac))
* **language-switcher:** add language switcher component ([6955305](https://github.com/prismaymedia/linkfy/commit/6955305c7381cdc8c1183f67b1b963c00e1eb504))
* **locales:** add translation files for English and Spanish ([ee2af55](https://github.com/prismaymedia/linkfy/commit/ee2af551d90f5eec52c88728b67f833aecc67f60))
* **music-service:** add MusicServiceDemo and MusicServiceSelector components ([7a3d92f](https://github.com/prismaymedia/linkfy/commit/7a3d92f9c0ed4ff1479c3c77619c623237aba17a))
* **select:** set default source to YouTube Music and target to Spotify ([840d217](https://github.com/prismaymedia/linkfy/commit/840d217f56526a0c12c201d700a836b310149d1b))
* **sentry:** configure project and enable user email tracking ([8dc3ad9](https://github.com/prismaymedia/linkfy/commit/8dc3ad9553a8459e79552a4bb4546a8e5ed712bd))
* **supabase:** integrate Supabase client in NestJS and test connection ([14048c7](https://github.com/prismaymedia/linkfy/commit/14048c73d700c5789cb7b7d8c44275719c96e09f))
* **testing:** configure test environment and global setup ([8762200](https://github.com/prismaymedia/linkfy/commit/87622009454cf55131f577694842cbe1ef49391a))
* **testing:** configure Vitest and testing dependencies ([bba7b4f](https://github.com/prismaymedia/linkfy/commit/bba7b4f2db644f560c8c349f351c12182b73bf7e))
* **testing:** implement MSW for API response mocking ([bc9f0df](https://github.com/prismaymedia/linkfy/commit/bc9f0dffa8dcb7b4f51dfa654d5ef19363aaf4b1))
* **youtube:** implement YouTube endpoint with frontend integration ([fd2bd36](https://github.com/prismaymedia/linkfy/commit/fd2bd3652b883095c68273443cf09faee04deebc))


### Bug Fixes

* **config:** Remove trailing slash from VITE_API_URL to prevent errors in extension requests ([eb83e03](https://github.com/prismaymedia/linkfy/commit/eb83e0344ef37a190b8cc004fd7ebc82cf291d47))
* **deploy:** correct gh-pages path and add root deploy:client script ([9720ca0](https://github.com/prismaymedia/linkfy/commit/9720ca097954c6bf56f8bbfabaeb9c1b6406a86f))
* **deps:** use zod@3.x for compatibility with drizzle-zod@0.8.2 ([fff5244](https://github.com/prismaymedia/linkfy/commit/fff524413e4c7152e9d9bd974e60f8df79ae7998))
* **e2e tests:** mock SupabaseAuthGuard and provide user for YouTube conversion endpoint ([c7e4d7a](https://github.com/prismaymedia/linkfy/commit/c7e4d7ace0d291d0c733887e12f18d0146d08d42))
* **extension:** fix MusicServiceSelector and queryClient issues ([be1dfef](https://github.com/prismaymedia/linkfy/commit/be1dfef252de2de36484295e4219afedcd726023))
* **i18n:** Add translations to the authentication form ([8f61ea4](https://github.com/prismaymedia/linkfy/commit/8f61ea44d911a53d0087ac29a0fdad4675ef9c77))
* regex youtube and youtube music ([4047dc2](https://github.com/prismaymedia/linkfy/commit/4047dc2f52fd6ac14ee06272e55d0ab70e90ce82))
* **server tests:** pass CurrentUser mock to youtubeConvert ([d6efd58](https://github.com/prismaymedia/linkfy/commit/d6efd58f12f903c3b782e1b324c8b2a74bc31180))
* **server:** improve Spotify track matching accuracy and fix storage issues ([f7ab4f7](https://github.com/prismaymedia/linkfy/commit/f7ab4f7b27b59a3af0e0da82e356149d21acbfa6))
* set base path for Wouter router in GitHub Pages ([3cdcec0](https://github.com/prismaymedia/linkfy/commit/3cdcec0b9609345c2875100c254e66e4033a7d4a))
* **shared:** resolve zod type inference error with drizzle-zod ([32208c9](https://github.com/prismaymedia/linkfy/commit/32208c984b1ec7ee0ef67468e39366cc01e52690))
* **test:** mock SupabaseService in E2E to avoid missing env errors ([65d2efb](https://github.com/prismaymedia/linkfy/commit/65d2efbc1111034667936c59b64e5a7de2ae0dc8))
* **tests:** prevent createClient from failing in CI ([f483113](https://github.com/prismaymedia/linkfy/commit/f4831131784b9e399232272557c8665861ad5cab))
* **toast:** remove fixed position from ToastViewport ([6774c49](https://github.com/prismaymedia/linkfy/commit/6774c49fcd151d08efea81855b26d5382228d2f0))
* **toast:** set popup to absolute position on mobile ([a47fa65](https://github.com/prismaymedia/linkfy/commit/a47fa6596c4a88f43d715fc5bc437fb312fc1aa6))
* **ui:** prevent duplicate previews by storing last processed url ([6d46f35](https://github.com/prismaymedia/linkfy/commit/6d46f35119d82973b087f69fc05823bd8f922438))


### Code Refactoring

* **api:** migrate backend from Express to NestJS keeping same features and Swagger ([d414ccb](https://github.com/prismaymedia/linkfy/commit/d414ccbe8c829a8c664b09326759a7cb3feb86d9))
* **auth:** remove email login form and language switcher ([61d172e](https://github.com/prismaymedia/linkfy/commit/61d172e7315a1a1c70a6f6c08dac32d3002d331c))
* **auth:** remove Facebook login support and keep only Google provider ([728bd0d](https://github.com/prismaymedia/linkfy/commit/728bd0de9d7a4559c0302004ea9bdfbbd0cb1dfc))
* **auth:** replace window.location with setLocation and clean up session listener ([fa25467](https://github.com/prismaymedia/linkfy/commit/fa25467d74beaf7ac7a7e15ea2fe0e1d5f74cb75))
* **components:** integrate i18n ([06ac48e](https://github.com/prismaymedia/linkfy/commit/06ac48e51fea7aaf9f0fb896a4f76ff6dbfee287))
* **conversion:** unify YouTube conversion endpoint and update tests ([0340e81](https://github.com/prismaymedia/linkfy/commit/0340e818b6001300dd5fa5f6fd20302fa784f4f1))
* endpoint convert to spotify ([1957e9c](https://github.com/prismaymedia/linkfy/commit/1957e9c358fb1aa3c734744464cc16d573109beb))
* remove footer from home page ([8912b23](https://github.com/prismaymedia/linkfy/commit/8912b23d85a340d6d0fce6f2828c884402bef08a))
* remove unused spotifyService dependency ([526da4f](https://github.com/prismaymedia/linkfy/commit/526da4f354ecaa42ec3185a7089fb58a280f4352))
* **structure:** restructure project into client (frontend) and server (backend) folders ([2ff29c9](https://github.com/prismaymedia/linkfy/commit/2ff29c93b1d2a392e90205ef3f7a33c3fb47aca8))


### Documentation

* add commit convention and update instructions ([59968b0](https://github.com/prismaymedia/linkfy/commit/59968b022a1f60c2f02faea8cacfa9e5d77d2be8))
* **config:** add commit message instructions ([8dfa91b](https://github.com/prismaymedia/linkfy/commit/8dfa91b8fb5ae244b70514cc2b7da7ef2548ef14))
* **env:** add DATABASE_URL and instructions to server/.env.example ([dfd5c6f](https://github.com/prismaymedia/linkfy/commit/dfd5c6f3267584f6cbea4e81d49a7f8ce8abc65a))
* **http:** add note to replace Authorization with Supabase token ([5ae9b0f](https://github.com/prismaymedia/linkfy/commit/5ae9b0fa40764ac907416b40bb3d8e2ffe019766))
* **request:** update examples for youtube-convert endpoint ([a088c17](https://github.com/prismaymedia/linkfy/commit/a088c17a4148ee8f644b1739218bd811141ff9fc))
* **swagger:** translate responses to English and add success/error examples ([77fff08](https://github.com/prismaymedia/linkfy/commit/77fff08b32fdb5a024dcc5ad77752cfa95ee0393))
