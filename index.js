const {aiPageHandler} = require('./js/page-handler')
const {imageToBase64} = require('./js/common')
const {generalBasicImg} = require('./js/baiduOcr/rest2.0ocrv1general_basic')

const main = async function () {
  const outputFilePath = 'images/test_out_put.png'
  await aiPageHandler({
    outputFilePath,
    pageUrl: 'https://www.bilibili.com/video/BV14D4y1M7ub/?spm_id_from=333.788.recommend_more_video.-1&vd_source=f4666564bd398823589647df2a108413',
  });
  const formImg = imageToBase64(outputFilePath)
  const info = await generalBasicImg({
    image: formImg
  })
  console.log('baidu', info);
  // {"words_result":[{"words":"TEXTO"},{"words":"一直都只有苹果发布会才能称得上是科技螺春晚"},{"words":"TEXT1"},{"words":"因为春晚从2011年赵本山最后一次登台后"},{"words":"TE},{"words":"TEXT3"},{"words":"也是从2011年乔布斯最后一次登台后"},{"words":"TEXT4"},{"words":"也是从2011年乔布斯最后一次登台后"},{"words":"TEXT5"},{"words":"到底还有没有可words":"TEXT7"},{"words":"那我觉得看遍了历年的苹果宣传片"},{"words":"TEXT8"},{"words":"或老说起码可以上我们眼前一亮的东西"},{"words":"TEXT9"},{"words":"都还不如看看如今那706717632877828719}

  // console.log(b);
  // return b
};


main().then(data => {
  console.log('最终数据', data);
})
