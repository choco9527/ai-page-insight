// const {createScheduler, createWorker} = require('tesseract.js');
const fs = require('fs');
const Jimp = require('jimp');
const querystring = require('querystring');

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

async function concatenateImagesWithOrderText(base64Images, outputFilePath) {
  const tempImagePaths = [];

  // 保存每个 Base64 图像数据为临时文件
  base64Images.forEach((base64Image, index) => {
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const tempImagePath = `temp_image_${index}.png`;

    fs.writeFileSync(tempImagePath, imageData, { encoding: 'base64' });

    tempImagePaths.push(tempImagePath);
  });

  try {
    // 创建一个空的 Jimp 图像数组
    const images = [];

    // 读取每个图像并添加到数组中
    for (let i = 0; i < tempImagePaths.length; i++) {
      const imagePath = tempImagePaths[i];
      const image = await Jimp.read(imagePath);
      images.push(image);
    }

    // 计算拼接后图像的宽度和高度
    const maxWidth = Math.max(...images.map((image) => image.getWidth()));
    const totalHeight = images.reduce((sum, image) => sum + image.getHeight(), 0);

    // 创建一个新的 Jimp 图像来容纳拼接后的图像
    const concatenatedImage = new Jimp(maxWidth, totalHeight);

    // 在拼接图像中逐行绘制每个图像
    let offsetY = 0;
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      // 添加图片顺序文本
      const orderText = `TEXT${i}`;
      const orderTextX = 10; // 文本的 x 坐标
      const orderTextY = offsetY + 10; // 文本的 y 坐标
      const orderTextOutputPath = `temp_image_${i}_with_text.png`; // 临时输出图像路径

      await addTextToImage(image, orderText, orderTextX, orderTextY, orderTextOutputPath);

      // 读取带有文本的图像并添加到拼接图像中
      const imageWithText = await Jimp.read(orderTextOutputPath);
      concatenatedImage.blit(imageWithText, 0, offsetY);

      offsetY += image.getHeight();
    }

    // 将拼接后的图像保存为文件
    await new Promise((resolve, reject) => {
      concatenatedImage.write(outputFilePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    console.log('Concatenated image with order text saved successfully.');
  } catch (err) {
    console.error('Error processing images:', err);
  } finally {
    // 删除临时文件
    tempImagePaths.forEach((tempImagePath) => {
      fs.unlinkSync(tempImagePath);
    });

    // 删除临时带有文本的图像文件
    for (let i = 0; i < base64Images.length; i++) {
      fs.unlinkSync(`temp_image_${i}_with_text.png`);
    }
  }
}

async function addTextToImage(image, text, x, y, outputPath) {
  // 设置文本样式
  const textFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const textColor = 0x000000FF; // 白色
  const textOptions = {
    text: text,
    textColor,
    alignmentX: 1,
    alignmentY: 1,
  };

  // 在图像中添加文本
  image.print(textFont, 1, 1, textOptions, image.getWidth(), image.getHeight());

  // 保存修改后的图像
  await new Promise((resolve, reject) => {
    image.write(outputPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  console.log('Image with added text saved successfully.');
}

function imageToBase64(filePath) {
  // 读取图片文件
  const imageBuffer = fs.readFileSync(filePath);

  // 将图片数据转换为 Base64
  const base64Data = imageBuffer.toString('base64');
  const size = getBase64SizeInMB(base64Data)
  console.log(size);

  // URL 编码 Base64 字符串
  const urlEncodedData = querystring.escape(base64Data);

  return urlEncodedData;
}

function getBase64SizeInMB(base64String) {
  const base64WithoutPrefix = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64WithoutPrefix, 'base64');
  const sizeInBytes = buffer.length;
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
  return sizeInMB;
}

module.exports = {
  randomNumber,
  sleep,
  concatenateImages,
  concatenateImagesWithOrderText,
  imageToBase64
};
