// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');
const {sleep, concatenateImagesWithOrderText} = require('./common');
const {getTextByOcrSingle, concatenateImages} = require('./tesseractOcr');
const {launchConfig, cookiesArray} = require('./constans');
const {_initVideo, _getVideoData} = require('./helper')

const aiPageHandler = async function (
  {
    captionHeight = 60,
    outputFilePath
  }) {

  const dataMap = {}
  try {
    const {page, browser} = await openBrowser() // 打开浏览器
    await _openPage(page) // 打开页面
    console.log('--sleeping--')
    await sleep(5000);
    console.log('--loading--')
    await sleep(5000);
    await injectWindowFuc(page)
    console.log('--init start--')
    const {duration} = await _initVideo(page)
    console.log('--init end--')
    console.log(`视频时长共${duration}秒`)

    const videoInfoArr = [];
    for (let i = 1; i < 20; i += 1.5) { // TODO::
      // return {base64Img, videoTime, currentTime, id}
      const item = await _getVideoData({
        page,
        currentTime: i,
        tHeight: captionHeight
      })
      videoInfoArr.push({
        ...item,
        cur: i
      })
    }
    await sleep(1000);

    // 合并图片
    const base64Images = videoInfoArr.map(item => item.base64Img)
    await concatenateImagesWithOrderText(base64Images, outputFilePath);

    // const text = await getTextByOcrSingle(base64)
    // console.log(text);

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
    headless: 'new', // 'new', // 无头模式
    args: launchConfig,
    defaultViewport: {width: 1280, height: 800},
    // devtools: true,
    // ignoreDefaultArgs: ["--enable-automation"]
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
 * @param page
 * @returns {Promise<void>}
 */
async function _openPage(page) {
  const urls = [
    // 'https://www.baidu.com/',
    'https://www.bilibili.com/video/BV1Nu411w7DL/?spm_id_from=333.1007.tianma.1-1-1.click',
    'https://www.bilibili.com/video/BV1zm4y1N7zp/?spm_id_from=333.337.search-card.all.click' //
  ]
  const url = urls[0]
  // await p.setBypassCSP(true)
  await page.goto(url);
  await page.setCookie(...cookiesArray);
}

/**
 * 注入页面方法
 * @returns {Promise<void>}
 */
async function injectWindowFuc(page) {
  await page.exposeFunction('sleep', sleep)
}

module.exports = {
  aiPageHandler
}
