import React from 'react';
import type { LaptopComparison } from '../types';

interface TopPicksProps {
  onOpenComparison: (laptops: LaptopComparison[]) => void;
}

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CompareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const mockLaptops: LaptopComparison[] = [
  {
    brand: 'Apple',
    model: 'MacBook Air M3',
    rating: 4.8,
    summary: 'Perfect balance of performance and portability with exceptional battery life',
    specs: {
      Processor: 'Apple M3 8-core',
      RAM: '16GB Unified Memory',
      Storage: '512GB SSD',
      Display: '13.6" Liquid Retina',
      Graphics: 'M3 10-core GPU',
      Weight: '2.7 lbs'
    },
    pros: ['Excellent battery life', 'Silent operation', 'Premium build quality'],
    cons: ['Limited ports', 'Expensive upgrades']
  },
  {
    brand: 'Dell',
    model: 'XPS 13 Plus',
    rating: 4.6,
    summary: 'Sleek Windows ultrabook with stunning display and premium design',
    specs: {
      Processor: 'Intel Core i7-1360P',
      RAM: '16GB LPDDR5',
      Storage: '1TB SSD',
      Display: '13.4" OLED 3.5K',
      Graphics: 'Intel Iris Xe',
      Weight: '2.73 lbs'
    },
    pros: ['Gorgeous OLED display', 'Premium materials', 'Fast performance'],
    cons: ['Average battery life', 'Gets warm under load']
  },
  {
    brand: 'ASUS',
    model: 'ROG Zephyrus G14',
    rating: 4.7,
    summary: 'Compact gaming powerhouse with AMD Ryzen and RTX graphics',
    specs: {
      Processor: 'AMD Ryzen 9 7940HS',
      RAM: '32GB DDR5',
      Storage: '1TB SSD',
      Display: '14" QHD 165Hz',
      Graphics: 'RTX 4070',
      Weight: '3.64 lbs'
    },
    pros: ['Excellent gaming performance', 'Good battery life for gaming laptop', 'Compact size'],
    cons: ['Can get loud under load', 'Expensive']
  }
];

export const TopPicks: React.FC<TopPicksProps> = ({ onOpenComparison }) => {
  const handleCompare = () => {
    onOpenComparison(mockLaptops);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Editor's Top Picks
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our AI-curated selection of the best laptops across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {mockLaptops.map((laptop, index) => {
            const seed = laptop.model.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <img 
                    src={`https://picsum.photos/seed/${seed}/400/250`} 
                    alt={`${laptop.brand} ${laptop.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <StarIcon />
                    <span className="font-semibold text-sm">{laptop.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                      {laptop.brand}
                    </h3>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      {laptop.model}
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {laptop.summary}
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Processor:</span>
                      <span className="font-medium text-slate-700">{laptop.specs.Processor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">RAM:</span>
                      <span className="font-medium text-slate-700">{laptop.specs.RAM}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Storage:</span>
                      <span className="font-medium text-slate-700">{laptop.specs.Storage}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleCompare}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-xl hover:shadow-green-500/25 flex items-center space-x-2 mx-auto"
          >
            <CompareIcon />
            <span>Compare These Laptops</span>
          </button>
        </div>
      </div>
    </section>
  );
};