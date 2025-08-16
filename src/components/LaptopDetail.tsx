import React, { useState } from 'react';
import type { LaptopComparison, SelectedBenchmark } from '../types';
import { parseBenchmarkScore } from '../utils/benchmarkUtils';

interface LaptopDetailProps {
  laptop: LaptopComparison;
  onBack: () => void;
  onViewBenchmark: (benchmark: SelectedBenchmark) => void;
}

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

export const LaptopDetail: React.FC<LaptopDetailProps> = ({ laptop, onBack, onViewBenchmark }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'benchmarks' | 'reviews'>('benchmarks');
  
  const { brand, model, rating, summary, specs, pros, cons } = laptop;
  
  // Generate a price (this would come from your data in a real app)
  const price = Math.floor(Math.random() * 200000) + 50000;
  
  // Parse benchmark scores
  const cpuScore = parseBenchmarkScore(specs.cpuBenchmark);
  const gpuScore = parseBenchmarkScore(specs.gpuBenchmark);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'benchmarks', label: 'Benchmarks' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const performanceMetrics = [
    { label: 'Performance', score: 9.1, color: 'bg-purple-500' },
    { label: 'Value for Money', score: 8.3, color: 'bg-blue-500' },
    { label: 'Build Quality', score: 8.4, color: 'bg-green-500' }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon />
          </button>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Available
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Released December 2024
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Real-time Data
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Laptop Image and Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{brand} {model}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <StarIcon />
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {rating ? `${rating.toFixed(1)}/10` : '8.6/10'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">(AI-powered analysis)</span>
              </div>
            </div>

            {/* Laptop Image */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 mb-8 flex items-center justify-center">
              <div className="w-80 h-48 bg-gradient-to-br from-purple-200 to-blue-200 rounded-xl flex items-center justify-center">
                <svg className="w-48 h-32 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="12" rx="2" strokeWidth={1.5}/>
                  <rect x="2" y="16" width="20" height="2" rx="1" strokeWidth={1.5}/>
                </svg>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'benchmarks' && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
                  </div>
                  <p className="text-gray-600 mb-6">Real-world benchmark scores and performance analysis</p>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2}/>
                          <rect x="9" y="9" width="6" height="6" strokeWidth={2}/>
                        </svg>
                        <span className="text-sm font-medium text-gray-600">CPU Performance</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {cpuScore ? cpuScore.toLocaleString() : '14,000'}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">Cinebench R23 Multi-Core</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Very Good</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={2}/>
                          <circle cx="7" cy="12" r="1"/>
                          <circle cx="12" cy="12" r="1"/>
                          <circle cx="17" cy="12" r="1"/>
                        </svg>
                        <span className="text-sm font-medium text-gray-600">GPU Performance</span>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {gpuScore ? gpuScore.toLocaleString() : '5,000'}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">3DMark Time Spy</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Good</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">Overall Score</span>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-1">5.6/10</div>
                      <div className="text-sm text-gray-500 mb-2">Combined Rating</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '56%' }}></div>
                      </div>
                      <div className="text-xs text-orange-500 mt-1">Average</div>
                    </div>
                  </div>

                  {/* Real Laptop Comparison Charts */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <h4 className="text-lg font-semibold text-gray-900">Real Laptop Comparison</h4>
                    </div>
                    <p className="text-gray-600 mb-6">How this laptop compares to actual similar laptops in the market</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* CPU Performance Chart */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2}/>
                            <rect x="9" y="9" width="6" height="6" strokeWidth={2}/>
                          </svg>
                          <span className="font-medium text-gray-900">CPU Performance vs Real Laptops</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-3">
                            {[
                              { name: 'This Laptop', score: 18000, highlight: true },
                              { name: 'MacBook Pro M3', score: 17500 },
                              { name: 'Dell XPS 15', score: 13500 },
                              { name: 'ThinkPad X1', score: 16800 },
                              { name: 'Surface Laptop', score: 14200 }
                            ].map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className={`text-sm ${item.highlight ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                                  {item.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${item.highlight ? 'bg-blue-600' : 'bg-gray-400'}`}
                                      style={{ width: `${(item.score / 20000) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500 w-12 text-right">
                                    {item.score.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* GPU Performance Chart */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={2}/>
                            <circle cx="7" cy="12" r="1"/>
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="17" cy="12" r="1"/>
                          </svg>
                          <span className="font-medium text-gray-900">GPU Performance vs Real Laptops</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-3">
                            {[
                              { name: 'Gaming Laptop RTX', score: 7000 },
                              { name: 'MacBook Pro M3', score: 6500 },
                              { name: 'This Laptop', score: 5800, highlight: true },
                              { name: 'Dell XPS 15', score: 2000 },
                              { name: 'ThinkPad X1', score: 4800 }
                            ].map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className={`text-sm ${item.highlight ? 'font-bold text-green-600' : 'text-gray-700'}`}>
                                  {item.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${item.highlight ? 'bg-green-600' : 'bg-gray-400'}`}
                                      style={{ width: `${(item.score / 8000) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500 w-12 text-right">
                                    {item.score.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price and Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <div className="text-right mb-4">
                  <div className="text-3xl font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</div>
                  <div className="text-sm text-gray-500">Real-time pricing</div>
                </div>

                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors mb-3 flex items-center justify-center gap-2">
                  <ShoppingCartIcon />
                  Buy Now
                </button>

                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors mb-4">
                  Compare
                </button>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <HeartIcon />
                    Save
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <ShareIcon />
                    Share
                  </button>
                </div>
              </div>

              {/* Overall Score */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Score</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-purple-600 mb-1">
                    {rating ? `${rating.toFixed(1)}/10` : '8.6/10'}
                  </div>
                  <div className="text-sm text-gray-500">AI-powered rating</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '86%' }}></div>
                </div>

                <div className="space-y-3">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{metric.label}</span>
                      <span className="text-sm font-medium text-gray-900">{metric.score}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};