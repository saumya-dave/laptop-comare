"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import type { LaptopComparison, SelectedBenchmark, ComponentAnalysis, BenchmarkData, RatingBreakdown } from "../types"
import { Rating } from "./Rating"
import { parseBenchmarkScore } from "../utils/benchmarkUtils"
import { getComponentAnalysis, getBenchmarkComparisons } from "../services/geminiService"
import { BenchmarkChart } from "./BenchmarkChart"
import ComparisonPage from "./ComparisonPage"

// --- ICONS (New Consistent Set) ---
const BackIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
)

const StarIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-[var(--warning)]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 text-[var(--success)] ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 text-[var(--error)] ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ThumbsUpIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-[var(--success)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5.5 8m7 2H5.5m0 0l-1.07-3.542A2 2 0 014.5 2.542V5"
    />
  </svg>
)

const ThumbsDownIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-[var(--error)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.085a2 2 0 001.736-.93l2.5-4.5m-7 2H18.5m0 0l1.07 3.542A2 2 0 0117.5 21.458V19"
    />
  </svg>
)

// --- SPEC ICONS ---
const ProcessorIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-[var(--text-3)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
    />
    <rect x="7" y="7" width="10" height="10" rx="1" strokeWidth="1.5" />
  </svg>
)

const GraphicsIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-[var(--text-3)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V5.25A2.25 2.25 0 0018 3H6A2.25 2.25 0 003.75 5.25v12.75A2.25 2.25 0 006 20.25z"
    />
  </svg>
)

const MemoryIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-[var(--text-3)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5"
    />
    <rect x="6" y="4.5" width="12" height="15" rx="1" />
  </svg>
)

const StorageIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-[var(--text-3)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m3 3H9m3-6H9" />
  </svg>
)

const DisplayIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-[var(--text-3)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z"
    />
  </svg>
)

const WeightIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-[var(--text-3)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 11.25V7.875a4.5 4.5 0 00-9 0v3.375m-3.75 2.25c-.995 0-1.875.56-2.372 1.412A4.493 4.493 0 002.25 16.5c0 .356.028.707.084 1.05.058.343.123.68.203 1.005.082.326.17.646.265.958.096.312.2.615.312.908.112.293.23.575.354.846.124.27.255.53.392.78.137.25.28.49.43.72.15.23.308.45.474.66.167.21.34.41.52.59.18.18.368.35.56.51.194.16.395.3.6.43.204.13.414.25.63.35.215.1.438.18.66.25.22.07.445.13.67.18.227.05.457.09.69.12.232.03.468.05.706.06.237.01.476.02.716.02h3.11c.24 0 .479-.01.716-.02.238-.01.473-.03.706-.06.228-.03.458-.06.69-.12.224-.05.449-.1.67-.18.216-.07.426-.22.63-.35.205-.13.415-.27.6-.43.192-.16.38-.33.56-.51.18-.18.352-.38.52-.59.166-.21.338-.42.474-.66.15-.23.297-.47.43-.72.137-.25.268-.51.392-.78.124-.27.242-.553.354-.846.112-.293.216-.596.312-.908.095-.312.183-.632.265-.958.08-.325.145-.662.203-1.005.056-.343.084-.694.084-1.05 0-.79-.207-1.536-.588-2.188a4.5 4.5 0 00-2.372-1.412z"
    />
  </svg>
)

const PortsIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-[var(--text-3)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  </svg>
)

const specIcons: { [key: string]: React.FC } = {
  Processor: ProcessorIcon,
  Graphics: GraphicsIcon,
  RAM: MemoryIcon,
  Storage: StorageIcon,
  Display: DisplayIcon,
  Weight: WeightIcon,
  Ports: PortsIcon,
}

