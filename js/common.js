// const {createScheduler, createWorker} = require('tesseract.js');
const fs = require('fs');
const {createWorker, createScheduler} = require('tesseract.js');
const {tesseractWorkerConfig, supportLang} = require('./constans');
const path = require('path');
const Jimp = require('jimp');

function sleep(ms = 0) {
  return new Promise(resolve => {
    const t = setTimeout(() => {
      resolve()
      clearTimeout(t)
    }, ms)
  })
}

function randomNumber(min = 0, max = 0, Int = true) // random Int / Float
{
  return Int ? Math.floor(Math.random() * (max - min + 1) + min) :
    Math.random() * (max - min) + min
}

/**
 * 通过 tesseract 进行ocr识别文字
 * @returns {Promise<string>}
 */

async function getTextByOcrSingle(img) {
  const worker = await createWorker(tesseractWorkerConfig);

  await (async () => {
    await worker.loadLanguage(supportLang.zh);
    await worker.initialize(supportLang.zh);

    const {data: {text}} = await worker.recognize(img);
    console.log('----文本----', text);
    await worker.terminate();
    return text
  })();
}

async function getTextByOcr(imgArr = []) {
  const scheduler = await createScheduler();

  // Creates worker and adds to scheduler
  const workerGen = async () => {
    const worker = await createWorker(tesseractWorkerConfig);
    await worker.loadLanguage(supportLang.zh);
    await worker.initialize(supportLang.zh);
    scheduler.addWorker(worker);
  }

  const workerN = 4; // 创建4个线程并行翻译
  await (async () => {
    const resArr = Array(workerN);
    for (let i = 0; i < workerN; i++) {
      resArr[i] = workerGen();
    }
    await Promise.all(resArr);
    /** Add 4 recognition jobs */
    const results = await Promise.all(imgArr.map(async imgName => {
      const imagePath = path.join(__dirname, '..', 'images', imgName)
      const {data: {text}} = scheduler.addJob('recognize', imagePath)
      return text
    }))
    await scheduler.terminate(); // It also terminates all workers.
  })();
}


function concatenateImages(base64Images, outputFilePath) {
  const tempImagePaths = [];

  // 保存每个 Base64 图像数据为临时文件
  base64Images.forEach((base64Image, index) => {
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const tempImagePath = `temp_image_${index}.png`;

    fs.writeFileSync(tempImagePath, imageData, { encoding: 'base64' });

    tempImagePaths.push(tempImagePath);
  });

  // 创建一个空的 Jimp 图像数组
  const images = [];

  // 读取每个图像并添加到数组中
  Promise.all(
    tempImagePaths.map((imagePath) => Jimp.read(imagePath))
  )
    .then((results) => {
      results.forEach((image) => {
        images.push(image);
      });

      // 计算拼接后图像的宽度和高度
      const maxWidth = Math.max(...images.map((image) => image.getWidth()));
      const totalHeight = images.reduce((sum, image) => sum + image.getHeight(), 0);

      // 创建一个新的 Jimp 图像来容纳拼接后的图像
      const concatenatedImage = new Jimp(maxWidth, totalHeight);

      // 在拼接图像中逐行绘制每个图像
      let offsetY = 0;
      images.forEach((image) => {
        concatenatedImage.blit(image, 0, offsetY);
        offsetY += image.getHeight();
      });

      // 将拼接后的图像保存为文件
      concatenatedImage.write(outputFilePath, (err) => {
        if (err) {
          console.error('Error writing the concatenated image:', err);
        } else {
          console.log('Concatenated image saved successfully.');
        }

        // 删除临时文件
        tempImagePaths.forEach((tempImagePath) => {
          fs.unlinkSync(tempImagePath);
        });
      });
    })
    .catch((err) => {
      console.error('Error reading images:', err);

      // 删除临时文件（如果出现错误）
      tempImagePaths.forEach((tempImagePath) => {
        fs.unlinkSync(tempImagePath);
      });
    });
}


function concatenateImagesWithOrderText(base64Images, outputFilePath) {
  const tempImagePaths = [];

  // 保存每个 Base64 图像数据为临时文件
  base64Images.forEach((base64Image, index) => {
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const tempImagePath = `temp_image_${index}.png`;

    fs.writeFileSync(tempImagePath, imageData, { encoding: 'base64' });

    tempImagePaths.push(tempImagePath);
  });

  // 创建一个空的 Jimp 图像数组
  const images = [];

  // 读取每个图像并添加到数组中
  Promise.all(
    tempImagePaths.map((imagePath) => Jimp.read(imagePath))
  )
    .then((results) => {
      results.forEach((image) => {
        images.push(image);
      });

      // 计算拼接后图像的宽度和高度
      const maxWidth = Math.max(...images.map((image) => image.getWidth()));
      const totalHeight = images.reduce((sum, image) => sum + image.getHeight(), 0);

      // 创建一个新的 Jimp 图像来容纳拼接后的图像
      const concatenatedImage = new Jimp(maxWidth, totalHeight);

      // 在拼接图像中逐行绘制每个图像
      let offsetY = 0;
      images.forEach((image, index) => {
        // 添加图片顺序文本
        const orderText = `Image ${index + 1}`;
        const orderTextX = 10; // 文本的 x 坐标
        const orderTextY = offsetY + 10; // 文本的 y 坐标
        const orderTextOutputPath = `temp_image_${index}_with_text.png`; // 临时输出图像路径

        addTextToImage(image, orderText, orderTextX, orderTextY, orderTextOutputPath);

        // 读取带有文本的图像并添加到拼接图像中
        const imageWithText = Jimp.read(orderTextOutputPath);
        concatenatedImage.blit(imageWithText, 0, offsetY);

        offsetY += image.getHeight();
      });

      // 将拼接后的图像保存为文件
      concatenatedImage.write(outputFilePath, (err) => {
        if (err) {
          console.error('Error writing the concatenated image:', err);
        } else {
          console.log('Concatenated image with order text saved successfully.');
        }

        // 删除临时文件
        tempImagePaths.forEach((tempImagePath) => {
          fs.unlinkSync(tempImagePath);
        });

        // 删除临时带有文本的图像文件
        for (let i = 0; i < images.length; i++) {
          fs.unlinkSync(`temp_image_${i}_with_text.png`);
        }
      });
    })
    .catch((err) => {
      console.error('Error reading images2 :', err);

      // 删除临时文件（如果出现错误）
      tempImagePaths.forEach((tempImagePath) => {
        fs.unlinkSync(tempImagePath);
      });
    });
}

function addTextToImage(image, text, x, y, outputPath) {
  // 设置文本样式
  const textFont = Jimp.FONT_SANS_32_BLACK;
  const textColor = 0xFFFFFFFF; // 白色
  const textOptions = {
    text: text,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
  };

  // 在图像中添加文本
  image.print(Jimp.loadFont(textFont), x, y, textOptions, image.getWidth(), image.getHeight());

  // 保存修改后的图像
  image.write(outputPath, (err) => {
    if (err) {
      console.error('Error writing the image with added text:', err);
    } else {
      console.log('Image with added text saved successfully.');
    }
  });
}


module.exports = {
  randomNumber,
  sleep,
  getTextByOcrSingle,
  getTextByOcr,
  concatenateImages,
  concatenateImagesWithOrderText
};
