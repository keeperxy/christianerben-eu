import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
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
    // Always return 'light' on server to prevent hydration mismatch
    // The actual theme will be set in useEffect after mount
    if (typeof window === 'undefined') return 'light';

    const savedTheme = window.localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [language, setLanguageState] = useState<Language>(initialLanguage);
  // Initialize with 'light' to match server, then update in useLayoutEffect
  const [theme, setThemeState] = useState<Theme>('light');
  const themeInitialized = useRef(false);

  // Set initial theme from localStorage/preferences after mount to prevent hydration mismatch
  // Using useLayoutEffect to set theme before paint to minimize flash
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || themeInitialized.current) {
      return;
    }

    const savedTheme = window.localStorage.getItem('theme') as Theme;
    const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Only set if different to avoid unnecessary re-renders
    if (preferredTheme !== theme) {
      setThemeState(preferredTheme);
    }
    themeInitialized.current = true;
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedLanguage = window.localStorage.getItem('language') as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'de') {
      setLanguageState((current) => (current === savedLanguage ? current : savedLanguage));
    }
  }, []);

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
  };

  // Theme setting function
  const setTheme = (theme: Theme) => {
    setThemeState(theme);
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    document.documentElement.setAttribute('lang', language);
    window.localStorage.setItem('language', language);
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    window.document.cookie = `language=${language}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  }, [language]);

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
