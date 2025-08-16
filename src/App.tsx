import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchResults } from './components/SearchResults';
import { LaptopDetail } from './components/LaptopDetail';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { getLaptopComparison } from './services/geminiService';
import type { LaptopComparison, GroundingChunk, SelectedBenchmark } from './types';
import { BenchmarkModal } from './components/BenchmarkModal';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<LaptopComparison[] | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState<SelectedBenchmark | null>(null);
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopComparison | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'detail'>('home');

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) {
      setError('Please enter a query to start the comparison.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setComparisonResult(null);
    setSources([]);
    setCurrentView('search');

    try {
      const result = await getLaptopComparison(searchTerm);
      setComparisonResult(result.comparisons);
      setSources(result.sources);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);
  
  const handleViewBenchmark = useCallback((benchmark: SelectedBenchmark) => {
    setSelectedBenchmark(benchmark);
  }, []);

  const handleCloseBenchmarkModal = useCallback(() => {
    setSelectedBenchmark(null);
  }, []);

  const handleViewLaptop = useCallback((laptop: LaptopComparison) => {
    setSelectedLaptop(laptop);
    setCurrentView('detail');
  }, []);

  const handleBackToSearch = useCallback(() => {
    setSelectedLaptop(null);
    setCurrentView('search');
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentView('home');
    setComparisonResult(null);
    setSelectedLaptop(null);
    setQuery('');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onBackToHome={handleBackToHome}
        showBackButton={currentView !== 'home'}
      />
      
      <main>
        {currentView === 'home' && (
          <Hero 
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        )}

        {currentView === 'search' && (
          <SearchResults
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
            error={error}
            results={comparisonResult}
            sources={sources}
            onViewLaptop={handleViewLaptop}
            onViewBenchmark={handleViewBenchmark}
          />
        )}

        {currentView === 'detail' && selectedLaptop && (
          <LaptopDetail
            laptop={selectedLaptop}
            onBack={handleBackToSearch}
            onViewBenchmark={handleViewBenchmark}
          />
        )}
      </main>
      
      {selectedBenchmark && (
        <BenchmarkModal 
          isOpen={!!selectedBenchmark}
          onClose={handleCloseBenchmarkModal}
          benchmark={selectedBenchmark}
        />
      )}
    </div>
  );
};

export default App;