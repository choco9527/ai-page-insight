/**
 * 灰化突出字幕内容
 * @param data
 * @returns {*}
 * @private
 */
const _grayData = data => {
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
  return data
}
/**
 * 初始化视频
 * @param page
 * @returns {Promise<void>}
 * @private
 */
const _initVideo = async (page) => {
  await page.waitForSelector('#bilibili-player video');
  await page.evaluate(async () => {
    const videoEl = document.querySelector('#bilibili-player video');
    videoEl.pause() // 先暂停
    videoEl.currentTime = 0;
    const res = {
      duration: 0
    }
    if (videoEl) {
      res.duration = videoEl.duration
    }
    return res
  })
}

/**
 * 获取当前视频信息
 * @param $canvas
 * @returns {{duration: *, base64Img: null, videoTime: string|string, id: number}}
 * @private
 */
const _getVideoCurInfo = ($canvas = null) => {
  const timeElement = document.querySelector('#bilibili-player .bpx-player-ctrl-time-current');
  const videoEl = document.querySelector('#bilibili-player video');
  const videoTime = timeElement ? timeElement.textContent : '';

  const tId = Date.now()
  const item = {
    base64Img: null,
    videoTime,
    id: tId,
    duration: videoEl.duration
  }
  if ($canvas) {
    const canEl = $canvas.drawVideoImg({id: tId})
    const base64Img = $canvas.processImageAndReturnBase64(canEl)
    item.base64Img = base64Img
  }
  console.log('_getVideoCurInfo', item)
  return item
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
        imageData.data = window._grayData(imageData.data)

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

    return Promise.resolve(window._getVideoCurInfo($canvas))
  });
  return videoData
}

module.exports = {
  _grayData,
  _getVideoData,
  _getVideoCurInfo,
  _initVideo
};
