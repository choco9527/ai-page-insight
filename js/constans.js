const path = require('path');

const tesseractWorkerConfig = {
  langPath: path.join(__dirname, '..', 'lang-data'),
  // logger: m => console.log(m),
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

const cookie = `buvid4=EDE34684-7E12-EFA5-7A4B-DE77F469EC5E69082-023091515-PoU2UV/9Gkohh10gDVpiGg%3D%3D; buvid3=173DB426-436F-E510-90EF-ABCE6D8CA0B665013infoc; b_nut=1694762165; _uuid=3625B999-531C-47107-9594-10789B115155C35404infoc; buvid_fp=f3f5f1cef66de528daa938f5ccad82bf; CURRENT_FNVAL=4048; rpdid=|(um|JY~R)Y~0J'uYmR~YR~Yl; header_theme_version=CLOSE; home_feed_column=4; browser_resolution=1384-758; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTU2MTk4MTMsImlhdCI6MTY5NTM2MDU1MywicGx0IjotMX0.i8aF9WuT6fiGD5N7C5WLw8ogEW7m0IzlUjfypBMY1os; bili_ticket_expires=1695619753; PVID=1; b_lsid=4B2AF101010_18ABB907485; SESSDATA=f210ea0b%2C1710917265%2Cd8ada%2A92CjB74F30uX5b9wdP0LSqngyoQDDz6D21FourDuByrEWs7SutcK87WJL2KMmv6qqNKfcSVnN4OEY2OEJPUUg1LXNvMWNlRDdJUFotbmJWUUpuNDlQVXR6ZnpzdUF0SWZ4bEM0bWNLVV9vOG1ISnVwcEtQU0ZEbGswQlNVZ0I3VDV0My1oV1RxNkdBIIEC; bili_jct=476b4d37f5ab1bddf05a4035540148ad; DedeUserID=19374705; DedeUserID__ckMd5=dec1fdef5ff1dccb; sid=mihn3pfk`
const cookiesArray = cookie.split("; ").map(cookie => {
  const [name, value] = cookie.split("=");
  return { name, value, domain: '.bilibili.com' };
});

module.exports = {
  tesseractWorkerConfig,
  supportLang,
  launchConfig: launchConfigAll,
  cookie,
  cookiesArray
}
