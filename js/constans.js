const path = require('path');

const tesseractWorkerConfig = {
  langPath: path.join(__dirname, '..', 'lang-data'),
  logger: m => console.log(m),
}

const supportLang = {
  eng: 'eng',
  zh: 'chi_sim'
}

const launchConfig = [
  "--window-position=0,0",
  `--window-size=1280,800`,
]

const launchConfigAll = [
  "--window-position=0,0",
  `--window-size=1280,800`,
  '–enable-gpu', // GPU硬件加速
  '--disable-timeouts-for-profiling'

// '--autoplay-policy=user-gesture-required',
  // '--disable-background-networking',
  // '--disable-background-timer-throttling',
  // '--disable-backgrounding-occluded-windows',
  // '--disable-breakpad',
  // '--disable-client-side-phishing-detection',
  // '--disable-component-update',
  // '--disable-default-apps',
  // '--disable-dev-shm-usage',
  // '--disable-domain-reliability',
  // '--disable-extensions',
  // '--disable-features=AudioServiceOutOfProcess',
  // '--disable-hang-monitor',
  // '--disable-ipc-flooding-protection',
  // '--disable-notifications',
  // '--disable-offer-store-unmasked-wallet-cards',
  // '--disable-popup-blocking',
  // '--disable-print-preview',
  // '--disable-prompt-on-repost',
  // '--disable-renderer-backgrounding',
  // '--disable-speech-api',
  // '--disable-sync',
  // '--hide-scrollbars',
  // '--ignore-gpu-blacklist',
  // '--metrics-recording-only',
  // '--mute-audio',
  // '--no-default-browser-check',
  // '--no-first-run',
  // '--no-pings',
  // // '--no-sandbox',
  // '--no-zygote',
  // '--password-store=basic',
  // '--use-gl=swiftshader',
  // '--use-mock-keychain',
  // '--disable-background-networking',
  // '--enable-features=NetworkService,NetworkServiceInProcess',
  // '--disable-background-timer-throttling',
  // '--disable-backgrounding-occluded-windows',
  // '--disable-breakpad',
  // '--disable-client-side-phishing-detection',
  // '--disable-component-extensions-with-background-pages',
  // '--disable-default-apps',
  // '--disable-dev-shm-usage',
  // '--disable-extensions',
  // '--disable-features=TranslateUI',
  // '--disable-hang-monitor',
  // '--disable-ipc-flooding-protection',
  // '--disable-popup-blocking',
  // '--disable-prompt-on-repost',
  // '--disable-renderer-backgrounding',
  // '--disable-sync',
  // '--force-color-profile=srgb',
  // '--metrics-recording-only',
  // '--no-first-run',
  // '--disable-automation',
  // // '--disable-setuid-sandbox',
  // '--password-store=basic',
  // '--use-mock-keychain',
]

module.exports = {
  tesseractWorkerConfig,
  supportLang,
  launchConfig: launchConfigAll
}
