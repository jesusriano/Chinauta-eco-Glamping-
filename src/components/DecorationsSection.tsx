import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VIP_PHOTOS = [
  '/assets/images/decoracion-vip-1.jpg',
  '/assets/images/decoracion-vip-2.jpg',
  '/assets/images/decoracion-vip-3.jpg',
  '/assets/images/decoracion-vip-4.jpg',
  '/assets/images/decoracion-vip-5.jpg',
];

interface DecorationsSectionProps {
  onOpenBooking?: () => void;
}

export const DecorationsSection: React.FC<DecorationsSectionProps> = ({ onOpenBooking }) => {
  const { language } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const isEn = language === 'en';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>{isEn ? 'Decorations' : 'Decoraciones'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isEn ? 'VIP Decoration' : 'Decoración VIP'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          {isEn
            ? 'Make your stay special with our VIP decoration: balloons, letters, rose petals and a romantic setup for your bed.'
            : 'Haz tu estadía especial con nuestra decoración VIP: globos, letras, pétalos de rosa y un montaje romántico para tu cama.'}
        </p>
      </div>

      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">$150.000 COP</p>
        <p className="text-xs text-slate-500">{isEn ? 'VIP decoration price' : 'Precio de la decoración VIP'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {VIP_PHOTOS.map((src, idx) => (
          <button
            key={src}
            type="button"
            onClick={() => setPreview(src)}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-slate-100 cursor-zoom-in"
          >
            <img
              src={src}
              alt={isEn ? `VIP decoration ${idx + 1}` : `Decoración VIP ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {onOpenBooking && (
        <div className="text-center">
          <button
            type="button"
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-lg shadow-emerald-700/30 hover:from-emerald-700 hover:to-teal-800 text-sm"
          >
            {isEn ? 'Book with VIP decoration' : 'Reservar con decoración VIP'}
          </button>
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/90 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={isEn ? 'Close' : 'Cerrar'}
          >
            <X className="w-6 h-6" />
          </button>
          <img src={preview} alt="" className="max-h-[90vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </section>
  );
};
