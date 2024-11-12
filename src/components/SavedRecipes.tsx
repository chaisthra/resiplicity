import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, ChevronDown, Clock, Scale, ChefHat } from 'lucide-react';
import { getGeneratedRecipes } from '../services/supabase';
import type { Recipe } from '../types/recipe';

export const SavedRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getGeneratedRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader className="w-8 h-8 animate-spin text-brown-600" />
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

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-brown-600">No saved recipes yet. Generate some recipes to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recipes.map((recipe) => (
        <motion.div
          key={recipe.id}
          layout
          className="bg-brown-100 rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-display text-brown-800 mb-2">{recipe.title}</h3>
                <div className="flex items-center gap-4 text-sm text-brown-600">
                  {recipe.prep_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {recipe.prep_time}
                    </div>
                  )}
                  {recipe.difficulty && (
                    <div className="flex items-center gap-1">
                      <Scale className="w-4 h-4" />
                      {recipe.difficulty}
                    </div>
                  )}
                  {recipe.cuisine_type && (
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      {recipe.cuisine_type}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
                className="p-2 hover:bg-brown-200 rounded-full transition-colors"
              >
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedId === recipe.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            <p className="text-brown-700">{recipe.description}</p>

            <AnimatePresence>
              {expandedId === recipe.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-brown-200 overflow-hidden"
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-brown-800 mb-2">Ingredients</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-brown-700">{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-brown-800 mb-2">Instructions</h4>
                      <div className="text-brown-700 whitespace-pre-line">
                        {recipe.instructions}
                      </div>
                    </div>

                    {recipe.plating && (
                      <div>
                        <h4 className="font-semibold text-brown-800 mb-2">Plating Suggestions</h4>
                        <p className="text-brown-700">{recipe.plating}</p>
                        {recipe.plating_image && (
                          <img
                            src={recipe.plating_image}
                            alt={`Plating suggestion for ${recipe.title}`}
                            className="mt-4 w-full rounded-lg shadow-lg"
                          />
                        )}
                      </div>
                    )}

                    {recipe.nutrition && (
                      <div>
                        <h4 className="font-semibold text-brown-800 mb-2">Nutrition Information</h4>
                        <div className="grid grid-cols-2 gap-2 text-brown-700">
                          <div>Calories: {recipe.nutrition.calories}</div>
                          <div>Protein: {recipe.nutrition.protein}</div>
                          <div>Carbs: {recipe.nutrition.carbs}</div>
                          <div>Fat: {recipe.nutrition.fat}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
};