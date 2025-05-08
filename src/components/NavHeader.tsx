import React from 'react';
import { BarChart3, Bell, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const NavHeader: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-7 w-7 text-blue-700 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">MarketCode AI</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            
            <button 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;