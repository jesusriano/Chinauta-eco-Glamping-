import React, { useState } from 'react';
import { Utensils, Sparkles, CheckCircle2, ChevronRight, ShoppingBag, Coffee, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageCarousel } from './ImageCarousel';

export interface FoodMenuItem {
  id: number;
  item_number: number;
  title: string;
  category: 'Cenas y Almuerzos' | 'Bebidas' | 'Desayunos';
  description: string;
  preparations: string[];
  sides: string[];
  beverage: string;
  price: number;
  image: string;
  images: string[];
  badge?: string;
}

export const CHINAUTA_MENU_ITEMS: FoodMenuItem[] = [
  {
    id: 1,
    item_number: 1,
    title: "Trucha Gratinada o en Salsa de Champiñones",
    category: "Cenas y Almuerzos",
    description: "Trucha fresca marinada en hierbas nativas y preparada a tu preferencia (gratinada al horno, en cremosa salsa de champiñones o asada a la parrilla).",
    preparations: ["Gratinada", "En salsa de champiñones", "Asada a la parrilla"],
    sides: ["Papas a la francesa", "Ensalada fresca de la casa"],
    beverage: "Jugo natural de fruta de estación",
    price: 38000,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1000&q=80"
    ],
    badge: "Plato Especialidad"
  },
  {
    id: 2,
    item_number: 2,
    title: "Carne de Res Gratinada o Asada",
    category: "Cenas y Almuerzos",
    description: "Jugoso corte de carne de res madurada, sazonada al estilo campestre y terminada según tu preferencia.",
    preparations: ["Gratinada con queso", "En salsa de champiñones", "Asada a la parrilla"],
    sides: ["Papas a la francesa", "Ensalada de champiñones o ensalada tradicional"],
    beverage: "Jugo natural de fruta de estación",
    price: 38000,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80"
    ],
    badge: "Favorito del Huésped"
  },
  {
    id: 3,
    item_number: 3,
    title: "Cerdo en Salsa de Champiñones o Gratinado",
    category: "Cenas y Almuerzos",
    description: "Tierno lomito de cerdo bañado en cremosa salsa artesanal de champiñones silvetres, gratinado o asado a fuego lento.",
    preparations: ["En salsa de champiñones", "Gratinado", "Asado"],
    sides: ["Papa a la francesa", "Ensalada fresca"],
    beverage: "Jugo natural de fruta de estación",
    price: 36000,
    image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: 4,
    item_number: 4,
    title: "Pechuga Asada, Gratinada o en Champiñones",
    category: "Cenas y Almuerzos",
    description: "Pechuga de pollo seleccionada, deshuesada y marinada con finas hierbas. Servida asada, en salsa o gratinada.",
    preparations: ["Asada a la plancha", "En salsa de champiñones", "Gratinada con queso"],
    sides: ["Papa a la francesa", "Ensalada campesina"],
    beverage: "Jugo natural de fruta de estación",
    price: 34000,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: 5,
    item_number: 5,
    title: "Combo Hamburguesa Artesanal",
    category: "Cenas y Almuerzos",
    description: "Hamburguesa gourmet artesanal con carne selecta 100% de res, queso fundido, vegetales frescos y pan artesanal dorado.",
    preparations: ["Término Medio", "Bien Asada", "Con Queso Extra"],
    sides: ["Papas a la francesa crujientes"],
    beverage: "Gaseosa Postobón de 400ml",
    price: 30000,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80"
    ],
    badge: "Combo Rápido"
  }
];

interface FoodMenuSectionProps {
  onOpenBooking?: () => void;
}

export const FoodMenuSection: React.FC<FoodMenuSectionProps> = ({ onOpenBooking }) => {
  const [selectedPrep, setSelectedPrep] = useState<Record<number, string>>({
    1: "Gratinada",
    2: "Gratinada con queso",
    3: "En salsa de champiñones",
    4: "Asada a la plancha",
    5: "Término Medio"
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
          <Utensils className="w-4 h-4 text-emerald-600" />
          <span>Gastronomía Chinauta Eco Glamping</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Menú de Cenas y Almuerzos
        </h2>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Platos frescos preparados al instante con ingredientes de la región de Cundinamarca. Todos nuestros combos incluyen acompañamientos y bebida.
        </p>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CHINAUTA_MENU_ITEMS.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Image Header Carousel */}
              <div className="relative overflow-hidden bg-slate-950">
                <ImageCarousel
                  images={item.images}
                  alt={item.title}
                  className="h-60"
                  overlayBadge={
                    <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700/50 flex items-center space-x-1.5 shadow-md">
                      <span className="text-emerald-400">#{item.item_number}</span>
                      <span>{item.category}</span>
                    </div>
                  }
                />

                {item.badge && (
                  <div className="absolute top-3 right-16 z-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md pointer-events-none">
                    {item.badge}
                  </div>
                )}

                <div className="absolute bottom-3 right-3 z-20 bg-emerald-600/95 text-white font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-lg border border-emerald-400/30 pointer-events-none">
                  ${item.price.toLocaleString('es-CO')} COP
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  #{item.item_number}. {item.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Preparation choices */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Opción de preparación:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.preparations.map((prep) => (
                      <button
                        key={prep}
                        onClick={() => setSelectedPrep(prev => ({ ...prev, [item.id]: prep }))}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          selectedPrep[item.id] === prep
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {prep}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sides and Beverage */}
                <div className="space-y-2 pt-2 text-xs text-slate-600 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100/80">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800">Acompañamiento:</strong> {item.sides.join(' + ')}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Coffee className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800">Bebida incluida:</strong> {item.beverage}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  if (onOpenBooking) onOpenBooking();
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-md group-hover:bg-emerald-700"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-300" />
                <span>Incluir en Mi Reserva</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-200/80 bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Flame className="w-5 h-5 text-emerald-400" />
            <h4 className="text-lg font-bold text-white">¿Tienes requerimientos dietéticos especiales?</h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Atendemos opciones vegetarianas o alergias avisándonos previamente durante la confirmación de tu reserva o vía WhatsApp.
          </p>
        </div>
        <button
          onClick={() => { if (onOpenBooking) onOpenBooking(); }}
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm whitespace-nowrap shadow-lg transition-transform hover:scale-105"
        >
          Ir a Reservar Experiencia
        </button>
      </div>
    </div>
  );
};
