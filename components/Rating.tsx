import React from 'react';

interface RatingProps {
  rating: number;
}

const StarIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--warning)]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export const Rating: React.FC<RatingProps> = ({ rating }) => {
  return (
    <div className="flex items-center gap-2">
      <StarIcon />
      <span className="font-bold text-[var(--text-1)] text-lg">{rating.toFixed(1)}/10</span>
      <span className="text-sm text-[var(--text-3)]">(AI-powered analysis)</span>
    </div>
  );
};