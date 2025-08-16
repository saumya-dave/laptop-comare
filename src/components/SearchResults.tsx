import React from 'react';
import type { LaptopComparison, GroundingChunk, SelectedBenchmark } from '../types';
import { LaptopCard } from './LaptopCard';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { SourcePill } from './SourcePill';

interface SearchResultsProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  error: string | null;
  results: LaptopComparison[] | null;
  sources: GroundingChunk[];
  onViewLaptop: (laptop: LaptopComparison) => void;
  onViewBenchmark: (benchmark: SelectedBenchmark) => void;
}

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  setQuery,
  onSearch,
  isLoading,
  error,
  results,
  sources,
  onViewLaptop,
  onViewBenchmark
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  const popularSearches = [
    'Gaming laptop under 80000',
    'MacBook Air M3',
    'Business laptop with 16GB RAM',
    'Ultrabook under 60000',
    'Latest Dell XPS',
    'ASUS ROG gaming'
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Laptop Search</h1>
          <p className="text-gray-600">Describe what you're looking for and let our AI find the perfect laptops for you</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your ideal laptop (e.g., 'gaming laptop under 80000 with RTX 4060')"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={onSearch}
              disabled={isLoading || !query.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Find Laptops
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters and Results Count */}
        {!isLoading && results && (
          <div className="flex justify-between items-center mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FilterIcon />
              Show Filters
            </button>
            <span className="text-gray-600">Found {results.length} laptops</span>
          </div>
        )}

        {/* Popular Searches */}
        {!isLoading && !results && !error && (
          <div className="text-center mb-12">
            <p className="text-gray-600 mb-4">Try these popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    setQuery(search);
                    setTimeout(() => onSearch(), 100);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <Loader />}

        {/* Error State */}
        {error && <ErrorMessage message={error} />}

        {/* Results */}
        {results && results.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Laptops</h2>
              <p className="text-gray-600">Popular choices for gaming and productivity</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {results.map((laptop, index) => (
                <LaptopCard
                  key={index}
                  laptop={laptop}
                  onViewDetails={() => onViewLaptop(laptop)}
                  onViewBenchmark={onViewBenchmark}
                />
              ))}
            </div>
          </>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sources:</h3>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, index) => (
                <SourcePill key={index} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !results && !error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <SparklesIcon />
            </div>
            <p className="text-xl text-gray-600">Ready to find your perfect laptop?</p>
            <p className="text-gray-500">Enter your requirements above to get AI-powered recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
};