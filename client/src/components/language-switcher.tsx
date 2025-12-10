import { useState, useEffect, useRef } from 'react';
import { setDocumentDir } from '@/lib/setDocumentDir';
import { usePreferences } from '@/contexts/PreferencesContext';
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
    const { language, setLanguage } = usePreferences();
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

    // Update document direction when language changes
    useEffect(() => {
        const lang = LANGUAGES.find(l => l.code === language);
        if (lang) {
            setDocumentDir(lang.dir || 'ltr');
        }
    }, [language]);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang.code as any);
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            setOpen(true);
            e.preventDefault();
        }
        if (e.key === 'Escape') setOpen(false);
    };

    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    // Different styles based on variant
    const containerClasses = clsx(
        "relative inline-block text-left w-full",
        variant === "header" ? "sm:w-auto" : "max-w-xs"
    );

    const buttonClasses = clsx(
        "flex items-center font-medium text-foreground bg-background dark:bg-white/10 backdrop-blur-md border-2 border-border dark:border-white/30 rounded-md hover:bg-accent/50 dark:hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-border transition-colors w-full",
        variant === "header"
            ? "gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm touch-target-sm sm:w-auto min-w-0"
            : "gap-2 px-3 py-2 text-sm justify-between"
    );

    const dropdownClasses = clsx(
        "absolute z-50 mt-1 bg-popover backdrop-blur-md text-popover-foreground border-2 border-border dark:border-white/30 rounded-md shadow-lg",
        variant === "header"
            ? "right-0 sm:right-0 w-40"
            : "left-0 w-full"
    );

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
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    'w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground dark:hover:bg-white/5 flex items-center gap-2 touch-target-sm',
                                    language === lang.code && 'bg-accent/50 font-semibold'
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
