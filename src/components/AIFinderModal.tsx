import React, { useState } from 'react';
import { getLaptopComparison } from '../services/geminiService';
import type { LaptopComparison } from '../types';

interface AIFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResults: (laptops: LaptopComparison[]) => void;
}

const SparklesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const AIFinderModal: React.FC<AIFinderModalProps> = ({ isOpen, onClose, onResults }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    useCase: '',
    budget: '',
    screenSize: '',
    performance: '',
    portability: '',
    additionalRequirements: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const query = `Find laptops for ${formData.useCase} with budget ${formData.budget}, screen size ${formData.screenSize}, performance level ${formData.performance}, portability ${formData.portability}. Additional requirements: ${formData.additionalRequirements}`;
    
    try {
      const result = await getLaptopComparison(query);
      onResults(result.comparisons);
      onClose();
    } catch (error) {
      console.error('AI Finder error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl text-white">
                <SparklesIcon />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">AI Laptop Finder</h2>
                <p className="text-slate-600">Step {step} of 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">What will you use your laptop for?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Gaming', 'Work/Business', 'Creative Work', 'Student Use', 'General Use', 'Programming'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFormData({...formData, useCase: option})}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.useCase === option
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">What's your budget?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Under $500', '$500-$1000', '$1000-$1500', '$1500-$2500', '$2500+', 'No Budget'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFormData({...formData, budget: option})}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.budget === option
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Preferred screen size?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['13-14 inches', '15-16 inches', '17+ inches', 'No preference'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFormData({...formData, screenSize: option})}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.screenSize === option
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Performance requirements?</h3>
                <div className="space-y-3">
                  {[
                    { value: 'Basic', desc: 'Web browsing, documents, light tasks' },
                    { value: 'Moderate', desc: 'Multitasking, photo editing, light gaming' },
                    { value: 'High', desc: 'Video editing, 3D work, heavy gaming' },
                    { value: 'Maximum', desc: 'Professional workstation, AI/ML tasks' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({...formData, performance: option.value})}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.performance === option.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{option.value}</div>
                      <div className="text-sm text-slate-600">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">How important is portability?</h3>
                <div className="space-y-3">
                  {[
                    { value: 'Very Important', desc: 'Ultra-thin, lightweight, long battery' },
                    { value: 'Somewhat Important', desc: 'Reasonable size and weight' },
                    { value: 'Not Important', desc: 'Performance over portability' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({...formData, portability: option.value})}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.portability === option.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{option.value}</div>
                      <div className="text-sm text-slate-600">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Any additional requirements?</h3>
                <textarea
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({...formData, additionalRequirements: e.target.value})}
                  placeholder="e.g., specific ports, operating system, brand preferences, special features..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none resize-none"
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="px-6 py-3 text-slate-600 hover:text-slate-800 font-semibold transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={isLoading || (step === 1 && (!formData.useCase || !formData.budget)) || (step === 2 && (!formData.screenSize || !formData.performance)) || (step === 3 && !formData.portability)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Finding Laptops...</span>
              </>
            ) : (
              <span>{step === 3 ? 'Find My Laptop' : 'Next'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};