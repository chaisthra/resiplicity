import React, { useState } from 'react';
import { ImageIcon, Loader, AlertCircle } from 'lucide-react';

interface PlatingImageGeneratorProps {
  recipe: {
    title: string;
    description: string;
    plating?: string;
  };
  onImageGenerated?: (url: string) => void;
}

export const PlatingImageGenerator: React.FC<PlatingImageGeneratorProps> = ({ recipe, onImageGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);

    const prompt = `A retro 70s style food photo of ${recipe.title}. 
                   ${recipe.description}. 
                   ${recipe.plating || ''}
                   Styled like a vintage cookbook photo with bold colors and period-appropriate plating.`;

    try {
      const response = await fetch('http://localhost:4000/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (onImageGenerated) {
        onImageGenerated(data.url);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={generateImage}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brown-600 text-cream rounded-lg hover:bg-brown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Generating Plating Preview...
          </>
        ) : (
          <>
            <ImageIcon className="w-5 h-5" />
            Generate Plating Preview
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};