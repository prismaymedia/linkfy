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

export default function LanguageSwitcher() {
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-300 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className={clsx('fi', `fi-${currentLang.flag}`, 'text-base')}></span>
        <span className="uppercase text-xs">{currentLang.code}</span>
      </button>

      {open && (
        <ul
          className="absolute right-0 z-10 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg"
          role="menu"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => handleLanguageChange(lang)}
                className={clsx(
                  'w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2',
                  i18n.language === lang.code && 'bg-gray-50 font-semibold'
                )}
                role="menuitem"
              >
                <span className={clsx('fi', `fi-${lang.flag}`, 'text-base')}></span>
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
