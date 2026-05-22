import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Timer } from './Timer';

interface LayoutProps {
  children: ReactNode;
  secondsLeft?: number;
  showTimer?: boolean;
}

export function Layout({ children, secondsLeft, showTimer }: LayoutProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const loc = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        loc.pathname.startsWith(to)
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {navLink('/contest', t.contestNav)}
            {navLink('/leaderboard', t.leaderboardNav)}
            {user?.role === 'admin' && navLink('/admin', t.adminNav)}
          </div>

          <div className="flex items-center gap-3">
            {showTimer && secondsLeft !== undefined && (
              <Timer secondsLeft={secondsLeft} />
            )}
            <LanguageSwitcher />
            <span className="text-sm text-gray-500">{user?.username}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {t.logoutBtn}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
