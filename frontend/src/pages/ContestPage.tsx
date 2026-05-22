import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useContest } from '../hooks/useContest'
import { useFocusTracker } from '../hooks/useFocusTracker'
import { Layout } from '../components/Layout'
import { FocusViolationModal } from '../components/FocusViolationModal'
import { DragOrderProblem } from '../components/problems/DragOrderProblem'
import { MultiChoiceProblem } from '../components/problems/MultiChoiceProblem'
import { CheckboxMultiProblem } from '../components/problems/CheckboxMultiProblem'
import { ClickSequenceProblem } from '../components/problems/ClickSequenceProblem'
import { ClickBugProblem } from '../components/problems/ClickBugProblem'
import { DragMatchProblem } from '../components/problems/DragMatchProblem'
import { FillMatrixProblem } from '../components/problems/FillMatrixProblem'
import { ClickEdgesProblem } from '../components/problems/ClickEdgesProblem'
import { DragPriorityProblem } from '../components/problems/DragPriorityProblem'
import { ClickCellsProblem } from '../components/problems/ClickCellsProblem'

import type { Problem } from '../../../backend/src/data/problems'

interface SubmissionState {
  submitted: boolean
  isCorrect: boolean | null
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*\n]+\*\*|`[^`\n]+`)/)
  return (
    <>
      {parts.map((part, pi) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={pi}>{part.slice(2, -2)}</strong>
        if (part.startsWith('`') && part.endsWith('`')) return <code key={pi} className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>
        return <span key={pi}>{part}</span>
      })}
    </>
  )
}

function renderMd(text: string): ReactNode {
  const isSepRow = (l: string) => {
    const cells = l.split('|').slice(1, -1)
    return cells.length > 0 && cells.every((c) => /^[\s\-:]+$/.test(c))
  }

  const segments = text.split(/(```[\s\S]*?```)/g)
  const nodes: ReactNode[] = []
  segments.forEach((seg, si) => {
    if (seg.startsWith('```') && seg.endsWith('```')) {
      const code = seg.replace(/^```\w*\n?/, '').replace(/\n?```$/, '')
      nodes.push(<pre key={si} className="bg-gray-900 text-green-300 text-xs p-3 rounded-lg my-2 overflow-x-auto font-mono whitespace-pre">{code}</pre>)
      return
    }
    const lines = seg.split('\n')
    let i = 0
    const rendered: ReactNode[] = []
    while (i < lines.length) {
      if (lines[i].trimStart().startsWith('|')) {
        const start = i
        while (i < lines.length && lines[i].trimStart().startsWith('|')) i++
        const tableLines = lines.slice(start, i)
        const parseRow = (l: string) => l.split('|').slice(1, -1).map((c) => c.trim())
        if (tableLines.length >= 2 && isSepRow(tableLines[1])) {
          const headers = parseRow(tableLines[0])
          const rows = tableLines.slice(2).map(parseRow)
          rendered.push(
            <div key={`${si}-tbl-${start}`} className="overflow-x-auto my-3">
              <table className="text-sm border-collapse">
                <thead>
                  <tr>
                    {headers.map((h, hi) => (
                      <th key={hi} className="px-3 py-2 text-left font-semibold text-gray-700 bg-gray-100 border border-gray-200 whitespace-nowrap">
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 border border-gray-200 text-gray-700">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      } else {
        const start = i
        while (i < lines.length && !lines[i].trimStart().startsWith('|')) i++
        const block = lines.slice(start, i).join('\n')
        const inlineParts = block.split(/(\*\*[^*\n]+\*\*|`[^`\n]+`)/)
        const lineNodes: ReactNode[] = []
        inlineParts.forEach((part, pi) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            lineNodes.push(<strong key={pi}>{part.slice(2, -2)}</strong>)
          } else if (part.startsWith('`') && part.endsWith('`')) {
            lineNodes.push(<code key={pi} className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>)
          } else {
            const sublines = part.split('\n')
            sublines.forEach((subline, li) => {
              if (subline) lineNodes.push(<span key={`${pi}-${li}`}>{subline}</span>)
              if (li < sublines.length - 1) lineNodes.push(<br key={`br-${pi}-${li}`} />)
            })
          }
        })
        if (lineNodes.length > 0) rendered.push(<span key={`${si}-txt-${start}`}>{lineNodes}</span>)
      }
    }
    if (rendered.length > 0) nodes.push(<span key={si}>{rendered}</span>)
  })
  return <>{nodes}</>
}

const DIFF_COLORS = {
  easy: 'text-green-600 bg-green-50 ring-green-200',
  medium: 'text-yellow-600 bg-yellow-50 ring-yellow-200',
  hard: 'text-red-600 bg-red-50 ring-red-200',
}

