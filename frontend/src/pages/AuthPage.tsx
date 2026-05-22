import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSwitcher } from '../components/LanguageSwitcher'

export function AuthPage() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body: Record<string, string> = { username, password }
      if (tab === 'register') body.joinCode = joinCode.trim().toUpperCase()
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')
      login(data.token, data.user)
      navigate(data.user.role === 'admin' ? '/admin' : '/contest')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Data Structures Contest
        </h1>

        {/* Tabs */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          {(['login', 'register'] as const).map((tabId) => (
            <button
              key={tabId}
              onClick={() => { setTab(tabId); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === tabId ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tabId === 'login' ? t.login : t.register}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.username}</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-xl ring-1 ring-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl ring-1 ring-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {tab === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.joinCode}</label>
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                maxLength={6}
                className="w-full px-3 py-2 rounded-xl ring-1 ring-gray-200 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            {loading ? '...' : tab === 'login' ? t.login : t.register}
          </button>
        </form>
      </div>
    </div>
  )
}
