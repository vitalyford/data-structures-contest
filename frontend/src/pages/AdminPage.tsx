import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Layout } from '../components/Layout'
import { Leaderboard } from '../components/Leaderboard'
import { useLeaderboard } from '../hooks/useLeaderboard'

interface Group { id: number; name: string; join_code: string; created_at: string }
interface Session { id: number; name: string; group_id: number; duration_minutes: number; is_active: number; start_time: string | null }
interface SubmissionRow { id: number; user_id: number; username: string; problem_id: string; is_correct: number; elapsed_seconds: number; submitted_at: string }

function SessionLeaderboardPanel({ session, token, groups }: { session: Session; token: string | null; groups: Group[] }) {
  const { data } = useLeaderboard(session.id, `/api/admin/sessions/${session.id}/leaderboard`, token)
  const group = groups.find(g => g.id === session.group_id)
  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-gray-800">
        {session.name}
        {group && <span className="ml-2 text-xs font-normal text-gray-400">{group.name}</span>}
      </h2>
      {data ? <Leaderboard data={data} /> : <div className="text-gray-400 text-sm">Loading…</div>}
    </div>
  )
}

export function AdminPage() {
  const { token } = useAuth()
  const { t } = useLanguage()
  const [tab, setTab] = useState<'groups' | 'sessions' | 'leaderboard'>('groups')
  const [groups, setGroups] = useState<Group[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<number | null>(null)
  const [sessionSubmissions, setSessionSubmissions] = useState<SubmissionRow[]>([])
  const [newGroupName, setNewGroupName] = useState('')
  const [newSession, setNewSession] = useState({ name: '', groupId: '', duration: '120' })
  const [error, setError] = useState('')
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null)
  const [editingDuration, setEditingDuration] = useState('')

  const authHeader = useCallback(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }), [token])

  const { data: lbData, refetch: refetchLb } = useLeaderboard(
    selectedSession,
    selectedSession ? `/api/admin/sessions/${selectedSession}/leaderboard` : '',
    token,
  )

  const fetchGroups = useCallback(() => {
    fetch('/api/admin/groups', { headers: authHeader() }).then(r => r.json()).then(setGroups).catch(() => {})
  }, [authHeader])

  const fetchSessions = useCallback(() => {
    fetch('/api/admin/sessions', { headers: authHeader() }).then(r => r.json()).then(setSessions).catch(() => {})
  }, [authHeader])

  useEffect(() => { fetchGroups(); fetchSessions() }, [fetchGroups, fetchSessions])

  useEffect(() => {
    if (!selectedSession) { setSessionSubmissions([]); return }
    fetch(`/api/admin/sessions/${selectedSession}/submissions`, { headers: authHeader() })
      .then(r => r.json()).then(setSessionSubmissions).catch(() => {})
  }, [selectedSession, authHeader])

  const resetSubmission = async (subId: number) => {
    await fetch(`/api/admin/submissions/${subId}`, { method: 'DELETE', headers: authHeader() })
    if (selectedSession) {
      fetch(`/api/admin/sessions/${selectedSession}/submissions`, { headers: authHeader() })
        .then(r => r.json()).then(setSessionSubmissions).catch(() => {})
      refetchLb()
    }
  }

  const createGroup = async () => {
    if (!newGroupName.trim()) return
    setError('')
    try {
      const r = await fetch('/api/admin/groups', { method: 'POST', headers: authHeader(), body: JSON.stringify({ name: newGroupName.trim() }) })
      if (!r.ok) throw new Error((await r.json()).error)
      setNewGroupName('')
      fetchGroups()
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error') }
  }

  const deleteGroup = async (id: number) => {
    await fetch(`/api/admin/groups/${id}`, { method: 'DELETE', headers: authHeader() })
    fetchGroups()
  }

  const createSession = async () => {
    setError('')
    try {
      const r = await fetch('/api/admin/sessions', {
        method: 'POST', headers: authHeader(),
        body: JSON.stringify({ name: newSession.name, groupId: Number(newSession.groupId), durationMinutes: Number(newSession.duration) })
      })
      if (!r.ok) throw new Error((await r.json()).error)
      setNewSession({ name: '', groupId: '', duration: '120' })
      fetchSessions()
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error') }
  }

  const startSession = async (id: number) => {
    await fetch(`/api/admin/sessions/${id}/start`, { method: 'POST', headers: authHeader() })
    fetchSessions()
  }

  const stopSession = async (id: number) => {
    await fetch(`/api/admin/sessions/${id}/stop`, { method: 'POST', headers: authHeader() })
    fetchSessions()
  }

  const deleteSession = async (id: number) => {
    await fetch(`/api/admin/sessions/${id}`, { method: 'DELETE', headers: authHeader() })
    if (selectedSession === id) setSelectedSession(null)
    fetchSessions()
  }

  const saveSessionDuration = async (id: number) => {
    const dur = Number(editingDuration)
    if (!dur || dur < 1) return
    setError('')
    try {
      const r = await fetch(`/api/admin/sessions/${id}`, {
        method: 'PATCH', headers: authHeader(),
        body: JSON.stringify({ durationMinutes: dur })
      })
      if (!r.ok) throw new Error((await r.json()).error)
      setEditingSessionId(null)
      fetchSessions()
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error') }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.adminPanel}</h1>
        {error && <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl ring-1 ring-red-200">{error}</div>}

        {/* Tabs */}
        <div className="flex rounded-xl bg-gray-100 p-1 w-fit">
          {(['groups', 'sessions', 'leaderboard'] as const).map((id) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {id === 'groups' ? t.groups : id === 'sessions' ? t.sessions : t.leaderboard}
            </button>
          ))}
        </div>

        {/* Groups tab */}
        {tab === 'groups' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
                placeholder={t.groupName}
                className="flex-1 max-w-xs px-3 py-2 rounded-xl ring-1 ring-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={createGroup} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors">
                {t.createGroup}
              </button>
            </div>
            {groups.length === 0 ? (
              <p className="text-gray-400 text-sm">{t.noGroups}</p>
            ) : (
              <div className="space-y-2">
                {groups.map((g) => (
                  <div key={g.id} className="flex items-center gap-4 bg-white rounded-xl ring-1 ring-gray-200 px-4 py-3">
                    <span className="font-medium text-gray-800">{g.name}</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{g.join_code}</span>
                    <span className="text-xs text-gray-400 ml-auto">{t.joinCodeLabel}</span>
                    <button onClick={() => deleteGroup(g.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">{t.deleteBtn}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sessions tab */}
        {tab === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {/* Create session */}
              <div className="bg-white rounded-xl ring-1 ring-gray-200 p-4 space-y-3">
                <p className="font-semibold text-gray-800 text-sm">{t.createSession}</p>
                <input value={newSession.name} onChange={e => setNewSession(p => ({ ...p, name: e.target.value }))}
                  placeholder={t.sessionName}
                  className="w-full px-3 py-2 rounded-xl ring-1 ring-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={newSession.groupId} onChange={e => setNewSession(p => ({ ...p, groupId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl ring-1 ring-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select group…</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <input type="number" value={newSession.duration} onChange={e => setNewSession(p => ({ ...p, duration: e.target.value }))}
                  placeholder={t.duration} min={1}
                  className="w-full px-3 py-2 rounded-xl ring-1 ring-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={createSession} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-sm transition-colors">
                  {t.createSession}
                </button>
              </div>

              {/* Session list */}
              {sessions.length === 0 ? <p className="text-gray-400 text-sm">{t.noSessions}</p> : (
                <div className="space-y-2">
                  {sessions.map(s => {
                    const group = groups.find(g => g.id === s.group_id)
                    const isExpired = !!s.start_time &&
                      (new Date(s.start_time).getTime() + s.duration_minutes * 60_000) <= Date.now()
                    const isActive = !!s.is_active && !isExpired
                    return (
                      <div key={s.id} onClick={() => setSelectedSession(s.id)}
                        className={`bg-white rounded-xl ring-1 px-4 py-3 cursor-pointer transition-all ${selectedSession === s.id ? 'ring-blue-400' : 'ring-gray-200 hover:ring-blue-200'}`}>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-sm text-gray-800">{s.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ring-1 ${isActive ? 'text-green-600 bg-green-50 ring-green-200' : 'text-gray-400 bg-gray-50 ring-gray-200'}`}>
                            {isActive ? t.active : t.inactive}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{group?.name} · {editingSessionId === s.id ? (
                          <span className="inline-flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <input
                              type="number" min={1}
                              value={editingDuration}
                              onChange={e => setEditingDuration(e.target.value)}
                              className="w-16 px-1 py-0.5 rounded ring-1 ring-blue-400 text-xs text-gray-800 focus:outline-none"
                            />
                            <span className="text-gray-400">min</span>
                          </span>
                        ) : `${s.duration_minutes} min`}</p>
                        <div className="flex gap-2 mt-2">
                          {!isActive ? (
                            <button onClick={e => { e.stopPropagation(); startSession(s.id) }} className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">{t.start}</button>
                          ) : (
                            <button onClick={e => { e.stopPropagation(); stopSession(s.id) }} className="text-xs bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600">{t.stop}</button>
                          )}
                          {editingSessionId === s.id ? (
                            <>
                              <button onClick={e => { e.stopPropagation(); saveSessionDuration(s.id) }} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">{t.saveBtn}</button>
                              <button onClick={e => { e.stopPropagation(); setEditingSessionId(null) }} className="text-xs text-gray-500 hover:text-gray-700 font-medium">{t.cancelBtn}</button>
                            </>
                          ) : (
                            <button onClick={e => { e.stopPropagation(); setEditingSessionId(s.id); setEditingDuration(String(s.duration_minutes)) }} className="text-xs text-blue-500 hover:text-blue-700 font-medium">{t.editBtn}</button>
                          )}
                          <button onClick={e => { e.stopPropagation(); deleteSession(s.id) }} className="text-xs text-red-500 hover:text-red-700 font-medium">{t.deleteBtn}</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Session detail */}
            <div>
              {lbData ? (
                <div className="space-y-6">
                  <h2 className="font-semibold text-gray-800">Leaderboard — {sessions.find(s => s.id === selectedSession)?.name}</h2>
                  <Leaderboard data={lbData} />

                  {sessionSubmissions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 text-sm mb-2">Submissions</h3>
                      <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                            <tr>
                              <th className="px-3 py-2 text-left">Student</th>
                              <th className="px-3 py-2 text-left">Problem</th>
                              <th className="px-3 py-2 text-left">Result</th>
                              <th className="px-3 py-2 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {sessionSubmissions.map(sub => (
                              <tr key={sub.id}>
                                <td className="px-3 py-2 text-gray-700">{sub.username}</td>
                                <td className="px-3 py-2 font-mono text-gray-600">{sub.problem_id}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-1.5 py-0.5 rounded font-medium ${sub.is_correct ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                    {sub.is_correct ? '✓' : '✗'}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <button
                                    onClick={() => resetSubmission(sub.id)}
                                    className="text-red-500 hover:text-red-700 font-medium"
                                  >
                                    Reset
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-sm mt-8 text-center">Select a session to view leaderboard</div>
              )}
            </div>
          </div>
        )}
        {/* Leaderboard tab */}
        {tab === 'leaderboard' && (() => {
          const activeSessions = sessions.filter(s => {
            const isExpired = !!s.start_time && (new Date(s.start_time).getTime() + s.duration_minutes * 60_000) <= Date.now()
            return !!s.is_active && !isExpired
          })
          return (
            <div className="space-y-10">
              {activeSessions.length === 0 ? (
                <p className="text-gray-400 text-sm">No active contests right now.</p>
              ) : (
                activeSessions.map(s => (
                  <SessionLeaderboardPanel key={s.id} session={s} token={token} groups={groups} />
                ))
              )}
            </div>
          )
        })()}
      </div>
    </Layout>
  )
}
