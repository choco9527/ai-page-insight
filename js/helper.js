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
  await page.waitForSelector('#bilibili-player');
  await page.evaluate(async () => {
    const videoEl = document.querySelector('#bilibili-player video');
    videoEl.pause()
    console.log('先暂停')
    videoEl.currentTime = 0
    console.log('重置视频')
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
 * 获取视频页面
 * @returns {Promise<XPathResult>}
 * @private
 */
async function _getVideoData({page, currentTime, tHeight = 80}) {
  console.log('读取视频当前数据')
  await page.waitForSelector('#bilibili-player');
  console.log('视频加载成功')

  const videoData = await page.evaluate(async (currentTime, tHeight) => {
    const CanvasId = 'yyds-canvas'

    function HandleCanvas({videoSelector = '', tHeight}) {
      let videoEle = null;
      let viewWidth = 668;
      let viewHeight = 376;
      let selector = videoSelector;
      const textHeight = tHeight || 80
      const footerHeight = 30
      const paddingWidth = 100
      fresh();

      function initCanvas({id = '', height, width}) {
        const K = 1;
        const canvasEle = document.createElement('canvas');
        canvasEle.id = `${CanvasId}-${id}`;
        canvasEle.style.zIndex = '1100';
        canvasEle.style.opacity = '1';
        canvasEle.style.position = 'fixed';
        canvasEle.style.top = '0';
        canvasEle.style.left = '0';
        canvasEle.width = width / K;
        canvasEle.height = height / K;
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

      function drawVideoImg({id = ''}) {
        const cWidth = viewWidth - 2 * paddingWidth
        const cHeight = textHeight - footerHeight
        const canvasEle = initCanvas({id, height: cHeight, width: cWidth})

        fresh();
        if (videoEle) {
          const ctx = canvasEle.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(videoEle, paddingWidth, (viewHeight - textHeight), cWidth, cHeight, 0, 0, cWidth, cHeight);
        }
        return canvasEle
      }

      function processImageAndReturnBase64(canvasEle) {
        const ctx = canvasEle.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
        // imageData.data = window._grayData(imageData.data) // TODO::

        ctx.putImageData(imageData, 0, 0);
        return canvasEle.toDataURL();
      }

      /**
       *  获取当前视频信息
       * @param currentTime
       * @returns {Promise<unknown>}
       * @private
       */
      function _getVideoCurInfo(currentTime = 0) {
        return new Promise((resolve, reject) => {
          const timeElement = document.querySelector('#bilibili-player .bpx-player-ctrl-time-current');
          const videoEl = videoEle
          videoEl.pause(); // 暂停
          videoEl.currentTime = currentTime; // 设置视频时间

          const tId = Date.now()
          const canEl = drawVideoImg({id: tId})
          const item = {
            base64Img: null,
            videoTime: '',
            id: tId,
            currentTime,
            duration: videoEl.duration
          }
          videoEl.addEventListener('canplaythrough', async () => {
            console.log('视频缓冲完毕，可以播放');
            await window.sleep(200)
            videoEl.pause(); // 暂停
            const base64Img = processImageAndReturnBase64(canEl)
            item.base64Img = base64Img
            item.videoTime = timeElement ? timeElement.textContent : '';
            resolve(item)
          });
          videoEl.play(); // 继续播放
        })
      }

      return {
        initCanvas,
        createNewCanvas,
        drawVideoImg,
        processImageAndReturnBase64,
        _getVideoCurInfo,
        videoEle
      };
    }

    const $canvas = new HandleCanvas({
      videoSelector: '#bilibili-player video',
      tHeight
    });
    window.$canvas = $canvas

    return Promise.resolve(await $canvas._getVideoCurInfo(currentTime))
  }, currentTime, tHeight);
  return videoData
}

module.exports = {
  _grayData,
  _getVideoData,
  _initVideo
};
