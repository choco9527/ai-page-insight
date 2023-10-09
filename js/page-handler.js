// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');
const {sleep, concatenateImagesWithOrderText, saveJSONToFile} = require('./common');
const {getTextByOcrSingle, concatenateImages} = require('./tesseract-ocr');
const {launchConfig, cookiesArray} = require('./constans');
const {_initVideo, _getVideoData} = require('./helper')
require('dotenv').config();

const aiPageHandler = async function (
  {
    captionHeight = 100, // 字幕高度
    pageUrl = '', // 视频地址
    headless = true
  }) {
  const videoInfoArr = [];

  try {
    console.time('启动总耗时');
    const {page} = await openBrowser({headless}) // 打开浏览器
    await _openPage(page, pageUrl) // 打开页面
    await sleep(1000);
    console.log('--loading--')
    await sleep(1000);
    await injectWindowFuc(page)
    console.log('--init start--')
    const {duration} = await _initVideo(page)
    console.log('--init end--')
    console.timeEnd('启动总耗时');
    console.log(`视频时长共${duration}秒`)

    for (let i = 1; i < duration; i += 1.5) { // TODO::测试30秒
      // return {captionImg, videoImage, videoTime, currentTime, id}
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

    // const text = await getTextByOcrSingle(base64)
    // console.log(text);

    return videoInfoArr
  } catch (e) {
    console.warn(e);
    // await browser.close();
    return videoInfoArr
  }
};

async function openBrowser({headless = true} = {}) {
  console.log('正在启动 Chrome')

  const options = {
    headless: headless ? 'new' : false,// 无头模式
    args: launchConfig,
    defaultViewport: {width: 1280, height: 800},
    timeout: 60000,
    // devtools: true,
    ignoreDefaultArgs: ["--enable-automation"],
    // userDataDir: headless ? undefined : './user-data-cache/path'
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
 * @param pageUrl
 * @returns {Promise<void>}
 */
async function _openPage(page, pageUrl) {
  const urls = [
    'https://www.bilibili.com/video/BV14D4y1M7ub/?spm_id_from=333.788.recommend_more_video.-1&vd_source=f4666564bd398823589647df2a108413',
    'https://www.bilibili.com/video/BV1Nu411w7DL/?spm_id_from=333.1007.tianma.1-1-1.click',
    'https://www.bilibili.com/video/BV1zm4y1N7zp/?spm_id_from=333.337.search-card.all.click' //
  ]
  const url = pageUrl ? pageUrl : urls[0]
  // await p.setBypassCSP(true)
  await page.goto(url, {timeout: 90000});
  await page.setCookie(...cookiesArray);
}

/**
 * 注入页面方法
 * @returns {Promise<void>}
 */
async function injectWindowFuc(page) {
  await page.exposeFunction('sleep', sleep)
  // await page.exposeFunction('processImageData', processImageData)
}

module.exports = {
  aiPageHandler
}
