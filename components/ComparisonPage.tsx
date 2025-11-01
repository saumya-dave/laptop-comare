import React, { useState, useCallback, useMemo } from 'react';
import type { LaptopComparison } from '../types';
import { getDetailedComparison } from '../services/geminiService';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';

// --- ICONS ---
const BackIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"></polyline></svg>
);

const LightbulbIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--brand)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const MedalIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 shrink-0 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
);


const ComparisonPage: React.FC<{
  laptops: LaptopComparison[];
  onBack: () => void;
}> = ({ laptops, onBack }) => {
    const [verdictQuery, setVerdictQuery] = useState('');
    const [aiVerdict, setAiVerdict] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetVerdict = useCallback(async () => {
        if (!verdictQuery.trim()) {
            setError("Please enter what you're looking for.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAiVerdict('');
        try {
            const result = await getDetailedComparison(laptops, verdictQuery);
            setAiVerdict(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [laptops, verdictQuery]);
    
    const { analysis, conclusion } = useMemo(() => {
        if (!aiVerdict) return { analysis: null, conclusion: null };
        
        const htmlVerdict = aiVerdict
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');

        const conclusionMarker = '<strong>Final Recommendation:</strong>';
        const parts = htmlVerdict.split(new RegExp(`<br />\\s*${conclusionMarker}`, 'i'));
        
        if (parts.length === 2) {
            return { analysis: parts[0], conclusion: parts[1].trim() };
        }
        
        return { analysis: htmlVerdict, conclusion: null };
    }, [aiVerdict]);


    const specRows: (keyof LaptopComparison | keyof LaptopComparison['specs'])[] = [
        'price', 'rating', 'Processor', 'Graphics', 'RAM', 'Storage', 'Display', 'Weight', 'cpuBenchmark', 'gpuBenchmark'
    ];
    
    const currencyFormatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
    });

    const getSpecValue = (laptop: LaptopComparison, specKey: string) => {
        if (specKey in laptop) {
            const value = laptop[specKey as keyof LaptopComparison];
            if (specKey === 'price' && typeof value === 'number') return currencyFormatter.format(value);
            if (specKey === 'rating' && typeof value === 'number') return `${value.toFixed(1)}/10`;
            return value as string;
        }
        if (laptop.specs && specKey in laptop.specs) {
            return laptop.specs[specKey as keyof typeof laptop.specs] ?? 'N/A';
        }
        return 'N/A';
    };
    
    const formatSpecName = (name: string) => {
        if (name === 'cpuBenchmark') return 'CPU Benchmark';
        if (name === 'gpuBenchmark') return 'GPU Benchmark';
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 animate-slide-in">
            <button onClick={onBack} className="flex items-center my-6 sm:my-8 text-sm font-semibold text-[var(--text-2)] hover:text-[var(--brand)] transition-colors">
                <BackIcon /> Back to Results
            </button>

            <div className="mb-10 sm:mb-12 bg-[var(--surface-2)] border border-[var(--surface-4)] rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                <h3 className="flex items-center text-xl sm:text-2xl font-bold text-[var(--text-1)] mb-3 font-serif"><LightbulbIcon /> AI Verdict</h3>
                <p className="text-[var(--text-2)] mb-6 text-sm sm:text-base">What is most important to you? Let our AI give you a tailored recommendation.</p>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <input
                        type="text"
                        value={verdictQuery}
                        onChange={(e) => setVerdictQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGetVerdict()}
                        placeholder="e.g., 'Best for video editing on a budget'"
                        className="w-full flex-grow px-4 py-3 bg-[var(--surface-1)] text-[var(--text-1)] placeholder-[var(--text-3)] rounded-lg border border-[var(--surface-4)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none transition-shadow"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleGetVerdict} 
                        disabled={isLoading || !verdictQuery.trim()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand)] text-[var(--brand-text)] font-semibold rounded-lg hover:bg-[var(--brand-hover)] disabled:bg-[var(--surface-4)] disabled:text-[var(--text-3)] disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                               <span>Thinking...</span>
                            </>
                        ) : (
                            <><SendIcon /> Get Verdict</>
                        )}
                    </button>
                </div>

                {isLoading && <div className="mt-6"><Loader /></div>}
                {error && <div className="mt-6"><ErrorMessage message={error} /></div>}
                
                {analysis && (
                    <div className="mt-8 pt-6 border-t border-[var(--surface-4)] animate-fade-in">
                        <div 
                            className="prose prose-sm sm:prose-base max-w-none text-[var(--text-2)] prose-headings:text-[var(--text-1)] prose-strong:text-[var(--text-1)]" 
                            dangerouslySetInnerHTML={{ __html: analysis }}
                        />
                         {conclusion && (
                            <div className="mt-6 p-5 sm:p-6 rounded-xl bg-[var(--success-bg)] border border-[var(--success)]">
                                <h4 className="flex items-center text-lg sm:text-xl font-bold text-[var(--success-text)] mb-3">
                                    <MedalIcon />
                                    Final Recommendation
                                </h4>
                                <div 
                                    className="prose prose-sm sm:prose-base max-w-none text-[var(--success-text)] prose-strong:text-[var(--text-1)]" 
                                    dangerouslySetInnerHTML={{ __html: conclusion }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-[var(--surface-2)] border border-[var(--surface-4)] rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-1)] mb-6 sm:mb-8 font-serif">Side-by-Side Specifications</h2>
                
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full min-w-[800px] border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="sticky left-0 bg-[var(--surface-2)] p-3 sm:p-4 text-sm font-semibold text-[var(--text-1)] w-1/5">Feature</th>
                                {laptops.map((laptop, index) => (
                                    <th key={`${laptop.model}-${index}`} className={`p-3 sm:p-4 w-1/${laptops.length+1} border-l border-[var(--surface-4)]`}>
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-full aspect-video bg-[var(--surface-1)] rounded-lg mb-3 flex items-center justify-center p-2">
                                                <img src={`https://placehold.co/400x300/f1f5f9/334155?text=${laptop.brand}`} alt={laptop.model} className="max-h-full max-w-full object-contain rounded-md" />
                                            </div>
                                            <p className="font-semibold text-sm text-[var(--text-1)]">{laptop.brand} {laptop.model}</p>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {specRows.map(spec => (
                                <tr key={spec} className="border-t border-[var(--surface-4)]">
                                    <td className="sticky left-0 bg-[var(--surface-2)] p-3 sm:p-4 font-semibold text-sm text-[var(--text-2)]">{formatSpecName(spec)}</td>
                                    {laptops.map((laptop, index) => (
                                        <td key={`${laptop.model}-${index}-${spec}`} className="p-3 sm:p-4 text-sm text-[var(--text-2)] border-l border-[var(--surface-4)] align-top">
                                            {getSpecValue(laptop, spec)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComparisonPage;