import React, { useEffect, useState } from 'react';
import { Dome } from '../types';
import { Compass, Calendar, MapPin, Sparkles, Wifi, Coffee, Waves, Flame, Star, ChevronRight, CheckCircle2, X, ChevronLeft, Maximize2, Camera } from 'lucide-react';
import { TestimonialsSection } from './TestimonialsSection';
import { WeatherWidget } from './WeatherWidget';
import { FoodMenuSection } from './FoodMenuSection';
import { ImageCarousel } from './ImageCarousel';
import { BochicaCarousel } from './BochicaCarousel';
import { HuitacaVideoCard } from './HuitacaVideoCard';
import { DomeMediaCard } from './DomeMediaCard';
import { getDomeImages } from '../utils/domeImages';
import { motion } from 'motion/react';
import regeneratedDome2Image from '../assets/images/regenerated_image_1790617455020.jpg';
import bochicaRomanticDecor from '../assets/images/bochica_romantic_decor_1790618007934.jpg';
import bochicaJacuzziDeck from '../assets/images/bochica_jacuzzi_deck_1790618019311.jpg';
import bochicaSunsetView from '../assets/images/bochica_sunset_view_1790617981274.jpg';

interface HomePortalProps {
  onOpenBooking: (domeId?: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomePortal: React.FC<HomePortalProps> = ({ onOpenBooking, onNavigateTab }) => {
  const [domes, setDomes] = useState<Dome[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom video for Domes (defaulting dome 3 to a high quality glamping video, with custom upload support)
  const [domeVideos, setDomeVideos] = useState<Record<number, string>>({
    3: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  });
  const [videoError, setVideoError] = useState(false);

  const handleVideoUpload = (domeId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDomeVideos(prev => ({ ...prev, [domeId]: url }));
    }
  };

  // Gallery state
  const [galleryCategory, setGalleryCategory] = useState('Todos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Scroll reading progress
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryItems = [
    {
      id: 1,
      title: 'Domo Huitaca — Jacuzzi Privado',
      category: 'Domos',
      image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
      description: 'Jacuzzi panorámico con agua caliente y vista sobre las montañas de Chinauta.'
    },
    {
      id: 2,
      title: 'Domo Bochica — Decoración Romántica Interior',
      category: 'Domos',
      image: bochicaRomanticDecor,
      description: 'Cama decorada para ocasiones especiales con rosas, globos y ambiente cálido acogedor.'
    },
    {
      id: 7,
      title: 'Domo Bochica — Jacuzzi en Deck al Atardecer',
      category: 'Jacuzzis & Vistas',
      image: bochicaJacuzziDeck,
      description: 'Jacuzzi privado exterior en plataforma de madera rodeado de naturaleza y luces cálidas.'
    },
    {
      id: 8,
      title: 'Domo Bochica — Vista Panorámica al Ocaso',
      category: 'Domos',
      image: bochicaSunsetView,
      description: 'Vista privilegiada del atardecer a través de los ventanales triangulares geodésicos.'
    },
    {
      id: 3,
      title: 'Tina de Cedro Japonés',
      category: 'Jacuzzis & Vistas',
      image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
      description: 'Inmersión en agua caliente aromatizada con esencias naturales en el bosque.'
    },
    {
      id: 4,
      title: 'Atardecer en Fusagasugá',
      category: 'Naturaleza',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      description: 'Puestas de sol mágicas y clima templado perfecto todo el año.'
    },
    {
      id: 5,
      title: 'Zona Fogata & Estrellas',
      category: 'Comodidades',
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
      description: 'Espacios privados para fogata nocturna, vino y marshmallows.'
    },
    {
      id: 6,
      title: 'Desayuno Campesino Artesanal',
      category: 'Comodidades',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      description: 'Servicio incluido todas las mañanas con café de origen y arepas de choclo.'
    }
  ];

  const categories = ['Todos', 'Domos', 'Jacuzzis & Vistas', 'Naturaleza', 'Comodidades'];

  const filteredGallery = galleryCategory === 'Todos' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === galleryCategory);

  useEffect(() => {
    fetch('/api/domes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDomes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-20 pb-20 relative"
    >
      {/* Slim Scroll Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200/50 z-50 pointer-events-none">
        <div 
          className="h-full bg-emerald-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Background image with subtle dark overlay */}
        <div className="absolute inset-0 z-0 opacity-45">
          <img
            src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=2000&q=85"
            alt="Eco Glamping Chinauta"
            className="w-full h-full object-cover scale-105 animate-pulse [animation-duration:10s]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 pt-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Experiencia de Lujo Natural en Fusagasugá</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            Conexión Mística <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Entre Montañas y Estrellas
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
            Descubre Eco Glamping Chinauta. Domos geodésicos exclusivos equipados con jacuzzi privado, mallas flotantes y vistas panorámicas incomparables.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-900/40 transition-all transform hover:-translate-y-0.5"
            >
              Reservar Mi Domo
            </button>
            <button
              onClick={() => onNavigateTab('availability')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all"
            >
              Consultar Disponibilidad
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">6</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Domos Exclusivos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-teal-400">100%</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Naturaleza & Confort</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">4.9</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Calificación de Huéspedes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-teal-400">24/7</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Atención Personalizada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Weather Widget Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WeatherWidget />
      </section>

      {/* Domes Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs uppercase tracking-widest text-emerald-600 font-bold">Nuestros Alojamientos</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900">Nuestros 6 Domos Ancestrales</h3>
          <p className="text-slate-600 text-base">
            Cada domo lleva el nombre de deidades y leyendas ancestrales, diseñado con arquitectura bioclimática y acabados de lujo.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Cargando domos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domes.map(dome => (
              <div key={dome.id} className="glass-card rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 flex flex-col hover:shadow-xl transition-all group">
                <DomeMediaCard
                  dome={dome}
                  onOpenBooking={() => onOpenBooking(dome.id)}
                />

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-slate-900">{dome.name}</h4>
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-medium">{dome.code}</span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{dome.description}</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">✨ {dome.features}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      dome.status === 'Disponible' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {dome.status}
                    </span>
                    <button
                      onClick={() => onOpenBooking(dome.id)}
                      className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                    >
                      <span>Reservar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Interactive Photo Gallery Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Galería Visual</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900">Explora Nuestra Experiencia en Imágenes</h3>
          <p className="text-slate-600 text-base">
            Sumérgete en los paisajes, domos y rincones mágicos diseñados para tu desconexión total.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  galleryCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(galleryItems.findIndex(g => g.id === item.id))}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-md cursor-pointer border border-slate-200 bg-slate-900"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
              
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6 space-y-1 text-white transform transition-transform">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-white inline-block mb-1">
                  {item.category}
                </span>
                <h4 className="text-lg font-bold">{item.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Slideshow Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length)}
            className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryItems.length)}
            className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-3/5 h-80 md:h-[500px] relative">
              <img
                src={galleryItems[lightboxIndex].image}
                alt={galleryItems[lightboxIndex].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/5 p-8 flex flex-col justify-between space-y-6 bg-slate-900 text-white">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {galleryItems[lightboxIndex].category}
                </span>
                <h3 className="text-2xl font-bold">{galleryItems[lightboxIndex].title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {galleryItems[lightboxIndex].description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs text-slate-400">
                <span>Foto {lightboxIndex + 1} de {galleryItems.length}</span>
                <button
                  onClick={() => {
                    setLightboxIndex(null);
                    onOpenBooking();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                >
                  Reservar Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Food Menu Section */}
      <section className="bg-slate-50/50 py-12 border-y border-slate-200/60">
        <FoodMenuSection onOpenBooking={onOpenBooking} />
      </section>

      {/* Services & Amenities */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Comodidades</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white">Una Experiencia Todo Incluido</h3>
            <p className="text-slate-300 text-base">
              Diseñado para ofrecer el máximo confort en medio de la naturaleza de Cundinamarca.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-dark p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Waves className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Jacuzzi & Tinamú</h4>
              <p className="text-slate-400 text-sm">Disfruta de tinas de hidromasaje y agua caliente privadas con vista al atardecer.</p>
            </div>

            <div className="glass-dark p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Desayuno Campesino</h4>
              <p className="text-slate-400 text-sm">Incluido todas las mañanas, elaborado con ingredientes locales frescos de la región.</p>
            </div>

            <div className="glass-dark p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Fogatas & Astronomía</h4>
              <p className="text-slate-400 text-sm">Zonas de fogata privadas y telescopios para avistamiento nocturno.</p>
            </div>

            <div className="glass-dark p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Wifi className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Wi-Fi Starlink</h4>
              <p className="text-slate-400 text-sm">Conectividad satelital de alta velocidad por si necesitas trabajar o compartir.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Ubicación Privilegiada</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">Chinauta, Fusagasugá, Cundinamarca</h3>
            <p className="text-slate-600 leading-relaxed text-base">
              A tan solo 1.5 horas de Bogotá, en el corazón del clima templado de Chinauta. Un oasis de paz, aire puro y paisajes montañosos majestuosos.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-slate-700 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Vía pavimentada hasta la entrada principal</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Parqueadero privado vigilado 24/7</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Senderos ecológicos internos</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onNavigateTab('contact')}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
              >
                Ver Información de Contacto
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <ImageCarousel
              images={[
                'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80'
              ]}
              alt="Instalaciones y Entorno Eco Glamping Chinauta"
              className="h-80 sm:h-96"
              overlayBadge={
                <div className="bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                  Chinauta, Fusagasugá
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

    </motion.div>
  );
};
