
import { GoogleGenAI, Type } from "@google/genai";
import type { LaptopComparison, GroundingChunk, GeminiResponse, SelectedBenchmark, BenchmarkData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Parses the text response from Gemini to extract a JSON array of laptop comparisons.
 * It's designed to be robust against common formatting variations.
 */
function parseGeminiResponse(responseText: string): LaptopComparison[] {
  // First, try to find a JSON code block
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = responseText.match(jsonRegex);
  let jsonString = responseText.trim();

  if (match && match[1]) {
    jsonString = match[1];
  } else {
    // If no code block, find the first '{' or '[' and the last '}' or ']'
    // This is a fallback for when the model omits the markdown fences.
    const firstBracket = jsonString.indexOf('{');
    const firstSquare = jsonString.indexOf('[');
    
    // Determine the start of the JSON content
    let start = -1;
    if (firstBracket === -1 && firstSquare === -1) {
        throw new Error("Could not find a valid JSON object or array in the AI's response.");
    }
    if (firstBracket === -1) start = firstSquare;
    else if (firstSquare === -1) start = firstBracket;
    else start = Math.min(firstBracket, firstSquare);

    // Determine the end of the JSON content
    const lastBracket = jsonString.lastIndexOf('}');
    const lastSquare = jsonString.lastIndexOf(']');
    const end = Math.max(lastBracket, lastSquare);
    
    if (start !== -1 && end !== -1 && end > start) {
        jsonString = jsonString.substring(start, end + 1);
    } else {
        throw new Error("Could not find a valid JSON object or array in the AI's response.");
    }
  }

  try {
    const parsedJson = JSON.parse(jsonString);
    // The model might return {"comparisons": [...]} or {"laptops": [...]} or some other key
    const key = Object.keys(parsedJson)[0];
    if (Array.isArray(parsedJson[key])) {
      return parsedJson[key];
    }
    // Or it might return the array directly [...]
    if (Array.isArray(parsedJson)) {
      return parsedJson;
    }
    throw new Error("The JSON response is not in the expected format (not an array or an object with an array).");
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    console.error("Raw JSON string attempted to parse:", jsonString);
    throw new Error("There was an issue parsing the comparison data from the AI.");
  }
}


export const getLaptopComparison = async (query: string): Promise<GeminiResponse> => {
    const prompt = `You are a world-class tech analyst specializing in the latest laptops. Your goal is to provide a highly detailed, real-time comparison of laptops based on the user's query, focusing on the very latest models and components. Use Google Search to find the most relevant, current information.

Your response MUST be a single JSON object inside a markdown code block. Do not include any text outside of the JSON block.

The JSON object must have a key "comparisons" which is an array of 2-4 laptop objects. Each object must have this exact structure:
{
  "brand": "string",
  "model": "string",
  "rating": "number (out of 5)",
  "summary": "string",
  "specs": {
    "Processor": "string",
    "RAM": "string",
    "Storage": "string",
    "Display": "string",
    "Graphics": "string",
    "Weight": "string",
    "cpuBenchmark": "string (e.g., 'Cinebench R23: ~15200')",
    "gpuBenchmark": "string (e.g., '3DMark Time Spy: ~8500')"
  },
  "pros": ["string"],
  "cons": ["string"]
}

User Query: "${query}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.1, 
            },
        });

        const comparisons = parseGeminiResponse(response.text);
        const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk as GroundingChunk) ?? [];

        if (comparisons.length === 0) {
            throw new Error("The AI was unable to find suitable laptops for your query. Please try being more specific or broader in your request.");
        }

        return { comparisons, sources };
    } catch (error) {
        console.error("Gemini API Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('xhr') || /5\d{2}/.test(errorMessage)) {
            throw new Error("Sorry, there was a problem communicating with the AI service. It might be a temporary issue. Please try again in a moment.");
        }
        
        if (error instanceof Error) {
            throw error;
        }
        
        throw new Error("Failed to get comparison from AI. The model may be busy or the request was blocked.");
    }
};

export const getBenchmarkComparisons = async (benchmark: SelectedBenchmark): Promise<BenchmarkData[]> => {
    const { name, score, type } = benchmark;
    const scoreRange = 0.15; // +/- 15%
    const lowerBound = Math.round(score * (1 - scoreRange));
    const upperBound = Math.round(score * (1 + scoreRange));

    const prompt = `Based on the provided component, find 5-10 other commercially available laptop ${type}s that have a benchmark score between ${lowerBound} and ${upperBound}. The original component is "${name}" with a score of ${score}. Do not include the original component in your response. Provide a common benchmark source URL for the scores, like PassMark or NotebookCheck. The type for all items should be "${type}".`;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: 'The name of the component (e.g., "Intel Core Ultra 7 155H")' },
                score: { type: Type.NUMBER, description: 'The benchmark score.' },
                type: { type: Type.STRING, enum: [type], description: `The component type, which must be "${type}".` },
                source: { type: Type.STRING, description: 'A URL to the benchmark source.' },
            },
            required: ["name", "score", "type", "source"]
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.3,
            },
        });

        const resultText = response.text.trim();
        if (!resultText) return [];
        
        const benchmarks = JSON.parse(resultText) as BenchmarkData[];
        return benchmarks;
    } catch (error) {
        console.error("Gemini API Error in getBenchmarkComparisons:", error);
        return [];
    }
};