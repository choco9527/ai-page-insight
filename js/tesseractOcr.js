const {createWorker, createScheduler} = require('tesseract.js');
const {tesseractWorkerConfig, supportLang} = require('./constans')
const path = require('path');

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

module.exports = {
  getTextByOcrSingle,
  getTextByOcr,
}
