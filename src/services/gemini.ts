import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeImage = async (imageFile: File): Promise<{ success: boolean; ingredients?: string[]; error?: string }> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const imageData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });

    const prompt = "Identify and list all ingredients visible in this image. Format the response as a JSON array of strings, each string containing an ingredient with its approximate quantity if visible.";
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: imageFile.type
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    let ingredients: string[];
    try {
      ingredients = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim());
      if (!Array.isArray(ingredients)) {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      throw new Error('Failed to parse ingredients from image analysis');
    }
    
    return { success: true, ingredients };
  } catch (error) {
    console.error('Image analysis error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to analyze image'
    };
  }
};

export const generateRecipe = async (params: {
  ingredients: string[];
  cuisine: string;
  restrictions: string[];
  proficiency: string;
  timeAvailable: string;
}): Promise<{
  success: boolean;
  recipe?: any;
  error?: string;
}> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Create a recipe using these parameters:
    Ingredients: ${params.ingredients.join(', ')}
    Cuisine: ${params.cuisine}
    Dietary Restrictions: ${params.restrictions.join(', ')}
    Cook's Proficiency: ${params.proficiency}
    Time Available: ${params.timeAvailable}

    Respond with a valid JSON object containing EXACTLY these fields:
    {
      "title": "Recipe name",
      "description": "Brief description",
      "prepTime": "Preparation time",
      "cookTime": "Cooking time",
      "totalTime": "Total time",
      "difficulty": "Easy/Medium/Hard",
      "ingredients": ["List of ingredients with quantities"],
      "alternativeIngredients": {"ingredient": "alternative"},
      "instructions": ["Step by step instructions"],
      "nutrition": {
        "calories": "per serving",
        "protein": "grams",
        "carbs": "grams",
        "fat": "grams"
      },
      "plating": "Plating suggestions",
      "history": "Cultural background and history"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let recipe;
    try {
      recipe = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim());
    } catch (parseError) {
      throw new Error('Failed to parse recipe data');
    }
    
    return { success: true, recipe };
  } catch (error) {
    console.error('Recipe generation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate recipe'
    };
  }
};