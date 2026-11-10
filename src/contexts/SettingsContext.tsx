import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  SettingsContext,
  type Language,
  type Theme,
  type SettingsContextType,
} from './settings-hook';

// Storage access throws when the browser blocks site data (privacy modes,
// disabled cookies, quota errors). Preferences are optional, so fail quietly.
const readStoredValue = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStoredValue = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore: the preference only lasts for the current page view.
  }
};

const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark';

const isLanguage = (value: string | null): value is Language =>
  value === 'en' || value === 'de';

const getBrowserLanguage = (): Language => {
  const browserLanguages = [
    ...Array.from(window.navigator.languages ?? []),
    window.navigator.language,
  ];
  const preferred = browserLanguages.find((value) => value);

  return preferred?.toLowerCase().startsWith('de') ? 'de' : 'en';
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>('en');
  // Initialize with 'light' to match server, then update in useLayoutEffect
  const [theme, setThemeState] = useState<Theme>('light');
  const themeInitialized = useRef(false);

  // Set initial theme from localStorage/preferences after mount to prevent hydration mismatch
  // Using useLayoutEffect to set theme before paint to minimize flash
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || themeInitialized.current) {
      return;
    }

    const savedTheme = readStoredValue('theme');
    const preferredTheme: Theme = isTheme(savedTheme)
      ? savedTheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    
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

    const savedLanguage = readStoredValue('language');
    if (isLanguage(savedLanguage)) {
      setLanguageState((current) => (current === savedLanguage ? current : savedLanguage));
      return;
    }

    const browserLanguage = getBrowserLanguage();
    setLanguageState((current) => (current === browserLanguage ? current : browserLanguage));
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

    writeStoredValue('theme', theme);
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
    writeStoredValue('language', language);
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
