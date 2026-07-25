import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: localStorage.getItem('wadigo_theme') === 'dark',
  toggleDarkMode: () =>
    set((state) => {
      const nextMode = !state.isDarkMode;
      if (nextMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('wadigo_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('wadigo_theme', 'light');
      }
      return { isDarkMode: nextMode };
    }),
  toggleTheme: () =>
    set((state) => {
      const nextMode = !state.isDarkMode;
      if (nextMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('wadigo_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('wadigo_theme', 'light');
      }
      return { isDarkMode: nextMode };
    }),
}));
