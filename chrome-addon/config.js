const ENV = chrome.runtime.getManifest().update_url ? 'production' : 'local';

const CONFIG = {
    local: {
        API_BASE_URL: 'http://localhost:3000',
    },
    production: {
        API_BASE_URL: 'https://linkfy-production.up.railway.app',
    },
};

const CURRENT_CONFIG = CONFIG[ENV];
const API_BASE_URL = CURRENT_CONFIG.API_BASE_URL;

if (ENV !== 'production') {
    console.log(`[Config] Running in ${ENV.toUpperCase()} mode`);
    console.log(`[Config] API URL: ${API_BASE_URL}`);
}
