/**
 * Parses a benchmark string (e.g., "Cinebench R23: ~15,200") to extract the numerical score.
 * It's designed to be robust against common variations like commas and tildes.
 * @param benchmarkString The string containing the benchmark information.
 * @returns The parsed score as a number, or null if no valid number is found.
 */
export const parseBenchmarkScore = (benchmarkString?: string): number | null => {
  if (!benchmarkString) return null;
  
  // This regex finds the last number in the string, ignoring commas.
  const match = benchmarkString.match(/(\d{1,3}(,\d{3})*|\d+)/g);
  if (!match) return null;
  
  // Get the last number found in the string.
  const lastNumberStr = match[match.length - 1];
  
  // Remove commas and parse as an integer.
  const score = parseInt(lastNumberStr.replace(/,/g, ''), 10);
  
  return isNaN(score) ? null : score;
};
