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
const {userPrompt} = require('./js/constans')

const main = async function () {
  const outputName = 'test2'
  const pageUrl = 'https://www.bilibili.com/video/BV14D4y1M7ub/?spm_id_from=333.788.recommend_more_video.-1&vd_source=f4666564bd398823589647df2a108413'

  /***   获取视频图像   ***/
  // const videoInfoArr = await aiPageHandler({
  //   captionHeight: 230,
  //   pageUrl,
  // });
  // await saveJSONToFile(JSON.stringify(videoInfoArr), `output/json/${outputName}.json`)
  // console.log('保存全部数据到json')

  /***   合并图像并添加标记    ***/
  const videoInfoArr = await readJson(`output/json/${outputName}.json`) // 测试用
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

  const content = `
视频的主要内容是关于容易辞职的岗位的讨论。视频提到了一些异地偏远乡镇的岗位辞职率较高，也涉及了一些观众分享的辞职经历和困扰。重点时间点包括：

00:09：提到有很多粉丝和主播聊过辞职的问题。
00:21：特别提到异地偏远乡镇的岗位辞职率较高。
00:46：主播分享了一个粉丝的辞职经历。
01:10：提到异地乡镇岗位排在第一位，辞职率较高。

视频讨论了区县级政府办的工作环境，着重强调了工作的繁重和累人程度。以下是视频中的重要内容和关键时间点：

01:16：提到区县级政府办的工作单位，特别是政府办，工作非常累。
01:24：提到在周末和节假日也需要加班。
01:58：讨论了有许多观众想要辞职离开政府办的工作，大约有20-30人。
02:13：分享了一个观众考上县委办工作，但由于加班太多而想要辞职的案例。
02:25：描述了工作日常是除了上班就是睡觉，没有自己的生活，觉得这种生活没有意义。

视频讨论了工作在区县级政府办、县委办和经开区的情况，并探讨了这些单位的工作环境和特点。以下是视频中的重要内容和关键时间点：

- 02:33：观众表达了对当前工作生活缺乏意义的感受。
- 02:36：有观众考虑辞职并重新参加考试。
- 02:45：讨论了另一类单位，例如派出机构，提到工作地点可能是山区或农村。
- 03:01：指出进入这些单位后很难有晋升机会。
- 03:13：讨论了在不同级别单位工作的管理层级和责任。
- 03:28：强调在这些单位工作的不稳定性和缺乏前途感。
- 03:40：介绍了经开区作为地方建设中心，聚集本地资源的特点。

请注意，由于字幕的OCR识别可能存在一些错误，因此内容的准确性可能会有所影响。

视频讨论了经开区作为一种工作单位的特点和情况，并探讨了在经开区工作的优势和劣势。以下是视频中的重要内容和关键时间点：

- 03:51：强调经开区的建设和特点。
- 03:54：指出经开区是最累的工作地方。
- 03:57：经开区的机构规模较小，人员数量较少。
- 04:00：无论在什么岗位上，工作都是辛苦的。
- 04:04：经开区的待遇相对较好。
- 04:09：有多个人向作者咨询关于辞职的问题。
- 04:13：总结出了辞职较为常见的5个单位。
- 04:18：鼓励观众在评论区分享其他容易辞职的单位。
`
};


main().then(data => {
  // console.log('最终数据', data);
})
