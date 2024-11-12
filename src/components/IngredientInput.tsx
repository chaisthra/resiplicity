import React, { useState, useCallback } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { analyzeImage } from '../services/api';

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, onChange }) => {
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      onChange([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
      setError(null);
    }
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, []);

   const processImage = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImage(file);
      
      if (!result.success || !result.ingredients) {
        setError(result.error || 'Failed to analyze image');
        return;
      }

      const newIngredients = result.ingredients
        .filter(ingredient => ingredient && !ingredients.includes(ingredient));
      
      if (newIngredients.length > 0) {
        onChange([...ingredients, ...newIngredients]);
      } else {
        setError('No new ingredients detected in the image');
      }
    } catch (err) {
      setError('Failed to analyze image');
      console.error('Image analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all bg-brown-100
          ${error ? 'border-red-400' : 'border-brown-300 hover:border-brown-500'}`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${error ? 'text-red-400' : 'text-brown-400'}`} />
          <p className={`${error ? 'text-red-600' : 'text-brown-700'}`}>
            {isAnalyzing ? 'Analyzing image...' : error || 'Upload or drag & drop an image'}
          </p>
          {!error && !isAnalyzing && (
            <p className="text-sm text-brown-500 mt-2">
              We'll analyze the ingredients for you
            </p>
          )}
        </label>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter an ingredient"
          className="flex-1 p-3 rounded-lg border border-brown-300 bg-cream focus:outline-none focus:ring-2 focus:ring-brown-400 text-brown-800 placeholder-brown-400"
        />
        <button
          onClick={addIngredient}
          className="p-3 rounded-lg bg-brown-600 text-cream hover:bg-brown-700 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-brown-100 text-brown-800 px-3 py-1 rounded-full"
          >
            <span>{ingredient}</span>
            <button
              onClick={() => removeIngredient(index)}
              className="text-brown-600 hover:text-brown-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};