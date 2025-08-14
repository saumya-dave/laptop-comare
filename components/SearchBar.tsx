
import React from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading }) => {
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-3xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., 'Compare MacBook Air M3 vs Dell XPS 13'"
        className="w-full px-5 py-3 bg-gray-800 border-2 border-gray-700 rounded-full text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
        disabled={isLoading}
      />
      <button
        onClick={onSearch}
        disabled={isLoading || !query.trim()}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-cyan-600 text-white font-semibold rounded-full hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 disabled:shadow-none"
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
            </>
        ) : (
            <>
                <SearchIcon />
                <span>Compare</span>
            </>
        )}
      </button>
    </div>
  );
};
