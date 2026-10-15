'use client'

import { Clock, ExternalLink, History, Layers, Trash2 } from 'lucide-react'

export interface SavedVersion {
  id: string
  title: string
  timestamp: string
  matchScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  resumeMarkdown: string
  originalText: string
  atsBreakdown?: any
  coverLetter?: string
}

interface VersionHistoryProps {
  versions: SavedVersion[]
  currentVersionId?: string
  onSelectVersion: (version: SavedVersion) => void
  onDeleteVersion: (id: string) => void
  onClearAll: () => void
}

export function VersionHistory({
  versions,
  currentVersionId,
  onSelectVersion,
  onDeleteVersion,
  onClearAll,
}: VersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfe1dc] bg-white p-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fbfbf9] text-[#9aa19d]">
          <History className="size-6" />
        </span>
        <h3 className="mt-4 text-sm font-semibold text-[#1d2421]">No saved versions yet</h3>
        <p className="mt-1 max-w-sm text-xs text-[#66706b]">
          Whenever you tailor a resume for a different role, each iteration will automatically be saved here so you can compare and restore past versions.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-2xl border border-[#dfe1dc] bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#eef0ff] text-[#536bff]">
              <Layers className="size-4" />
            </span>
            <h3 className="text-sm font-semibold text-[#1d2421]">Saved Resume Versions</h3>
            <span className="rounded-full bg-[#eef0ff] px-2 py-0.5 text-xs font-semibold text-[#536bff]">
              {versions.length} {versions.length === 1 ? 'version' : 'versions'}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#66706b]">
            Switch between tailored versions to evaluate how different job descriptions affect your score.
          </p>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
        >
          <Trash2 className="size-3.5" />
          Clear All
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {versions.map((ver) => {
          const isSelected = ver.id === currentVersionId
          return (
            <div
              key={ver.id}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-5 transition ${
                isSelected
                  ? 'border-[#536bff] ring-2 ring-[#536bff]/20 shadow-sm'
                  : 'border-[#dfe1dc] hover:border-[#536bff]/50 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-[#eef0ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#536bff]">
                    {ver.matchScore}% Match
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#9aa19d]">
                    <Clock className="size-3" />
                    <span>{ver.timestamp}</span>
                  </div>
                </div>

                <h4 className="mt-3 text-sm font-semibold text-[#1d2421] line-clamp-1">
                  {ver.title || 'Tailored Resume'}
                </h4>
                <p className="mt-1 text-xs text-[#66706b] line-clamp-2">
                  {ver.matchedKeywords.length} skills aligned • {ver.missingKeywords.length} suggestions
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#f1f2ee] pt-3">
                <button
                  type="button"
                  onClick={() => onSelectVersion(ver)}
                  className={`flex items-center gap-1 text-xs font-semibold transition ${
                    isSelected ? 'text-[#536bff]' : 'text-[#374151] hover:text-[#536bff]'
                  }`}
                >
                  <ExternalLink className="size-3.5" />
                  {isSelected ? 'Currently Viewing' : 'Restore Version'}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteVersion(ver.id)
                  }}
                  className="rounded-lg p-1 text-[#9ca3af] transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
