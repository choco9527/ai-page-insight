const {aiPageHandler} = require('./js/page-handler')
const {imageToBase64} = require('./js/common')

const main = async function () {
  const outputFilePath = 'images/test_out_put.png'
  // await aiPageHandler({
  //   outputFilePath
  // });
  const b = imageToBase64(outputFilePath)
  // console.log(b);
  // return b
};


main().then(data => {
  console.log('最终数据', data);
})
