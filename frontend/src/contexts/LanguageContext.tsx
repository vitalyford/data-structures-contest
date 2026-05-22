import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { en } from '../i18n/en';
import { zh } from '../i18n/zh';
import type { Translations } from '../i18n/en';

type Lang = 'en' | 'zh';

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  t: en,
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('lang');
    return stored === 'zh' ? 'zh' : 'en';
  });

  const toggle = () => {
    const next: Lang = lang === 'en' ? 'zh' : 'en';
    setLang(next);
    localStorage.setItem('lang', next);
  };

  return (
    <LanguageContext.Provider value={{ lang, t: lang === 'en' ? en : zh, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
