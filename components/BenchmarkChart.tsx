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

    useEffect(() => {
        if (isLoading || !chartRef.current || chartData.length === 0) {
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

        const isMobile = window.innerWidth < 768; // Corresponds to Tailwind's 'md' breakpoint
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
                    borderRadius: 6,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(20, 28, 58, 0.05)' },
                        ticks: { color: getColor('--text-3'), font: { size: isMobile ? 10 : 12, family: "'Poppins', sans-serif" } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: getColor('--text-1'), font: { size: isMobile ? 10 : 12, family: "'Poppins', sans-serif" } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: getColor('--text-1'),
                        titleColor: getColor('--surface-2'),
                        bodyColor: getColor('--text-3'),
                        titleFont: { size: 14, weight: 'bold', family: "'Poppins', sans-serif" },
                        bodyFont: { size: 12, family: "'Poppins', sans-serif" },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => `${context.dataset.label || ''}: ${new Intl.NumberFormat().format(context.parsed.x)}`
                        }
                    }
                },
                animation: {
                    duration: 1000,
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

    }, [isLoading, chartData, baseBenchmark.name, baseBenchmark.type]);
    
    return (
        <div className="relative min-h-[320px] sm:min-h-[350px] bg-[var(--surface-3)] p-4 sm:p-6 rounded-xl border border-[var(--surface-4)]">
            <h5 className="font-bold text-base sm:text-lg mb-3 text-[var(--text-1)]">{baseBenchmark.type} Performance Comparison</h5>
            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--text-2)] text-sm">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--brand)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Querying AI for real-time benchmark data...</span>
                </div>
            ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--error)] px-4 text-center text-sm">{error}</div>
            ) : chartData.length > 1 ? (
                <div className="h-[320px] sm:h-[400px] lg:h-[450px] animate-fade-in">
                    <canvas ref={chartRef}></canvas>
                </div>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--text-3)] px-4 text-center text-sm">The AI could not find other benchmarks in this performance range (±15%).</div>
            )}
        </div>
    );
};