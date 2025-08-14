
import React from 'react';
import type { GroundingChunk } from '../types';

interface SourcePillProps {
  source: GroundingChunk;
}

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
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
      className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-cyan-300 text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200"
    >
      <LinkIcon />
      <span className="truncate max-w-xs">{source.web.title || new URL(source.web.uri).hostname}</span>
    </a>
  );
};
