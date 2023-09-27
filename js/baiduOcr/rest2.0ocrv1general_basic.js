const request = require('request')
require('dotenv').config();
const AK = process.env.AK;
const SK = process.env.SK;

async function generalBasicImg({image}) {
  var options = {
    'method': 'POST',
    'url': 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=' + await getAccessToken(),
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    form: {
      'detect_direction': 'false',
      'paragraph': 'false',
      'probability': 'false',
      image
    }
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
function getAccessToken() {

  let options = {
    'method': 'POST',
    'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
  }
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(JSON.parse(response.body).access_token)
      }
    })
  })
}

module.exports = {
  generalBasicImg
}
