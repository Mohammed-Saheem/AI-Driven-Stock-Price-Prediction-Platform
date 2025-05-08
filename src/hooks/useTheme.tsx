import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check local storage or user preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleTheme };
};