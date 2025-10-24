import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { setDocumentDir } from '@/lib/setDocumentDir';
import clsx from 'clsx';

type Language = {
  code: string;
  label: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
};

const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', flag: 'us', dir: 'ltr' },
  { code: 'es', label: 'Español', flag: 'es', dir: 'ltr' },
];

interface LanguageSwitcherProps {
  variant?: 'header' | 'settings';
}

export default function LanguageSwitcher({ variant = 'header' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // On mount, load saved language from localStorage and set document direction.
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang).then(() => {
        setDocumentDir(LANGUAGES.find(l => l.code === savedLang)?.dir || 'ltr');
      });
    }
  }, [i18n]);

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

  // Change language and update document direction
  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang.code);
    setDocumentDir(lang.dir || 'ltr');
    localStorage.setItem('language', lang.code);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      setOpen(true);
      e.preventDefault();
    }
    if (e.key === 'Escape') setOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  // Different styles based on variant
  const containerClasses = variant === 'header' 
    ? "relative inline-block text-left w-full sm:w-auto" 
    : "relative inline-block text-left w-full max-w-xs";

  const buttonClasses = variant === 'header'
    ? "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-300 transition-colors touch-target-sm w-full sm:w-auto min-w-0"
    : "flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-300 transition-colors w-full justify-between";

  const dropdownClasses = variant === 'header'
    ? "absolute right-0 sm:right-0 w-40 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
    : "absolute left-0 w-full z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg";

  const showCode = variant === 'header';

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
          <span className={clsx('fi', `fi-${currentLang.flag}`, 'text-sm sm:text-base flex-shrink-0')}></span>
          {showCode ? (
            <span className="text-xs uppercase">{currentLang.code}</span>
          ) : (
            <span className="text-sm">{currentLang.label}</span>
          )}
        </div>
        {variant === 'settings' && (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {open && (
        <ul
          className={dropdownClasses}
          role="menu"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => handleLanguageChange(lang)}
                className={clsx(
                  'w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 touch-target-sm',
                  i18n.language === lang.code && 'bg-gray-50 font-semibold'
                )}
                role="menuitem"
              >
                <span className={clsx('fi', `fi-${lang.flag}`, 'text-sm flex-shrink-0')}></span>
                <span className="truncate">{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}