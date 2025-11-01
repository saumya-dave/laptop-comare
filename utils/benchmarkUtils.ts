/**
 * Parses a benchmark string (e.g., "Cinebench R23: ~15,200") to extract the numerical score.
 * It's designed to be robust against common variations like commas and tildes.
 * @param benchmarkString The string containing the benchmark information.
 * @returns The parsed score as a number, or null if no valid number is found.
 */
export const parseBenchmarkScore = (benchmarkString?: string): number | null => {
  if (!benchmarkString) return null;
  
  // This regex finds all number-like sequences, including those with commas.
  const numberRegex = /(\d{1,3}(?:,\d{3})*|\d+)/g;
  const matches = benchmarkString.match(numberRegex);
  
  if (!matches) return null;

  const scores = matches
    .map(str => parseInt(str.replace(/,/g, ''), 10))
    .filter(num => !isNaN(num));

  if (scores.length === 0) return null;

  // Assume the largest number in the string is the actual benchmark score.
  // This prevents version numbers (e.g., "v4.0") or other small numbers
  // from being mistaken for the score.
  return Math.max(...scores);
};