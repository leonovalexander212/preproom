import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export const THEMES = [
  { id: 'indigo',  label: 'Indigo · Violet', swatch: '#6366f1' },
  { id: 'emerald', label: 'Emerald · Teal',  swatch: '#10b981' },
  { id: 'amber',   label: 'Amber · Orange',  swatch: '#f59e0b' },
  { id: 'rose',    label: 'Rose · Coral',     swatch: '#f43f5e' },
  { id: 'cyan',    label: 'Cyan · Sky',       swatch: '#06b6d4' },
  { id: 'mono',    label: 'Mono · Lime',      swatch: '#84cc16' },
  { id: 'light',   label: 'Светлая',          swatch: '#f8fafc', border: '#cbd5e1' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const LS_KEY = 'preproom_theme';

type Ctx = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
};

const ThemeContext = createContext<Ctx>({ theme: 'indigo', setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && THEMES.some(t => t.id === saved)) return saved as ThemeId;
    return 'indigo';
  });

  function setTheme(t: ThemeId) {
    setThemeState(t);
    localStorage.setItem(LS_KEY, t);
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
