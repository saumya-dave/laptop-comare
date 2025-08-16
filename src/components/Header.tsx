import React from 'react';

interface HeaderProps {
  onBackToHome: () => void;
  showBackButton?: boolean;
}

const LaptopIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="2" y="16" width="20" height="2" rx="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onBackToHome, showBackButton }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={onBackToHome}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white">
                <LaptopIcon />
              </div>
              <span className="text-2xl font-bold text-gray-900">LaptopAI</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
              AI Search
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Compare
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Reviews
            </a>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};