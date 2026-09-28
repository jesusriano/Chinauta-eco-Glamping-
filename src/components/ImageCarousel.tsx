import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Camera, Image as ImageIcon } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
  imageClassName?: string;
  showIndicators?: boolean;
  showCounter?: boolean;
  allowZoom?: boolean;
  overlayBadge?: React.ReactNode;
  onImageClick?: (currentIndex: number) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.98
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.25 }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  })
};

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [],
  alt = 'Fotografía',
  className = 'h-64',
  imageClassName = 'object-cover',
  showIndicators = true,
  showCounter = true,
  allowZoom = false,
  overlayBadge,
  onImageClick
}) => {
  const validImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80'];
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const hasMultiple = validImages.length > 1;
  const currentIndex = ((page % validImages.length) + validImages.length) % validImages.length;

  const paginate = (newDirection: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPage([page + newDirection, newDirection]);
  };

  const goToSlide = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const diff = idx - currentIndex;
    setPage([page + diff, diff >= 0 ? 1 : -1]);
  };

  const currentImage = validImages[currentIndex];
  const isFailed = imageError[currentIndex];

  return (
    <div
      className={`relative w-full overflow-hidden select-none group bg-slate-950 ${className}`}
      onClick={() => onImageClick && onImageClick(currentIndex)}
    >
      {/* Current Animated Image with Framer Motion */}
      <div className="absolute inset-0 overflow-hidden">
        {isFailed ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-4 text-center">
            <ImageIcon className="w-8 h-8 text-slate-500 mb-2" />
            <span className="text-xs font-medium">Eco Glamping Chinauta</span>
          </div>
        ) : (
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={currentImage}
              alt={`${alt} - Foto ${currentIndex + 1}`}
              onError={() => setImageError((prev) => ({ ...prev, [currentIndex]: true }))}
              referrerPolicy="no-referrer"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={hasMultiple ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, { offset, velocity }) => {
                if (!hasMultiple) return;
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -100 || offset.x < -60) {
                  paginate(1);
                } else if (swipe > 100 || offset.x > 60) {
                  paginate(-1);
                }
              }}
              className={`absolute inset-0 w-full h-full ${imageClassName}`}
            />
          </AnimatePresence>
        )}
      </div>

      {/* Subtle Gradient Scrim for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />

      {/* Custom Overlay Badge */}
      {overlayBadge && (
        <div className="absolute top-3 left-3 z-10 pointer-events-auto">
          {overlayBadge}
        </div>
      )}

      {/* Counter Badge */}
      {hasMultiple && showCounter && (
        <div className="absolute top-3 right-3 z-10 bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10 flex items-center space-x-1 shadow-sm">
          <Camera className="w-3 h-3 text-emerald-400" />
          <span>{currentIndex + 1} / {validImages.length}</span>
        </div>
      )}

      {/* Previous / Next Arrow Controls */}
      {hasMultiple && (
        <>
          <motion.button
            type="button"
            onClick={(e) => paginate(-1, e)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Foto anterior"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-md"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            type="button"
            onClick={(e) => paginate(1, e)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Siguiente foto"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-md"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </motion.button>
        </>
      )}

      {/* Bottom Dot Indicators */}
      {hasMultiple && showIndicators && (
        <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center space-x-1.5 pointer-events-auto">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => goToSlide(idx, e)}
              aria-label={`Ver foto ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-6 bg-emerald-400 shadow-sm'
                  : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}

      {/* Zoom / Lightbox Trigger Hint */}
      {allowZoom && (
        <div className="absolute bottom-3 right-3 z-10 p-1.5 rounded-lg bg-slate-950/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};
