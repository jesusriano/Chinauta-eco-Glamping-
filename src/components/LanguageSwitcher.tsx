import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'full') {
    return (
      <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-100/90 border border-slate-200/90 ${className}`}>
        <div className="flex items-center space-x-2 pl-1">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-slate-700">Idioma / Language</span>
        </div>
        <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all relative ${
              language === 'es'
                ? 'text-emerald-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'es' && (
              <motion.div
                layoutId="active-lang-full"
                className="absolute inset-0 bg-emerald-100 rounded-md -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span>🇨🇴</span>
            <span>ES</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all relative ${
              language === 'en'
                ? 'text-emerald-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'en' && (
              <motion.div
                layoutId="active-lang-full"
                className="absolute inset-0 bg-emerald-100 rounded-md -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span>🇺🇸</span>
            <span>EN</span>
          </button>
        </div>
      </div>
    );
  }

  // Compact variant (Header Navbar)
  return (
    <div
      className={`inline-flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs select-none ${className}`}
      role="group"
      aria-label="Selector de idioma / Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('es')}
        title="Español (Colombia)"
        aria-pressed={language === 'es'}
        className={`relative flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
          language === 'es'
            ? 'text-emerald-950 font-extrabold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {language === 'es' && (
          <motion.div
            layoutId="active-lang-compact"
            className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/70 -z-10"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span className="text-sm leading-none" role="img" aria-label="Bandera Colombia">🇨🇴</span>
        <span>ES</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        title="English"
        aria-pressed={language === 'en'}
        className={`relative flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
          language === 'en'
            ? 'text-emerald-950 font-extrabold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {language === 'en' && (
          <motion.div
            layoutId="active-lang-compact"
            className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/70 -z-10"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span className="text-sm leading-none" role="img" aria-label="Flag United States">🇺🇸</span>
        <span>EN</span>
      </button>
    </div>
  );
};
