const puppeteer = require('puppeteer');
const dotenv = require("dotenv")
dotenv.config()
const {getTextByOcr} = require('./js/common');
const {HandleCanvas} = require('./js/helper')

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
  const dataMap = {}
  try {
    getTextByOcr()

    const page = await openBrowser() // 打开浏览器
    await _openPage(page) // 打开页面
    await _getVideoData(page)

    return // TODO::到这里

    return dataMap

  } catch (e) {
    console.warn(e);
    return dataMap
  }
};

/**
 * 打开页面
 * @param p
 * @returns {Promise<void>}
 */
async function _openPage(p) {
  const urls = [
    'https://www.bilibili.com/' //
  ]
  const url = urls[0]
  await p.setBypassCSP(true)
  await p.goto(url);
}

/**
 * 获取页面视频
 * @returns {Promise<XPathResult>}
 * @private
 */
async function _getVideoData(page) {
  return page.evaluate(async () => {
    const $canvas = new HandleCanvas('#bilibili-player .bpx-player-video-wrap video');
    // 刷新一次页面
    const canEl = $canvas.initCanvas(1);
    $canvas.drawVideoImg(canEl, 50)
    const base64Img = $canvas.processImageAndReturnBase64(canEl)
    return Promise.resolve(base64Img)
  });
}

main().then(data => {
  console.log('最终数据', data); /*！最终数据！*/
})

/**
 *
 * 准确率 容错率
 */
