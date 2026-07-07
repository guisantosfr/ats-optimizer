import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Aviso: GEMINI_API_KEY não foi encontrada nas variáveis de ambiente.");
}

export const ai = new GoogleGenAI({
  apiKey: apiKey || "",
});
