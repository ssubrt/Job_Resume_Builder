'use client'

import { useState } from 'react'
import { Check, Copy, Download, Mail, Printer, Sparkles } from 'lucide-react'

interface CoverLetterViewProps {
  coverLetter: string
  jobTitle?: string
}

export function CoverLetterView({ coverLetter, jobTitle = 'Tailored Role' }: CoverLetterViewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadTxt = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${jobTitle.toLowerCase().replace(/\s+/g, '-')}-cover-letter.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dfe1dc] bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#eef0ff] text-[#536bff]">
              <Mail className="size-4" />
            </span>
            <h3 className="text-sm font-semibold text-[#1d2421]">Tailored AI Cover Letter</h3>
            <span className="rounded-full bg-[#eef0ff] px-2 py-0.5 text-xs font-semibold text-[#536bff]">
              Bonus Feature
            </span>
          </div>
          <p className="mt-1 text-xs text-[#66706b]">
            Customized cover letter generated specifically for this role based on your verified accomplishments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-[#dfe1dc] bg-[#fbfbf9] px-3.5 py-1.5 text-xs font-medium text-[#303833] transition hover:border-[#536bff] hover:text-[#536bff]"
          >
            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-[#536bff] px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#4357e0]"
          >
            <Printer className="size-3.5" />
            Print / Save PDF
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 rounded-xl border border-[#dfe1dc] bg-white px-3.5 py-1.5 text-xs font-medium text-[#303833] transition hover:border-[#536bff] hover:text-[#536bff]"
          >
            <Download className="size-3.5" />
            Download (.txt)
          </button>
        </div>
      </div>

      {/* Formatted Cover Letter Card */}
      <div className="resume-paper rounded-2xl border border-[#dfe1dc] bg-white p-8 shadow-[0_12px_40px_rgba(29,36,33,.05)] sm:p-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="border-b border-[#e5e7eb] pb-4">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#536bff]">
              <Sparkles className="size-3.5" /> Letter of Interest
            </span>
            <p className="mt-1 text-xs text-[#66706b]">
              Prepared for {jobTitle} Application
            </p>
          </div>

          <div className="space-y-4 text-sm leading-7 text-[#374151]">
            {coverLetter.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-justify whitespace-pre-wrap">
                {paragraph.trim()}
              </p>
            ))}
          </div>

          <div className="pt-6 border-t border-[#f1f2ee] text-xs text-[#8c9690]">
            Generated using truthful context from source resume.
          </div>
        </div>
      </div>
    </div>
  )
}
