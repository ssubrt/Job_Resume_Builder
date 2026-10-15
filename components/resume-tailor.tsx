'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Columns2,
  FileCode,
  FileDiff,
  FileText,
  History,
  Layers,
  LoaderCircle,
  Mail,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react'
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME_TEXT } from '@/lib/demo-data'
import { ResumeRenderer } from './resume-renderer'
import { DiffViewer } from './diff-viewer'
import { AtsAudit } from './ats-audit'
import { CoverLetterView } from './cover-letter-view'
import { SavedVersion, VersionHistory } from './version-history'

export type TailoredResumeResult = {
  summary: string
  match_score: number
  keywords: string[]
  matched_keywords?: string[]
  missing_keywords?: string[]
  ats_breakdown?: {
    overall: number
    keyword_match: number
    action_verbs: number
    formatting: number
    recommendations: string[]
  }
  cover_letter?: string
  resume_markdown: string
  original_text?: string
  file_info?: {
    name: string
    size_bytes: number
    size_formatted: string
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!

const PROCESSING_STEPS = [
  'Extracting resume tokens & validating layout in memory...',
  'Analyzing role requirements & keyword frequency from JD...',
  'Auditing ATS compliance & detecting missing skill gaps...',
  'Rephrasing achievements with Google XYZ formula & action verbs...',
  'Generating executive document, diff comparison & cover letter...',
]

export function ResumeTailor() {
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [fileSizeFormatted, setFileSizeFormatted] = useState('')
  const [result, setResult] = useState<TailoredResumeResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'preview' | 'diff' | 'ats' | 'cover' | 'history'>('preview')

  // Section-wise Customization & Tone (Bonus #4)
  const [customizeSummary, setCustomizeSummary] = useState(true)
  const [customizeExperience, setCustomizeExperience] = useState(true)
  const [customizeSkills, setCustomizeSkills] = useState(true)
  const [selectedTone, setSelectedTone] = useState<'impactful' | 'executive' | 'technical'>('impactful')

  // Saved Versions History (Bonus #3 & #7)
  const [versions, setVersions] = useState<SavedVersion[]>([])
  const [currentVersionId, setCurrentVersionId] = useState<string>('')

  // Load versions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('alignr_saved_versions')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setVersions(parsed)
      }
    } catch {
      // LocalStorage error fallback
    }
  }, [])

  // Save versions whenever updated
  const saveVersionsToStorage = (updated: SavedVersion[]) => {
    setVersions(updated)
    try {
      localStorage.setItem('alignr_saved_versions', JSON.stringify(updated))
    } catch {
      // LocalStorage error fallback
    }
  }

  // Format File Size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !['pdf', 'docx'].includes(extension)) {
      setError('Please upload a valid PDF or DOCX file.')
      return
    }
    setError('')
    setResumeFile(file)
    setFileSizeFormatted(formatBytes(file.size))
  }

  const clearFile = () => {
    setResumeFile(null)
    setFileSizeFormatted('')
  }

  // Load 1-Click Demo Sample
  const handleLoadDemo = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION)
    // Create a mock docx/pdf-named dummy file with sample text
    const blob = new Blob([SAMPLE_RESUME_TEXT], { type: 'application/pdf' })
    const demoFile = new File([blob], 'alex-rivera-senior-fullstack.pdf', { type: 'application/pdf' })
    setResumeFile(demoFile)
    setFileSizeFormatted(formatBytes(demoFile.size))
    setError('')
  }

  // Animated pipeline progress while loading (Bonus #8 Streaming feedback)
  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0)
      return
    }
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev))
    }, 2800)
    return () => clearInterval(interval)
  }, [isLoading])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!resumeFile || jobDescription.trim().length < 40) {
      setError('Please enter a valid job description (min 40 characters) and upload a resume.')
      return
    }
    setError('')
    setIsLoading(true)

    // Build active sections string
    const activeSections: string[] = []
    if (customizeSummary) activeSections.push('summary')
    if (customizeExperience) activeSections.push('experience')
    if (customizeSkills) activeSections.push('skills')

    const body = new FormData()
    body.append('job_description', jobDescription)
    body.append('resume', resumeFile)
    body.append('sections', activeSections.join(','))
    body.append('tone', selectedTone)

    try {
      const response = await fetch(`${API_URL}/api/customize`, { method: 'POST', body })
      const payload = (await response.json()) as TailoredResumeResult | { detail?: string }
      if (!response.ok) {
        throw new Error('detail' in payload ? (payload as any).detail : 'Unable to tailor your resume.')
      }

      const tailoredData = payload as TailoredResumeResult
      setResult(tailoredData)
      setActiveTab('preview')

      // Save to Version History
      const newVersionId = `v-${Date.now()}`
      setCurrentVersionId(newVersionId)

      const titleMatch = jobDescription.match(/Role:\s*([^\n]+)/i) || jobDescription.match(/(?:title|position):\s*([^\n]+)/i)
      const versionTitle = titleMatch ? titleMatch[1].trim() : 'Tailored Position'

      const newVersion: SavedVersion = {
        id: newVersionId,
        title: versionTitle,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchScore: tailoredData.match_score,
        matchedKeywords: tailoredData.matched_keywords || tailoredData.keywords || [],
        missingKeywords: tailoredData.missing_keywords || [],
        resumeMarkdown: tailoredData.resume_markdown,
        originalText: tailoredData.original_text || '',
        atsBreakdown: tailoredData.ats_breakdown,
        coverLetter: tailoredData.cover_letter,
      }

      saveVersionsToStorage([newVersion, ...versions.slice(0, 9)])
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Something went wrong while processing your resume. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Restore past version from history
  const handleSelectVersion = (version: SavedVersion) => {
    setCurrentVersionId(version.id)
    setResult({
      summary: `Restored version: ${version.title}`,
      match_score: version.matchScore,
      keywords: version.matchedKeywords,
      matched_keywords: version.matchedKeywords,
      missing_keywords: version.missingKeywords,
      ats_breakdown: version.atsBreakdown,
      cover_letter: version.coverLetter,
      resume_markdown: version.resumeMarkdown,
      original_text: version.originalText,
    })
    setActiveTab('preview')
  }

  const handleDeleteVersion = (id: string) => {
    const updated = versions.filter((v) => v.id !== id)
    saveVersionsToStorage(updated)
  }

  const handleClearAllVersions = () => {
    saveVersionsToStorage([])
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#1d2421]">
      {/* Sticky Navbar */}
      <header className="no-print sticky top-0 z-30 border-b border-[#dfe1dc]/80 bg-[#f7f6f2]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#1d2421] text-[#f7f6f2] shadow-xs">
              <Sparkles className="size-4.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight">
                alignr<span className="text-[#536bff]">.</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide text-[#8c9690]">
                AI RESUME OPTIMIZATION STUDIO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Button */}
            <button
              type="button"
              onClick={handleLoadDemo}
              className="flex items-center gap-1.5 rounded-full border border-[#536bff]/30 bg-[#eef0ff] px-3.5 py-1.5 text-xs font-semibold text-[#536bff] transition hover:bg-[#e4e7ff]"
            >
              <Zap className="size-3.5" />
              Try Demo Sample
            </button>

            <span className="hidden sm:inline-flex rounded-full border border-[#dfe1dc] bg-white/70 px-3 py-1 text-xs font-medium text-[#66706b]">
              Gemini Flash AI
            </span>
          </div>
        </div>
      </header>

      {/* Hero & Configuration Form */}
      <section className="no-print mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-8 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-12 lg:pt-12">
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#536bff]">
            <span className="h-px w-6 bg-[#536bff]" />
            Full Stack Career Intelligence
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl text-[#111827]">
            Tailor your resume for the role you deserve.
          </h1>
          <p className="mt-5 text-sm leading-6 text-[#4b5563] sm:text-base">
            Upload your PDF or DOCX resume and paste any Job Description. Our model reorganizes your verified achievements, injects relevant keywords, and audits ATS compatibility — without ever inventing false experience.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 text-xs font-medium text-[#374151]">
            <span className="flex items-center gap-2 rounded-xl bg-white/80 p-2.5 border border-[#dfe1dc]">
              <Check className="size-4 text-[#536bff]" />
              Truthful edits only
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/80 p-2.5 border border-[#dfe1dc]">
              <Check className="size-4 text-[#536bff]" />
              ATS score & gap analysis
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/80 p-2.5 border border-[#dfe1dc]">
              <Check className="size-4 text-[#536bff]" />
              Interactive Diff view
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/80 p-2.5 border border-[#dfe1dc]">
              <Check className="size-4 text-[#536bff]" />
              Cover letter generation
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-[#dfe1dc] bg-white p-6 shadow-[0_20px_50px_rgba(29,36,33,.05)] sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between border-b border-[#f1f2ee] pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa19d]">Step 1 of 2</p>
              <h2 className="text-xl font-bold tracking-tight text-[#111827]">Provide Context & Rules</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              In-Memory Processing
            </span>
          </div>

          {/* Job Description Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="job-description" className="text-xs font-bold uppercase tracking-wider text-[#374151]">
                Job Description
              </label>
              <span className="text-[11px] text-[#9ca3af]">
                {jobDescription.length > 0 ? `${jobDescription.length} chars` : 'Min. 40 chars'}
              </span>
            </div>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description, responsibilities, and required qualifications..."
              className="min-h-36 w-full resize-y rounded-2xl border border-[#dfe1dc] bg-[#fbfbf9] p-3.5 text-xs sm:text-sm leading-6 outline-none transition focus:border-[#536bff] focus:ring-4 focus:ring-[#536bff]/10"
            />
          </div>

          {/* Resume Upload Box with File Size Display */}
          <div className="mt-5 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
              Resume Upload (PDF or DOCX)
            </label>
            {resumeFile ? (
              <div className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50/50 p-4 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-xs">
                    <FileText className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[#111827] sm:text-sm">{resumeFile.name}</p>
                    <p className="text-[11px] font-medium text-emerald-800">
                      {fileSizeFormatted} • Ready to tailor
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-white hover:text-rose-600"
                  title="Remove file"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="resume-upload"
                className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#c8cdc8] bg-[#fbfbf9] p-4 transition hover:border-[#536bff] hover:bg-[#f8f8ff]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#536bff] shadow-xs">
                  <UploadCloud className="size-5" />
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[#111827] sm:text-sm">
                    Upload your resume
                  </span>
                  <span className="mt-0.5 block text-xs text-[#8c9690]">
                    PDF or DOCX • Max 10 MB (Name & Size will be displayed)
                  </span>
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFile}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {/* Bonus Feature #4: Section-wise Customization & Tone Selector */}
          <div className="mt-5 rounded-2xl border border-[#dfe1dc] bg-[#fbfbf9] p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#374151]">
              <SlidersHorizontal className="size-3.5 text-[#536bff]" />
              Section-wise Customization (Bonus)
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#dfe1dc] bg-white px-2.5 py-1.5 font-medium transition hover:border-[#536bff]">
                <input
                  type="checkbox"
                  checked={customizeSummary}
                  onChange={(e) => setCustomizeSummary(e.target.checked)}
                  className="rounded text-[#536bff]"
                />
                Summary Section
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#dfe1dc] bg-white px-2.5 py-1.5 font-medium transition hover:border-[#536bff]">
                <input
                  type="checkbox"
                  checked={customizeExperience}
                  onChange={(e) => setCustomizeExperience(e.target.checked)}
                  className="rounded text-[#536bff]"
                />
                Experience Bullets
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#dfe1dc] bg-white px-2.5 py-1.5 font-medium transition hover:border-[#536bff]">
                <input
                  type="checkbox"
                  checked={customizeSkills}
                  onChange={(e) => setCustomizeSkills(e.target.checked)}
                  className="rounded text-[#536bff]"
                />
                Skills Alignment
              </label>
            </div>

            {/* Tone Selector */}
            <div className="mt-3.5 flex items-center justify-between border-t border-[#f1f2ee] pt-3 text-xs">
              <span className="font-semibold text-[#66706b]">Tailoring Tone:</span>
              <div className="flex gap-1.5">
                {(['impactful', 'executive', 'technical'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTone(t)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                      selectedTone === t
                        ? 'bg-[#1d2421] text-white shadow-xs'
                        : 'border border-[#dfe1dc] bg-white text-[#66706b] hover:text-[#1d2421]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          {/* Submit Button & Live Progress Feedback (Bonus #8) */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d2421] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#536bff] disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="size-4.5 animate-spin" />
                  Optimizing with Gemini...
                </>
              ) : (
                <>
                  Tailor My Resume
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            {/* Live Pipeline Steps Feedback */}
            {isLoading && (
              <div className="mt-4 rounded-xl border border-[#536bff]/20 bg-[#eef0ff]/60 p-3 text-center">
                <p className="text-xs font-semibold text-[#536bff] animate-pulse">
                  {PROCESSING_STEPS[stepIndex]}
                </p>
                <div className="mt-2 flex justify-center gap-1.5">
                  {PROCESSING_STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i <= stepIndex ? 'w-6 bg-[#536bff]' : 'w-2 bg-[#536bff]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </section>

      {/* Dynamic Results Studio (Multi-Tab Interface) */}
      {result && (
        <section className="mx-auto max-w-7xl border-t border-[#dfe1dc] px-5 py-12 sm:px-8 lg:px-12">
          {/* Studio Header & Navigation Tabs */}
          <div className="no-print mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Step 2 of 2 • Ready
                </span>
                <span className="text-xs font-medium text-[#8c9690]">
                  Target Match: {result.match_score}%
                </span>
              </div>
              <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
                AI Career Studio
              </h2>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-[#4b5563]">
                {result.summary}
              </p>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#dfe1dc] bg-white p-1.5 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  activeTab === 'preview'
                    ? 'bg-[#1d2421] text-white shadow-xs'
                    : 'text-[#66706b] hover:text-[#1d2421]'
                }`}
              >
                <FileText className="size-3.5" />
                Formatted Sheet
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('diff')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  activeTab === 'diff'
                    ? 'bg-[#1d2421] text-white shadow-xs'
                    : 'text-[#66706b] hover:text-[#1d2421]'
                }`}
              >
                <FileDiff className="size-3.5" />
                Diff View
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ats')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  activeTab === 'ats'
                    ? 'bg-[#1d2421] text-white shadow-xs'
                    : 'text-[#66706b] hover:text-[#1d2421]'
                }`}
              >
                <ShieldCheck className="size-3.5" />
                ATS & Keywords
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cover')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  activeTab === 'cover'
                    ? 'bg-[#1d2421] text-white shadow-xs'
                    : 'text-[#66706b] hover:text-[#1d2421]'
                }`}
              >
                <Mail className="size-3.5" />
                Cover Letter
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  activeTab === 'history'
                    ? 'bg-[#1d2421] text-white shadow-xs'
                    : 'text-[#66706b] hover:text-[#1d2421]'
                }`}
              >
                <History className="size-3.5" />
                Versions ({versions.length})
              </button>
            </div>
          </div>

          {/* Active Tab Panels */}
          <div>
            {activeTab === 'preview' && (
              <ResumeRenderer
                markdown={result.resume_markdown}
                apiUrl={API_URL}
                jobTitle={resumeFile?.name ? resumeFile.name.replace(/\.[^/.]+$/, '') : 'tailored'}
              />
            )}

            {activeTab === 'diff' && (
              <DiffViewer
                originalText={result.original_text || 'Original resume text captured in memory.'}
                tailoredMarkdown={result.resume_markdown}
              />
            )}

            {activeTab === 'ats' && (
              <AtsAudit
                matchScore={result.match_score}
                matchedKeywords={result.matched_keywords || result.keywords || []}
                missingKeywords={result.missing_keywords || []}
                atsBreakdown={result.ats_breakdown}
              />
            )}

            {activeTab === 'cover' && (
              <CoverLetterView
                coverLetter={result.cover_letter || 'Cover letter generating...'}
                jobTitle="Tailored Opportunity"
              />
            )}

            {activeTab === 'history' && (
              <VersionHistory
                versions={versions}
                currentVersionId={currentVersionId}
                onSelectVersion={handleSelectVersion}
                onDeleteVersion={handleDeleteVersion}
                onClearAll={handleClearAllVersions}
              />
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="no-print mx-auto max-w-7xl border-t border-[#dfe1dc] px-5 py-8 text-center text-xs text-[#9aa19d] sm:px-8 lg:px-12">
        alignr • Full-Stack Resume Optimization Studio • Built with Next.js 16, FastAPI & Gemini Flash
      </footer>
    </main>
  )
}
