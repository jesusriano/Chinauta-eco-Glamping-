import React, { useState, useEffect, useRef } from 'react';
import { Utensils, Sparkles, CheckCircle2, ChevronRight, ShoppingBag, Coffee, Flame, Plus, Camera, Video, Upload, X, CheckCircle, ImagePlus, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageCarousel } from './ImageCarousel';
import { useLanguage } from '../context/LanguageContext';

export interface FoodMenuItem {
  id: number;
  item_number: number;
  title: string;
  title_en: string;
  category: 'Almuerzos y Comidas' | 'Almuerzos y Cenas' | 'Bebidas' | 'Snacks' | 'Snacks & Picadas';
  category_en: string;
  description: string;
  description_en: string;
  preparations: string[];
  preparations_en: string[];
  sides: string[];
  sides_en: string[];
  beverage: string;
  beverage_en: string;
  price: number;
  image: string;
  images: string[];
  video_url?: string | null;
  badge?: string;
  badge_en?: string;
}

export const DEFAULT_MENU_ITEMS: FoodMenuItem[] = [
  {
    id: 1,
    item_number: 1,
    title: "Trucha Gratinada o en Salsa de Champiñones",
    title_en: "Gratin / Mushroom Sauce Rainbow Trout",
    category: "Almuerzos y Cenas",
    category_en: "Lunch & Dinner",
    description: "Trucha fresca marinada en hierbas nativas y preparada a tu preferencia (gratinada al horno, en cremosa salsa de champiñones o asada a la parrilla).",
    description_en: "Fresh Andean trout seasoned with local herbs, cooked to your preference (baked au gratin, creamy mushroom sauce, or charbroiled).",
    preparations: ["Gratinada", "En salsa de champiñones", "Asada a la parrilla"],
    preparations_en: ["Au Gratin", "Mushroom Sauce", "Grilled"],
    sides: ["Papas a la francesa", "Ensalada fresca de la casa"],
    sides_en: ["French fries", "Fresh house salad"],
    beverage: "Jugo natural de fruta de estación",
    beverage_en: "Fresh natural seasonal fruit juice",
    price: 38000,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80"
    ],
    badge: "Plato Especialidad",
    badge_en: "House Specialty"
  },
  {
    id: 2,
    item_number: 2,
    title: "Carne de Res Gratinada o Asada",
    title_en: "Grilled or Au Gratin Beef Tenderloin",
    category: "Almuerzos y Cenas",
    category_en: "Lunch & Dinner",
    description: "Jugoso corte de carne de res madurada, sazonada al estilo campestre y terminada según tu preferencia.",
    description_en: "Juicy aged beef steak, seasoned in rustic style and prepared to your liking (grilled or with rich au gratin mushrooms).",
    preparations: ["Gratinada con queso", "En salsa de champiñones", "Asada a la parrilla"],
    preparations_en: ["Au Gratin Cheese", "Mushroom Reduction", "Grilled"],
    sides: ["Papas a la francesa", "Ensalada fresca"],
    sides_en: ["French fries", "Fresh salad"],
    beverage: "Jugo natural de fruta de estación",
    beverage_en: "Fresh natural seasonal fruit juice",
    price: 38000,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80"
    ],
    badge: "Favorito del Huésped",
    badge_en: "Guest Favorite"
  },
  {
    id: 3,
    item_number: 3,
    title: "Cerdo en Salsa de Champiñones o Gratinado",
    title_en: "Pork Loin in Mushroom Cream / Au Gratin",
    category: "Almuerzos y Cenas",
    category_en: "Lunch & Dinner",
    description: "Tierno lomito de cerdo bañado en cremosa salsa artesanal de champiñones silvestres, gratinado o asado a fuego lento.",
    description_en: "Tender pork loin bathed in creamy wild mushroom sauce, baked au gratin or slow-grilled.",
    preparations: ["En salsa de champiñones", "Gratinado", "Asado"],
    preparations_en: ["Mushroom Sauce", "Au Gratin", "Grilled"],
    sides: ["Papa a la francesa", "Ensalada fresca"],
    sides_en: ["French fries", "Fresh salad"],
    beverage: "Jugo natural de fruta de estación",
    beverage_en: "Fresh natural seasonal fruit juice",
    price: 36000,
    image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: 4,
    item_number: 4,
    title: "Pechuga Asada, Gratinada o en Champiñones",
    title_en: "Grilled or Au Gratin Chicken Breast",
    category: "Almuerzos y Cenas",
    category_en: "Lunch & Dinner",
    description: "Pechuga de pollo seleccionada, deshuesada y marinada con finas hierbas. Servida asada, en salsa o gratinada.",
    description_en: "Free-range chicken breast marinated in herbs, served grilled, in mushroom sauce or baked au gratin.",
    preparations: ["Asada a la plancha", "En salsa de champiñones", "Gratinada con queso"],
    preparations_en: ["Grilled", "Mushroom Sauce", "Au Gratin Cheese"],
    sides: ["Papa a la francesa", "Ensalada campesina"],
    sides_en: ["French fries", "Garden salad"],
    beverage: "Jugo natural de fruta de estación",
    beverage_en: "Fresh natural seasonal fruit juice",
    price: 34000,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: 5,
    item_number: 5,
    title: "Combo Hamburguesa Artesanal",
    title_en: "Artisan Burger Meal Combo",
    category: "Snacks & Picadas",
    category_en: "Snacks & Platters",
    description: "Hamburguesa gourmet artesanal con carne selecta 100% de res, queso fundido, vegetales frescos y pan artesanal dorado.",
    description_en: "Gourmet artisan 100% beef burger with melted artisan cheese, bacon, and crisp vegetables on a brioche bun.",
    preparations: ["Término Medio", "Bien Asada", "Con Queso Extra"],
    preparations_en: ["Medium Rare", "Well Done", "Extra Cheese"],
    sides: ["Papas a la francesa crujientes"],
    sides_en: ["Crispy french fries"],
    beverage: "Gaseosa Postobón de 400ml",
    beverage_en: "Postobón Soda (400ml)",
    price: 30000,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
    ],
    badge: "Combo Rápido",
    badge_en: "Quick Combo"
  },
  {
    id: 6,
    item_number: 6,
    title: "Picada Campesina Chinauta (Para Compartir)",
    title_en: "Chinauta Farmer Platter (To Share)",
    category: "Snacks & Picadas",
    category_en: "Snacks & Platters",
    description: "Generosa picada tradicional con trozos de lomo de res, cerdo, pechuga, chorizo santandereano, papa criolla dorada y arepitas.",
    description_en: "Hearty traditional Colombian sharing platter with beef, pork, chicken, artisanal chorizo, golden creole potatoes, and corn arepas.",
    preparations: ["Para 2 Personas", "Para 4 Personas"],
    preparations_en: ["For 2 Guests", "For 4 Guests"],
    sides: ["Papa criolla", "Arepitas de queso", "Guacamole casero"],
    sides_en: ["Creole potatoes", "Cheese arepas", "Homemade guacamole"],
    beverage: "2 Bebidas a elección (Gaseosa o Jugo Natural)",
    beverage_en: "2 Beverages of choice",
    price: 65000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80"
    ],
    badge: "Especial Para Parejas",
    badge_en: "Special for Couples"
  },
  {
    id: 7,
    item_number: 7,
    title: "Vino Tinto / Blanco & Tabla de Quesos",
    title_en: "Fine Wine Bottle & Artisan Cheese Board",
    category: "Bebidas",
    category_en: "Beverages & Wines",
    description: "Botella de vino reserva seleccionada (Cabernet / Sauvignon Blanc) acompañada de frutos secos, quesos madurados y uvas para la fogata.",
    description_en: "Bottle of premium reserve wine accompanied by artisanal cheeses, nuts, and fresh grapes perfect for the fire pit.",
    preparations: ["Vino Tinto Cabernet", "Vino Blanco Sauvignon", "Vino Rosado"],
    preparations_en: ["Red Cabernet", "White Sauvignon", "Rosé Wine"],
    sides: ["Tabla de quesos y jamones", "Frutos secos"],
    sides_en: ["Cheese & charcuterie board", "Dried fruits & nuts"],
    beverage: "Botella 750ml",
    beverage_en: "750ml Bottle",
    price: 75000,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80"
    ],
    badge: "Noche Romántica",
    badge_en: "Romantic Night"
  },
  {
    id: 8,
    item_number: 8,
    title: "Cócteles de la Casa & Jugos Naturales",
    title_en: "House Cocktails & Tropical Natural Juices",
    category: "Bebidas",
    category_en: "Beverages & Wines",
    description: "Mojitos refrescantes de maracuyá y menta, Piña Colada artesanal o jugos tropicales en agua o leche.",
    description_en: "Refreshing passionfruit and mint mojitos, artisanal Piña Colada, or fresh tropical fruit juices in water/milk.",
    preparations: ["Mojito Maracuyá", "Piña Colada", "Margarita Glamping", "Jugo Mango / Mora / Lulo"],
    preparations_en: ["Passionfruit Mojito", "Piña Colada", "Glamping Margarita", "Natural Tropical Juice"],
    sides: ["Copas escarchadas con fruta fresca"],
    sides_en: ["Chilled glass with fresh fruit garnish"],
    beverage: "Preparación al instante",
    beverage_en: "Freshly made",
    price: 22000,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80"
    ]
  }
];

