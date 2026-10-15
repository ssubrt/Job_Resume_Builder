'use client'

import { AlertCircle, CheckCircle2, Lightbulb, ShieldCheck, Tag } from 'lucide-react'

interface AtsAuditProps {
  matchScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  atsBreakdown?: {
    overall: number
    keyword_match: number
    action_verbs: number
    formatting: number
    recommendations: string[]
  }
}

export function AtsAudit({
  matchScore,
  matchedKeywords,
  missingKeywords,
  atsBreakdown,
}: AtsAuditProps) {
  const breakdown = atsBreakdown || {
    overall: matchScore,
    keyword_match: Math.max(70, Math.min(100, matchScore - 5)),
    action_verbs: 92,
    formatting: 95,
    recommendations: [
      'Highlight specific cloud architecture metrics in the summary',
      'Ensure standard section headers are used for automated ATS parsers',
      'Keep bullets between 1-2 lines for optimal recruiter scannability',
    ],
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Scores Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Score */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#dfe1dc] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9aa19d]">
              Overall ATS Score
            </span>
            <span className="flex size-6 items-center justify-center rounded-full bg-[#eef0ff] text-[#536bff]">
              <ShieldCheck className="size-3.5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-[#536bff]">
              {breakdown.overall}
            </span>
            <span className="text-sm font-semibold text-[#66706b]">/ 100</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f1f2ee]">
            <div
              className="h-full rounded-full bg-[#536bff] transition-all duration-500"
              style={{ width: `${breakdown.overall}%` }}
            />
          </div>
        </div>

        {/* Keyword Match */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#dfe1dc] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9aa19d]">
              Keyword Match
            </span>
            <span className="flex size-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-3.5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-emerald-600">
              {breakdown.keyword_match}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f1f2ee]">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${breakdown.keyword_match}%` }}
            />
          </div>
        </div>

        {/* Action Verbs */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#dfe1dc] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9aa19d]">
              Action Verbs & Impact
            </span>
            <span className="flex size-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Tag className="size-3.5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-indigo-600">
              {breakdown.action_verbs}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f1f2ee]">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${breakdown.action_verbs}%` }}
            />
          </div>
        </div>

        {/* ATS Formatting */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#dfe1dc] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9aa19d]">
              Parse Readability
            </span>
            <span className="flex size-6 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <ShieldCheck className="size-3.5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-sky-600">
              {breakdown.formatting}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f1f2ee]">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-500"
              style={{ width: `${breakdown.formatting}%` }}
            />
          </div>
        </div>
      </div>

      {/* Keywords Breakdown (Matched vs Missing) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Matched Keywords */}
        <div className="rounded-2xl border border-[#dfe1dc] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#1d2421]">Matched Skills & Keywords</h4>
              <p className="mt-0.5 text-xs text-[#66706b]">
                Verified competencies found in the resume and prioritized for the JD.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {matchedKeywords.length} matched
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-medium text-emerald-800"
                >
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  {kw}
                </span>
              ))
            ) : (
              <p className="text-xs text-[#8c9690]">No specific matched keywords detected.</p>
            )}
          </div>
        </div>

        {/* Missing Keywords (Skill Gaps) */}
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-amber-950">Missing Keywords & Skill Gaps</h4>
              <p className="mt-0.5 text-xs text-[#786134]">
                Requested in the JD but not found in the original resume. Consider adding if applicable.
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
              {missingKeywords.length} suggested
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900"
                >
                  <AlertCircle className="size-3 text-amber-600" />
                  {kw}
                </span>
              ))
            ) : (
              <p className="text-xs text-emerald-700 font-medium">
                Great job! No critical missing keywords detected for this role.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      {breakdown.recommendations && breakdown.recommendations.length > 0 && (
        <div className="rounded-2xl border border-[#dfe1dc] bg-[#fbfbf9] p-6">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Lightbulb className="size-4" />
            </span>
            <h4 className="text-sm font-semibold text-[#1d2421]">
              ATS Optimization Recommendations
            </h4>
          </div>
          <ul className="mt-4 space-y-2.5">
            {breakdown.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[#4b5563] sm:text-sm">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#536bff]" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
