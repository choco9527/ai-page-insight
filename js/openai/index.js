require('dotenv').config();
const https = require('https');
const apiKey = process.env.OPENAI_API_KEY;

async function callChatGPT(prompt) {
  const data = JSON.stringify({
    prompt: prompt,
    max_tokens: 300, // 根据需要调整 max_tokens 的值
    temperature: 0.7
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/engines/davinci-codex/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log('ai结果', responseData);
        const response = JSON.parse(responseData);
        if (response.error) {
          reject(response.error.message)
        } else {
          resolve(response.choices[0].text);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// const userPrompt = '生成一段关于人工智能的文章：';
// callChatGPT(userPrompt);

module.exports = {
  callChatGPT
}
