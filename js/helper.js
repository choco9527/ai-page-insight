/**
 * 初始化视频
 * @param page
 * @returns {Promise<void>}
 * @private
 */
const _initVideo = async (page) => {
  await page.waitForSelector('#bilibili-player video', {timeout: 60000});
  await page.click('.bpx-player-ctrl-btn.bpx-player-ctrl-wide');

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
 * @returns {Promise<{captionImg, videoTime, currentTime, id}>}
 * @private
 */
async function _getVideoData({page, currentTime, tHeight = 80}) {
  console.log('读取视频当前数据' + currentTime)
  await page.waitForSelector('#bilibili-player');

  const videoData = await page.evaluate(async (currentTime, tHeight) => {


    function HandleCanvas({videoSelector = '', tHeight}) {
      const CanvasId = 'yyds-canvas'

      let videoEle = null;
      let viewWidth = 923 // 668;
      let viewHeight = 516 // 376;
      let selector = videoSelector;
      const textHeight = tHeight || 100
      const footerHeight = 180
      const paddingWidth = 80
      fresh();

      function initCanvas({id = '', width, height, hide = false}) {
        const K = 1;
        const canvasEle = document.createElement('canvas');
        canvasEle.id = `${CanvasId}-${id}`;
        canvasEle.style.zIndex = '1100';
        canvasEle.style.opacity = hide ? 0 : '1';
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
        const canvasEle = initCanvas({id: 'ori-canvas-video', width: viewWidth, height: viewHeight, hide: true})
        fresh();
        if (videoEle) {
          const ctx = canvasEle.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(videoEle, 0, 0, viewWidth, viewHeight, 0, 0, viewWidth, viewHeight);
        }
        return canvasEle
      }

      async function processImageAndReturnBase64(canvasEle, {gray = false, scaleRatio = 1} = {}) {
        const ctx = canvasEle.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
        const _grayData = data => { // 二值化
          function calculateVariance(array) { // 计算方差
            // 计算数组的平均值
            const mean = array.reduce((sum, value) => sum + value, 0) / array.length;
            // 计算差异的平方
            const squaredDifferences = array.map(value => Math.pow(value - mean, 2));
            // 计算平方差异的平均值
            const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / array.length;
            return variance;
          }

          const threshold = 190;

          function checkTwoValuesGreaterThan(array, threshold2 = 205) {
            return array.filter(value => value > threshold2).length >= 2;
          }

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = (r + g + b) / 3;
            let color = 255

            // 都大于阈值 && 方差小于10
            if (
              // gray > threshold &&
              [r, g, b].every(val => (val > threshold))
              && checkTwoValuesGreaterThan([r, g, b])
            ) {
              color = 0
            }
            data[i] = color;
            data[i + 1] = color;
            data[i + 2] = color;
          }
          return data
        }

        function getThresholdingImageData() {
          function processImage(imageData, matrixSize = 9, highThreshold = 200, lowThreshold = 50) {
            const processedImageData = processImageData(imageData, matrixSize, highThreshold, lowThreshold);
            return processedImageData;
          }

          function processImageData(imageData, matrixSize, highThreshold, lowThreshold) {
            const width = imageData.width;
            const height = imageData.height;
            const data = imageData.data;
            const halfSize = Math.floor(matrixSize / 2);

            // 遍历每个像素
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const pixelIndex = (y * width + x) * 4;
                const pixelMatrix = getPixelMatrix(x, y, width, height, data, matrixSize);

                // 判断像素矩阵是否可信
                if (isPixelMatrixTrusted(pixelMatrix, highThreshold, lowThreshold)) {
                  // 像素矩阵可信，不做处理
                  continue;
                } else {
                  // 像素矩阵不可信，将所有像素设为白色
                  for (let i = 0; i < matrixSize * matrixSize; i++) {
                    const pixelOffset = pixelIndex + i * 4;
                    data[pixelOffset] = 255;     // 设置红色通道为 255（白色）
                    data[pixelOffset + 1] = 255; // 设置绿色通道为 255（白色）
                    data[pixelOffset + 2] = 255; // 设置蓝色通道为 255（白色）
                  }
                }
              }
            }

            return imageData;
          }

          function getPixelMatrix(x, y, width, height, data, matrixSize) {
            const pixelMatrix = [];

            // 遍历像素矩阵
            for (let j = y - halfSize; j <= y + halfSize; j++) {
              for (let i = x - halfSize; i <= x + halfSize; i++) {
                const pixelOffset = (clamp(j, 0, height - 1) * width + clamp(i, 0, width - 1)) * 4;
                const pixel = {
                  r: data[pixelOffset],
                  g: data[pixelOffset + 1],
                  b: data[pixelOffset + 2]
                };
                pixelMatrix.push(pixel);
              }
            }

            return pixelMatrix;
          }

          function isPixelMatrixTrusted(pixelMatrix, highThreshold, lowThreshold) {
            let hasHighAvg = false;
            let hasLowAvg = false;

            // 计算像素矩阵的 RGB 均值
            const avgR = getAverageValue(pixelMatrix, 'r');
            const avgG = getAverageValue(pixelMatrix, 'g');
            const avgB = getAverageValue(pixelMatrix, 'b');

            // 判断均值是否满足条件
            if (avgR > highThreshold && avgG > highThreshold && avgB > highThreshold) {
              hasHighAvg = true;
            }
            if (avgR < lowThreshold && avgG < lowThreshold && avgB < lowThreshold) {
              hasLowAvg = true;
            }

            return hasHighAvg && hasLowAvg;
          }

          function getAverageValue(pixelMatrix, channel) {
            let sum = 0;

            for (let i = 0; i < pixelMatrix.length; i++) {
              sum += pixelMatrix[i][channel];
            }

            return sum / pixelMatrix.length;
          }

          function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
          }
          return {
            processImage
          }
        }

        const {processImage} = getThresholdingImageData()

        if (gray) {
          // _grayData(imageData.data)
          processImage(imageData)
        }

        console.log('输出imageData')
        ctx.putImageData(imageData, 0, 0);

        function scaleImage(canvas, scale) {
          const context = canvas.getContext('2d');
          const {width, height} = canvas;
          const imageData = context.getImageData(0, 0, width, height);

          const scaledCanvas = document.createElement('canvas');
          const scaledContext = scaledCanvas.getContext('2d');
          scaledCanvas.width = width * scale;
          scaledCanvas.height = height * scale;

          const scaledImageData = scaledContext.createImageData(width * scale, height * scale);
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const sourceIndex = (y * width + x) * 4;

              for (let j = 0; j < scale; j++) {
                for (let i = 0; i < scale; i++) {
                  const targetIndex = ((y * scale + j) * width * scale + (x * scale + i)) * 4;
                  scaledImageData.data.set(imageData.data.subarray(sourceIndex, sourceIndex + 4), targetIndex);
                }
              }
            }
          }
          scaledContext.putImageData(scaledImageData, 0, 0);
          return scaledCanvas;
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
            captionImg: null, // 字幕图像
            videoImage: '', // 当前视频画面
            videoTime: '', // 视频当前时间
            currentTime, // 当前秒
            id: tId,
          }
          videoEl.addEventListener('canplaythrough', async () => {
            console.log('视频缓冲完毕，可以播放');
            videoEl.pause(); // 暂停
            await window.sleep(100)
            const captionCanvasEl = drawCaptionImg({id: tId})
            const videoCanvasEl = drawVideoImg()
            item.captionImg = await processImageAndReturnBase64(captionCanvasEl, {gray: true})
            item.videoImage = await processImageAndReturnBase64(videoCanvasEl)
            item.videoTime = timeElement ? timeElement.textContent : '';
            resolve(item)
          });
          // videoEl.play(); // 继续播放
        })
      }

      return {
        initCanvas,
        drawCaptionImg,
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
