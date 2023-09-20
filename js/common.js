// const {createScheduler, createWorker} = require('tesseract.js');
const {createWorker, createScheduler} = require('tesseract.js');
const {tesseractWorkerConfig, supportLang} = require('./constans');
const path = require('path');

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

    const imgPath = 'https://tesseract.projectnaptha.com/img/eng_bw.png'
    const imgPath1 = path.join(__dirname, '..', 'images', 'test1.png')
    const imgPath2 = path.join(__dirname, '..', 'images', 'test2.png')
    const imgPath3 = path.join(__dirname, '..', 'images', 'test3.png')

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
    console.log(results); // 识别结果
  })();
}

module.exports = {
  randomNumber,
  sleep,
  getTextByOcrSingle,
  getTextByOcr
};
