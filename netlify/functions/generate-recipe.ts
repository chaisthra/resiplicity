import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { ingredients, cuisine, restrictions, proficiency } = JSON.parse(event.body || '{}');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a detailed recipe using these ingredients: ${ingredients.join(', ')}
                   Cuisine type: ${cuisine}
                   Dietary restrictions: ${restrictions.join(', ')}
                   Cook's proficiency: ${proficiency}
                   
                   Format the response in the following structure:
                   {
                     "title": "Recipe Name",
                     "description": "Brief description",
                     "prepTime": "Preparation time",
                     "cookTime": "Cooking time",
                     "difficulty": "Easy/Medium/Hard",
                     "instructions": ["Step 1", "Step 2", ...],
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
    
    let recipeData;
    try {
      recipeData = JSON.parse(response.text());
    } catch {
      throw new Error('Failed to generate a valid recipe format');
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ recipe: recipeData })
    };
  } catch (error: any) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to generate recipe'
      })
    };
  }
};