// --- COMPACT CARD VIEW ---
const CompactLaptopCard: React.FC<{
  laptop: LaptopComparison
  onViewDetails: () => void
  onSelectToggle: () => void
  isSelected: boolean
  index: number
}> = ({ laptop, onViewDetails, onSelectToggle, isSelected, index }) => {
  return (
    <div
      className="bg-[var(--surface-2)] rounded-2xl shadow-lg border border-[var(--surface-4)] overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-slide-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div 
        onClick={onViewDetails}
        className="cursor-pointer"
        role="button"
        tabIndex={-1} // The main element is not focusable, but the inner button and checkbox are.
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onViewDetails()}
      >
        <div className="absolute top-4 right-4 z-10">
          {laptop.status === "Available" && (
            <span className="text-xs font-semibold bg-[var(--success-bg)] text-[var(--success-text)] px-3 py-1 rounded-full shadow-sm">
              {laptop.status}
            </span>
          )}
          {laptop.status !== "Available" && (
            <span className="text-xs font-semibold bg-[var(--warning-bg)] text-[var(--warning-text)] px-3 py-1 rounded-full shadow-sm">
              {laptop.status}
            </span>
          )}
        </div>

        <div className="h-48 sm:h-56 flex items-center justify-center p-4 sm:p-6 bg-[var(--surface-1)] overflow-hidden">
          <img
            src={`https://placehold.co/600x400/f1f5f9/334155?text=${laptop.brand}`}
            alt={`${laptop.brand} ${laptop.model}`}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="h-12 sm:h-14">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-1)] leading-snug" title={`${laptop.brand} ${laptop.model}`}>
              {laptop.brand} {laptop.model}
            </h3>
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm text-[var(--text-3)]">
            <StarIcon />
            <span className="font-semibold text-[var(--text-2)]">{laptop.rating?.toFixed(1)}/10</span>
            <span className="truncate">{laptop.releaseDate ? `• ${laptop.releaseDate}` : ""}</span>
          </div>

          <div className="mt-4 sm:mt-5">
            {laptop.price ? (
              <p className="text-xl sm:text-2xl font-bold text-[var(--text-1)]">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(
                  laptop.price,
                )}
              </p>
            ) : (
              <div className="h-8" />
            )}
          </div>
        </div>
      </div>
       <label 
        onClick={(e) => e.stopPropagation()} 
        className="absolute top-3 left-3 z-20 flex items-center"
        >
        <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelectToggle}
            className="h-6 w-6 rounded-md border-[var(--surface-4)] text-[var(--brand)] focus:ring-[var(--brand)] focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface-2)] bg-[var(--surface-2)] cursor-pointer"
            aria-label={`Select ${laptop.brand} ${laptop.model} for comparison`}
        />
      </label>
    </div>
  )
}


// --- DETAIL VIEW ---
const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 ${
      active
        ? "bg-[var(--brand)] text-[var(--brand-text)] shadow-sm"
        : "text-[var(--text-2)] hover:bg-[var(--surface-3)]"
    }`}
  >
    {children}
  </button>
)

const PerformanceBar: React.FC<{ label: string; score: number; maxScore?: number }> = ({
  label,
  score,
  maxScore = 10,
}) => {
  const percentage = (score / maxScore) * 100
  const getBarColor = () => {
    if (percentage < 40) return "bg-[var(--warning)]"
    if (percentage < 75) return "bg-[var(--accent)]"
    return "bg-[var(--brand)]"
  }
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-[var(--text-2)]">{label}</span>
        <span className="font-semibold text-[var(--text-1)]">{score.toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-[var(--surface-3)] rounded-full h-2.5">
        <div
          className={`${getBarColor()} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

const OverallScoreCard: React.FC<{ rating: number; breakdown: RatingBreakdown }> = ({ rating, breakdown }) => (
  <div className="p-6 sm:p-7 border border-[var(--surface-4)] rounded-xl bg-[var(--surface-2)] shadow-sm">
    <h4 className="font-semibold text-lg mb-5 text-[var(--text-1)]">Overall Score</h4>
    <div className="text-center">
      <p className="text-5xl sm:text-6xl font-bold text-[var(--text-1)]">
        {rating.toFixed(1)}
        <span className="text-2xl sm:text-3xl text-[var(--text-3)]">/10</span>
      </p>
      <p className="text-sm text-[var(--text-3)] mt-2">AI-powered rating</p>
    </div>
    <div className="mt-6">
      <div className="w-full bg-[var(--surface-3)] rounded-full h-3">
        <div
          className="bg-[var(--brand)] h-3 rounded-full transition-all duration-300"
          style={{ width: `${rating * 10}%` }}
        ></div>
      </div>
    </div>
    <div className="space-y-4 mt-7 text-sm">
      <div className="flex justify-between">
        <span className="text-[var(--text-2)]">Performance</span>
        <span className="font-semibold text-[var(--text-1)]">{breakdown.performance.toFixed(1)}/10</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[var(--text-2)]">Value for Money</span>
        <span className="font-semibold text-[var(--text-1)]">{breakdown.value.toFixed(1)}/10</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[var(--text-2)]">Build Quality</span>
        <span className="font-semibold text-[var(--text-1)]">{breakdown.quality.toFixed(1)}/10</span>
      </div>
    </div>
  </div>
)

