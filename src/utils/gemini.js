import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "mock_key");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeFoodImage = async (base64Image) => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    // Mock response for testing UI without API key
    return new Promise((resolve) => setTimeout(() => {
      resolve({
        name: "Avocado Toast with Egg",
        calories: 350,
        protein: 14,
        carbs: 28,
        fat: 20,
        fiber: 8,
        healthScore: 85
      });
    }, 2000));
  }

  try {
    const prompt = `Analyze this food image. Provide a JSON response with the following keys and appropriate values based on your visual estimation:
    - name (string: descriptive name of the food)
    - calories (number: estimated total calories)
    - protein (number: estimated protein in grams)
    - carbs (number: estimated carbohydrates in grams)
    - fat (number: estimated fat in grams)
    - fiber (number: estimated dietary fiber in grams)
    - healthScore (number: a score from 0 to 100 indicating how healthy this meal is, 100 being extremely healthy)
    
    Return ONLY valid JSON without any markdown formatting like \`\`\`json.`;

    const mimeType = base64Image.substring(base64Image.indexOf(":") + 1, base64Image.indexOf(";"));
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image.split(',')[1] || base64Image,
          mimeType: mimeType || 'image/jpeg'
        }
      }
    ]);
    const response = result.response.text();
    // try to parse json safely by removing any potential markdown
    const cleanedJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("Failed to analyze image", { cause: error });
  }
};

export const generateMealPlan = async (userProfile) => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
     // Mock response
     return new Promise((resolve) => setTimeout(() => {
        resolve({
          days: Array.from({length: 7}, (_, i) => ({
            day: i + 1,
            breakfast: "Oatmeal with berries",
            lunch: "Grilled chicken salad",
            dinner: "Salmon with quinoa",
            snacks: "Almonds"
          }))
        });
     }, 2000));
  }

  try {
    const prompt = `Create a 7-day personalized meal plan for someone with the following profile:
    - Goal: ${userProfile.goal}
    - Dietary Preference: ${userProfile.diet}
    - BMI Category: ${userProfile.bmiCategory} (BMI: ${userProfile.bmi})
    - Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm
    
    Provide a JSON response with a 'days' array. Each item in the array should represent a day (1 to 7) and include keys:
    - day (number)
    - breakfast (string)
    - lunch (string)
    - dinner (string)
    - snacks (string)
    
    Return ONLY valid JSON without any markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const cleanedJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Gemini Meal Plan Error:", error);
    throw new Error("Failed to generate meal plan", { cause: error });
  }
};
