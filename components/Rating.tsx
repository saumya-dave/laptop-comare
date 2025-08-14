
import React from 'react';

interface RatingProps {
  rating: number;
}

const StarIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg className={`w-5 h-5 ${color}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const Rating: React.FC<RatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
      <span className="text-yellow-400 font-bold mr-2 text-sm">{rating.toFixed(1)}</span>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} color="text-yellow-400" />)}
        {/* Note: This simplified version doesn't render a visual half star, but accounts for it in empty stars. A more complex SVG could be used for a true half star. */}
        {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} color="text-gray-600" />)}
      </div>
    </div>
  );
};
