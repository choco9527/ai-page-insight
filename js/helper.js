/**
 * 初始化视频
 * @param page
 * @returns {Promise<void>}
 * @private
 */
const _initVideo = async (page) => {
  await page.waitForSelector('#bilibili-player video');
  return page.evaluate(async () => {
    const videoEl = document.querySelector('#bilibili-player video');
    videoEl.pause()
    console.log('先暂停')
    videoEl.currentTime = 0
    console.log('重置视频')
    const res = {
      duration: 0 // 视频总长度
    }
    if (videoEl) {
      res.duration = videoEl.duration
    }
    return res
  });
}


/**
 * 获取视频页面
 * @returns {Promise<{base64Img, videoTime, currentTime, id}>}
 * @private
 */
async function _getVideoData({page, currentTime, tHeight = 80}) {
  console.log('读取视频当前数据' + currentTime)
  await page.waitForSelector('#bilibili-player');

  const videoData = await page.evaluate(async (currentTime, tHeight) => {

    function HandleCanvas({videoSelector = '', tHeight}) {
      const CanvasId = 'yyds-canvas'

      let videoEle = null;
      let viewWidth = 668;
      let viewHeight = 376;
      let selector = videoSelector;
      const textHeight = tHeight || 80
      const footerHeight = 30
      const paddingWidth = 50
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

      function fresh() {
        if (!videoEle) {
          videoEle = document.querySelector(selector ? selector : 'video');
          return videoEle;
        }
      }

      function drawCaptionImg({id = ''}) {
        // 画出字幕
        const cWidth = viewWidth - 2 * paddingWidth
        const cHeight = textHeight - footerHeight
        const cElWidth = cWidth * 2
        const cElHeight = cHeight * 2
        const canvasEle = initCanvas({id, width: cElWidth, height: cElHeight})

        fresh();
        if (videoEle) {
          const ctx = canvasEle.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(videoEle, paddingWidth, (viewHeight - textHeight), cWidth, cHeight, 0, 0, cElWidth, cElHeight);
        }
        return canvasEle
      }

      function drawVideoImg() {
        // 画出原图
        const canvasEle = initCanvas({id: 'ori-canvas-video', width: viewWidth, height: viewHeight})
        fresh();
        if (videoEle) {
          const ctx = canvasEle.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(videoEle, 0, 0, viewWidth, viewHeight, 0, 0, viewWidth, viewHeight);
        }
        return canvasEle
      }

      async function processImageAndReturnBase64(canvasEle, {gray = true, scaleRatio = 1} = {}) {
        const ctx = canvasEle.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
        const _grayData = data => { // 二值化
          function calculateVariance(array) { // 计算方差 TODO::
            // 计算数组的平均值
            const mean = array.reduce((sum, value) => sum + value, 0) / array.length;
            // 计算差异的平方
            const squaredDifferences = array.map(value => Math.pow(value - mean, 2));
            // 计算平方差异的平均值
            const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / array.length;
            return variance;
          }

          const threshold = 170;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = (r + g + b) / 3;
            let color = 255
            if ([r, g, b].every(val => (val > threshold))) {
              color = 0
            }
            data[i] = color;
            data[i + 1] = color;
            data[i + 2] = color;
          }
          return data
        }
        if (gray) {
          _grayData(imageData.data)
        }
        console.log('输出imageData')
        ctx.putImageData(imageData, 0, 0);

        function scaleImage(canvas, scale) {
          const context = canvas.getContext('2d');
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const width = imageData.width;
          const height = imageData.height;

          // 创建放大后的 canvas 元素
          const scaledCanvas = document.createElement('canvas');
          const scaledContext = scaledCanvas.getContext('2d');

          // 设置放大后的 canvas 尺寸
          scaledCanvas.width = width * scale;
          scaledCanvas.height = height * scale;

          // 放大图像像素点
          const scaledImageData = scaledContext.createImageData(width * scale, height * scale);
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const sourceIndex = (y * width + x) * 4;
              const targetIndex = (y * scale * width * scale + x * scale) * 4;

              for (let j = 0; j < scale; j++) {
                for (let i = 0; i < scale; i++) {
                  const targetPixelIndex = (targetIndex + j * width * 4 * scale + i * 4);
                  scaledImageData.data.set(imageData.data.slice(sourceIndex, sourceIndex + 4), targetPixelIndex);
                }
              }
            }
          }

          // 在放大后的 canvas 上绘制放大后的图像数据
          scaledContext.putImageData(scaledImageData, 0, 0);

          // 获取放大后的图像数据的 Base64 字符串
          return scaledCanvas
        }

        // 放大图片
        const scaledCanvas = scaleImage(canvasEle, scaleRatio)
        return scaledCanvas.toDataURL();
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
          videoEl.currentTime = currentTime; // 设置视频时间

          const tId = Date.now()
          const item = {
            base64Img: null, // 字幕图像
            videoImage: '', // 当前视频画面
            videoTime: '', // 视频当前时间
            currentTime, // 当前秒
            id: tId,
          }
          videoEl.addEventListener('canplaythrough', async () => {
            console.log('视频缓冲完毕，可以播放');
            videoEl.pause(); // 暂停
            await window.sleep(100)
            const canEl = drawCaptionImg({id: tId})
            const videoCanEl = drawVideoImg()

            item.base64Img = await processImageAndReturnBase64(canEl, {scaleRatio: 2})
            item.videoImage = await processImageAndReturnBase64(videoCanEl, {gray: false})
            item.videoTime = timeElement ? timeElement.textContent : '';
            resolve(item)
          });
          // videoEl.play(); // 继续播放
        })
      }

      return {
        initCanvas,
        drawCaptionImg,
        processImageAndReturnBase64,
        _getVideoCurInfo,
        videoEle
      };
    }

    const $canvas = new HandleCanvas({
      videoSelector: '#bilibili-player video',
      tHeight
    });
    // $canvas._getVideoCurInfo(60)
    window.$canvas = $canvas
    return Promise.resolve(await $canvas._getVideoCurInfo(currentTime))
  }, currentTime, tHeight);

  return videoData
}

module.exports = {
  _getVideoData,
  _initVideo,
};
