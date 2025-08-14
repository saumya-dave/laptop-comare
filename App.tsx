
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ComparisonResult } from './components/ComparisonResult';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { getLaptopComparison } from './services/geminiService';
import type { LaptopComparison, GroundingChunk, SelectedBenchmark } from './types';
import { SourcePill } from './components/SourcePill';
import { BenchmarkModal } from './components/BenchmarkModal';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<LaptopComparison[] | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState<SelectedBenchmark | null>(null);


  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError('Please enter a query to start the comparison.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setComparisonResult(null);
    setSources([]);

    try {
      const result = await getLaptopComparison(query);
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        
        <main className="mt-8">
          <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} isLoading={isLoading} />

          {error && <ErrorMessage message={error} />}

          {isLoading && <Loader />}

          {comparisonResult && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center text-cyan-400 mb-8">Comparison Results</h2>
              <ComparisonResult 
                results={comparisonResult} 
                onViewBenchmark={handleViewBenchmark}
              />
            </div>
          )}

          {sources.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-400 mb-4">Sources:</h3>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, index) => (
                  <SourcePill key={index} source={source} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && !comparisonResult && !error && (
             <div className="text-center text-gray-500 mt-20">
              <p className="text-lg">Ready to find your next laptop?</p>
              <p>Enter your requirements above, like "best ultrabooks for students" or "compare Dell XPS 15 vs MacBook Pro 16".</p>
            </div>
          )}
        </main>
      </div>
      
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
