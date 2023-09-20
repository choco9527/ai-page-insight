const puppeteer = require('puppeteer-core');
const {getTextByOcr, getTextByOcrSingle, sleep} = require('./js/common');
const {HandleCanvas} = require('./js/helper')

async function openBrowser() {
  console.log('正在启动 Chrome')

  const options = {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // 使用默认的浏览器执行路径
    headless: false, // 无头模式
    args: [
      "--window-position=0,0",
      `--window-size=1280,800`,
      '–enable-gpu', // GPU硬件加速
      // '–disable-dev-shm-usage', // 创建临时文件共享内存
      // '–disable-setuid-sandbox', // uid沙盒
      // '–no-first-run', // 没有设置首页。在启动的时候，就会打开一个空白页面。
      // '–no-sandbox', // 沙盒模式
      // '–no-zygote',
      // '–single-process' // 单进程运行
    ],
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

const main = async function () {
  // 最终需要的数据集合
  const dataMap = {}
  const {page, browser} = await openBrowser() // 打开浏览器
  try {
    await _openPage(page) // 打开页面
    await sleep(2000);
    const videoData = await _getVideoData(page)
    console.log(videoData);
    // await getTextByOcrSingle(base64Img)

    return dataMap
  } catch (e) {
    console.warn(e);
    // await browser.close();
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
    'https://www.bilibili.com/video/BV1zm4y1N7zp/?spm_id_from=333.337.search-card.all.click' //
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
  console.log('读取视频当前数据')
  await page.waitForSelector('.bpx-player-video-wrap');
  console.log('视频加载成功')

  const videoData = await page.evaluate(async () => {
    const CanvasId = 'yyds-canvas'

    function HandleCanvas(videoSelector = '') {
      let videoEle = null;
      let viewWidth = 668;
      let viewHeight = 376;
      let selector = videoSelector;
      const footerHeight = 50
      const paddingWidth = 100

      function initCanvas({id = '', height = 0, width = 0}) {
        const K = 1;
        const canvasEle = document.createElement('canvas');
        canvasEle.id = `${CanvasId}-${id}`;
        canvasEle.style.zIndex = '1100';
        canvasEle.style.opacity = '1';
        canvasEle.style.position = 'fixed';
        canvasEle.style.top = '0';
        canvasEle.style.left = '0';

        canvasEle.width = width / K;
        canvasEle.height = height ? (height / K) : ((viewHeight - footerHeight) / K);
        document.body.appendChild(canvasEle);
        return canvasEle;
      }

      function createNewCanvas() {
        let newCanvas = document.getElementById('yyds-origin-canvas');
        if (!newCanvas) {
          newCanvas = document.createElement('canvas');
          newCanvas.id = 'yyds-origin-canvas';
          newCanvas.style.zIndex = '100';
          newCanvas.style.position = 'fixed';
          newCanvas.style.top = '0';
          newCanvas.style.left = '0';
          newCanvas.width = viewWidth;
          newCanvas.height = viewHeight;
          newCanvas.style.display = 'block';
          document.body.appendChild(newCanvas);
        }
        newCanvas.style.display = newCanvas.style.display === 'none' ? 'block' : 'none';
        const ctx = newCanvas.getContext('2d');
        ctx.drawImage(videoEle, 0, 0, newCanvas.width - 2 * paddingWidth, newCanvas.height);
      }

      function fresh() {
        if (!videoEle) {
          videoEle = document.querySelector(selector ? selector : 'video');
          return videoEle;
        }
      }

      function drawVideoImg({height = 80, id = ''}) {
        const cWidth = viewWidth - 2 * paddingWidth
        const cHeight = height - footerHeight
        const canvasEle = this.initCanvas({id, height: cHeight, width: cWidth})

        fresh();
        if (videoEle) {
          const ctx = canvasEle.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(videoEle, paddingWidth, (viewHeight - height), cWidth, cHeight, 0, 0, cWidth, cHeight);
        }
        return canvasEle
      }

      function processImageAndReturnBase64(canvasEle) {
        const ctx = canvasEle.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
        const data = imageData.data;
        const threshold = 200;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const gray = (r + g + b) / 3;
          let color = 255
          if ((gray < threshold) || [r, g, b].some(val => val < 195)) {
            color = 0
          }
          data[i] = color;
          data[i + 1] = color;
          data[i + 2] = color;
        }

        ctx.putImageData(imageData, 0, 0);
        return canvasEle.toDataURL();
      }

      return {
        initCanvas,
        createNewCanvas,
        drawVideoImg,
        processImageAndReturnBase64
      };
    }

    const $canvas = new HandleCanvas();

    // 直接读取视频内容
    const getInfo = () => {
      const timeElement = document.querySelector('#bilibili-player .bpx-player-ctrl-time-current');
      const videoTime = timeElement ? timeElement.textContent : '';
      const tId = Date.now()
      const canEl = $canvas.drawVideoImg({id: tId})
      const base64Img = $canvas.processImageAndReturnBase64(canEl)
      const item = {
        base64Img,
        videoTime,
        id: tId,
      }
      console.log('读取', item)
      return item
    }

    return Promise.resolve(getInfo())
  });
  return videoData
}

main().then(data => {
  console.log('最终数据', data); /*！最终数据！*/
})

/**
 *
 * 准确率 容错率
 */
