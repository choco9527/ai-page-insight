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
        canvasEle.style.zIndex = hide ? '-1' : '1100';
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
        ctx.willReadFrequently = true;
        const imageData = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);

        const _grayData = data => { // 全局二值化
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

        function processImageData(imageData, blockSize = 8, highThreshold = 130, lowThreshold = 90) {
          const width = imageData.width; // 26
          const height = imageData.height; // 26
          const data = imageData.data;
          const blocksPerRow = Math.floor(width / blockSize); // 26/5 = 5
          const blocksPerColumn = Math.floor(height / blockSize); // 26/5 = 5

          const blocks = [];

          for (let blockY = 0; blockY < blocksPerColumn; blockY++) {
            for (let blockX = 0; blockX < blocksPerRow; blockX++) {
              const startX = blockX * blockSize;
              const startY = blockY * blockSize;
              const endX = Math.min(startX + blockSize, width); // 确保不超出图像边界
              const endY = Math.min(startY + blockSize, height); // 确保不超出图像边界

              const block = [];

              for (let y = startY; y < endY; y++) {
                for (let x = startX; x < endX; x++) {
                  const pixelOffset = (y * width + x) * 4;
                  const pixel = {
                    r: data[pixelOffset],
                    g: data[pixelOffset + 1],
                    b: data[pixelOffset + 2]
                  };
                  block.push(pixel);
                }
              }

              blocks.push(block);
            }
          }

          function checkTwoValuesGreaterThan(array) {
            return array.filter(value => value > highThreshold).length >= 2;
          }

          function checkTwoValuesSmallerThan(array) {
            return array.filter(value => value < lowThreshold).length >= 2;
          }

          // 对每个矩阵块进行操作
          for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            // 至少有x个像素如此表现——像素中有2个值大于、小于两个阈值
            const filterX = 3
            const hasHighAvg = block.filter(pixel => checkTwoValuesGreaterThan([pixel.r, pixel.g, pixel.b], highThreshold)).length > filterX; //
            const hasLowAvg = block.filter(pixel => checkTwoValuesSmallerThan([pixel.r, pixel.g, pixel.b], lowThreshold)).length > filterX; //

            if (!(hasHighAvg && hasLowAvg)) {
              // 将不满足条件的矩阵块像素设置为白色
              for (let j = 0; j < block.length; j++) {
                const pixel = block[j];
                pixel.r = 255;
                pixel.g = 255;
                pixel.b = 255;
              }
            }
          }

          // 将矩阵块重新合并为一维数组
          let blockIndex = 0;
          for (let blockY = 0; blockY < blocksPerColumn; blockY++) {
            for (let blockX = 0; blockX < blocksPerRow; blockX++) {
              const startX = blockX * blockSize;
              const startY = blockY * blockSize;
              const endX = Math.min(startX + blockSize, width);
              const endY = Math.min(startY + blockSize, height);

              const block = blocks[blockIndex];
              let pixelIndex = (startY * width + startX) * 4;

              for (let y = startY; y < endY; y++) {
                for (let x = startX; x < endX; x++) {
                  const pixel = block[(y - startY) * blockSize + (x - startX)];
                  data[pixelIndex] = pixel.r;
                  data[pixelIndex + 1] = pixel.g;
                  data[pixelIndex + 2] = pixel.b;
                  pixelIndex += 4;
                }
                pixelIndex += (width - endX + startX) * 4;
              }

              blockIndex++;
            }
          }
          imageData.data = [...data];
          return imageData;
        }

        if (gray) {
          // _grayData(imageData.data)
          // processImageData(imageData)
          const newData = await window.processImageData({
            data: await window.deepClone(imageData.data),
            width: imageData.width,
            height: imageData.height,
          })
          imageData.data = newData
        }

        console.log('输出imageData')
        ctx.putImageData(imageData, 0, 0);

        if (scaleRatio > 1) { // 清晰化图像
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

          function enhanceImage(canvas) {
            const ctx = canvas.getContext('2d');

            // 获取图像数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 应用图像清晰化算法
            // 这里使用一个简单的锐化滤波器作为示例
            const filterMatrix = [
              0, -1, 0,
              -1, 5, -1,
              0, -1, 0
            ];
            applyConvolutionFilter(imageData, filterMatrix);

            // 将处理后的图像数据绘制回 Canvas
            ctx.putImageData(imageData, 0, 0);
            return canvas
          }

          // 应用卷积滤波器
          function applyConvolutionFilter(imageData, filterMatrix) {
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            const filterSize = Math.sqrt(filterMatrix.length);
            const halfFilterSize = Math.floor(filterSize / 2);

            const tempData = new Uint8ClampedArray(data.length);

            for (let i = 0; i < height; i++) {
              for (let j = 0; j < width; j++) {
                const pixelIndex = (i * width + j) * 4;
                let r = 0, g = 0, b = 0;

                for (let k = 0; k < filterSize; k++) {
                  for (let l = 0; l < filterSize; l++) {
                    const rowIndex = i + k - halfFilterSize;
                    const colIndex = j + l - halfFilterSize;

                    if (rowIndex >= 0 && rowIndex < height && colIndex >= 0 && colIndex < width) {
                      const neighborPixelIndex = (rowIndex * width + colIndex) * 4;
                      const filterValue = filterMatrix[k * filterSize + l];

                      r += data[neighborPixelIndex] * filterValue;
                      g += data[neighborPixelIndex + 1] * filterValue;
                      b += data[neighborPixelIndex + 2] * filterValue;
                    }
                  }
                }

                tempData[pixelIndex] = r;
                tempData[pixelIndex + 1] = g;
                tempData[pixelIndex + 2] = b;
                tempData[pixelIndex + 3] = data[pixelIndex + 3];
              }
            }

            for (let i = 0; i < data.length; i++) {
              data[i] = tempData[i];
            }
          }

          // 清晰化图像
          const scaledCanvas = enhanceImage(canvasEle)
          return scaledCanvas.toDataURL();
        } else {
          return canvasEle.toDataURL();
        }
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
            videoTime: '', // 视频当前时间 02:11
            currentTime, // 当前秒 230
            id: tId,
          }
          const handleCanPlayThrough = async () => {
            console.log('视频缓冲完毕，可以播放');
            videoEl.pause(); // 暂停
            const captionCanvasEl = drawCaptionImg({id: tId})
            const videoCanvasEl = drawVideoImg()
            item.captionImg = await processImageAndReturnBase64(captionCanvasEl, {gray: true, scaleRatio: 1})
            item.videoImage = await processImageAndReturnBase64(videoCanvasEl)
            item.videoTime = timeElement ? timeElement.textContent : '';
            videoEl.removeEventListener('canplaythrough', handleCanPlayThrough);
            resolve(item)
          }
          videoEl.addEventListener('canplaythrough', handleCanPlayThrough);
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

    // $canvas._getVideoCurInfo(2)
    window.$canvas = $canvas
    return Promise.resolve(await $canvas._getVideoCurInfo(currentTime))
  }, currentTime, tHeight);

  return videoData
}

module.exports = {
  _getVideoData,
  _initVideo,
};
