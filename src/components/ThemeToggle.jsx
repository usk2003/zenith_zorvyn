import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useStore from '../store/useStore';

const ThemeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleDarkMode } = useStore();

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-3 rounded-2xl transition-all duration-300 flex items-center gap-3 backdrop-blur-md border ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 text-yellow-500 hover:bg-white/10' 
          : 'bg-gray-100 border-gray-200 text-accent hover:bg-gray-200'
      } ${className}`}
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <>
          <Sun size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
