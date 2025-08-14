
import React from 'react';
import type { LaptopComparison, LaptopSpecs, SelectedBenchmark } from '../types';
import { Rating } from './Rating';
import { parseBenchmarkScore } from '../utils/benchmarkUtils';

const ChartBarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const SpecItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <li className="flex justify-between items-start text-sm py-1 border-b border-gray-700/50">
      <span className="font-semibold text-gray-400 flex-shrink-0 pr-2">{label}</span>
      <span className="text-right text-gray-300">{value}</span>
    </li>
  );
};

const BenchmarkSpecItem: React.FC<{ label: string; value?: string; onClick: () => void }> = ({ label, value, onClick }) => {
  if (!value) return null;
  return (
    <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm py-3 border-b border-gray-700/50 last:border-b-0 gap-2">
      <div className="flex-shrink-0 pr-4">
          <span className="font-semibold text-gray-400 block">{label}</span>
          <span className="text-gray-300">{value}</span>
      </div>
      <button
        onClick={onClick}
        className="flex items-center justify-center text-xs font-semibold bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700 transition-colors flex-shrink-0 shadow-lg hover:shadow-cyan-500/30 w-full sm:w-auto"
        aria-label={`Compare performance for ${label}`}
      >
        <ChartBarIcon />
        <span>Compare Performance</span>
      </button>
    </li>
  );
};


const LaptopCard: React.FC<{ 
  laptop: LaptopComparison; 
  onViewBenchmark: (benchmark: SelectedBenchmark) => void;
}> = ({ laptop, onViewBenchmark }) => {
  const { brand, model, rating, summary, specs, pros, cons } = laptop;

  const CheckIcon = () => (
    <svg className="h-5 w-5 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const CrossIcon = () => (
    <svg className="h-5 w-5 text-red-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
  
  const seed = model.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const cpuScore = parseBenchmarkScore(specs.cpuBenchmark);
  const gpuScore = parseBenchmarkScore(specs.gpuBenchmark);
  const hasBenchmarks = cpuScore || gpuScore;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/20 hover:-translate-y-1 flex flex-col">
      <img src={`https://picsum.photos/seed/${seed}/600/400`} alt={`${brand} ${model}`} className="w-full h-48 object-cover" />
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xs uppercase font-bold text-cyan-400">{brand}</h3>
                    <h2 className="text-xl font-bold text-gray-100">{model}</h2>
                </div>
                {rating && <Rating rating={rating} />}
            </div>
            <p className="text-gray-400 mt-3 text-sm">{summary}</p>
            
            <div className="mt-6 space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Key Specifications</h4>
                    <ul className="space-y-1">
                        <SpecItem label="Processor" value={specs.Processor} />
                        <SpecItem label="Graphics" value={specs.Graphics} />
                        <SpecItem label="RAM" value={specs.RAM} />
                        <SpecItem label="Storage" value={specs.Storage} />
                        <SpecItem label="Display" value={specs.Display} />
                        <SpecItem label="Weight" value={specs.Weight} />
                    </ul>
                </div>

                {hasBenchmarks && (
                   <div>
                      <h4 className="font-semibold text-gray-200 mb-2 mt-4">Performance Benchmarks</h4>
                      <ul className="bg-gray-900/40 p-3 rounded-lg">
                          {specs.Processor && cpuScore && (
                            <BenchmarkSpecItem 
                              label="CPU" 
                              value={specs.cpuBenchmark}
                              onClick={() => onViewBenchmark({name: specs.Processor!, score: cpuScore, type: 'CPU'})}
                            />
                          )}
                          {specs.Graphics && gpuScore && (
                             <BenchmarkSpecItem 
                              label="GPU" 
                              value={specs.gpuBenchmark}
                              onClick={() => onViewBenchmark({name: specs.Graphics!, score: gpuScore, type: 'GPU'})}
                            />
                          )}
                      </ul>
                  </div>
                )}

                {(pros && cons && pros.length > 0 && cons.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-4 border-t border-gray-700/60">
                      <div>
                          <h4 className="font-semibold text-gray-200 mb-2">Pros</h4>
                          <ul className="space-y-2">
                              {pros.map((pro, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                      <CheckIcon /> <span>{pro}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                       <div>
                          <h4 className="font-semibold text-gray-200 mb-2">Cons</h4>
                          <ul className="space-y-2">
                              {cons.map((con, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                      <CrossIcon /> <span>{con}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};


export const ComparisonResult: React.FC<{ 
  results: LaptopComparison[], 
  onViewBenchmark: (benchmark: SelectedBenchmark) => void,
}> = ({ results, onViewBenchmark }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
      {results.map((laptop, index) => (
        <LaptopCard 
          key={index} 
          laptop={laptop} 
          onViewBenchmark={onViewBenchmark} 
        />
      ))}
    </div>
  );
};