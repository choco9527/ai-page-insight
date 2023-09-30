const { OpenAIApi } = require('openai');
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIApi({ key: apiKey });

async function callChatGPT(prompt) {
  try {
    const response = await openai.createCompletion({
      engine: 'davinci-codex', // 或者你想要使用的其他引擎
      prompt: prompt,
      max_tokens: 1000, // 调整生成的最大标记数
    });
    console.log(response.choices[0].text);

    return response
  } catch (error) {
    console.error(error);
  }
}

// const userPrompt = '生成一段关于人工智能的文章：';
// callChatGPT(userPrompt);

modules.export = {
  callChatGPT
}