export function ContestPage() {
  const { token } = useAuth()
  const { lang, t } = useLanguage()
  const { session, secondsLeft, loading } = useContest()
  const [problems, setProblems] = useState<Problem[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<Record<string, SubmissionState>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [showFocusModal, setShowFocusModal] = useState(false)
  const [hasOpenedProblem, setHasOpenedProblem] = useState(false)

  const allSubmitted = problems.length > 0 && problems.every((p) => submissions[p.id]?.submitted)

  useFocusTracker({
    contestSessionId: session?.id ?? null,
    enabled: !!session && !allSubmitted,
    onViolation: useCallback(() => setShowFocusModal(true), []),
  })

  useEffect(() => {
    fetch('/api/problems', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setProblems)
      .catch(() => {})
  }, [token])

  // Restore past submissions from the server on load / session change
  useEffect(() => {
    if (!session || !token) return
    fetch(`/api/submissions?contestSessionId=${session.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: Record<string, boolean>) => {
        const restored: Record<string, SubmissionState> = {}
        for (const [problemId, isCorrect] of Object.entries(data)) {
          restored[problemId] = { submitted: true, isCorrect }
        }
        setSubmissions(restored)
      })
      .catch(() => {})
  }, [session, token])

  const handleSubmit = async (problem: Problem, answer: unknown) => {
    if (!session || submittingId) return
    setSubmittingId(problem.id)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ problemId: problem.id, contestSessionId: session.id, answer }),
      })
      const data = await res.json()
      if (res.status === 409) {
        return
      }
      setSubmissions((prev) => ({
        ...prev,
        [problem.id]: { submitted: true, isCorrect: data.correct ?? false },
      }))
    } catch {
      // Network error — do nothing so the user can retry
    } finally {
      setSubmittingId(null)
    }
  }

  const selectedProblem = problems.find((p) => p.id === selected)

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>{t.loading}</span>
        </div>
      </Layout>
    )
  }

  if (!session) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-gray-400">{t.contestNotStarted}</div>
      </Layout>
    )
  }

  if (secondsLeft <= 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-gray-400">{t.contestEnded}</div>
      </Layout>
    )
  }

  const content = selectedProblem ? (lang === 'en' ? selectedProblem.en : selectedProblem.zh) : null
  const subState = selected ? submissions[selected] : null

  function renderProblem(p: Problem) {
    const state = submissions[p.id] ?? { submitted: false, isCorrect: null }
    const props = { problem: p, onSubmit: (ans: unknown) => handleSubmit(p, ans), submitted: state.submitted, isCorrect: state.isCorrect, submitting: submittingId === p.id }
    switch (p.type) {
      case 'drag-order': return <DragOrderProblem {...props} />
      case 'multi-choice': return <MultiChoiceProblem {...props} />
      case 'checkbox-multi': return <CheckboxMultiProblem {...props} />
      case 'click-sequence': return <ClickSequenceProblem {...props} />
      case 'click-bug': return <ClickBugProblem {...props} />
      case 'drag-match': return <DragMatchProblem {...props} />
      case 'fill-matrix': return <FillMatrixProblem {...props} />
      case 'click-edges': return <ClickEdgesProblem {...props} />
      case 'drag-priority': return <DragPriorityProblem {...props} />
      case 'click-cells': return <ClickCellsProblem {...props} />
      default: return <div className="text-gray-400 text-sm">Unknown problem type: {p.type}</div>
    }
  }

  return (
    <Layout secondsLeft={secondsLeft} showTimer={true}>
      {showFocusModal && <FocusViolationModal open={true} onClose={() => setShowFocusModal(false)} />}

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-60 flex-shrink-0 border-r border-gray-100 bg-white overflow-y-auto py-4">
          {['stacks', 'queues', 'graphs'].map((topic) => {
            const group = problems.filter((p) => p.topic === topic)
            if (group.length === 0) return null
            return (
              <div key={topic} className="mb-4">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{t[topic as 'stacks' | 'queues' | 'graphs']}</p>
                {group.map((p) => {
                  const sub = submissions[p.id]
                  const title = lang === 'en' ? p.en.title : p.zh.title
                  return (
                    <button
                      key={p.id}
                      onClick={() => { setSelected(p.id); setHasOpenedProblem(true); }}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors ${
                        selected === p.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        !sub ? 'bg-gray-300' : sub.isCorrect ? 'bg-blue-600' : 'bg-amber-500'
                      }`} />
                      <span className="text-sm truncate">{title}</span>
                      <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ring-1 ${DIFF_COLORS[p.difficulty]}`}>
                        {t[p.difficulty]}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </aside>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {selectedProblem && content ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded ring-1 font-medium ${DIFF_COLORS[selectedProblem.difficulty]}`}>
                    {t[selectedProblem.difficulty]}
                  </span>
                  <span className="text-xs text-gray-400">{selectedProblem.points} pts</span>
                </div>

                {/* Teaching section */}
                {content.teaching && (
                  <div className="mb-6 p-5 bg-blue-50 rounded-xl ring-1 ring-blue-200 text-sm text-gray-700 leading-relaxed">
                    {renderMd(content.teaching)}
                  </div>
                )}

                <div className="text-gray-600 mb-6 leading-relaxed text-sm">{renderMd(content.description)}</div>
              </div>

              {subState?.submitted && (
                <div className={`flex items-center gap-2 text-sm font-semibold ${subState.isCorrect ? 'text-blue-800' : 'text-amber-600'}`}>
                  <span>{subState.isCorrect ? '✓' : '✗'}</span>
                  <span>{subState.isCorrect ? t.correct : t.wrong}</span>
                </div>
              )}

              {!subState?.submitted && renderProblem(selectedProblem)}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a problem from the sidebar
            </div>
          )}
        </main>
      </div>
    </Layout>
  )
}
