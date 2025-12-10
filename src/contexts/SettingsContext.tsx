import React, { useState, useEffect } from 'react';
import {
  SettingsContext,
  type Language,
  type Theme,
  type SettingsContextType,
} from './settings-hook';

export const SettingsProvider: React.FC<{ children: React.ReactNode; initialLanguage?: Language }> = ({
  children,
  initialLanguage = 'en',
}) => {
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';

    const savedTheme = window.localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedLanguage = window.localStorage.getItem('language') as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'de') {
      setLanguageState(savedLanguage);
      document.documentElement.setAttribute('lang', savedLanguage);
    } else {
      document.documentElement.setAttribute('lang', initialLanguage);
    }

    setThemeState(getInitialTheme());
  }, [initialLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    window.localStorage.setItem('theme', theme);
  }, [theme]);

  // Language setting function
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language', lang);
    }
    // Set <html lang> attribute
    document.documentElement.setAttribute('lang', lang);
  };

  // Theme setting function
  const setTheme = (theme: Theme) => {
    setThemeState(theme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
  };

  // Translation helper
  const t = (text: { en: string; de: string }): string => {
    return text[language];
  };

  return (
    <SettingsContext.Provider value={{ language, theme, setLanguage, setTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
};
// Ensure useSettings is NOT re-exported or defined here.
// It should be imported directly from './settings-hook' by components that need it.
