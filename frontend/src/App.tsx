import React from 'react'
import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { AuthPage } from './pages/AuthPage'
import { ContestPage } from './pages/ContestPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { AdminPage } from './pages/AdminPage'

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, token } = useAuth()
  if (!token || !user) return <Navigate to="/auth" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/contest" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/contest" element={<ProtectedRoute><ContestPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/contest" replace />} />
      </Routes>
    </BrowserRouter>
  )
}