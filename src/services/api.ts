import { supabase } from './supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  author?: string;
  image_url?: string;
  dietary_tags?: string[];
  difficulty?: string;
  prep_time?: string;
  trust_score?: number;
  votes?: number;
  comments?: number;
  created_at?: string;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: string;
  ingredients: string[];
  alternativeIngredients: Record<string, string>;
  instructions: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  plating: string;
  history: string;
}

export const generateRecipe = async (params: {
  ingredients: string[];
  cuisine: string;
  restrictions: string[];
  proficiency: string;
  timeAvailable: string;
}): Promise<{ success: boolean; recipe?: GeneratedRecipe; error?: string }> => {
  try {
    if (!params.ingredients.length) {
      throw new Error('No ingredients provided');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Create a detailed recipe with these parameters:
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
    
    let recipe: GeneratedRecipe;
    try {
      recipe = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim());
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Failed to parse recipe data. Please try again.');
    }

    const requiredFields = [
      'title',
      'description',
      'prepTime',
      'cookTime',
      'totalTime',
      'difficulty',
      'ingredients',
      'instructions',
      'nutrition',
      'plating',
      'history'
    ];

    const missingFields = requiredFields.filter(field => !recipe[field as keyof GeneratedRecipe]);
    if (missingFields.length > 0) {
      throw new Error(`Invalid recipe data: Missing ${missingFields.join(', ')}`);
    }

    if (!Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions)) {
      throw new Error('Invalid recipe data: ingredients and instructions must be arrays');
    }

    if (!recipe.nutrition || typeof recipe.nutrition !== 'object') {
      throw new Error('Invalid recipe data: nutrition information is missing or invalid');
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

export const analyzeImage = async (file: File): Promise<{ success: boolean; ingredients?: string[]; error?: string }> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const imageData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const prompt = "Analyze this image and identify all visible ingredients. Format the response as a JSON array of strings, each string containing an ingredient with its approximate quantity if visible.";
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: file.type
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

export const validateRecipe = async (recipeId: string, vote: 'up' | 'down') => {
  try {
    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('votes, trust_score')
      .eq('id', recipeId)
      .single();

    if (fetchError) throw fetchError;

    const voteChange = vote === 'up' ? 1 : -1;
    const trustChange = vote === 'up' ? 2 : -2;

    const newVotes = (recipe.votes || 0) + voteChange;
    const newTrustScore = Math.max(0, Math.min(100, (recipe.trust_score || 50) + trustChange));

    const { data, error: updateError } = await supabase
      .from('recipes')
      .update({
        votes: newVotes,
        trust_score: newTrustScore
      })
      .eq('id', recipeId)
      .select()
      .single();

    if (updateError) throw updateError;

    return { data };
  } catch (error) {
    console.error('Error validating recipe:', error);
    return { error: 'Failed to update vote' };
  }
};