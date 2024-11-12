import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, Scale, ChefHat } from 'lucide-react';
import { generateRecipe } from '../services/api';
import { supabase } from '../services/supabase';
import { FoodImageGenerator } from './FoodImageGenerator';

interface Recipe {
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

interface RecipeOutputProps {
  formData: {
    ingredients: string[];
    selectedCuisine: string;
    dietaryRestrictions: string[];
    proficiency: string;
    timeAvailable: string;
  };
}

export const RecipeOutput: React.FC<RecipeOutputProps> = ({ formData }) => {
  const [showPlating, setShowPlating] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!formData.ingredients.length) {
          throw new Error('No ingredients provided');
        }

        const result = await generateRecipe({
          ingredients: formData.ingredients,
          cuisine: formData.selectedCuisine,
          restrictions: formData.dietaryRestrictions,
          proficiency: formData.proficiency,
          timeAvailable: formData.timeAvailable
        });

        if (!result.success || !result.recipe) {
          throw new Error(result.error || 'Failed to generate recipe');
        }

        const validatedRecipe = validateRecipeStructure(result.recipe);
        setRecipe(validatedRecipe);
        await saveRecipe(validatedRecipe);
      } catch (err) {
        console.error('Recipe generation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate recipe');
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [formData]);

  const validateRecipeStructure = (data: any): Recipe => {
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

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Invalid recipe data: Missing ${missingFields.join(', ')}`);
    }

    if (!Array.isArray(data.ingredients)) {
      throw new Error('Invalid recipe data: ingredients must be an array');
    }

    if (!Array.isArray(data.instructions)) {
      throw new Error('Invalid recipe data: instructions must be an array');
    }

    if (typeof data.nutrition !== 'object' || !data.nutrition) {
      throw new Error('Invalid recipe data: nutrition must be an object');
    }

    const requiredNutrition = ['calories', 'protein', 'carbs', 'fat'];
    const missingNutrition = requiredNutrition.filter(field => !data.nutrition[field]);
    if (missingNutrition.length > 0) {
      throw new Error(`Invalid recipe data: Missing nutrition fields ${missingNutrition.join(', ')}`);
    }

    return {
      title: String(data.title),
      description: String(data.description),
      prepTime: String(data.prepTime),
      cookTime: String(data.cookTime),
      totalTime: String(data.totalTime),
      difficulty: String(data.difficulty),
      ingredients: data.ingredients.map(String),
      alternativeIngredients: data.alternativeIngredients || {},
      instructions: data.instructions.map(String),
      nutrition: {
        calories: String(data.nutrition.calories),
        protein: String(data.nutrition.protein),
        carbs: String(data.nutrition.carbs),
        fat: String(data.nutrition.fat)
      },
      plating: String(data.plating),
      history: String(data.history)
    };
  };

  const saveRecipe = async (recipeData: Recipe) => {
    if (!recipeData || saving) return;

    try {
      setSaving(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      const { error: saveError } = await supabase
        .from('generated_recipes')
        .insert([{
          user_id: userData.user.id,
          title: recipeData.title,
          description: recipeData.description,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          prep_time: recipeData.prepTime,
          cook_time: recipeData.cookTime,
          total_time: recipeData.totalTime,
          difficulty: recipeData.difficulty,
          nutrition: recipeData.nutrition,
          plating: recipeData.plating,
          history: recipeData.history,
          cuisine_type: formData.selectedCuisine,
          dietary_restrictions: formData.dietaryRestrictions,
          alternative_ingredients: recipeData.alternativeIngredients
        }]);

      if (saveError) throw saveError;
      setSaved(true);
    } catch (err) {
      console.error('Failed to save recipe:', err);
      setError('Failed to save recipe to your collection');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-brown-100 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-display text-brown-800">{recipe.title}</h3>
          {saved && (
            <span className="text-green-600 text-sm">
              ✓ Saved to your collection
            </span>
          )}
        </div>
        <p className="text-brown-700 mb-6">{recipe.description}</p>

        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brown-600" />
            <span className="text-sm">
              Prep: {recipe.prepTime}<br />
              Cook: {recipe.cookTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-brown-600" />
            <span className="text-sm">
              {recipe.difficulty} difficulty
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-brown-600" />
            <span className="text-sm">
              {formData.proficiency} level
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-brown-800">Instructions</h4>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="text-brown-700">{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setShowPlating(!showPlating)}
          className="w-full p-4 rounded-lg bg-brown-200 hover:bg-brown-300 flex items-center justify-between transition-all text-brown-800"
        >
          <span>Plating Suggestions</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${showPlating ? 'rotate-180' : ''}`} />
        </button>
        {showPlating && (
          <div className="p-4 bg-brown-100 rounded-lg text-brown-700">
            {recipe.plating}
          </div>
        )}

        <button
          onClick={() => setShowNutrition(!showNutrition)}
          className="w-full p-4 rounded-lg bg-brown-200 hover:bg-brown-300 flex items-center justify-between transition-all text-brown-800"
        >
          <span>Nutritional Information</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${showNutrition ? 'rotate-180' : ''}`} />
        </button>
        {showNutrition && (
          <div className="p-4 bg-brown-100 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-brown-700">
                <span className="font-semibold">Calories:</span> {recipe.nutrition.calories}
              </div>
              <div className="text-brown-700">
                <span className="font-semibold">Protein:</span> {recipe.nutrition.protein}
              </div>
              <div className="text-brown-700">
                <span className="font-semibold">Carbs:</span> {recipe.nutrition.carbs}
              </div>
              <div className="text-brown-700">
                <span className="font-semibold">Fat:</span> {recipe.nutrition.fat}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full p-4 rounded-lg bg-brown-200 hover:bg-brown-300 flex items-center justify-between transition-all text-brown-800"
        >
          <span>Recipe History & Origin</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
        </button>
        {showHistory && (
          <div className="p-4 bg-brown-100 rounded-lg text-brown-700">
            {recipe.history}
          </div>
        )}
      </div>

      <div className="mt-8">
        <FoodImageGenerator 
          onImageGenerated={(url) => {
            console.log('Generated image:', url);
          }} 
        />
      </div>
    </div>
  );
};