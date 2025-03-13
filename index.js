import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function chatWithGPT() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: "Привет! Расскажи анекдот." }],
  });

  console.log(response.choices[0].message.content);
}

chatWithGPT();