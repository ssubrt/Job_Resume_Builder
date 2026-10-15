'use client'

import { useState } from 'react'
import { Check, Columns2, FileDiff, Sparkles, Split } from 'lucide-react'

interface DiffViewerProps {
  originalText: string
  tailoredMarkdown: string
}

export function DiffViewer({ originalText, tailoredMarkdown }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')

  const originalLines = originalText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const tailoredLines = tailoredMarkdown
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Diff Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dfe1dc] bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#eef0ff] text-[#536bff]">
              <FileDiff className="size-4" />
            </span>
            <h3 className="text-sm font-semibold text-[#1d2421]">Interactive Diff Comparison</h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              Bonus Feature
            </span>
          </div>
          <p className="mt-1 text-xs text-[#66706b]">
            Compare the uploaded resume against the tailored version to inspect strategic rephrasing and newly integrated keywords.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-xl border border-[#dfe1dc] bg-[#fbfbf9] p-1">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              viewMode === 'split'
                ? 'bg-white text-[#1d2421] shadow-xs font-semibold'
                : 'text-[#66706b] hover:text-[#1d2421]'
            }`}
          >
            <Columns2 className="size-3.5" />
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode('unified')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              viewMode === 'unified'
                ? 'bg-white text-[#1d2421] shadow-xs font-semibold'
                : 'text-[#66706b] hover:text-[#1d2421]'
            }`}
          >
            <Split className="size-3.5" />
            Unified View
          </button>
        </div>
      </div>

      {/* Side-by-Side Mode */}
      {viewMode === 'split' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Left Column: Original */}
          <div className="flex flex-col rounded-2xl border border-[#dfe1dc] bg-white">
            <div className="flex items-center justify-between border-b border-[#dfe1dc] bg-[#fbfbf9] px-4 py-3 rounded-t-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#66706b]">
                Original Extracted Content
              </span>
              <span className="text-xs text-[#8c9690]">{originalLines.length} lines</span>
            </div>
            <div className="max-h-[600px] overflow-auto p-4 space-y-2">
              {originalLines.map((line, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-3 rounded-lg p-1.5 text-xs font-mono leading-5 text-[#4b5563] hover:bg-[#f7f6f2]"
                >
                  <span className="w-6 shrink-0 select-none text-right text-[10px] text-[#9ca3af]">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-sans">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Tailored */}
          <div className="flex flex-col rounded-2xl border border-emerald-200 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/60 px-4 py-3 rounded-t-2xl">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <Sparkles className="size-3.5 text-emerald-600" />
                Tailored & ATS Optimized
              </span>
              <span className="text-xs font-semibold text-emerald-700">{tailoredLines.length} lines</span>
            </div>
            <div className="max-h-[600px] overflow-auto p-4 space-y-2">
              {tailoredLines.map((line, idx) => {
                const isBullet = line.startsWith('- ') || line.startsWith('* ')
                const isHeader = line.startsWith('#')
                return (
                  <div
                    key={idx}
                    className={`group flex items-start gap-3 rounded-lg p-1.5 text-xs font-mono leading-5 ${
                      isBullet
                        ? 'bg-emerald-50/70 text-emerald-950 font-sans border-l-2 border-emerald-500 pl-2'
                        : isHeader
                        ? 'bg-[#eef0ff]/50 font-semibold text-[#1d2421]'
                        : 'text-[#374151] font-sans'
                    }`}
                  >
                    <span className="w-6 shrink-0 select-none text-right text-[10px] text-[#9ca3af]">
                      {idx + 1}
                    </span>
                    <span className="flex-1 font-sans">
                      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Unified View */
        <div className="overflow-hidden rounded-2xl border border-[#dfe1dc] bg-white">
          <div className="border-b border-[#dfe1dc] bg-[#fbfbf9] px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66706b]">
              Unified Diff Flow
            </span>
          </div>
          <div className="max-h-[600px] overflow-auto p-4 space-y-1 font-mono text-xs">
            {tailoredLines.map((line, idx) => {
              const isAddedOrOptimized = line.startsWith('- ') || line.startsWith('* ')
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 rounded px-2 py-1 leading-5 ${
                    isAddedOrOptimized
                      ? 'bg-emerald-50 text-emerald-900 border-l-2 border-emerald-600'
                      : 'text-[#4b5563]'
                  }`}
                >
                  <span className="w-4 select-none text-[11px] font-bold text-emerald-600">
                    {isAddedOrOptimized ? '+' : ' '}
                  </span>
                  <span className="font-sans flex-1">{line}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
