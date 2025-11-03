import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

type Theme = 'light' | 'dark' | 'system';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Moon;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        title="Toggle theme"
      >
        <ThemeIcon size={20} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-40 glass-effect rounded-lg shadow-lg border border-white/10 py-2 z-50"
          >
            <button
              onClick={() => handleThemeChange('light')}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                theme === 'light' 
                  ? 'text-aqua-blue bg-aqua-blue/20' 
                  : 'text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              <Sun size={16} />
              Light
            </button>
            
            <button
              onClick={() => handleThemeChange('dark')}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                theme === 'dark' 
                  ? 'text-aqua-blue bg-aqua-blue/20' 
                  : 'text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              <Moon size={16} />
              Dark
            </button>
            
            <button
              onClick={() => handleThemeChange('system')}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                theme === 'system' 
                  ? 'text-aqua-blue bg-aqua-blue/20' 
                  : 'text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              <Monitor size={16} />
              System
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
