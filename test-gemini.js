import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Very basic dotenv parser
const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const keyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.+)/);
const apiKey = keyMatch ? keyMatch[1].trim() : null;

if (!apiKey) {
  console.error("No API key found in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function test() {
  try {
    console.log("Testing API with key: " + apiKey.substring(0, 5) + "...");
    const result = await model.generateContent("Say hello world");
    console.log("API Success:", result.response.text());
  } catch (error) {
    console.error("API Error:", error);
  }
}

test();
