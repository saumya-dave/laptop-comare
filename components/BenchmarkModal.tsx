import React, { useEffect, useRef, useState } from 'react';
import type { SelectedBenchmark, BenchmarkData } from '../types';
import { getBenchmarkComparisons } from '../services/geminiService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  benchmark: SelectedBenchmark;
}

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({ isOpen, onClose, benchmark }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<ChartJS | null>(null);
    const [chartData, setChartData] = useState<BenchmarkData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInfoVisible, setIsInfoVisible] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsInfoVisible(false); // Reset on close
            return;
        }

        const fetchAndSetBenchmarks = async () => {
            setIsLoading(true);
            setError(null);
            setChartData([]);
            
            try {
                const fetchedData = await getBenchmarkComparisons(benchmark);
                
                const baseComponent: BenchmarkData = { ...benchmark, source: 'N/A' };
                
                const combined = [baseComponent, ...fetchedData];
                const uniqueMap = new Map<string, BenchmarkData>();
                combined.forEach(item => {
                    uniqueMap.set(item.name.toLowerCase().trim(), item);
                });

                const results = Array.from(uniqueMap.values());
                results.sort((a, b) => b.score - a.score);
                
                setChartData(results);

            } catch (e) {
                console.error("Failed to fetch or process benchmark data:", e);
                setError("Could not load comparison data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndSetBenchmarks();

    }, [isOpen, benchmark]);

    useEffect(() => {
        if (isLoading || !chartRef.current || chartData.length === 0) {
            return;
        }

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
        
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const labels = chartData.map(d => d.name);
        const scores = chartData.map(d => d.score);
        const backgroundColors = chartData.map(d => 
            d.name.toLowerCase().trim() === benchmark.name.toLowerCase().trim() ? '#06b6d4' : '#4b5563'
        );
        const hoverBackgroundColors = chartData.map(d => 
            d.name.toLowerCase().trim() === benchmark.name.toLowerCase().trim() ? '#0891b2' : '#6b7280'
        );

        chartInstanceRef.current = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `${benchmark.type} Score`,
                    data: scores,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: hoverBackgroundColors,
                    borderWidth: 0,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#d1d5db', font: { size: 12 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#d1d5db', font: { size: 12 } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 12 },
                        padding: 10,
                        cornerRadius: 4,
                        callbacks: {
                            label: (context) => `${context.dataset.label || ''}: ${new Intl.NumberFormat().format(context.parsed.x)}`
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };

    }, [isLoading, chartData, benchmark.name, benchmark.type]);
    
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="benchmark-modal-title"
        >
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 id="benchmark-modal-title" className="text-lg sm:text-xl font-bold text-cyan-400">{benchmark.type} Benchmark Comparison</h2>
                            <button
                                onClick={() => setIsInfoVisible(!isInfoVisible)}
                                className="text-gray-400 hover:text-cyan-400 transition-colors"
                                aria-label="Toggle benchmark explanation"
                                title="What does this benchmark mean?"
                            >
                                <InfoIcon />
                            </button>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700">&times;</button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        Comparing components with scores within &plusmn;15% of <span className="font-bold text-gray-200">{benchmark.name}</span> (Score: {new Intl.NumberFormat().format(benchmark.score)}).
                    </p>
                    {isInfoVisible && (
                        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 transition-all duration-300 animate-fade-in-slow">
                            <h3 className="font-semibold text-gray-200 mb-2">What do these scores mean?</h3>
                            <p className="text-sm text-gray-400">
                                {benchmark.type === 'CPU' 
                                    ? `CPU benchmarks (like Cinebench or Geekbench) measure a processor's performance on demanding tasks like 3D rendering, video encoding, and complex calculations. A higher score generally means a faster, more capable processor for professional work and multitasking.` 
                                    : `GPU benchmarks (like 3DMark Time Spy) measure a graphics card's ability to render complex 3D graphics, which is vital for gaming, AI, and content creation. A higher score indicates better performance, leading to smoother frame rates and faster processing times.`
                                }
                            </p>
                        </div>
                    )}
                </header>
                <main className="p-4 sm:p-6 flex-grow overflow-y-auto">
                    <div className="relative min-h-[400px] sm:min-h-[500px]">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Querying AI for real-time benchmark data...</span>
                            </div>
                        ) : error ? (
                            <div className="absolute inset-0 flex items-center justify-center text-red-400 px-4 text-center">{error}</div>
                        ) : chartData.length > 1 ? (
                            <canvas ref={chartRef}></canvas>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 px-4 text-center">The AI could not find other benchmarks in this specific performance range (±15%). This can happen for very new or niche components.</div>
                        )}
                    </div>
                    {chartData.length > 1 && !isLoading && (
                        <div className="mt-6 border-t border-gray-700 pt-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Data Sources</h4>
                            <ul className="text-xs text-gray-400 space-y-1 max-h-24 overflow-y-auto">
                                {chartData.filter(d => d.source && d.source !== 'N/A').map(d => (
                                    <li key={d.name}>
                                        <span className="font-medium text-gray-300">{d.name}:</span>
                                        <a href={d.source} target="_blank" rel="noopener noreferrer" className="ml-2 hover:text-cyan-400 underline transition-colors">
                                            {new URL(d.source).hostname}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </main>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                @keyframes fade-in-slow {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-slow {
                    animation: fade-in-slow 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};