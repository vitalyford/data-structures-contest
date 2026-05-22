import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { Layout } from '../components/Layout'
import { Leaderboard } from '../components/Leaderboard'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useContest } from '../hooks/useContest'
import { useFocusTracker } from '../hooks/useFocusTracker'

export function LeaderboardPage() {
  const { t } = useLanguage()
  const { token } = useAuth()
  const { session, loading: sessionLoading } = useContest()
  const { data, loading: dataLoading } = useLeaderboard(session?.id ?? null, `/api/leaderboard?sessionId=${session?.id}`, token)

  useFocusTracker({
    contestSessionId: session?.id ?? null,
    enabled: !!session && !!session.is_active,
  })

  const isLoading = sessionLoading || (!!session && dataLoading)

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.leaderboard}</h1>
        {isLoading ? (
          <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>{t.loading}</span>
          </div>
        ) : data ? (
          <Leaderboard data={data} />
        ) : (
          <div className="text-gray-400 text-center py-16">{t.contestNotStarted}</div>
        )}
      </div>
    </Layout>
  )
}
