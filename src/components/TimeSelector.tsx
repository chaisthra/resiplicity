import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSelectorProps {
  onSelect: (time: string) => void;
  selectedTime: string;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ onSelect, selectedTime }) => {
  const timeOptions = [
    { value: '15min', label: '15 minutes', description: 'Quick & Easy' },
    { value: '30min', label: '30 minutes', description: 'Express Meal' },
    { value: '60min', label: '1 hour', description: 'Standard Cooking' },
    { value: '90min', label: '1.5 hours', description: 'Elaborate Dish' },
    { value: '120min+', label: '2+ hours', description: 'Gourmet Experience' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {timeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`p-6 rounded-lg transition-all ${
            selectedTime === option.value
              ? 'bg-brown-600 text-cream'
              : 'bg-brown-100 hover:bg-brown-200 text-brown-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{option.label}</span>
          </div>
          <p className="text-sm opacity-80">{option.description}</p>
        </button>
      ))}
    </div>
  );
};