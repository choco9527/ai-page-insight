// const {createScheduler, createWorker} = require('tesseract.js');
const Tesseract = require('tesseract.js');
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

function getTextByOcr(imgArr = []) {
  console.log(1, Tesseract)
  Tesseract.recognize(
    'https://tesseract.projectnaptha.com/img/eng_bw.png',
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log(text);
  })

  // const worker = createWorker(tesseractWorkerConfig);
  //
  // (async () => {
  //   await worker.loadLanguage(supportLang.zh);
  //   await worker.initialize(supportLang.zh);
  //   const { data: { text } } = await worker.recognize(path.join(__dirname, '..', 'images', 'test1.png'));
  //   console.log(text);
  //   await worker.terminate();
  // })();
}

function getTextByOcrCopy(imgArr = []) {
  const scheduler = createScheduler();

  // Creates worker and adds to scheduler
  const workerGen = async () => {
    const worker = await createWorker(tesseractWorkerConfig);
    await worker.loadLanguage(supportLang.zh);
    await worker.initialize(supportLang.zh);
    scheduler.addWorker(worker);
  }

  const workerN = 4; // 创建4个线程并行翻译
  (async () => {
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
  getTextByOcr
};
