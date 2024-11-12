import React from 'react';

export const SimmeringStories: React.FC = () => {
  return (
    <div className="w-full h-[800px] rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://rad-raindrop-f2036d.netlify.app/"
        title="Simmering Stories"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
};