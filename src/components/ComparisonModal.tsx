import React from 'react';
import type { LaptopComparison } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  laptops: LaptopComparison[];
}

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, laptops }) => {
  if (!isOpen) return null;

  const specs = ['Processor', 'RAM', 'Storage', 'Display', 'Graphics', 'Weight'];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Laptop Comparison</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Laptop Headers */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50">
              <div className="font-semibold text-slate-700">Specification</div>
              {laptops.slice(0, 3).map((laptop, index) => {
                const seed = laptop.model.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                return (
                  <div key={index} className="text-center">
                    <img 
                      src={`https://picsum.photos/seed/${seed}/200/120`} 
                      alt={`${laptop.brand} ${laptop.model}`}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-bold text-slate-900">{laptop.brand}</h3>
                    <p className="text-sm text-slate-600">{laptop.model}</p>
                    {laptop.rating && (
                      <div className="flex items-center justify-center mt-2">
                        <StarIcon />
                        <span className="ml-1 text-sm font-semibold">{laptop.rating}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Specifications */}
            <div className="divide-y divide-gray-200">
              {specs.map((spec) => (
                <div key={spec} className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50">
                  <div className="font-semibold text-slate-700">{spec}</div>
                  {laptops.slice(0, 3).map((laptop, index) => (
                    <div key={index} className="text-sm text-slate-600">
                      {laptop.specs[spec as keyof typeof laptop.specs] || 'N/A'}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Pros and Cons */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold text-slate-700">Pros & Cons</div>
                {laptops.slice(0, 3).map((laptop, index) => (
                  <div key={index} className="space-y-3">
                    {laptop.pros && laptop.pros.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-700 text-sm mb-2">Pros</h4>
                        <ul className="space-y-1">
                          {laptop.pros.slice(0, 3).map((pro, proIndex) => (
                            <li key={proIndex} className="flex items-start text-xs text-slate-600">
                              <CheckIcon />
                              <span className="ml-1">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {laptop.cons && laptop.cons.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-700 text-sm mb-2">Cons</h4>
                        <ul className="space-y-1">
                          {laptop.cons.slice(0, 3).map((con, conIndex) => (
                            <li key={conIndex} className="flex items-start text-xs text-slate-600">
                              <XIcon />
                              <span className="ml-1">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};