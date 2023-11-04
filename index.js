const {aiPageHandler} = require('./js/page-handler')
const {
  imageToBase64,
  readJson,
  saveJSONToFile,
  extractTime,
  splitArray,
  concatenateImagesWithOrderText
} = require('./js/common')
const {generalBasicImg} = require('./js/baidu-ocr/rest2.0ocrv1general_basic')
const {getTextByOcrSingle} = require('./js/tesseract-ocr')
const {callChatGPT} = require('./js/openai')
const {userPrompt, showContent} = require('./js/constans')

const main = async function () {
  const outputName = 'test-fast'
  const pageUrl = 'https://www.bilibili.com/video/BV14D4y1M7ub/?spm_id_from=333.788.recommend_more_video.-1&vd_source=f4666564bd398823589647df2a108413'

  /***   获取视频图像   ***/
  const videoInfoArr = await aiPageHandler({
    captionHeight: 230,
    pageUrl,
    headless: false
  });
  await saveJSONToFile(JSON.stringify(videoInfoArr), `output/json/${outputName}.json`)
  console.log('保存全部数据到json')

  return

  /***   合并图像并添加标记    ***/
  // const videoInfoArr = await readJson(`output/json/${outputName}.json`) // 测试用
  console.log('总字幕条数', videoInfoArr.length);

  const allCaptionInfos = videoInfoArr.map(item => ({
    base64Image: item.captionImg,
    videoTime: item.videoTime
  }))

  /***   拆分字幕图像    ***/
  const {imagePartsLength} = await concatenateImagesWithOrderText({
    list: allCaptionInfos,
    outputFileName: outputName
  });
  console.log('图像拆分完成', imagePartsLength)

  /***   OCR识别    ***/
  const ocrList = []
  for (let i = 0; i < imagePartsLength; i++) {
    const formImg = imageToBase64(`output/img/${outputName}_${i}.png`)
    const baiduInfo = await generalBasicImg({
      image: formImg
    })
    // const tInfo = await getTextByOcrSingle(formImg) // 使用tesseract识别
    const words_result = baiduInfo.words_result
    // console.log('百度解析', words_result);
    ocrList.push(...words_result)
  }
  console.log('ocrList', ocrList)
  await saveJSONToFile(JSON.stringify(ocrList), `output/ocr/${outputName}.json`)
  console.log('存ocrList数据到json')

  // const ocrList = await readJson(`output/ocr/${outputName}.json`) // 测试用
  const simOcrList = ocrList.map(({words}) => { // 过滤并处理文案
    return extractTime(words)
  })
  console.log(simOcrList);

  return

  /***   OPENAI分析    ***/
  console.log('分割内容')
  const chunkedArray = splitArray(simOcrList, 100);
  for (let i = 0; i < chunkedArray.length; i++) {
    const chunks = chunkedArray[i]
    await saveJSONToFile(JSON.stringify(chunks), `output/ocr/chunk_${outputName}_${i}.json`)
  }

  console.log('AI分析')
  const aiList = []
  for (let i = 0; i < chunkedArray.length; i++) {
    const text = await readJson(`output/ocr/chunk_${outputName}_${i}.json`)
    const aiRes = await callChatGPT(text + userPrompt)
    aiList.push(aiRes)
  }
  console.log('aiList', aiList);
  console.log(showContent) // 展示
};


main().then(data => {
  // console.log('最终数据', data);
})
