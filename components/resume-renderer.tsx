'use client'

import { useState } from 'react'
import { Check, Copy, Download, FileCode, FileDown, FileText, Printer } from 'lucide-react'

interface ResumeRendererProps {
  markdown: string
  jobTitle?: string
  apiUrl?: string
}

export function ResumeRenderer({ markdown, jobTitle = 'Tailored Resume', apiUrl = 'http://localhost:8000' }: ResumeRendererProps) {
  const [copied, setCopied] = useState(false)
  const [downloadingDocx, setDownloadingDocx] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${jobTitle.toLowerCase().replace(/\s+/g, '-')}-tailored.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadTxt = () => {
    // Strip markdown formatting for pure plain text
    const plainText = markdown
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${jobTitle.toLowerCase().replace(/\s+/g, '-')}-tailored.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadDocx = async () => {
    try {
      setDownloadingDocx(true)
      const res = await fetch(`${apiUrl}/api/export/docx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown,
          filename: `${jobTitle.toLowerCase().replace(/\s+/g, '-')}-tailored.docx`,
        }),
      })
      if (!res.ok) throw new Error('Failed to generate DOCX')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${jobTitle.toLowerCase().replace(/\s+/g, '-')}-tailored.docx`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      // Fallback: download as text
      handleDownloadTxt()
    } finally {
      setDownloadingDocx(false)
    }
  }

  // Parse lines to render visually
  const lines = markdown.split('\n')

  return (
    <div className="flex flex-col gap-6">
      {/* Action Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfe1dc] bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-[#eef0ff] text-[#536bff]">
            <FileText className="size-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#66706b]">
            A4 Executive Preview
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-[#dfe1dc] bg-[#fbfbf9] px-3 py-1.5 text-xs font-medium text-[#303833] transition hover:border-[#536bff] hover:text-[#536bff]"
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
            Save as PDF / Print
          </button>

          <button
            type="button"
            disabled={downloadingDocx}
            onClick={handleDownloadDocx}
            className="flex items-center gap-1.5 rounded-xl border border-[#dfe1dc] bg-white px-3 py-1.5 text-xs font-medium text-[#303833] transition hover:border-[#536bff] hover:text-[#536bff] disabled:opacity-50"
          >
            <FileDown className="size-3.5" />
            {downloadingDocx ? 'Generating...' : 'Word (.docx)'}
          </button>

          <button
            type="button"
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 rounded-xl border border-[#dfe1dc] bg-white px-3 py-1.5 text-xs font-medium text-[#303833] transition hover:border-[#536bff] hover:text-[#536bff]"
          >
            <FileCode className="size-3.5" />
            Markdown (.md)
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 rounded-xl border border-[#dfe1dc] bg-white px-3 py-1.5 text-xs font-medium text-[#303833] transition hover:border-[#536bff] hover:text-[#536bff]"
          >
            <Download className="size-3.5" />
            Plain Text (.txt)
          </button>
        </div>
      </div>

      {/* Formatted Paper Resume Preview */}
      <div className="resume-paper rounded-2xl border border-[#dfe1dc] bg-white p-8 shadow-[0_12px_40px_rgba(29,36,33,.05)] sm:p-12">
        <div className="mx-auto max-w-3xl space-y-4">
          {lines.map((line, idx) => {
            const trimmed = line.trim()
            if (!trimmed) return <div key={idx} className="h-2" />

            // Main Name Header (# Name)
            if (trimmed.startsWith('# ')) {
              return (
                <div key={idx} className="border-b border-[#e5e7eb] pb-3 pt-2 text-center">
                  <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                    {trimmed.replace(/^#\s+/, '')}
                  </h1>
                </div>
              )
            }

            // Section Header (## Section)
            if (trimmed.startsWith('## ')) {
              return (
                <div key={idx} className="mt-6 border-b border-[#1d2421]/20 pb-1 pt-3">
                  <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#1d2421]">
                    {trimmed.replace(/^##\s+/, '')}
                  </h2>
                </div>
              )
            }

            // Sub Section Header (### Sub)
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={idx} className="mt-2 text-sm font-semibold text-[#1f2937]">
                  {trimmed.replace(/^###\s+/, '')}
                </h3>
              )
            }

            // Bullet Point (- or *)
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const bulletContent = trimmed.replace(/^[-*]\s+/, '')
              // Render bold parts
              const formatted = bulletContent.split(/(\*\*.*?\*\*)/).map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-semibold text-[#111827]">
                      {part.slice(2, -2)}
                    </strong>
                  )
                }
                return part
              })
              return (
                <div key={idx} className="flex items-start gap-2.5 pl-2 text-xs leading-5 text-[#374151] sm:text-sm">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#536bff]" />
                  <span>{formatted}</span>
                </div>
              )
            }

            // Regular paragraph or contact line
            const formattedLine = trimmed.split(/(\*\*.*?\*\*)/).map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-semibold text-[#111827]">
                    {part.slice(2, -2)}
                  </strong>
                )
              }
              return part
            })

            // Check if contact info line (contains email, phone, or bullets)
            const isContact = trimmed.includes('@') || trimmed.includes('•') || trimmed.includes('|')
            return (
              <p
                key={idx}
                className={
                  isContact
                    ? 'text-center text-xs text-[#4b5563]'
                    : 'text-xs leading-6 text-[#374151] sm:text-sm'
                }
              >
                {formattedLine}
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}
