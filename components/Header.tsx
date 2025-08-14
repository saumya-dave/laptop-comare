
import React from 'react';

const ChipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m6-6h3m-3 6h3M9 6h6M9 18h6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h-3a3 3 0 00-3 3v3a3 3 0 003 3h3a3 3 0 003-3v-3a3 3 0 00-3-3z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
            <ChipIcon />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
                AI Laptop Comparator
            </h1>
        </div>
      <p className="text-lg text-gray-400">
        Get instant, data-driven laptop comparisons powered by Gemini.
      </p>
    </header>
  );
};
