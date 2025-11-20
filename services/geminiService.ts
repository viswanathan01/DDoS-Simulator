import { GoogleGenAI } from "@google/genai";
import { AttackType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getEducationalContent = async (attackType: AttackType): Promise<string> => {
  try {
    if (!apiKey) return "API Key is missing. Please provide a valid API Key to see AI insights.";

    const model = "gemini-2.5-flash";
    const prompt = `
      Provide a concise, educational explanation for a ${attackType} DDoS attack.
      Include:
      1. How it works technically.
      2. Typical mitigation strategies.
      Format the response in Markdown. Keep it under 200 words.
      Focus on clarity for a web developer audience.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch educational content at this time. Please check your connection or API key.";
  }
};

export const analyzeAttackPattern = async (rps: number, load: number, type: AttackType): Promise<string> => {
    try {
        if (!apiKey) return "Simulated Analysis: System under stress.";

        const model = "gemini-2.5-flash";
        const prompt = `
          Act as a cybersecurity analyst system.
          Current metrics:
          - Attack Type: ${type}
          - Requests Per Second: ${rps}
          - Server Load: ${load.toFixed(1)}%
          
          Provide a 1-sentence status update alert that would appear in a SOC dashboard.
          Be urgent if load > 80%. Be informative if load < 50%.
        `;
    
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
    
        return response.text || "System monitoring active.";
      } catch (error) {
        return "System monitoring active (Offline Mode).";
      }
}
