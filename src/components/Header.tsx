import React from 'react';

interface HeaderProps {
  onOpenAIFinder: () => void;
}

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const LaptopIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onOpenAIFinder }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl">
              <LaptopIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">LaptopAI</h1>
              <p className="text-xs text-slate-500 -mt-1">Smart Comparisons</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Browse Laptops
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Compare
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Guides
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Reviews
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAIFinder}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
            >
              <SearchIcon />
              <span className="hidden sm:inline">AI Finder</span>
            </button>
            
            <button className="md:hidden p-2 text-slate-600 hover:text-blue-600">
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};