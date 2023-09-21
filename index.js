// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');
const {sleep} = require('./js/common');
const {launchConfig} = require('./js/constans');
const {_grayData, _initVideo, _getVideoCurInfo, _getVideoData} = require('./js/helper')

require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"],
});

const main = async function () {
  // 最终需要的数据集合
  const dataMap = {}
  const {page, browser} = await openBrowser() // 打开浏览器
  try {
    await _openPage(page) // 打开页面
    await sleep(2000);
    await injectWindowFuc(page)
    await _initVideo(page)

    return
    const videoData = await _getVideoData(page)
    console.log('videoData', videoData);
    // await getTextByOcrSingle(base64Img)
    return dataMap
  } catch (e) {
    console.warn(e);
    // await browser.close();
    return dataMap
  }
};

async function openBrowser() {
  console.log('正在启动 Chrome')

  const options = {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // 使用默认的浏览器执行路径
    headless: false, // 无头模式
    args: launchConfig,
    defaultViewport: {width: 1280, height: 800},
    devtools: true,
    ignoreDefaultArgs: ["--enable-automation"]
  }
  if (process.env.CHROME_PATH) {
    options.executablePath = process.env.CHROME_PATH
  }
  const browser = await puppeteer.launch(options);
  const [p1] = await browser.pages()
  return {page: p1, browser}
}

/**
 * 打开页面
 * @param p
 * @returns {Promise<void>}
 */
async function _openPage(p) {
  const urls = [
    'https://www.bilibili.com/video/BV1Nu411w7DL/?spm_id_from=333.1007.tianma.1-1-1.click',
    'https://www.bilibili.com/video/BV1zm4y1N7zp/?spm_id_from=333.337.search-card.all.click' //
  ]
  const url = urls[0]
  await p.setBypassCSP(true)
  await p.goto(url);
}

/**
 * 注入页面方法
 * @returns {Promise<void>}
 */
async function injectWindowFuc(page) {
  await page.exposeFunction('_grayData', _grayData)
  await page.exposeFunction('_getVideoCurInfo', _getVideoCurInfo)
}

main().then(data => {
  console.log('最终数据', data); /*！最终数据！*/
})

/**
 *
 * 准确率 容错率
 */
