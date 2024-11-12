import React, { useState } from 'react';
import { Loader, Plus, X, Upload } from 'lucide-react';

interface RecipeFormProps {
  recipe: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string;
    cuisine_type?: string;
    prep_time?: string;
    cooking_time?: string;
    servings?: string;
    difficulty?: string;
    dietary_tags?: string[];
    author?: string;
    image_url?: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  submitting: boolean;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  recipe,
  onSubmit,
  onChange,
  submitting
}) => {
  const [currentIngredient, setCurrentIngredient] = useState('');
  const difficultyLevels = ['easy', 'medium', 'hard'];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'];

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      onChange('ingredients', [...(recipe.ingredients || []), currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    onChange('ingredients', (recipe.ingredients || []).filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 bg-brown-100 p-6 rounded-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Recipe Title"
          value={recipe.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          required
          className="col-span-2 p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400"
        />
        
        <input
          type="text"
          placeholder="Author Name"
          value={recipe.author || ''}
          onChange={(e) => onChange('author', e.target.value)}
          className="p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400"
        />

        <input
          type="url"
          placeholder="Image URL"
          value={recipe.image_url || ''}
          onChange={(e) => onChange('image_url', e.target.value)}
          className="p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400"
        />
      </div>
      
      <textarea
        placeholder="Description"
        value={recipe.description || ''}
        onChange={(e) => onChange('description', e.target.value)}
        required
        className="w-full p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400 h-24"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-brown-700">Ingredients</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add an ingredient"
            className="flex-1 p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="p-2 bg-brown-600 text-cream rounded hover:bg-brown-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(recipe.ingredients || []).map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-brown-200 text-brown-800 px-3 py-1 rounded-full"
            >
              <span>{ingredient}</span>
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="text-brown-600 hover:text-brown-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Cuisine Type"
          value={recipe.cuisine_type || ''}
          onChange={(e) => onChange('cuisine_type', e.target.value)}
          className="p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400"
        />
        
        <input
          type="text"
          placeholder="Prep Time"
          value={recipe.prep_time || ''}
          onChange={(e) => onChange('prep_time', e.target.value)}
          className="p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400"
        />

        <input
          type="text"
          placeholder="Cooking Time"
          value={recipe.cooking_time || ''}
          onChange={(e) => onChange('cooking_time', e.target.value)}
          className="p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Servings"
          value={recipe.servings || ''}
          onChange={(e) => onChange('servings', e.target.value)}
          className="p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400"
        />

        <div className="flex gap-4 items-center">
          {difficultyLevels.map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                value={level}
                checked={recipe.difficulty === level}
                onChange={(e) => onChange('difficulty', e.target.value)}
                className="mr-2"
              />
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-brown-700">Dietary Options</label>
        <div className="flex flex-wrap gap-4">
          {dietaryOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={(recipe.dietary_tags || []).includes(option)}
                onChange={(e) => {
                  const newDietary = e.target.checked
                    ? [...(recipe.dietary_tags || []), option]
                    : (recipe.dietary_tags || []).filter(d => d !== option);
                  onChange('dietary_tags', newDietary);
                }}
                className="mr-2"
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Instructions"
        value={recipe.instructions || ''}
        onChange={(e) => onChange('instructions', e.target.value)}
        required
        className="w-full p-2 rounded border border-brown-300 focus:ring-2 focus:ring-brown-400 h-32"
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 bg-brown-600 text-cream rounded hover:bg-brown-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Recipe'
        )}
      </button>
    </form>
  );
};