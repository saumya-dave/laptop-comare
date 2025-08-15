import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryCards } from './components/CategoryCards';
import { TopPicks } from './components/TopPicks';
import { BlogSection } from './components/BlogSection';
import { AIFinderModal } from './components/AIFinderModal';
import { ComparisonModal } from './components/ComparisonModal';
import { Footer } from './components/Footer';
import type { LaptopComparison } from './types';

const App: React.FC = () => {
  const [isAIFinderOpen, setIsAIFinderOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [selectedLaptops, setSelectedLaptops] = useState<LaptopComparison[]>([]);

  const handleOpenAIFinder = useCallback(() => {
    setIsAIFinderOpen(true);
  }, []);

  const handleCloseAIFinder = useCallback(() => {
    setIsAIFinderOpen(false);
  }, []);

  const handleOpenComparison = useCallback((laptops: LaptopComparison[]) => {
    setSelectedLaptops(laptops);
    setIsComparisonOpen(true);
  }, []);

  const handleCloseComparison = useCallback(() => {
    setIsComparisonOpen(false);
    setSelectedLaptops([]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAIFinder={handleOpenAIFinder} />
      
      <main>
        <Hero onOpenAIFinder={handleOpenAIFinder} />
        <CategoryCards />
        <TopPicks onOpenComparison={handleOpenComparison} />
        <BlogSection />
      </main>

      <Footer />

      {isAIFinderOpen && (
        <AIFinderModal 
          isOpen={isAIFinderOpen}
          onClose={handleCloseAIFinder}
          onResults={handleOpenComparison}
        />
      )}

      {isComparisonOpen && (
        <ComparisonModal
          isOpen={isComparisonOpen}
          onClose={handleCloseComparison}
          laptops={selectedLaptops}
        />
      )}
    </div>
  );
};

export default App;