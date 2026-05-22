import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { lang, toggle } = useLanguage();
  return (
    <button
      onClick={toggle}
      className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
    >
      {lang === 'en' ? '中文' : 'EN'}
    </button>
  );
}
