const CanvasId = 'yyds-canvas'

class HandleCanvas {
  constructor(videoSelector = '') {
    this.selector = videoSelector
    this.canvasEle = null
    this.videoEle = null
    this.viewWidth = 668
    this.viewHeight = 376
    this.hidden = true
  }

  /**
   * 创建Canvas
   * @param id
   * @returns {HTMLCanvasElement}
   */
  initCanvas(id = '') {
    const K = 4
    let canvasEle = document.createElement('canvas')
    canvasEle.id = `${CanvasId}-${id}`
    // canvasEle.style.display = 'none' // TODO:: 不隐藏
    // canvasEle.style.zIndex = '-100'
    canvasEle.style.opacity = '0'
    canvasEle.width = this.viewWidth / K
    canvasEle.height = this.viewHeight / K
    document.body.appendChild(canvasEle)
    return canvasEle
  }

  createNewCanvas() { // 画一幅原始尺寸的画
    let newCanvas = document.getElementById('yyds-origin-canvas')
    if (!newCanvas) {
      newCanvas = document.createElement('canvas')
      newCanvas.id = 'yyds-origin-canvas'
      newCanvas.style.zIndex = '100'
      newCanvas.style.position = 'fixed'
      newCanvas.style.top = '0'
      newCanvas.style.left = '0'
      newCanvas.width = this.viewWidth
      newCanvas.height = this.viewHeight
      newCanvas.style.display = 'block'
      document.body.appendChild(newCanvas)
    }
    newCanvas.style.display = newCanvas.style.display === 'none' ? 'block' : 'none'
    const ctx = newCanvas.getContext('2d')
    ctx.drawImage(this.videoEle, 0, 0, newCanvas.width, newCanvas.height)
  }

  /**
   * draw video into canvas
   * @param canvasEle
   * @param height
   */
  drawVideoImg(canvasEle, height = 0) {
    if (this.videoEle) {
      const ctx = canvasEle.getContext('2d')
      ctx.imageSmoothingEnabled = false // 锐化
      ctx.drawImage(this.videoEle, 0, 0, canvasEle.width, height || canvasEle.height)
    }
  }

  getCanvasImgData(canvasEle) {
    const ctx = canvasEle.getContext('2d')
    ctx.imageSmoothingEnabled = false // 锐化
    let frame = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
    return Array.from(frame.data)
  }

  resetCanvasImgData(imageData, canvasEle) {
    const ctx = canvasEle.getContext('2d')
    ctx.putImageData(imageData, 0, 0);
    const base64Data = canvasEle.toDataURL();
    return base64Data
  }

  /**
   * 将获取的图像数据进行灰度处理，并将接近白色的像素点保留，其余像素转为黑色，然后将处理后的图像数据绘制到画布上
   */
  processImageAndReturnBase64(canvasEle) {
    const ctx = canvasEle.getContext('2d')
    // 获取图像数据
    const imageData = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
    // 将其转换为灰度值
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // 计算灰度值
      const gray = (r + g + b) / 3;

      // 将像素点设置为灰度值
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    // 根据像素的灰度值，将接近白色的像素点保留，其余像素转为黑色
    const threshold = 200; // 灰度阈值，接近白色的阈值

    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i];

      // 根据灰度值判断像素是否接近白色
      if (gray >= threshold) {
        // 保留接近白色的像素点
        data[i] = 255; // 设置红色通道为最大值
        data[i + 1] = 255; // 设置绿色通道为最大值
        data[i + 2] = 255; // 设置蓝色通道为最大值
      } else {
        // 转换为黑色
        data[i] = 0; // 设置红色通道为最小值
        data[i + 1] = 0; // 设置绿色通道为最小值
        data[i + 2] = 0; // 设置蓝色通道为最小值
      }
    }

    // 将处理后的图像数据重新绘制到画布上
    ctx.putImageData(imageData, 0, 0);

    // 获取 Canvas 的 Base64 编码
    return canvasEle.toDataURL();
  }
}

module.exports = {
  HandleCanvas,
};
