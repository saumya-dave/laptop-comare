import React, { useEffect, useRef } from 'react';
import type { SelectedBenchmark, BenchmarkData } from '../types';
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

interface BenchmarkChartProps {
  isLoading: boolean;
  error: string | null;
  chartData: BenchmarkData[];
  baseBenchmark: SelectedBenchmark;
}

const getColor = (variable: string): string => {
    if (typeof window === 'undefined') return '#000000'; // Fallback for SSR
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({ isLoading, error, chartData, baseBenchmark }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<ChartJS | null>(null);
    const [viewMode, setViewMode] = React.useState<'chart' | 'table'>('chart');

    useEffect(() => {
        if (isLoading || !chartRef.current || chartData.length === 0 || viewMode === 'table') {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            return;
        }

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const isMobile = window.innerWidth < 768;
        const labels = chartData.map(d => d.name);
        const scores = chartData.map(d => d.score);

        const baseColor = getColor('--brand');
        const otherColor = getColor('--surface-4');
        const baseHoverColor = getColor('--brand-hover');
        const otherHoverColor = getColor('--text-3');

        const backgroundColors = chartData.map(d =>
            d.name.toLowerCase().trim() === baseBenchmark.name.toLowerCase().trim() ? baseColor : otherColor
        );
        const hoverBackgroundColors = chartData.map(d =>
            d.name.toLowerCase().trim() === baseBenchmark.name.toLowerCase().trim() ? baseHoverColor : otherHoverColor
        );

        chartInstanceRef.current = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `${baseBenchmark.type} Score`,
                    data: scores,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: hoverBackgroundColors,
                    borderWidth: 0,
                    borderRadius: 8,
                    barPercentage: 0.75,
                    categoryPercentage: 0.85,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(20, 28, 58, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: getColor('--text-3'),
                            font: { size: isMobile ? 10 : 12, family: "'Poppins', sans-serif" },
                            padding: 8
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            color: getColor('--text-1'),
                            font: { size: isMobile ? 10 : 12, family: "'Poppins', sans-serif", weight: '500' },
                            padding: 8,
                            crossAlign: 'far'
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: getColor('--text-1'),
                        titleColor: getColor('--surface-2'),
                        bodyColor: getColor('--surface-2'),
                        titleFont: { size: 14, weight: 'bold', family: "'Poppins', sans-serif" },
                        bodyFont: { size: 13, family: "'Poppins', sans-serif" },
                        padding: 14,
                        cornerRadius: 10,
                        displayColors: false,
                        callbacks: {
                            label: (context) => `Score: ${new Intl.NumberFormat().format(context.parsed.x)}`
                        }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart',
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };

    }, [isLoading, chartData, baseBenchmark.name, baseBenchmark.type, viewMode]);
    
    const maxScore = Math.max(...chartData.map(d => d.score));
    const getPerformanceLevel = (score: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return { label: 'Excellent', color: 'text-[var(--success)]' };
        if (percentage >= 75) return { label: 'Very Good', color: 'text-[var(--accent)]' };
        if (percentage >= 60) return { label: 'Good', color: 'text-[var(--brand)]' };
        return { label: 'Average', color: 'text-[var(--warning)]' };
    };

    return (
        <div className="relative bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)] p-4 sm:p-6 rounded-2xl border border-[var(--surface-4)] shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                    <h5 className="font-bold text-base sm:text-lg text-[var(--text-1)] mb-1">{baseBenchmark.type} Performance Comparison</h5>
                    <p className="text-xs sm:text-sm text-[var(--text-3)]">Live benchmark data across similar components</p>
                </div>
                <div className="flex items-center gap-2 bg-[var(--surface-3)] p-1 rounded-lg shadow-sm">
                    <button
                        onClick={() => setViewMode('chart')}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                            viewMode === 'chart'
                                ? 'bg-[var(--brand)] text-[var(--brand-text)] shadow-sm'
                                : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
                        }`}
                        aria-label="Chart view"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                            viewMode === 'table'
                                ? 'bg-[var(--brand)] text-[var(--brand-text)] shadow-sm'
                                : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
                        }`}
                        aria-label="Table view"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center text-[var(--text-2)] text-sm py-16 animate-fade-in">
                    <svg className="animate-spin h-8 w-8 text-[var(--brand)] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-medium">Analyzing benchmark data...</span>
                    <span className="text-xs text-[var(--text-3)] mt-1">Finding similar components</span>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center text-[var(--error)] px-4 text-center py-16">
                    <div className="bg-[var(--error-bg)] border border-[var(--error-border)] rounded-xl p-5 max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                </div>
            ) : chartData.length > 1 ? (
                <div className="animate-fade-in">
                    {viewMode === 'chart' ? (
                        <div className="h-[340px] sm:h-[420px] lg:h-[480px]">
                            <canvas ref={chartRef}></canvas>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--surface-4)]">
                                        <th className="text-left py-3 px-4 font-semibold text-[var(--text-1)]">Rank</th>
                                        <th className="text-left py-3 px-4 font-semibold text-[var(--text-1)]">Component</th>
                                        <th className="text-right py-3 px-4 font-semibold text-[var(--text-1)]">Score</th>
                                        <th className="text-right py-3 px-4 font-semibold text-[var(--text-1)]">Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chartData.map((item, index) => {
                                        const isBase = item.name.toLowerCase().trim() === baseBenchmark.name.toLowerCase().trim();
                                        const perfLevel = getPerformanceLevel(item.score);
                                        return (
                                            <tr
                                                key={index}
                                                className={`border-b border-[var(--surface-4)] transition-colors hover:bg-[var(--surface-3)] ${
                                                    isBase ? 'bg-[var(--brand)]/5' : ''
                                                }`}
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-bold ${
                                                            index === 0 ? 'text-[var(--success)]' : 'text-[var(--text-2)]'
                                                        }`}>
                                                            #{index + 1}
                                                        </span>
                                                        {isBase && (
                                                            <span className="text-xs bg-[var(--brand)] text-[var(--brand-text)] px-2 py-0.5 rounded-full font-medium">
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-[var(--text-1)] font-medium max-w-xs truncate" title={item.name}>
                                                    {item.name}
                                                </td>
                                                <td className="py-3 px-4 text-right font-bold text-[var(--text-1)]">
                                                    {new Intl.NumberFormat().format(item.score)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className={`text-xs font-semibold ${perfLevel.color}`}>
                                                        {perfLevel.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-[var(--text-3)] px-4 text-center py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">No comparable components found</p>
                    <p className="text-xs mt-1">Could not find benchmarks in the ±15% performance range</p>
                </div>
            )}
        </div>
    );
};