const SpecItem: React.FC<{ icon: React.FC; name: string; value: string }> = ({ icon: Icon, name, value }) => (
  <div className="flex items-start gap-5">
    <div className="flex-shrink-0 mt-1">
      <Icon />
    </div>
    <div>
      <p className="text-sm font-medium text-[var(--text-3)]">{name}</p>
      <p className="font-semibold text-[var(--text-1)] leading-tight">{value}</p>
    </div>
  </div>
)

const ComponentBenchmarkView: React.FC<{
  title: string
  componentName?: string
  benchmarkValue?: string
  analysis: ComponentAnalysis | null
  isAnalysisLoading: boolean
  analysisError: string | null
  chartData: BenchmarkData[]
  isChartLoading: boolean
  chartError: string | null
  baseBenchmark?: SelectedBenchmark
}> = ({
  title,
  componentName,
  benchmarkValue,
  analysis,
  isAnalysisLoading,
  analysisError,
  chartData,
  isChartLoading,
  chartError,
  baseBenchmark,
}) => {
  const AnalysisLoader: React.FC = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-[var(--surface-3)] rounded-lg w-3/4"></div>
      <div className="h-5 bg-[var(--surface-3)] rounded-lg w-1/2"></div>
      <div className="space-y-2 pt-4">
        <div className="h-4 bg-[var(--surface-3)] rounded-lg w-full"></div>
        <div className="h-4 bg-[var(--surface-3)] rounded-lg w-full"></div>
        <div className="h-4 bg-[var(--surface-3)] rounded-lg w-5/6"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <div className="h-5 bg-[var(--surface-3)] rounded-lg w-1/3"></div>
          <div className="h-4 bg-[var(--surface-3)] rounded-lg w-full"></div>
          <div className="h-4 bg-[var(--surface-3)] rounded-lg w-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-[var(--surface-3)] rounded-lg w-1/3"></div>
          <div className="h-4 bg-[var(--surface-3)] rounded-lg w-full"></div>
          <div className="h-4 bg-[var(--surface-3)] rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  )

  if (!componentName) return null

  return (
    <div className="bg-gradient-to-br from-[var(--surface-2)] via-[var(--surface-2)] to-[var(--surface-3)] p-6 sm:p-8 rounded-3xl border border-[var(--surface-4)] shadow-xl">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--brand)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h4 className="font-bold text-xl sm:text-2xl text-[var(--text-1)]">{title}</h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Left Side: Analysis */}
        <div className="animate-fade-in order-2 lg:order-1">
          {isAnalysisLoading ? (
            <AnalysisLoader />
          ) : analysisError ? (
            <div className="p-6 rounded-xl bg-[var(--error-bg)] text-[var(--error-text)] border border-[var(--error-border)]">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold mb-1">Analysis Failed</p>
                  <p className="text-sm">{analysisError}</p>
                </div>
              </div>
            </div>
          ) : analysis ? (
            <div>
              <div className="bg-[var(--surface-3)] p-5 rounded-xl mb-6 border border-[var(--surface-4)]">
                <p className="text-2xl sm:text-3xl font-bold text-[var(--text-1)] leading-tight mb-2">{analysis.name}</p>
                {benchmarkValue && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-medium text-[var(--text-3)] uppercase tracking-wide">Benchmark Score</span>
                    <span className="text-lg sm:text-xl font-bold text-[var(--brand)]">{benchmarkValue}</span>
                  </div>
                )}
              </div>

              <p className="text-[var(--text-2)] mb-7 leading-relaxed text-sm sm:text-base">{analysis.summary}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[var(--success-bg)] p-5 rounded-xl border border-[var(--success)]/20">
                  <h5 className="font-semibold text-[var(--text-1)] mb-4 flex items-center gap-2">
                    <ThumbsUpIcon /> Strengths
                  </h5>
                  <ul className="space-y-3 text-sm">
                    {analysis.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckIcon className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="leading-relaxed text-[var(--text-2)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[var(--error-bg)] p-5 rounded-xl border border-[var(--error)]/20">
                  <h5 className="font-semibold text-[var(--text-1)] mb-4 flex items-center gap-2">
                    <ThumbsDownIcon /> Weaknesses
                  </h5>
                  <ul className="space-y-3 text-sm">
                    {analysis.weaknesses.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <XIcon className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="leading-relaxed text-[var(--text-2)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-[var(--text-3)] py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">No analysis available for this component</p>
            </div>
          )}
        </div>

        {/* Right Side: Chart */}
        <div className="order-1 lg:order-2">
          {baseBenchmark && (
            <BenchmarkChart
              isLoading={isChartLoading}
              error={chartError}
              chartData={chartData}
              baseBenchmark={baseBenchmark}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const LaptopDetailView: React.FC<{
  laptop: LaptopComparison
  onBack: () => void
}> = ({ laptop, onBack }) => {
  const [activeTab, setActiveTab] = useState("Overview")
  const {
    brand,
    model,
    rating,
    summary,
    specs,
    pros,
    cons,
    price,
    releaseDate,
    status,
    ratingBreakdown,
    gamingPerformance,
    productivityPerformance,
  } = laptop

  const [cpuAnalysis, setCpuAnalysis] = useState<ComponentAnalysis | null>(null)
  const [gpuAnalysis, setGpuAnalysis] = useState<ComponentAnalysis | null>(null)
  const [isCpuAnalysisLoading, setIsCpuAnalysisLoading] = useState(false)
  const [isGpuAnalysisLoading, setIsGpuAnalysisLoading] = useState(false)
  const [cpuAnalysisError, setCpuAnalysisError] = useState<string | null>(null)
  const [gpuAnalysisError, setGpuAnalysisError] = useState<string | null>(null)

  const [cpuChartData, setCpuChartData] = useState<BenchmarkData[]>([])
  const [gpuChartData, setGpuChartData] = useState<BenchmarkData[]>([])
  const [isCpuChartLoading, setIsCpuChartLoading] = useState(false)
  const [isGpuChartLoading, setIsGpuChartLoading] = useState(false)
  const [cpuChartError, setCpuChartError] = useState<string | null>(null)
  const [gpuChartError, setGpuChartError] = useState<string | null>(null)

  const cpuScore = parseBenchmarkScore(specs.cpuBenchmark)
  const gpuScore = parseBenchmarkScore(specs.gpuBenchmark)

  useEffect(() => {
    const fetchAnalysesAndBenchmarks = async () => {
      if (specs.Processor) {
        setIsCpuAnalysisLoading(true)
        setCpuAnalysisError(null)
        try {
          const data = await getComponentAnalysis(specs.Processor)
          setCpuAnalysis(data)
        } catch (e) {
          setCpuAnalysisError(e instanceof Error ? e.message : "Failed to load analysis.")
        } finally {
          setIsCpuAnalysisLoading(false)
        }

        if (cpuScore) {
          setIsCpuChartLoading(true)
          setCpuChartError(null)
          try {
            const benchmark: SelectedBenchmark = { name: specs.Processor, score: cpuScore, type: "CPU" }
            const fetchedData = await getBenchmarkComparisons(benchmark)
            const baseComponent: BenchmarkData = { ...benchmark, source: "N/A" }
            const combined = [baseComponent, ...fetchedData]
            const uniqueMap = new Map<string, BenchmarkData>()
            combined.forEach((item) => {
              uniqueMap.set(item.name.toLowerCase().trim(), item)
            })
            const results = Array.from(uniqueMap.values()).sort((a, b) => b.score - a.score)
            setCpuChartData(results)
          } catch (e) {
            setCpuChartError("Could not load comparison chart.")
          } finally {
            setIsCpuChartLoading(false)
          }
        }
      }
      if (specs.Graphics) {
        setIsGpuAnalysisLoading(true)
        setGpuAnalysisError(null)
        try {
          const data = await getComponentAnalysis(specs.Graphics)
          setGpuAnalysis(data)
        } catch (e) {
          setGpuAnalysisError(e instanceof Error ? e.message : "Failed to load analysis.")
        } finally {
          setIsGpuAnalysisLoading(false)
        }

        if (gpuScore) {
          setIsGpuChartLoading(true)
          setGpuChartError(null)
          try {
            const benchmark: SelectedBenchmark = { name: specs.Graphics, score: gpuScore, type: "GPU" }
            const fetchedData = await getBenchmarkComparisons(benchmark)
            const baseComponent: BenchmarkData = { ...benchmark, source: "N/A" }
            const combined = [baseComponent, ...fetchedData]
            const uniqueMap = new Map<string, BenchmarkData>()
            combined.forEach((item) => {
              uniqueMap.set(item.name.toLowerCase().trim(), item)
            })
            const results = Array.from(uniqueMap.values()).sort((a, b) => b.score - a.score)
            setGpuChartData(results)
          } catch (e) {
            setGpuChartError("Could not load comparison chart.")
          } finally {
            setIsGpuChartLoading(false)
          }
        }
      }
    }
    fetchAnalysesAndBenchmarks()
  }, [specs.Processor, specs.Graphics])

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  })

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 animate-slide-in">
      <button
        onClick={onBack}
        className="flex items-center mb-6 sm:mb-8 text-sm font-semibold text-[var(--text-2)] hover:text-[var(--brand)] transition-colors"
      >
        <BackIcon />
        Back to Results
      </button>
      <div className="bg-[var(--surface-2)] rounded-3xl overflow-hidden shadow-xl border border-[var(--surface-4)]">
        <div className="p-4 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-14">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {status && (
                  <span className="text-xs font-semibold bg-[var(--success-bg)] text-[var(--success-text)] px-4 py-2 rounded-full shadow-sm">
                    {status}
                  </span>
                )}
                {releaseDate && (
                  <span className="text-xs font-semibold bg-[var(--surface-3)] text-[var(--text-2)] px-4 py-2 rounded-full">
                    {releaseDate}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-1)] font-serif leading-tight mb-4">
                {brand} {model}
              </h2>
              {rating && (
                <div className="mt-4">
                  <Rating rating={rating} />
                </div>
              )}

              <div className="aspect-video bg-[var(--surface-1)] rounded-2xl my-6 sm:my-8 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                  src={`https://placehold.co/800x450/f1f5f9/334155?text=${brand}+${model}`}
                  alt={`${brand} ${model}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TABS */}
              <div className="mb-8 sm:mb-10">
                <nav className="bg-[var(--surface-3)] p-1.5 rounded-xl shadow-sm">
                  <div className="flex space-x-1 overflow-x-auto no-scrollbar">
                    <TabButton active={activeTab === "Overview"} onClick={() => setActiveTab("Overview")}>
                      Overview
                    </TabButton>
                    <TabButton active={activeTab === "Specifications"} onClick={() => setActiveTab("Specifications")}>
                      Specifications
                    </TabButton>
                    <TabButton active={activeTab === "Benchmarks"} onClick={() => setActiveTab("Benchmarks")}>
                      Benchmarks
                    </TabButton>
                  </div>
                </nav>
              </div>

              {/* TAB CONTENT */}
              <div key={activeTab} className="animate-fade-in">
                {activeTab === "Overview" && (
                  <div className="space-y-8 sm:space-y-10">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-1)] mb-4 sm:mb-5">Overview</h3>
                      <p className="text-[var(--text-2)] leading-relaxed text-base">{summary}</p>
                    </div>
                    {pros && cons && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                        <div>
                          <h4 className="font-semibold text-lg mb-5 flex items-center gap-3 text-[var(--text-1)]">
                            <CheckIcon /> Pros
                          </h4>
                          <ul className="space-y-4">
                            {pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-3 text-[var(--text-2)] leading-relaxed">
                                <CheckIcon className="h-5 w-5 shrink-0 mt-1" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-5 flex items-center gap-3 text-[var(--text-1)]">
                            <XIcon /> Cons
                          </h4>
                          <ul className="space-y-4">
                            {cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-3 text-[var(--text-2)] leading-relaxed">
                                <XIcon className="h-5 w-5 shrink-0 mt-1" />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {gamingPerformance && (
                      <div className="p-6 sm:p-8 border border-[var(--surface-4)] rounded-2xl shadow-sm">
                        <h4 className="font-semibold text-lg mb-6 text-[var(--text-1)]">Gaming Performance</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                          <div>
                            <p className="text-2xl sm:text-3xl font-bold text-[var(--success)]">
                              {gamingPerformance["1080p"] || "N/A"}
                            </p>
                            <p className="text-sm text-[var(--text-3)] mt-2">1080p Gaming (FPS)</p>
                          </div>
                          <div>
                            <p className="text-2xl sm:text-3xl font-bold text-[var(--success)]">
                              {gamingPerformance["1440p"] || "N/A"}
                            </p>
                            <p className="text-sm text-[var(--text-3)] mt-2">1440p Gaming (FPS)</p>
                          </div>
                          <div>
                            <p className="text-2xl sm:text-3xl font-bold text-[var(--brand)]">
                              {gamingPerformance.quality || "N/A"}
                            </p>
                            <p className="text-sm text-[var(--text-3)] mt-2">Quality Settings</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {productivityPerformance && (
                      <div className="p-6 sm:p-8 border border-[var(--surface-4)] rounded-2xl shadow-sm">
                        <h4 className="font-semibold text-lg mb-6 text-[var(--text-1)]">Productivity Score</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                          {productivityPerformance.map((p) => (
                            <PerformanceBar key={p.task} label={p.task} score={p.score} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "Specifications" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-1)] mb-6 sm:mb-7">Technical Specifications</h3>
                    <div className="bg-[var(--surface-3)] p-6 sm:p-8 rounded-2xl border border-[var(--surface-4)] shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-8 sm:gap-y-10">
                        {Object.entries(specs)
                          .filter(([key, value]) => {
                            const normalizedKey = Object.keys(specIcons).find(
                              (k) => k.toLowerCase() === key.toLowerCase(),
                            )
                            return (
                              typeof value === "string" && !key.toLowerCase().includes("benchmark") && normalizedKey
                            )
                          })
                          .map(([key, value]) => {
                            const normalizedKey =
                              Object.keys(specIcons).find((k) => k.toLowerCase() === key.toLowerCase()) || key
                            const IconComponent = specIcons[normalizedKey]
                            if (!IconComponent) return null
                            return (
                              <SpecItem key={key} icon={IconComponent} name={normalizedKey} value={value as string} />
                            )
                          })}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "Benchmarks" && (
                  <div className="space-y-8 sm:space-y-10">
                    <ComponentBenchmarkView
                      title="CPU Benchmark Analysis"
                      componentName={specs.Processor}
                      benchmarkValue={specs.cpuBenchmark}
                      analysis={cpuAnalysis}
                      isAnalysisLoading={isCpuAnalysisLoading}
                      analysisError={cpuAnalysisError}
                      chartData={cpuChartData}
                      isChartLoading={isCpuChartLoading}
                      chartError={cpuChartError}
                      baseBenchmark={cpuScore ? { name: specs.Processor!, score: cpuScore, type: "CPU" } : undefined}
                    />
                    <ComponentBenchmarkView
                      title="GPU Benchmark Analysis"
                      componentName={specs.Graphics}
                      benchmarkValue={specs.gpuBenchmark}
                      analysis={gpuAnalysis}
                      isAnalysisLoading={isGpuAnalysisLoading}
                      analysisError={gpuAnalysisError}
                      chartData={gpuChartData}
                      isChartLoading={isGpuChartLoading}
                      chartError={gpuChartError}
                      baseBenchmark={gpuScore ? { name: specs.Graphics!, score: gpuScore, type: "GPU" } : undefined}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-7">
              <div className="p-6 sm:p-7 border border-[var(--surface-4)] rounded-2xl bg-[var(--surface-2)] lg:sticky top-6 shadow-lg">
                {price && (
                  <p className="text-3xl sm:text-4xl font-bold mb-2 text-[var(--text-1)]">{currencyFormatter.format(price)}</p>
                )}
                <p className="text-sm text-[var(--text-3)] mb-7">Real-time AI-verified pricing</p>
                <button className="w-full bg-[var(--brand)] text-[var(--brand-text)] font-semibold py-3 sm:py-4 rounded-xl hover:bg-[var(--brand-hover)] transition-all shadow-md hover:shadow-lg">
                  View Deal
                </button>
                <div className="flex items-center gap-3 mt-4">
                  <button className="w-full border border-[var(--surface-4)] py-3 rounded-xl hover:bg-[var(--surface-3)] transition-colors font-medium text-[var(--text-2)]">
                    Save
                  </button>
                  <button className="w-full border border-[var(--surface-4)] py-3 rounded-xl hover:bg-[var(--surface-3)] transition-colors font-medium text-[var(--text-2)]">
                    Share
                  </button>
                </div>
              </div>

              {ratingBreakdown && rating && <OverallScoreCard rating={rating} breakdown={ratingBreakdown} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- COMPARISON BAR ---
const ComparisonBar: React.FC<{
  selectedCount: number;
  onCompare: () => void;
  onClear: () => void;
}> = ({ selectedCount, onCompare, onClear }) => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
      <div className="flex items-center justify-between bg-[var(--text-1)] text-[var(--surface-2)] rounded-xl shadow-2xl p-3 animate-fade-in-up">
          <div className="flex items-center">
              <div className="grid grid-cols-2 gap-1.5 mr-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < selectedCount ? 'bg-[var(--brand)]' : 'bg-gray-600'}`}></div>
                  ))}
              </div>
              <p className="font-semibold">{selectedCount} of 4 selected</p>
          </div>
          <div className="flex items-center gap-2">
              <button onClick={onClear} className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-2">Clear</button>
              <button 
                  onClick={onCompare} 
                  disabled={selectedCount < 2}
                  className="bg-[var(--brand)] text-[var(--brand-text)] font-semibold px-5 py-2 rounded-lg hover:bg-[var(--brand-hover)] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                  Compare
              </button>
          </div>
      </div>
  </div>
);


