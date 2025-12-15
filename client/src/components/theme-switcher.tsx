import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '@/contexts/PreferencesContext';
import type { Theme } from '@/contexts/PreferencesContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import clsx from 'clsx';

type ThemeOption = {
  value: Theme;
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  // Calculate dropdown position dynamically for header variant
  useEffect(() => {
    if (variant === 'header' && buttonRef.current && open) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownLeft(rect.left);
    }
  }, [open, variant]);

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

  const currentTheme =
    THEME_OPTIONS.find(option => option.value === theme) || THEME_OPTIONS[0];

  const containerClasses = clsx(
    'relative inline-block text-left w-full',
    variant === 'header' ? 'sm:w-auto' : 'max-w-xs'
  );

  const buttonClasses = clsx(
    'flex items-center font-medium text-foreground bg-background backdrop-blur-md border-2 border-border rounded-md hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-border transition-colors w-full',
    variant === 'header'
      ? 'px-2 sm:px-3 py-1.5 touch-target-sm justify-center sm:w-auto min-w-0'
      : 'gap-2 px-3 py-2 text-sm justify-between'
  );

  const dropdownClasses = clsx(
    variant === 'header' ? 'fixed z-[101] top-14' : 'absolute z-50',
    'mt-1 bg-popover backdrop-blur-md text-foreground border border-border rounded-md shadow-lg',
    variant === 'header'
      ? 'w-auto min-w-fit'
      : 'left-0 w-full'
  );

  const iconOnly = variant === 'header';

  return (
    <div className={containerClasses} ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(o => !o)}
        className={buttonClasses}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {iconOnly ? (
          currentTheme.icon
        ) : (
          <>
            <div className="flex items-center gap-2">
              {currentTheme.icon}
              <span className="text-sm">
                {t(`settings.${currentTheme.value}`, currentTheme.label)}
              </span>
            </div>

            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <ul
          className={dropdownClasses}
          style={variant === 'header' ? { left: `${dropdownLeft}px` } : undefined}
          role="menu"
        >
          {THEME_OPTIONS.map(option => (
            <li key={option.value}>
              <button
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={clsx(
                  'w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 touch-target-sm',
                  iconOnly ? 'justify-center' : 'justify-start',
                  theme === option.value && 'bg-accent/50 font-semibold'
                )}
                title={iconOnly ? option.label : undefined}
              >
                {option.icon}
                {!iconOnly && <span>{t(`settings.${option.value}`, option.label)}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
