"use client";

// Libs
import { useEffect, useState } from 'react';

// Icones
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  // Inicializa o tema baseado no localStorage ou preferência do sistema
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (!theme && systemTheme)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Alterna entre os temas
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20 shadow-sm"
      aria-label="Alternar tema"
    >
      {isDark ? (
        <Sun size={20} className="animate-in zoom-in duration-300" />
      ) : (
        <Moon size={20} className="animate-in zoom-in duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;