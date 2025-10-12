import React, { useState, useEffect } from 'react';
import {
  SettingsContext,
  type Language,
  type Theme,
  type SettingsContextType,
} from './settings-hook';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from browser or localStorage
  // The useSettings hook is defined and exported from ./settings-hook.ts
  // This file should only export the SettingsProvider component.
  const getBrowserLanguage = (): Language => {
    // First check localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'en' || savedLanguage === 'de') return savedLanguage;
    
    // Fall back to browser language
    const navigatorLanguage = navigator.language.substring(0, 2).toLowerCase();
    return navigatorLanguage === 'de' ? 'de' : 'en';
  };

  // Get initial theme from system preference
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = window.localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const browserLang = getBrowserLanguage();
    setLanguageState(browserLang);
    setThemeState(getInitialTheme());
    // Set initial <html lang>
    document.documentElement.setAttribute('lang', browserLang);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Language setting function
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Set <html lang> attribute
    document.documentElement.setAttribute('lang', lang);
  };

  // Theme setting function
  const setTheme = (theme: Theme) => {
    setThemeState(theme);
    localStorage.setItem('theme', theme);
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
