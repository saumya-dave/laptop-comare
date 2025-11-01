import React from 'react';
import type { GroundingChunk } from '../types';

interface SourcePillProps {
  source: GroundingChunk;
}

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);

export const SourcePill: React.FC<SourcePillProps> = ({ source }) => {
  if (!source?.web?.uri) {
    return null;
  }

  return (
    <a
      href={source.web.uri}
      target="_blank"
      rel="noopener noreferrer"
      title={source.web.title || source.web.uri}
      className="flex items-center bg-[var(--surface-3)] hover:bg-[var(--surface-4)] text-[var(--text-2)] hover:text-[var(--brand)] text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200"
    >
      <LinkIcon />
      <span className="truncate max-w-xs">{source.web.title || new URL(source.web.uri).hostname}</span>
    </a>
  );
};