export const CHINAUTA_MENU_ITEMS = DEFAULT_MENU_ITEMS;

interface FoodMenuSectionProps {
  onOpenBooking?: () => void;
}

export const FoodMenuSection: React.FC<FoodMenuSectionProps> = ({ onOpenBooking }) => {
  const { t, language } = useLanguage();
  const [menuItems, setMenuItems] = useState<FoodMenuItem[]>(DEFAULT_MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [selectedPrep, setSelectedPrep] = useState<Record<number, string>>({});
  const [activeMediaTab, setActiveMediaTab] = useState<Record<number, 'photo' | 'video'>>({});
  
  // Modals & Uploads
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeUploadTarget, setActiveUploadTarget] = useState<{ id: number; type: 'image' | 'video' } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for new item
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Almuerzos y Comidas' | 'Bebidas' | 'Snacks'>('Almuerzos y Comidas');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState<number>(35000);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const parsed = data.map((d: any) => ({
            ...d,
            preparations: typeof d.preparations === 'string' ? JSON.parse(d.preparations || '[]') : (d.preparations || []),
            sides: typeof d.sides === 'string' ? JSON.parse(d.sides || '[]') : (d.sides || []),
            images: typeof d.images === 'string' ? JSON.parse(d.images || '[]') : (d.images || [d.image])
          }));
          setMenuItems(parsed);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories = [
    { id: 'Todos', label: language === 'en' ? 'All Menu' : 'Todo el Menú' },
    { id: 'Almuerzos y Comidas', label: language === 'en' ? 'Lunches & Meals' : 'Almuerzos y Comidas' },
    { id: 'Bebidas', label: language === 'en' ? 'Beverages & Drinks' : 'Bebidas' },
    { id: 'Snacks', label: language === 'en' ? 'Snacks & Quick Bites' : 'Snacks' }
  ];

  const filteredItems = activeCategory === 'Todos'
    ? menuItems
    : menuItems.filter(item => {
        if (activeCategory === 'Almuerzos y Comidas') {
          return item.category === 'Almuerzos y Comidas' || item.category === 'Almuerzos y Cenas';
        }
        if (activeCategory === 'Snacks') {
          return item.category === 'Snacks' || item.category === 'Snacks & Picadas';
        }
        if (activeCategory === 'Bebidas') {
          return item.category === 'Bebidas' || (item.category && item.category.toLowerCase().includes('bebida'));
        }
        return item.category === activeCategory;
      });

  // Upload photo/video to existing item card
  const handleItemMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTarget) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const isVideo = activeUploadTarget.type === 'video' || file.type.startsWith('video');
          const res = await fetch('/api/upload-media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              mediaData: base64,
              type: isVideo ? 'video' : 'image'
            })
          });
          const data = await res.json();
          if (data?.url) {
            const updated = menuItems.map(item => {
              if (item.id === activeUploadTarget.id) {
                if (isVideo) {
                  return { ...item, video_url: data.url };
                } else {
                  return { ...item, image: data.url, images: [data.url, ...(item.images || [])] };
                }
              }
              return item;
            });
            setMenuItems(updated);

            // Update Server
            await fetch(`/api/menu/${activeUploadTarget.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(isVideo ? { video_url: data.url } : { image: data.url, images: [data.url] })
            });

            showToast(language === 'en' ? 'Menu media updated!' : '¡Foto/video del plato actualizado!');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsUploading(false);
          setActiveUploadTarget(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  // Upload photo/video inside Add Modal
  const handleModalMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch('/api/upload-media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              mediaData: base64,
              type: isVideo ? 'video' : 'image'
            })
          });
          const data = await res.json();
          if (data?.url) {
            setNewMediaUrl(data.url);
            setNewMediaType(isVideo ? 'video' : 'image');
            showToast(language === 'en' ? 'File uploaded!' : '¡Archivo cargado!');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: FoodMenuItem = {
      id: Date.now(),
      item_number: menuItems.length + 1,
      title: newTitle,
      title_en: newTitle,
      category: newCategory,
      category_en: newCategory,
      description: newDesc || (language === 'en' ? 'Delicious fresh local preparation.' : 'Deliciosa preparación fresca con ingredientes locales.'),
      description_en: newDesc,
      preparations: [language === 'en' ? 'Standard Preparation' : 'Preparación Estándar'],
      preparations_en: ['Standard Preparation'],
      sides: [language === 'en' ? 'House Sides' : 'Acompañamiento de la casa'],
      sides_en: ['House Sides'],
      beverage: language === 'en' ? 'Natural Juice or Soda' : 'Jugo Natural o Gaseosa',
      beverage_en: 'Natural Juice or Soda',
      price: Number(newPrice) || 35000,
      image: newMediaType === 'image' ? newMediaUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80' : 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
      images: [newMediaUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80'],
      video_url: newMediaType === 'video' ? newMediaUrl : null,
      badge: language === 'en' ? 'New Item' : 'Nuevo Plato'
    };

    setMenuItems([newItem, ...menuItems]);
    setIsAddModalOpen(false);

    try {
      await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      showToast(language === 'en' ? 'Item added to menu successfully!' : '¡Plato/bebida agregada al menú con éxito!');
    } catch (err) {
      console.warn("Error creating menu item:", err);
    }

    setNewTitle('');
    setNewDesc('');
    setNewMediaUrl('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleItemMediaUpload}
        accept={activeUploadTarget?.type === 'video' ? "video/*" : "image/*,video/*"}
        className="hidden"
      />

      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <Utensils className="w-4 h-4 text-emerald-600" />
            <span>{t('menu.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t('menu.title')}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {language === 'en'
              ? 'Enjoy freshly prepared dishes, refreshing beverages, and artisan snack platters in Chinauta. Upload photos and video tours easily.'
              : 'Disfruta de platos preparados al instante con ingredientes frescos de la región: almuerzos y comidas, bebidas selectas y snacks artesanales.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-emerald-700/20 transition-all transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'en' ? '+ Add Dish / Beverage / Snack' : '+ Subir / Agregar Plato o Bebida'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => {
          const title = language === 'en' ? (item.title_en || item.title) : item.title;
          const category = language === 'en' ? (item.category_en || item.category) : item.category;
          const description = language === 'en' ? (item.description_en || item.description) : item.description;
          const preps = language === 'en' ? (item.preparations_en || item.preparations || []) : (item.preparations || []);
          const sides = language === 'en' ? (item.sides_en || item.sides || []) : (item.sides || []);
          const beverage = language === 'en' ? (item.beverage_en || item.beverage) : item.beverage;
          const badge = language === 'en' ? (item.badge_en || item.badge) : item.badge;

          return (
            <div
              key={item.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Media Header (Video or Image Carousel) */}
                <div className="relative overflow-hidden bg-slate-950">
                  {item.video_url && activeMediaTab[item.id] !== 'photo' ? (
                    <div className="relative h-60 w-full bg-slate-950">
                      <video
                        src={item.video_url}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700/50 flex items-center space-x-1.5 shadow-md pointer-events-none">
                        <Video className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Video Tour</span>
                      </div>
                    </div>
                  ) : (
                    <ImageCarousel
                      images={item.images && item.images.length > 0 ? item.images : [item.image]}
                      alt={title}
                      className="h-60"
                      overlayBadge={
                        <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700/50 flex items-center space-x-1.5 shadow-md">
                          <span className="text-emerald-400">#{item.item_number}</span>
                          <span>{category}</span>
                        </div>
                      }
                    />
                  )}

                  {/* Toggle between Video & Photo if item has video */}
                  {item.video_url && (
                    <div className="absolute top-3 right-3 z-20 flex items-center space-x-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-full border border-white/20">
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab(prev => ({ ...prev, [item.id]: 'video' }))}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          (activeMediaTab[item.id] || 'video') === 'video' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        🎥 Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab(prev => ({ ...prev, [item.id]: 'photo' }))}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          activeMediaTab[item.id] === 'photo' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        📷 Fotos
                      </button>
                    </div>
                  )}

                  {!item.video_url && badge && (
                    <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md pointer-events-none">
                      {badge}
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 z-20 bg-emerald-600/95 text-white font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-lg border border-emerald-400/30 pointer-events-none">
                    ${item.price.toLocaleString('es-CO')} COP
                  </div>
                </div>

                {/* Upload Buttons for each Dish / Drink / Snack */}
                <div className="px-6 py-2.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/80">
                  <span className="text-[11px] font-medium text-slate-500">
                    {language === 'en' ? 'Update dish media:' : 'Subir contenido:'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveUploadTarget({ id: item.id, type: 'image' });
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'en' ? 'Subir Foto' : 'Subir Foto'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveUploadTarget({ id: item.id, type: 'video' });
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-700 hover:text-teal-700 bg-white hover:bg-teal-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors shadow-2xs"
                    >
                      <Video className="w-3.5 h-3.5 text-teal-600" />
                      <span>{language === 'en' ? 'Subir Video' : 'Subir Video'}</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    #{item.item_number}. {title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {description}
                  </p>

                  {/* Preparation choices */}
                  {preps.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                        {language === 'en' ? 'Preparation choice:' : 'Opción de preparación:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {preps.map((prep) => (
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
                  )}

                  {/* Sides and Beverage */}
                  <div className="space-y-2 pt-2 text-xs text-slate-600 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100/80">
                    {sides.length > 0 && (
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-slate-800">{language === 'en' ? 'Sides:' : 'Acompañamiento:'}</strong> {sides.join(' + ')}</span>
                      </div>
                    )}
                    {beverage && (
                      <div className="flex items-start space-x-2">
                        <Coffee className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-slate-800">{language === 'en' ? 'Beverage included:' : 'Bebida incluida:'}</strong> {beverage}</span>
                      </div>
                    )}
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
                  <span>{language === 'en' ? 'Include in My Reservation' : 'Incluir en Mi Reserva'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-200/80 bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Flame className="w-5 h-5 text-emerald-400" />
            <h4 className="text-lg font-bold text-white">
              {language === 'en' ? 'Special dietary requests or allergies?' : '¿Tienes requerimientos dietéticos especiales?'}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            {language === 'en'
              ? 'We cater to vegetarian options and special diets. Please notify us during your booking confirmation or via WhatsApp.'
              : 'Atendemos opciones vegetarianas o alergias avisándonos previamente durante la confirmación de tu reserva o vía WhatsApp.'}
          </p>
        </div>
        <button
          onClick={() => { if (onOpenBooking) onOpenBooking(); }}
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm whitespace-nowrap shadow-lg transition-transform hover:scale-105"
        >
          {language === 'en' ? 'Book Glamping Experience' : 'Ir a Reservar Experiencia'}
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs px-4 py-2.5 rounded-full font-semibold shadow-2xl flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Dish Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <Utensils className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-lg text-slate-900">
                    {language === 'en' ? 'Add Dish / Beverage / Snack' : 'Subir / Agregar Plato, Bebida o Snack'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMenuItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {language === 'en' ? 'Item Name' : 'Nombre del Plato o Bebida'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Ej: Costillas BBQ Artesanales o Jarra de Sangría"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      {language === 'en' ? 'Category' : 'Categoría'}
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:outline-hidden bg-white"
                    >
                      <option value="Almuerzos y Cenas">Almuerzos y Cenas</option>
                      <option value="Bebidas">Bebidas & Vinos</option>
                      <option value="Snacks & Picadas">Snacks & Picadas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      {language === 'en' ? 'Price (COP)' : 'Precio (COP)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={e => setNewPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {language === 'en' ? 'Description & Ingredients' : 'Descripción e Ingredientes'}
                  </label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Describe los ingredientes, guarniciones y preparación..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Upload File Section */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">
                    {language === 'en' ? 'Upload Photo or Video Tour' : 'Subir Foto o Video del Plato'}
                  </label>

                  <input
                    type="file"
                    ref={modalFileInputRef}
                    onChange={handleModalMediaUpload}
                    accept="image/*,video/*"
                    className="hidden"
                  />

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => modalFileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center space-x-2 transition-colors border border-slate-300"
                    >
                      <ImagePlus className="w-4 h-4 text-emerald-600" />
                      <span>{isUploading ? (language === 'en' ? 'Uploading...' : 'Subiendo archivo...') : (language === 'en' ? 'Choose Image / Video' : 'Elegir Foto / Video')}</span>
                    </button>

                    {newMediaUrl && (
                      <span className="text-xs text-emerald-700 font-medium flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>{language === 'en' ? 'File ready' : 'Archivo listo'}</span>
                      </span>
                    )}
                  </div>

                  {newMediaUrl && (
                    <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
                      {newMediaType === 'video' ? (
                        <video src={newMediaUrl} controls className="h-full object-cover" />
                      ) : (
                        <img src={newMediaUrl} alt="Preview" className="h-full object-cover" />
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    {language === 'en' ? 'Cancel' : 'Cancelar'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md"
                  >
                    {language === 'en' ? 'Add to Menu' : 'Guardar en el Menú'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
