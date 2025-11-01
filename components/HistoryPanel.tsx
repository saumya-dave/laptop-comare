import React from 'react';

interface HistoryPanelProps {
  isVisible: boolean;
  history: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isVisible, history, onSelect, onClear, onClose }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <>
        <div className="fixed inset-0 z-10 bg-black/10" onClick={onClose} aria-hidden="true"></div>
        <div 
            className="absolute top-full mt-2 w-full bg-[var(--surface-2)]/80 backdrop-blur-lg border border-[var(--surface-4)] rounded-xl shadow-lg z-20 overflow-hidden animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
        >
            <div className="p-2">
                <div className="flex justify-between items-center mb-1 px-2 py-1">
                    <h3 className="text-sm font-semibold text-[var(--text-2)]">Recent Searches</h3>
                    {history.length > 0 && (
                        <button onClick={onClear} className="flex items-center text-xs font-medium text-[var(--text-3)] hover:text-[var(--error)] transition-colors">
                            <TrashIcon /> Clear
                        </button>
                    )}
                </div>
                {history.length > 0 ? (
                    <ul className="space-y-1 max-h-60 overflow-y-auto">
                        {history.map((item, index) => (
                            <li key={index}>
                                <button 
                                    onClick={() => onSelect(item)} 
                                    className="w-full text-left px-3 py-2.5 text-[var(--text-2)] hover:bg-[var(--surface-3)] rounded-lg transition-colors truncate"
                                    title={item}
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-[var(--text-3)] py-6 text-sm">No recent searches.</p>
                )}
            </div>
        </div>
    </>
  );
};