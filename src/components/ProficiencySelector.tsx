import React from 'react';
import { ChefHat, Flame, Award, Trophy } from 'lucide-react';

interface ProficiencySelectorProps {
  onSelect: (level: string) => void;
  selectedLevel: string;
}

export const ProficiencySelector: React.FC<ProficiencySelectorProps> = ({ onSelect, selectedLevel }) => {
  const levels = [
    {
      value: 'beginner',
      label: 'Beginner',
      icon: ChefHat,
      description: 'New to cooking'
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      icon: Flame,
      description: 'Comfortable with basics'
    },
    {
      value: 'amateur',
      label: 'Amateur',
      icon: Award,
      description: 'Regular home cook'
    },
    {
      value: 'professional',
      label: 'Professional',
      icon: Trophy,
      description: 'Advanced techniques'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {levels.map(({ value, label, icon: Icon, description }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`p-6 rounded-lg transition-all ${
            selectedLevel === value
              ? 'bg-brown-600 text-cream'
              : 'bg-brown-100 hover:bg-brown-200 text-brown-800'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Icon className="w-6 h-6" />
            <span className="text-lg font-semibold">{label}</span>
          </div>
          <p className="text-sm opacity-80">{description}</p>
        </button>
      ))}
    </div>
  );
};