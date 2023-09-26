const {aiPageHandler} = require('./js/page-handler')

const main = async function () {
  await aiPageHandler({});
};

main().then(data => {
  console.log('最终数据', data);
})
