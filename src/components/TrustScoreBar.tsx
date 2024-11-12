import React from 'react';

interface TrustScoreBarProps {
  score: number;
  votes: number;
}

export const TrustScoreBar: React.FC<TrustScoreBarProps> = ({ score, votes }) => {
  // Calculate opacity based on number of votes (more votes = more opacity)
  const opacity = Math.min(0.3 + (votes / 10) * 0.7, 1);
  
  // Calculate color gradient from red to green
  const hue = (score / 100) * 120; // 0 = red, 120 = green
  const backgroundColor = `hsla(${hue}, 70%, 45%, ${opacity})`;

  return (
    <div className="flex items-center space-x-2">
      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${score}%`,
            backgroundColor
          }}
        />
      </div>
      <span className="text-sm font-medium text-brown-600">
        {score}%
      </span>
    </div>
  );
};