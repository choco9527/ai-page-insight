// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');
const {sleep, getTextByOcrSingle, concatenateImages, concatenateImagesWithOrderText} = require('./js/common');
const {launchConfig, cookiesArray} = require('./js/constans');
const {_grayData, _initVideo, _getVideoData} = require('./js/helper')


require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"],
});

const main = async function () {
  // 最终需要的数据集合
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
    console.log(`视频时长${duration}秒`)

    const videoInfoArr = [];
    for (let i = 1; i < 20; i += 2) { // TODO::
      // return {base64Img, videoTime, currentTime, id}
      const item = await _getVideoData({
        page,
        currentTime: i,
        tHeight: 60
      })
      videoInfoArr.push({
        ...item,
        cur: i
      })
    }
    await sleep(2000);

    // const base64 =videoInfoArr
    // const base64 = 'data:image/png;base64,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'

    // 合并图片
    const base64Images = videoInfoArr.map(item => item.base64Img)

    const outputFilePath = 'test_out_put.png';
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
    headless: false, // 无头模式
    args: launchConfig,
    defaultViewport: {width: 1280, height: 800},
    // devtools: true,
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

main().then(data => {
  console.log('最终数据', data); /*！最终数据！*/
})

/**
 *
 * 准确率 容错率
 */
