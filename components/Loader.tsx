import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-28">
      <svg className="animate-spin h-12 w-12 text-[var(--brand)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <p className="mt-6 text-xl font-semibold text-[var(--text-1)]">Consulting with the AI expert...</p>
        <p className="text-[var(--text-2)] mt-1">Analyzing millions of data points to find your perfect match.</p>
      </div>
    </div>
  );
};