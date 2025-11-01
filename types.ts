export interface LaptopSpecs {
  Processor?: string;
  RAM?: string;
  Storage?: string;
  Display?: string;
  Graphics?: string;
  Ports?: string;
  Weight?: string;
  cpuBenchmark?: string;
  gpuBenchmark?: string;
}

export interface RatingBreakdown {
    performance: number;
    value: number;
    quality: number;
}

export interface GamingPerformance {
    "1080p"?: string;
    "1440p"?: string;
    quality?: string;
}

export interface ProductivityPerformance {
    task: string;
    score: number;
}

export interface LaptopComparison {
  model: string;
  brand: string;
  summary: string;
  specs: LaptopSpecs;
  rating?: number;
  pros?: string[];
  cons?: string[];
  price?: number;
  releaseDate?: string;
  status?: string;
  ratingBreakdown?: RatingBreakdown;
  gamingPerformance?: GamingPerformance;
  productivityPerformance?: ProductivityPerformance[];
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface GeminiResponse {
  comparisons: LaptopComparison[];
  sources: GroundingChunk[];
}

export interface BenchmarkData {
  name: string;
  score: number;
  type: "CPU" | "GPU";
  source: string;
}

export interface SelectedBenchmark {
    name: string;
    score: number;
    type: 'CPU' | 'GPU';
}

export interface ComponentAnalysis {
  name: string;
  summary: string;
  specs: Array<{ name: string; value: string }>;
  strengths: string[];
  weaknesses: string[];
}