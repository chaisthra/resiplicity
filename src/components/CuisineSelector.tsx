import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface CuisineOption {
  name: string;
  subcategories?: string[];
}

interface CuisineSelectorProps {
  options: CuisineOption[];
  onSelect: (cuisine: string) => void;
}

export const CuisineSelector: React.FC<CuisineSelectorProps> = ({ options, onSelect }) => {
  const [selectedMain, setSelectedMain] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {options.map((cuisine) => (
        <div key={cuisine.name} className="space-y-2">
          <button
            onClick={() => setSelectedMain(cuisine.name)}
            className="w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-left flex items-center justify-between transition-all"
          >
            <span>{cuisine.name}</span>
            <ChevronRight className={`w-5 h-5 transition-transform ${
              selectedMain === cuisine.name ? 'rotate-90' : ''
            }`} />
          </button>
          
          {selectedMain === cuisine.name && cuisine.subcategories && (
            <div className="ml-4 space-y-2">
              {cuisine.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => onSelect(`${cuisine.name} - ${sub}`)}
                  className="w-full p-3 rounded-lg bg-gray-700 hover:bg-amber-600 text-left transition-all"
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};