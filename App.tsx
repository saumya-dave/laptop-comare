import React, { useState, useCallback, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ComparisonResult } from './components/ComparisonResult';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { getLaptopComparison } from './services/geminiService';
import type { LaptopComparison, GroundingChunk } from './types';
import { SourcePill } from './components/SourcePill';
import { HistoryPanel } from './components/HistoryPanel';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<LaptopComparison[] | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('laptopSearchHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      localStorage.removeItem('laptopSearchHistory');
    }
  }, []);

  const updateHistory = (newQuery: string) => {
    const updatedHistory = [
      newQuery,
      ...history.filter(h => h.toLowerCase() !== newQuery.toLowerCase())
    ].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('laptopSearchHistory', JSON.stringify(updatedHistory));
  };

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const currentQuery = searchQuery || query;
    if (!currentQuery.trim()) {
      setError('Please enter a query to start the comparison.');
      return;
    }
    
    setIsHistoryVisible(false);
    setIsLoading(true);
    setError(null);
    setComparisonResult(null);
    setSources([]);

    try {
      const result = await getLaptopComparison(currentQuery);
      setComparisonResult(result.comparisons);
      setSources(result.sources);
      updateHistory(currentQuery);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [query, history]);
  
  const handleHistorySearch = useCallback((historyQuery: string) => {
    setQuery(historyQuery);
    handleSearch(historyQuery);
  }, [handleSearch]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('laptopSearchHistory');
    setIsHistoryVisible(false);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--surface-1)] text-[var(--text-2)] font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <header className="text-center mb-10 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-1)] font-serif">
                Laptop AI
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-2)] mt-4 max-w-2xl mx-auto">
              Your personal AI expert for instant, data-driven laptop recommendations.
            </p>
        </header>

        <main>
          <div className="relative max-w-3xl mx-auto">
            <SearchBar 
              query={query} 
              setQuery={setQuery} 
              onSearch={() => handleSearch()} 
              isLoading={isLoading}
              onToggleHistory={() => setIsHistoryVisible(prev => !prev)}
            />
            <HistoryPanel
              isVisible={isHistoryVisible}
              history={history}
              onSelect={handleHistorySearch}
              onClear={handleClearHistory}
              onClose={() => setIsHistoryVisible(false)}
            />
          </div>

          {error && <ErrorMessage message={error} />}

          {isLoading && <Loader />}

          {comparisonResult && (
            <div className="mt-12 sm:mt-16">
              <ComparisonResult 
                results={comparisonResult} 
              />
            </div>
          )}

          {sources.length > 0 && (
            <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
              <h3 className="text-xl font-semibold text-[var(--text-1)] mb-4">Data Sources</h3>
              <div className="flex flex-wrap gap-3">
                {sources.map((source, index) => (
                  <SourcePill key={index} source={source} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && !comparisonResult && !error && (
             <div className="text-center text-[var(--text-3)] mt-20 sm:mt-28">
              <p className="text-2xl font-serif text-[var(--text-1)]">Find Your Perfect Laptop</p>
              <p className="mt-2 text-sm sm:text-base">Enter your needs above. Try "powerful gaming laptops under $1500" <br className="hidden sm:block" /> or "compare the latest MacBooks for video editing".</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;