const path = require('path');

const tesseractWorkerConfig = {
  langPath: path.join(__dirname, '..', 'lang-data'),
  // logger: m => console.log(m),
}

const supportLang = {
  eng: 'eng',
  zh: 'chi_sim'
}

const launchConfigSimple = [
  "--window-position=0,0",
  `--window-size=1280,800`,
  '–enable-gpu', // GPU硬件加速
  '--disable-timeouts-for-profiling',
]

const launchConfigAll = [
  "--window-position=0,0",
  `--window-size=1280,800`,
  '–enable-gpu', // GPU硬件加速
  '--disable-timeouts-for-profiling',

  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
]

const cookie = `buvid4=EDE34684-7E12-EFA5-7A4B-DE77F469EC5E69082-023091515-PoU2UV/9Gkohh10gDVpiGg%3D%3D; buvid3=173DB426-436F-E510-90EF-ABCE6D8CA0B665013infoc; b_nut=1694762165; _uuid=3625B999-531C-47107-9594-10789B115155C35404infoc; buvid_fp=f3f5f1cef66de528daa938f5ccad82bf; CURRENT_FNVAL=4048; rpdid=|(um|JY~R)Y~0J'uYmR~YR~Yl; header_theme_version=CLOSE; home_feed_column=4; browser_resolution=1384-758; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTU2MTk4MTMsImlhdCI6MTY5NTM2MDU1MywicGx0IjotMX0.i8aF9WuT6fiGD5N7C5WLw8ogEW7m0IzlUjfypBMY1os; bili_ticket_expires=1695619753; PVID=1; b_lsid=4B2AF101010_18ABB907485; SESSDATA=f210ea0b%2C1710917265%2Cd8ada%2A92CjB74F30uX5b9wdP0LSqngyoQDDz6D21FourDuByrEWs7SutcK87WJL2KMmv6qqNKfcSVnN4OEY2OEJPUUg1LXNvMWNlRDdJUFotbmJWUUpuNDlQVXR6ZnpzdUF0SWZ4bEM0bWNLVV9vOG1ISnVwcEtQU0ZEbGswQlNVZ0I3VDV0My1oV1RxNkdBIIEC; bili_jct=476b4d37f5ab1bddf05a4035540148ad; DedeUserID=19374705; DedeUserID__ckMd5=dec1fdef5ff1dccb; sid=mihn3pfk`
const cookiesArray = cookie.split("; ").map(cookie => {
  const [name, value] = cookie.split("=");
  return {name, value, domain: '.bilibili.com'};
});

const userPrompt = `以上的数组是一段视频的字幕的OCR识别的结果，其中数字时间后接了当前时间的内容，请忽略其中出现的一些小的文字识别错误。请以json的形式返回，总结该视频的内容，给出你觉得的视频重要内容关键的时间点即可，如 {02:13：xxx}。
`

const showContent = `
视频的主要内容是关于容易辞职的岗位的讨论。视频提到了一些异地偏远乡镇的岗位辞职率较高，也涉及了一些观众分享的辞职经历和困扰。重点时间点包括：

00:09：提到有很多粉丝和主播聊过辞职的问题。
00:21：特别提到异地偏远乡镇的岗位辞职率较高。
00:46：主播分享了一个粉丝的辞职经历。
01:10：提到异地乡镇岗位排在第一位，辞职率较高。

视频讨论了区县级政府办的工作环境，着重强调了工作的繁重和累人程度。以下是视频中的重要内容和关键时间点：

01:16：提到区县级政府办的工作单位，特别是政府办，工作非常累。
01:24：提到在周末和节假日也需要加班。
01:58：讨论了有许多观众想要辞职离开政府办的工作，大约有20-30人。
02:13：分享了一个观众考上县委办工作，但由于加班太多而想要辞职的案例。
02:25：描述了工作日常是除了上班就是睡觉，没有自己的生活，觉得这种生活没有意义。

视频讨论了工作在区县级政府办、县委办和经开区的情况，并探讨了这些单位的工作环境和特点。以下是视频中的重要内容和关键时间点：

- 02:33：观众表达了对当前工作生活缺乏意义的感受。
- 02:36：有观众考虑辞职并重新参加考试。
- 02:45：讨论了另一类单位，例如派出机构，提到工作地点可能是山区或农村。
- 03:01：指出进入这些单位后很难有晋升机会。
- 03:13：讨论了在不同级别单位工作的管理层级和责任。
- 03:28：强调在这些单位工作的不稳定性和缺乏前途感。
- 03:40：介绍了经开区作为地方建设中心，聚集本地资源的特点。

请注意，由于字幕的OCR识别可能存在一些错误，因此内容的准确性可能会有所影响。

视频讨论了经开区作为一种工作单位的特点和情况，并探讨了在经开区工作的优势和劣势。以下是视频中的重要内容和关键时间点：

- 03:51：强调经开区的建设和特点。
- 03:54：指出经开区是最累的工作地方。
- 03:57：经开区的机构规模较小，人员数量较少。
- 04:00：无论在什么岗位上，工作都是辛苦的。
- 04:04：经开区的待遇相对较好。
- 04:09：有多个人向作者咨询关于辞职的问题。
- 04:13：总结出了辞职较为常见的5个单位。
- 04:18：鼓励观众在评论区分享其他容易辞职的单位。
`


module.exports = {
  tesseractWorkerConfig,
  supportLang,
  launchConfig: launchConfigSimple, // launchConfigSimple , // launchConfigAll,
  cookie,
  cookiesArray,
  userPrompt,
  showContent
}
