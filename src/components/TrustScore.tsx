import React from 'react';

interface TrustScoreProps {
  score: number;
  votes: number;
}

export const TrustScore: React.FC<TrustScoreProps> = ({ score, votes }) => {
  const getScoreColor = (score: number, votes: number) => {
    if (votes < 5) return 'bg-gray-200';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTextColor = (score: number, votes: number) => {
    if (votes < 5) return 'text-gray-600';
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-700';
    if (score >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <div className="relative pt-1">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className={`text-sm font-semibold ${getTextColor(score, votes)}`}>
            Trust Score
          </span>
        </div>
        <div className="text-right">
          <span className={`text-sm font-semibold ${getTextColor(score, votes)}`}>
            {score}%
          </span>
        </div>
      </div>
      <div className="flex h-2 overflow-hidden bg-gray-200 rounded">
        <div
          style={{ width: `${score}%` }}
          className={`${getScoreColor(score, votes)} transition-all duration-500`}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Based on {votes} {votes === 1 ? 'vote' : 'votes'}
      </div>
    </div>
  );
};