// --- MAIN COMPONENT ---

export const ComparisonResult: React.FC<{
  results: LaptopComparison[]
}> = ({ results }) => {
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopComparison | null>(null)
  const [selectedForCompare, setSelectedForCompare] = useState<LaptopComparison[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const handleViewDetails = useCallback((laptop: LaptopComparison) => {
    setSelectedLaptop(laptop);
  }, []);

  const handleBackToResults = useCallback(() => {
    setSelectedLaptop(null)
  }, [])
  
  const handleSelectToggle = useCallback((laptop: LaptopComparison) => {
      setSelectedForCompare(prev => {
          const isSelected = prev.some(l => l.model === laptop.model);
          if (isSelected) {
              return prev.filter(l => l.model !== laptop.model);
          } else {
              if (prev.length < 4) {
                  return [...prev, laptop];
              }
              // Optional: Add a toast/notification that the limit is 4
              return prev; 
          }
      });
  }, []);

  const handleStartCompare = useCallback(() => {
      if (selectedForCompare.length > 1) {
          setIsComparing(true);
      }
  }, [selectedForCompare]);

  const handleBackFromCompare = useCallback(() => {
      setIsComparing(false);
      setSelectedForCompare([]);
  }, []);
  
  const handleClearSelection = useCallback(() => {
      setSelectedForCompare([]);
  }, []);

  if (isComparing) {
    return <ComparisonPage laptops={selectedForCompare} onBack={handleBackFromCompare} />;
  }
  
  if (selectedLaptop) {
    return <LaptopDetailView laptop={selectedLaptop} onBack={handleBackToResults} />
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-1)] mb-3 leading-tight">Comparison Results</h2>
      <p className="text-base sm:text-lg text-[var(--text-2)] mb-8 sm:mb-10 leading-relaxed">
        Select up to 4 laptops to compare, or click a card to see more details.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7 lg:gap-9">
        {results.map((laptop, index) => (
          <CompactLaptopCard
            key={`${laptop.brand}-${laptop.model}-${index}`}
            laptop={laptop}
            onViewDetails={() => handleViewDetails(laptop)}
            onSelectToggle={() => handleSelectToggle(laptop)}
            isSelected={selectedForCompare.some(l => l.model === laptop.model)}
            index={index}
          />
        ))}
      </div>
      {selectedForCompare.length > 0 && (
          <ComparisonBar 
              selectedCount={selectedForCompare.length}
              onCompare={handleStartCompare}
              onClear={handleClearSelection}
          />
      )}
    </div>
  )
}
