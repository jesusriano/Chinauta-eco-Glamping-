import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  dome: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  image?: string;
}

export const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Camila & Alejandro',
      location: 'Bogotá, Colombia',
      dome: 'Domo Huitaca',
      rating: 5,
      date: 'Septiembre 2026',
      comment: 'Una experiencia inolvidable. El jacuzzi privado bajo las estrellas y la atención superaron todas nuestras expectativas. El clima de Chinauta es mágico y el desayuno campesino delicioso.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: 'Felipe Restrepo',
      location: 'Medellín, Colombia',
      dome: 'Domo Bochica',
      rating: 5,
      date: 'Agosto 2026',
      comment: 'La vista desde la cúpula es increíble. Pudimos ver las estrellas en la noche y desconectarnos por completo del ruido de la ciudad. 100 recomendado para parejas.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: 'Valentina Gomez',
      location: 'Cali, Colombia',
      dome: 'Domo Bachué',
      rating: 5,
      date: 'Agosto 2026',
      comment: 'Todo impecable. Desde la vía de acceso hasta la comodidad de la cama y la tina de cedro. El personal es sumamente atento y servicial.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>Testimonios Verificados</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900">Lo Que Dicen Nuestros Huéspedes</h3>
          <p className="text-slate-600 text-base">
            Historias reales de parejas y viajeros que han vivido la magia de Eco Glamping Chinauta.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(item => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="absolute top-6 right-6 text-emerald-600/20 group-hover:text-emerald-600/30 transition-colors">
                <Quote className="w-10 h-10" />
              </div>

              <div className="space-y-4 relative z-10">
                {/* Rating stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{item.rating}.0</span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{item.comment}"
                </p>

                {/* Optional Photo */}
                {item.image && (
                  <div className="h-48 rounded-2xl overflow-hidden shadow-inner border border-slate-100 mt-4">
                    <img
                      src={item.image}
                      alt={item.dome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                    {item.dome}
                  </span>
                  <div className="flex items-center justify-end space-x-1 text-[10px] text-emerald-600 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Estadía Verificada</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate Score Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-2xl font-bold">Calificación Promedio 4.9 / 5.0</h4>
            <p className="text-slate-300 text-sm">Basado en más de 320 reseñas verificadas en Google, TripAdvisor y nuestra plataforma.</p>
          </div>
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
