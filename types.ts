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

export interface LaptopComparison {
  model: string;
  brand: string;
  summary: string;
  specs: LaptopSpecs;
  rating?: number;
  pros?: string[];
  cons?: string[];
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