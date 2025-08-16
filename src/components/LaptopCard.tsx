import React from 'react';
import type { LaptopComparison, SelectedBenchmark } from '../types';
import { parseBenchmarkScore } from '../utils/benchmarkUtils';

interface LaptopCardProps {
  laptop: LaptopComparison;
  onViewDetails: () => void;
  onViewBenchmark: (benchmark: SelectedBenchmark) => void;
}

const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CpuIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2}/>
    <rect x="9" y="9" width="6" height="6" strokeWidth={2}/>
    <line x1="9" y1="1" x2="9" y2="4" strokeWidth={2}/>
    <line x1="15" y1="1" x2="15" y2="4" strokeWidth={2}/>
    <line x1="9" y1="20" x2="9" y2="23" strokeWidth={2}/>
    <line x1="15" y1="20" x2="15" y2="23" strokeWidth={2}/>
    <line x1="20" y1="9" x2="23" y2="9" strokeWidth={2}/>
    <line x1="20" y1="14" x2="23" y2="14" strokeWidth={2}/>
    <line x1="1" y1="9" x2="4" y2="9" strokeWidth={2}/>
    <line x1="1" y1="14" x2="4" y2="14" strokeWidth={2}/>
  </svg>
);

const MemoryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={2}/>
    <circle cx="7" cy="12" r="1"/>
    <circle cx="12" cy="12" r="1"/>
    <circle cx="17" cy="12" r="1"/>
  </svg>
);

const StorageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth={2}/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" strokeWidth={2}/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" strokeWidth={2}/>
  </svg>
);

const DisplayIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth={2}/>
    <line x1="8" y1="21" x2="16" y2="21" strokeWidth={2}/>
    <line x1="12" y1="17" x2="12" y2="21" strokeWidth={2}/>
  </svg>
);

export const LaptopCard: React.FC<LaptopCardProps> = ({ laptop, onViewDetails, onViewBenchmark }) => {
  const { brand, model, rating, summary, specs } = laptop;
  
  // Generate a consistent seed for the image based on the model name
  const seed = model.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate a price (this would come from your data in a real app)
  const price = Math.floor(Math.random() * 200000) + 50000;
  
  // Parse benchmark scores
  const cpuScore = parseBenchmarkScore(specs.cpuBenchmark);
  const gpuScore = parseBenchmarkScore(specs.gpuBenchmark);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Availability Badge and Heart */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <HeartIcon />
          </button>
        </div>
        
        {/* Laptop Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <div className="w-32 h-20 bg-gradient-to-br from-purple-300 to-blue-300 rounded-lg flex items-center justify-center">
            <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="12" rx="2" strokeWidth={2}/>
              <rect x="2" y="16" width="20" height="2" rx="1" strokeWidth={2}/>
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Title and Rating */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{brand} {model}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <StarIcon />
              <span className="text-sm font-medium text-gray-900 ml-1">
                {rating ? `${rating.toFixed(1)}/10` : '9.4/10'}
              </span>
            </div>
            <span className="text-sm text-gray-500">Released June 2024</span>
          </div>
        </div>

        {/* Key Specs */}
        <div className="space-y-3 mb-6">
          {specs.Processor && (
            <div className="flex items-center gap-3">
              <CpuIcon />
              <span className="text-sm text-gray-700">{specs.Processor}</span>
            </div>
          )}
          {specs.RAM && (
            <div className="flex items-center gap-3">
              <MemoryIcon />
              <span className="text-sm text-gray-700">{specs.RAM}</span>
            </div>
          )}
          {specs.Storage && (
            <div className="flex items-center gap-3">
              <StorageIcon />
              <span className="text-sm text-gray-700">{specs.Storage}</span>
            </div>
          )}
          {specs.Display && (
            <div className="flex items-center gap-3">
              <DisplayIcon />
              <span className="text-sm text-gray-700">{specs.Display}</span>
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            ₹{price.toLocaleString('en-IN')}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onViewDetails}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              View Details
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};