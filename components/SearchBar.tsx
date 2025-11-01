import React from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  onToggleHistory: () => void;
}

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const HistoryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);


export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading, onToggleHistory }) => {
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      onSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-3xl mx-auto bg-[var(--surface-2)] border border-[var(--surface-4)] rounded-xl shadow-custom pr-1.5 sm:pr-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--brand)] focus-within:border-[var(--brand)]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., 'MacBook M3 vs Dell XPS 13'"
        className="w-full pl-4 sm:pl-5 pr-2 py-3 sm:py-4 bg-transparent text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none text-sm sm:text-base"
        disabled={isLoading}
      />
      <button
        onClick={onToggleHistory}
        disabled={isLoading}
        className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 text-[var(--text-2)] hover:text-[var(--brand)] disabled:text-[var(--text-3)] disabled:cursor-not-allowed transition-colors duration-300 rounded-lg hover:bg-[var(--surface-3)] shrink-0"
        aria-label="Toggle search history"
        title="Search History"
      >
        <HistoryIcon />
      </button>
      <button
        onClick={onSearch}
        disabled={isLoading || !query.trim()}
        className="flex items-center justify-center gap-2 w-auto px-4 sm:px-6 py-3 bg-[var(--brand)] text-[var(--brand-text)] font-semibold rounded-lg hover:bg-[var(--brand-hover)] disabled:bg-[var(--surface-4)] disabled:text-[var(--text-3)] disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md shrink-0"
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm sm:text-base">Analyzing...</span>
            </>
        ) : (
            <>
                <SearchIcon />
                <span className="hidden sm:inline">Compare</span>
            </>
        )}
      </button>
    </div>
  );
};