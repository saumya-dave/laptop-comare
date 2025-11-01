import { GoogleGenAI, Type } from "@google/genai";
import type { LaptopComparison, GroundingChunk, GeminiResponse, SelectedBenchmark, BenchmarkData, ComponentAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * A utility function to retry an async operation with exponential backoff.
 * Only retries on specific "transient" errors like 503s or rate limiting.
 * @param fn The async function to retry.
 * @param retries The maximum number of retries.
 * @param delay The initial delay in milliseconds.
 * @param backoffFactor The factor by which the delay increases.
 * @returns The result of the async function.
 */
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000,
    backoffFactor = 2
): Promise<T> {
    let lastError: Error = new Error("Retry function failed without capturing an error.");
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            const errorMessage = (lastError.message || '').toLowerCase();
            
            // Check for specific retryable error codes/messages
            const isRetryable = errorMessage.includes('503') || 
                                errorMessage.includes('unavailable') || 
                                errorMessage.includes('overloaded') || 
                                errorMessage.includes('rate limit');

            if (isRetryable) {
                if (i < retries - 1) {
                    console.warn(`API call failed (attempt ${i + 1}/${retries}): ${lastError.message}. Retrying in ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    delay *= backoffFactor;
                }
            } else {
                // Not a retryable error, throw immediately
                throw lastError;
            }
        }
    }
    console.error(`API call failed after ${retries} attempts.`);
    throw lastError;
}


/**
 * Parses the text response from Gemini to extract a JSON object with laptop comparisons.
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
  
  // Pre-parsing cleanup to fix common AI model errors.
  
  // 1. Fix mismatched brackets for specific object keys known to cause issues.
  // e.g., "gamingPerformance": { ... ] -> "gamingPerformance": { ... }
  // This is a targeted fix for a known issue where the model uses a ']' instead of '}'
  jsonString = jsonString.replace(/("gamingPerformance":\s*{[^}]*?)\s*\]/g, '$1}');
  jsonString = jsonString.replace(/("ratingBreakdown":\s*{[^}]*?)\s*\]/g, '$1}');
  
  // 2. Remove trailing commas from objects and arrays, which are invalid in strict JSON.
  // e.g., { "a": 1, } -> { "a": 1 } or [ 1, 2, ] -> [ 1, 2 ]
  jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');

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

/**
 * Parses the text response from Gemini to extract a JSON array.
 * It's designed to be robust against common formatting variations.
 */
function parseGeminiJsonArrayResponse<T>(responseText: string): T[] {
  // First, try to find a JSON code block
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = responseText.match(jsonRegex);
  let jsonString = responseText.trim();

  if (match && match[1]) {
    jsonString = match[1];
  } else {
    // If no code block, find the first '[' and the last ']'
    const firstSquare = jsonString.indexOf('[');
    const lastSquare = jsonString.lastIndexOf(']');
    
    if (firstSquare !== -1 && lastSquare !== -1 && lastSquare > firstSquare) {
        jsonString = jsonString.substring(firstSquare, lastSquare + 1);
    } else {
        throw new Error("Could not find a valid JSON array in the AI's response.");
    }
  }
  
  // Remove trailing commas from objects and arrays, which are invalid in strict JSON.
  jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');

  try {
    const parsedJson = JSON.parse(jsonString);
    if (Array.isArray(parsedJson)) {
      return parsedJson as T[];
    }
    throw new Error("The JSON response is not an array.");
  } catch (e) {
    console.error("Failed to parse JSON array:", e);
    console.error("Raw JSON string attempted to parse:", jsonString);
    throw new Error("There was an issue parsing the benchmark data from the AI.");
  }
}

export const getLaptopComparison = async (query: string): Promise<GeminiResponse> => {
    const prompt = `You are a world-class tech analyst specializing in the latest laptops. Your goal is to provide a highly detailed, real-time comparison of laptops based on the user's query, focusing on the very latest models and components. Use Google Search to find the most relevant, current information.

Your response MUST be a single JSON object inside a markdown code block. Do not include any text outside of the JSON block.

The JSON object must have a key "comparisons" which is an array of 5-6 laptop objects. Each object must have this exact structure:
{
  "brand": "string",
  "model": "string",
  "rating": "number (out of 10)",
  "price": "number (in local currency, e.g., 54990)",
  "releaseDate": "string (e.g., 'July 2022')",
  "status": "string (e.g., 'Available')",
  "summary": "string (A concise one-paragraph summary)",
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
  "ratingBreakdown": {
    "performance": "number (out of 10)",
    "value": "number (out of 10)",
    "quality": "number (out of 10)"
  },
  "gamingPerformance": {
    "1080p": "string (FPS range, e.g., '45-60')",
    "1440p": "string (FPS range, e.g., '30-45')",
    "quality": "string (Recommended settings, e.g., 'Medium')"
  },
  "productivityPerformance": [
    { "task": "Video Editing", "score": "number (out of 10)" },
    { "task": "Programming & Dev", "score": "number (out of 10)" },
    { "task": "Office Work", "score": "number (out of 10)" },
    { "task": "Content Creation", "score": "number (out of 10)" }
  ],
  "pros": ["string"],
  "cons": ["string"]
}

User Query: "${query}"`;

    try {
        const response = await retryWithBackoff(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.1, 
            },
        }));

        const comparisons = parseGeminiResponse(response.text?.trim() ?? '');
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

    const prompt = `You are a hardware expert. Use Google Search to find the most current benchmark data. Find 5-10 other commercially available laptop ${type}s with a benchmark score between ${lowerBound} and ${upperBound}. The original component is "${name}" with a score of ${score}. Do not include the original component in your response.

Your response MUST be a single JSON array inside a markdown code block. Do not include any text outside of the JSON block. Each object in the array must have this exact structure:
{
  "name": "string (e.g., 'Intel Core Ultra 7 155H')",
  "score": "number (The benchmark score)",
  "type": "string (Must be '${type}')",
  "source": "string (A URL to the benchmark source, e.g., from PassMark or NotebookCheck)"
}`;

    try {
        const response = await retryWithBackoff(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.3,
            },
        }));

        const resultText = response.text?.trim();
        if (!resultText) return [];
        
        const benchmarks = parseGeminiJsonArrayResponse<BenchmarkData>(resultText);
        return benchmarks;
    } catch (error) {
        console.error("Gemini API Error in getBenchmarkComparisons:", error);
        return [];
    }
};

export const getComponentAnalysis = async (componentName: string): Promise<ComponentAnalysis> => {
    const prompt = `Provide a detailed technical analysis of the following hardware component: "${componentName}". Your response should be a clean JSON object with no extra text or markdown. The 'specs' property must be an array of objects, where each object has a 'name' and a 'value' key. Focus on information relevant to a laptop user.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: 'The official name of the component.' },
            summary: { type: Type.STRING, description: 'A concise paragraph summarizing the component\'s capabilities, target audience, and market position.' },
            specs: {
                type: Type.ARRAY,
                description: 'A list of 3-5 key technical specifications as name-value pairs.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The name of the specification (e.g., 'Cores', 'Clock Speed')." },
                        value: { type: Type.STRING, description: "The value of the specification (e.g., 'up to 5.5 GHz')." }
                    },
                    required: ['name', 'value']
                }
            },
            strengths: {
                type: Type.ARRAY,
                description: 'A list of 3-4 key strengths or advantages of this component.',
                items: { type: Type.STRING }
            },
            weaknesses: {
                type: Type.ARRAY,
                description: 'A list of 2-3 potential weaknesses or drawbacks.',
                items: { type: Type.STRING }
            }
        },
        required: ["name", "summary", "specs", "strengths", "weaknesses"]
    };

    const callApiModel = (model: 'gemini-2.5-pro' | 'gemini-2.5-flash') => {
        const thinkingBudget = model === 'gemini-2.5-pro' ? 32768 : 24576;
        return ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
                thinkingConfig: { thinkingBudget },
            },
        });
    }

    try {
        const response = await retryWithBackoff(() => callApiModel('gemini-2.5-pro'));
        
        const resultText = response.text?.trim();
        if (!resultText) {
            throw new Error("Received an empty response from the AI for component analysis.");
        }
        
        return JSON.parse(resultText) as ComponentAnalysis;

    } catch (error) {
        console.warn(`Primary model (gemini-2.5-pro) failed for "${componentName}":`, error);
        
        const errorMessage = (error instanceof Error ? error.message : String(error)).toLowerCase();
        const isRetryableServerError = errorMessage.includes('503') || 
                                     errorMessage.includes('unavailable') || 
                                     errorMessage.includes('overloaded');

        if (isRetryableServerError) {
            console.log(`Attempting fallback to gemini-2.5-flash for "${componentName}"...`);
            try {
                const fallbackResponse = await retryWithBackoff(() => callApiModel('gemini-2.5-flash'));

                const fallbackResultText = fallbackResponse.text?.trim();
                if (!fallbackResultText) {
                    throw new Error("Received an empty response from the AI for component analysis (fallback).");
                }
                return JSON.parse(fallbackResultText) as ComponentAnalysis;

            } catch (fallbackError) {
                console.error(`Fallback model also failed for "${componentName}":`, fallbackError);
                throw new Error(`Failed to get analysis for ${componentName}. Both primary and fallback AI models are unavailable or busy.`);
            }
        }

        console.error(`Gemini API Error in getComponentAnalysis for "${componentName}":`, error);
        throw new Error(`Failed to get analysis for ${componentName}. The AI may be busy or could not find information on this component.`);
    }
};

