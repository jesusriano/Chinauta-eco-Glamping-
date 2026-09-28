import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, Maximize2, Sparkles, X, Heart } from 'lucide-react';
import bochicaRomanticDecor from '../assets/images/bochica_romantic_decor_1790618007934.jpg';
import bochicaJacuzziDeck from '../assets/images/bochica_jacuzzi_deck_1790618019311.jpg';
import bochicaSunsetView from '../assets/images/bochica_sunset_view_1790617981274.jpg';

export interface BochicaImageItem {
  id: number;
  url: string;
  title: string;
  subtitle: string;
  badge: string;
}

export const BOCHICA_IMAGES: BochicaImageItem[] = [
  {
    id: 1,
    url: bochicaRomanticDecor,
    title: 'Decoración Romántica Interior',
    subtitle: 'Ambiente especial con letrero "Te Amo", rosas y globos',
    badge: 'Interior Romántico'
  },
  {
    id: 2,
    url: bochicaJacuzziDeck,
    title: 'Deck Exterior & Jacuzzi Privado',
    subtitle: 'Tina de hidromasaje entre árboles con luces cálidas al atardecer',
    badge: 'Jacuzzi & Deck'
  },
  {
    id: 3,
    url: bochicaSunsetView,
    title: 'Atardecer Panorámico en Cúpula',
    subtitle: 'Ventanales geodésicos triangulares con vista abierta al valle',
    badge: 'Vista Panorámica'
  }
];

interface BochicaCarouselProps {
  className?: string;
  overlayBadge?: React.ReactNode;
  pricePerNight?: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.96
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 120 : -120,
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.25 }
    }
  })
};

export const BochicaCarousel: React.FC<BochicaCarouselProps> = ({
  className = 'h-72',
  overlayBadge,
  pricePerNight = 450000
}) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [fullscreenImage, setFullscreenImage] = useState<BochicaImageItem | null>(null);

  const imageIndex = ((page % BOCHICA_IMAGES.length) + BOCHICA_IMAGES.length) % BOCHICA_IMAGES.length;
  const currentItem = BOCHICA_IMAGES[imageIndex];

  const paginate = (newDirection: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPage([page + newDirection, newDirection]);
  };

  const goToIndex = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = imageIndex;
    const diff = index - current;
    setPage([page + diff, diff >= 0 ? 1 : -1]);
  };

  return (
    <div className={`relative w-full overflow-hidden select-none group bg-slate-950 rounded-t-2xl flex flex-col justify-end ${className}`}>
      {/* Background slide with framer-motion */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={currentItem.url}
            alt={currentItem.title}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full object-cover"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -100 || offset.x < -60) {
                paginate(1);
              } else if (swipe > 100 || offset.x > 60) {
                paginate(-1);
              }
            }}
          />
        </AnimatePresence>
      </div>

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/40 pointer-events-none" />

      {/* Top Left: Overlay Badge (e.g. Capacidad) */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-2">
        {overlayBadge}
        <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-semibold shadow-sm">
          <Heart className="w-3 h-3 text-rose-200 fill-current" />
          <span>Experiencia Romántica</span>
        </span>
      </div>

      {/* Top Right: Counter & Fullscreen trigger */}
      <div className="absolute top-3 right-3 z-20 flex items-center space-x-2">
        <div className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/15 flex items-center space-x-1.5 shadow-sm">
          <Camera className="w-3 h-3 text-emerald-400" />
          <span>{imageIndex + 1} / {BOCHICA_IMAGES.length}</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFullscreenImage(currentItem);
          }}
          aria-label="Ver imagen completa"
          className="p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/15 transition-transform hover:scale-110 active:scale-95 shadow-sm"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Arrows with Framer Motion hover/tap */}
      <motion.button
        type="button"
        onClick={(e) => paginate(-1, e)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Foto anterior Domo Bochica"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-950/75 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors shadow-lg group-hover:opacity-100 opacity-90 sm:opacity-80"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </motion.button>

      <motion.button
        type="button"
        onClick={(e) => paginate(1, e)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Siguiente foto Domo Bochica"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-950/75 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors shadow-lg group-hover:opacity-100 opacity-90 sm:opacity-80"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </motion.button>

      {/* Bottom Content Bar: Title & Indicators */}
      <div className="relative z-20 p-4 space-y-2 pointer-events-auto">
        <div className="flex items-end justify-between">
          <div className="text-white space-y-0.5 max-w-[70%]">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              {currentItem.badge}
            </span>
            <p className="text-sm font-bold text-white drop-shadow truncate">
              {currentItem.title}
            </p>
          </div>

          <div className="bg-emerald-600/95 text-white text-xs px-2.5 py-1 rounded-md font-bold shadow-md">
            ${pricePerNight.toLocaleString('es-CO')} COP
          </div>
        </div>

        {/* Thumbnail Dots with Framer Motion layout animation */}
        <div className="flex items-center justify-center space-x-2 pt-1">
          {BOCHICA_IMAGES.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={(e) => goToIndex(idx, e)}
              aria-label={`Ver ${img.title}`}
              className="relative p-1 focus:outline-none"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  imageIndex === idx
                    ? 'w-7 h-2 bg-emerald-400 shadow-md shadow-emerald-500/50'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenImage(null)}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              aria-label="Cerrar vista completa"
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={fullscreenImage.url}
                alt={fullscreenImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />

              <div className="mt-4 text-center text-white space-y-1">
                <h4 className="text-xl font-bold">{fullscreenImage.title}</h4>
                <p className="text-sm text-slate-300">{fullscreenImage.subtitle}</p>
                <div className="flex items-center justify-center space-x-2 pt-2">
                  {BOCHICA_IMAGES.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setFullscreenImage(img)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        fullscreenImage.id === img.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {idx + 1}. {img.badge}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
