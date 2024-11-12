import React, { useState, useEffect } from 'react';
import { RecipeCard } from './RecipeCard';
import { RecipeForm } from './RecipeForm';
import type { Recipe } from '../types/recipe';
import { supabase } from '../services/supabase';

export const CommunityRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: [] as string[],
    instructions: '',
    cuisine_type: '',
    prep_time: '',
    cooking_time: '',
    servings: '',
    difficulty: '',
    dietary_tags: [] as string[],
    image_url: ''
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setRecipes(data || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('recipes')
        .insert([{
          ...newRecipe,
          author: 'Anonymous',
          trust_score: 50,
          votes: 0,
          comments: 0,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setShowSubmitForm(false);
      setNewRecipe({
        title: '',
        description: '',
        ingredients: [],
        instructions: '',
        cuisine_type: '',
        prep_time: '',
        cooking_time: '',
        servings: '',
        difficulty: '',
        dietary_tags: [],
        image_url: ''
      });
      fetchRecipes();
    } catch (error) {
      console.error('Error submitting recipe:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-display text-brown-800">Community Recipes</h2>
        <button
          onClick={() => setShowSubmitForm(!showSubmitForm)}
          className="px-4 py-2 bg-brown-600 text-cream rounded-lg hover:bg-brown-700 transition-all"
        >
          Share Your Recipe
        </button>
      </div>

      {showSubmitForm && (
        <RecipeForm
          recipe={newRecipe}
          onSubmit={handleSubmit}
          onChange={(field, value) => setNewRecipe(prev => ({ ...prev, [field]: value }))}
          submitting={submitting}
        />
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-12 text-brown-600">
          No recipes yet. Be the first to share one!
        </div>
      ) : (
        <div className="grid gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onUpdate={handleRecipeUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};