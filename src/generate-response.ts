import Cerebras from "@cerebras/cerebras_cloud_sdk";
import dotenv from "dotenv";
import { INITIAL_PROMPT } from "./prompts";
import { BASE_SYSTEM_PROMPT } from "./prompts";

dotenv.config();

const cerebras = new Cerebras({
  apiKey: process.env["CEREBRAS_API_KEY"],
});

const model = "qwen-3-32b";

export async function generateResponse() {
  const response = await cerebras.chat.completions.create({
    messages: [
      {
        role: "system",
        content: BASE_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: INITIAL_PROMPT(model),
      },
    ],
    model,
    stream: false,
    max_completion_tokens: 16382,
    temperature: 0.7,
    top_p: 0.95,
  });

  return extractCodeFromFence(
    (response.choices as { message: { content: string } }[])[0].message.content
  );
}

function extractCodeFromFence(text: string): string {
  const htmlMatch = text.match(/```html\n([\s\S]*?)\n```/);
  return htmlMatch ? htmlMatch[1].trim() : text;
}
