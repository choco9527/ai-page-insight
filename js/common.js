const Rembrandt = require('rembrandt') // 比较图片的库
const fs = require('fs').promises
const images = require('images')

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



module.exports = {
  randomNumber,
  sleep,
};
