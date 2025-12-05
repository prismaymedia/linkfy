import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '@/contexts/PreferencesContext';
import clsx from 'clsx';

type RetentionOption = {
    value: number;
    label: string;
};

const RETENTION_OPTIONS: RetentionOption[] = [
    { value: 7, label: "7 days" },
    { value: 30, label: "30 days" },
    { value: 90, label: "90 days" },
    { value: 365, label: "1 year" },
    { value: -1, label: "Forever" },
];

export default function HistoryRetentionSwitcher() {
    const { t } = useTranslation();
    const { historyRetentionDays, setHistoryRetentionDays } = usePreferences();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const current = RETENTION_OPTIONS.find(o => o.value === historyRetentionDays) || RETENTION_OPTIONS[0];

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

    const handleSelect = (value: number) => {
        setHistoryRetentionDays(value);
        setOpen(false);
    };

    return (
        <div className="relative inline-block text-left w-full max-w-xs" ref={dropdownRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center justify-between w-full gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-300 transition-colors"
            >
                <span className="truncate">
                    {t(`settings.retention${current.value}`, current.label)}
                </span>

                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <ul className="absolute left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {RETENTION_OPTIONS.map(option => (
                        <li key={option.value}>
                            <button
                                onClick={() => handleSelect(option.value)}
                                className={clsx(
                                    "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2",
                                    historyRetentionDays === option.value && "bg-gray-50 font-semibold"
                                )}
                            >
                                <span className="truncate">
                                    {t(`settings.retention${option.value}`, option.label)}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
