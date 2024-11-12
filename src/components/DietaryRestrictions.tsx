import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface DietaryRestrictionsProps {
  onComplete: (restrictions: string[]) => void;
}

export const DietaryRestrictions: React.FC<DietaryRestrictionsProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const restrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Low-Carb',
    'Keto',
    'Halal',
    'Kosher'
  ];

  const toggleRestriction = (restriction: string) => {
    setSelected(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {restrictions.map((restriction) => (
          <button
            key={restriction}
            onClick={() => toggleRestriction(restriction)}
            className={`p-4 rounded-lg flex items-center justify-between transition-all ${
              selected.includes(restriction)
                ? 'bg-amber-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-100'
            }`}
          >
            {restriction}
            {selected.includes(restriction) && <Check className="w-5 h-5" />}
          </button>
        ))}
      </div>
      <button
        onClick={() => onComplete(selected)}
        className="w-full p-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-all"
      >
        Continue
      </button>
    </div>
  );
};