export const getDetailedComparison = async (laptops: LaptopComparison[], userQuery: string): Promise<string> => {
    // Sanitize laptop objects to only include relevant data, to save tokens
    const sanitizedLaptops = laptops.map(({ pros, cons, summary, gamingPerformance, productivityPerformance, ...rest }) => rest);

    const prompt = `You are a world-class tech analyst. Below is a JSON array of laptops and a user's specific requirement.
Your task is to provide a detailed verdict in markdown format.

1.  Start with a brief, one-paragraph overview that summarizes the user's request and the options being compared.
2.  Then, for each laptop, provide a short analysis of its key strengths and weaknesses specifically related to the user's focus. Use headings for each laptop model.
3.  Finally, provide a concluding section starting *exactly* with the title "**Final Recommendation:**". In this section, clearly state which single laptop is the best choice and provide a concise justification for your decision. **Bold the name of the recommended laptop** within this final paragraph.

Analyze the laptops based ONLY on the provided data. Do not invent any new information.

Laptops:
\`\`\`json
${JSON.stringify(sanitizedLaptops, null, 2)}
\`\`\`

User's Focus:
"${userQuery}"`;

    try {
        const response = await retryWithBackoff(() => ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                temperature: 0.3,
                thinkingConfig: { thinkingBudget: 32768 },
            },
        }));

        const resultText = response.text?.trim();
        if (!resultText) {
            throw new Error("The AI returned an empty verdict. Please try rephrasing your query.");
        }
        
        return resultText;

    } catch (error) {
        console.error("Gemini API Error in getDetailedComparison:", error);
        throw new Error("Failed to get a detailed comparison from the AI. The service may be busy.");
    }
};