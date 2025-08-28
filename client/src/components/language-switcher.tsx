import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'en' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => i18n.changeLanguage('es')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'es' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'
        }`}
      >
        🇪🇸 ES
      </button>
    </div>
  );
}
