const path = require('path');

const tesseractWorkerConfig = {
  langPath: path.join(__dirname, '..', 'lang-data'),
  logger: m => console.log(m),
}

const supportLang = {
  eng: 'eng',
  zh: 'chi_sim'
}


module.exports = {
  tesseractWorkerConfig,
  supportLang
}
