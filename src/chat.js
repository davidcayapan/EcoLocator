import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'node:fs';
import mime from 'mime-types';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-preview-03-25",
  systemInstruction: "You are an expert at sustainability. Your task is to engage in conversations about sustainability, the effects of pollution and global warming, and how recycling can help our environment. You also need to answer questions people may have. Give examples of the bad effects of not being sustainable along with the good effects of being sustainable. Provide solutions if people have questions.",
});

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 5000,
  responseModalities: [],
  responseMimeType: "application/json",
};

const chatHistory = [
  {
    role: "user",
    parts: [{ text: "Hello\n" }],
  },
  {
    role: "model",
    parts: [
      { text: "Hello there! It's great to connect with you.\n\nAs an expert focused on sustainability, I'm here to discuss the crucial topics surrounding our planet's health. We can delve into the impacts of pollution and global warming, explore how recycling helps, and talk about the broader picture of sustainable living.\n\nDo you have any initial questions, or is there a particular area of sustainability you're interested in discussing today? Perhaps you're curious about:\n\n*   The specific effects of climate change?\n*   What happens to our waste?\n*   Simple ways to live more sustainably?\n*   The difference between 'recyclable' and 'recycled'?\n\nI'm ready when you are!" },
    ],
  },
];

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: chatHistory,
  });

  const result = await chatSession.sendMessage(process.argv[2] || "Hello");
  const response = result.response;

  // Handle any inline data (images, etc.)
  for (const candidate of response.candidates) {
    for (const [index, part] of candidate.content.parts.entries()) {
      if (part.inlineData) {
        try {
          const filename = `output_${index}.${mime.extension(part.inlineData.mimeType)}`;
          fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`Output written to: ${filename}`);
        } catch (err) {
          console.error('Error writing file:', err);
        }
      }
    }
  }

  // Print the text response
  console.log(response.text());
}

run().catch(console.error);