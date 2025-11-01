import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center bg-[var(--error-bg)] border border-[var(--error-border)] text-[var(--error-text)] px-5 py-4 rounded-xl relative max-w-3xl mx-auto mt-8" role="alert">
      <ErrorIcon />
      <div>
        <strong className="font-semibold">An error occurred: </strong>
        <span className="block sm:inline ml-1">{message}</span>
      </div>
    </div>
  );
};