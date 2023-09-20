const puppeteer = require('puppeteer');

const dotenv = require("dotenv")
dotenv.config()
const {
  getTextByOcr
} = require('./js/common');

async function openBrowser() {
  console.log('正在启动 Chrome')

  const options = {
    headless: false, // 无头模式
    args: ["--window-position=0,0", `--window-size=1280,800`],
    defaultViewport: {width: 1280, height: 800},
    // devtools: true,
    ignoreDefaultArgs: ["--enable-automation"]
  }
  if (process.env.CHROME_PATH) {
    options.executablePath = process.env.CHROME_PATH
  }
  const browser = await puppeteer.launch(options);
  const [p] = await browser.pages()
  return p
}

const main = async function () {
  // 最终需要的数据集合
  const dataMap = {
    'getLiveRoomData': undefined,
    'getLivingData': undefined,
    'getAnalysisLivingData': undefined
  }
  try {
    getTextByOcr()
    return // TODO::到这里
    const page = await openBrowser() // 打开浏览器
    await openPage(page) // 打开页面

    /**
     * 打开页面
     * @param p
     * @returns {Promise<void>}
     */
    async function openPage(p) {
      const urls = [
        'https://www.bilibili.com/' //
      ]
      const url = urls[0]
      await p.setBypassCSP(true)
      await p.goto(url);
    }

    /**
     * 通过opencv获取视频内容
     * @param p
     * @returns {Promise<void>}
     */
    async function getVideoInfo(p) {

    }

    /**
     * 上传openai获取内容
     * @param p
     * @returns {Promise<void>}
     */
    async function emitOpenAi(p) {

    }

    return dataMap

  } catch (e) {
    console.warn(e);
    return dataMap
  }
};

main().then(data => {
  console.log('最终数据', data); /*！最终数据！*/
})

/**
 *
 * 准确率 容错率
 */
