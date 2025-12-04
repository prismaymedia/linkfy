import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '@/contexts/PreferencesContext';
import type { Theme } from '@/contexts/PreferencesContext';
import clsx from 'clsx';
import { Sun, Moon, Monitor } from 'lucide-react';

type ThemeOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
];

interface ThemeSwitcherProps {
  variant?: 'header' | 'settings';
}

export default function ThemeSwitcher({ variant = 'settings' }: ThemeSwitcherProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = usePreferences();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeValue: string) => {
    setTheme(themeValue as Theme);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      setOpen(true);
      e.preventDefault();
    }
    if (e.key === 'Escape') setOpen(false);
  };

  const currentTheme = THEME_OPTIONS.find(t => t.value === theme) || THEME_OPTIONS[0];

  // Different styles based on variant
  const containerClasses = clsx(
    "relative inline-block text-left w-full",
    variant === "header" ? "sm:w-auto" : "max-w-xs"
  );

  const buttonClasses = clsx(
    "flex items-center font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-300 transition-colors w-full",
    variant === "header"
      ? "gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm touch-target-sm sm:w-auto min-w-0"
      : "gap-2 px-3 py-2 text-sm justify-between"
  );

  const dropdownClasses = clsx(
    "absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg",
    variant === "header"
      ? "right-0 sm:right-0 w-40"
      : "left-0 w-full"
  );

  return (
    <div className={containerClasses} ref={dropdownRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        className={buttonClasses}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {currentTheme.icon}
          <span className="text-sm">{t(`settings.${currentTheme.value}`, currentTheme.label)}</span>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          className={dropdownClasses}
          role="menu"
        >
          {THEME_OPTIONS.map((themeOption) => (
            <li key={themeOption.value}>
              <button
                onClick={() => handleThemeChange(themeOption.value)}
                className={clsx(
                  'w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 touch-target-sm',
                  theme === themeOption.value && 'bg-gray-50 font-semibold'
                )}
                role="menuitem"
              >
                {themeOption.icon}
                <span className="truncate">{t(`settings.${themeOption.value}`, themeOption.label)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
