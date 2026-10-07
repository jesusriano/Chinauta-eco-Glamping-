import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

export interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  es: {
    // Navbar
    'nav.home': 'Inicio',
    'nav.availability': 'Disponibilidad',
    'nav.domes': 'Nuestros Domos',
    'nav.menu': 'Menú Comidas',
    'nav.explore': 'Explorar',
    'nav.map': 'Mapa & Entorno',
    'nav.map_desc': 'Distribución de domos y senderos',
    'nav.jacuzzi_climate': 'Jacuzzis & Clima',
    'nav.jacuzzi_desc': 'Jacuzzi privado y clima templado',
    'nav.contact': 'Contacto',
    'nav.my_reservations': 'Mis Reservas',
    'nav.book': 'Reservar',
    'nav.book_now': 'Reservar Ahora',
    'nav.admin': 'Portal Administrativo',
    'nav.whatsapp_direct': 'WhatsApp Directo',
    'nav.online_reception': 'Recepción en línea • Chinauta',
    'nav.call_reception': 'Llamar a Recepción: +57 321 310 9331',
    'nav.dates': 'Fechas',
    'nav.menu_short': 'Menú',

    // Hero
    'hero.badge': 'Experiencia de Lujo Natural en Fusagasugá',
    'hero.title_p1': 'Conexión Mística',
    'hero.title_p2': 'Entre Montañas y Estrellas',
    'hero.desc': 'Descubre Eco Glamping Chinauta. Domos geodésicos exclusivos equipados con jacuzzi privado, mallas flotantes y vistas panorámicas incomparables.',
    'hero.book_btn': 'Reservar Mi Domo',
    'hero.check_btn': 'Consultar Disponibilidad',
    'stats.domes_count': '6',
    'stats.domes_label': 'Domos Exclusivos',
    'stats.nature_count': '100%',
    'stats.nature_label': 'Naturaleza & Confort',
    'stats.rating_count': '4.9',
    'stats.rating_label': 'Calificación de Huéspedes',
    'stats.service_count': '24/7',
    'stats.service_label': 'Atención Personalizada',

    // Domes Section
    'domes.tag': 'NUESTROS ALOJAMIENTOS',
    'domes.title': 'Nuestros 6 Domos Ancestrales',
    'domes.desc': 'Cada domo lleva el nombre de deidades y leyendas ancestrales, diseñado con arquitectura bioclimática y acabados de lujo.',
    'domes.loading': 'Cargando domos...',
    'domes.night': '/ noche',
    'domes.guests': 'huéspedes',
    'domes.book_btn': 'Reservar Domo',
    'domes.view_details': 'Ver Detalles',
    'domes.custom_photo': 'Foto',
    'domes.custom_video': 'Video',
    'domes.upload_img': 'Subir imagen',
    'domes.upload_video': 'Subir video',
    'domes.delete_photo': 'Borrar esta foto',

    // Availability
    'avail.tag': 'CONSULTA EN TIEMPO REAL',
    'avail.title': 'Consulta de Disponibilidad y Tarifas',
    'avail.desc': 'Selecciona las fechas de tu estadía y la cantidad de huéspedes para descubrir los domos disponibles con tarifa garantizada.',
    'avail.checkin': 'Fecha de Check-in (Llegada)',
    'avail.checkout': 'Fecha de Check-out (Salida)',
    'avail.guests_label': 'Huéspedes',
    'avail.search_btn': 'Buscar Domos Disponibles',
    'avail.clear_btn': 'Limpiar Fechas',
    'avail.searching': 'Buscando domos...',
    'avail.available': 'Disponible para tus fechas',
    'avail.unavailable': 'No disponible en este rango',
    'avail.reserve_now': 'Reservar Ahora',
    'avail.no_domes': 'No hay domos disponibles para las fechas seleccionadas.',

    // Menu
    'menu.badge': 'Gastronomía Artesanal Chinauta',
    'menu.title': 'Menú de Cenas y Almuerzos',
    'menu.desc': 'Disfruta de platos exquisitos preparados al instante con ingredientes frescos de la región.',
    'menu.dish1_name': '1. Trucha Gratinada o Asada',
    'menu.dish1_desc': 'Trucha fresca en salsa de champiñones gratinada o a la plancha. Acompañada de papas a la francesa, ensalada fresca de la huerta y jugo natural.',
    'menu.dish2_name': '2. Carne de Res Gratinada / Asada',
    'menu.dish2_desc': 'Corte selecto de res a la parrilla o con salsa suave de champiñones gratinada. Con papas fritas, ensalada y jugo natural.',
    'menu.dish3_name': '3. Cerdo en Salsa de Champiñones',
    'menu.dish3_desc': 'Lomo de cerdo tierno asado o gratinado en cremosa reducción de champiñones. Acompañado de papas a la francesa, ensalada y jugo.',
    'menu.dish4_name': '4. Pechuga Gratinada o a la Plancha',
    'menu.dish4_desc': 'Pechuga de pollo jugosa, asada o en salsa gratinada. Servida con papas a la francesa crujientes, ensalada y jugo natural.',
    'menu.dish5_name': '5. Combo Hamburguesa Artesanal',
    'menu.dish5_desc': 'Carne 100% de res artesanal con queso derretido, tocineta y vegetales frescos en pan brioche. Incluye papas y gaseosa Postobón 400ml.',
    'menu.book_dinner_btn': 'Reservar Estadía con Menú',

    // Map & Contact
    'map.title': 'Mapa Interactivo & Entorno Natural',
    'map.desc': 'Explora la ubicación de cada domo, senderos ecológicos, miradores y zonas comunes dentro de nuestro glamping.',
    'contact.title': 'Contacto & Ubicación',
    'contact.desc': 'Estamos ubicados en el clima ideal de Chinauta (Fusagasugá, Cundinamarca), a solo 1.5 horas de Bogotá.',
    'contact.address': 'Vía Principal Chinauta Km 4.5, Fusagasugá, Cundinamarca, Colombia',
    'contact.whatsapp': 'WhatsApp: +57 321 310 9331 / +57 310 123 4567',
    'contact.email': 'contacto@ecoglampingchinauta.com',
    'contact.hours': 'Atención al Cliente: Todos los días 7:00 AM - 9:00 PM',

    // Footer
    'footer.brand_desc': 'Plataforma tecnológica de alojamiento y turismo de naturaleza en Fusagasugá, Cundinamarca.',
    'footer.domes_title': 'Domos Ancestrales',
    'footer.links_title': 'Enlaces Rápidos',
    'footer.contact_title': 'Ubicación & Contacto',
    'footer.copyright': '© 2026 Eco Glamping Chinauta. Todos los derechos reservados. Sistema Integral de Reservas v2.5.'
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.availability': 'Availability',
    'nav.domes': 'Our Domes',
    'nav.menu': 'Dining Menu',
    'nav.explore': 'Explore',
    'nav.map': 'Map & Grounds',
    'nav.map_desc': 'Dome layout and nature trails',
    'nav.jacuzzi_climate': 'Jacuzzis & Weather',
    'nav.jacuzzi_desc': 'Cedar hot tubs & warm climate',
    'nav.contact': 'Contact',
    'nav.my_reservations': 'My Bookings',
    'nav.book': 'Book Now',
    'nav.book_now': 'Book Now',
    'nav.admin': 'Admin Portal',
    'nav.whatsapp_direct': 'Direct WhatsApp',
    'nav.online_reception': 'Front Desk Online • Chinauta',
    'nav.call_reception': 'Call Front Desk: +57 321 310 9331',
    'nav.dates': 'Dates',
    'nav.menu_short': 'Menu',

    // Hero
    'hero.badge': 'Luxury Nature Retreat in Fusagasugá',
    'hero.title_p1': 'Mystical Connection',
    'hero.title_p2': 'Between Mountains & Stars',
    'hero.desc': 'Discover Eco Glamping Chinauta. Exclusive geodesic domes equipped with private jacuzzi, catamaran lounge meshes, and breathtaking mountain views.',
    'hero.book_btn': 'Book My Dome',
    'hero.check_btn': 'Check Availability',
    'stats.domes_count': '6',
    'stats.domes_label': 'Exclusive Domes',
    'stats.nature_count': '100%',
    'stats.nature_label': 'Nature & Comfort',
    'stats.rating_count': '4.9',
    'stats.rating_label': 'Guest Rating',
    'stats.service_count': '24/7',
    'stats.service_label': 'Personalized Service',

    // Domes Section
    'domes.tag': 'OUR ACCOMMODATIONS',
    'domes.title': 'Our 6 Ancestral Domes',
    'domes.desc': 'Each dome is named after ancestral deities and legends, designed with bioclimatic architecture and luxury finishes.',
    'domes.loading': 'Loading domes...',
    'domes.night': '/ night',
    'domes.guests': 'guests',
    'domes.book_btn': 'Book This Dome',
    'domes.view_details': 'View Details',
    'domes.custom_photo': 'Photo',
    'domes.custom_video': 'Video',
    'domes.upload_img': 'Upload photo',
    'domes.upload_video': 'Upload video',
    'domes.delete_photo': 'Delete this photo',

    // Availability
    'avail.tag': 'REAL-TIME BOOKING',
    'avail.title': 'Check Availability & Rates',
    'avail.desc': 'Select your stay dates and number of guests to discover available domes with guaranteed best rates.',
    'avail.checkin': 'Check-in Date (Arrival)',
    'avail.checkout': 'Check-out Date (Departure)',
    'avail.guests_label': 'Guests',
    'avail.search_btn': 'Search Available Domes',
    'avail.clear_btn': 'Clear Dates',
    'avail.searching': 'Searching domes...',
    'avail.available': 'Available for your dates',
    'avail.unavailable': 'Unavailable in this date range',
    'avail.reserve_now': 'Book Now',
    'avail.no_domes': 'No domes available for the selected dates.',

    // Menu
    'menu.badge': 'Chinauta Artisan Gastronomy',
    'menu.title': 'Lunch & Dinner Menu',
    'menu.desc': 'Savor delicious gourmet meals freshly prepared with fresh local Colombian ingredients.',
    'menu.dish1_name': '1. Grilled or Au Gratin Trout',
    'menu.dish1_desc': 'Fresh mountain trout with rich mushroom sauce au gratin or grilled. Served with french fries, fresh farm garden salad, and natural fruit juice.',
    'menu.dish2_name': '2. Grilled / Au Gratin Beef Steak',
    'menu.dish2_desc': 'Prime Colombian beef cut grilled to perfection or baked with cheese and mushrooms. Served with fries, fresh salad, and juice.',
    'menu.dish3_name': '3. Pork Loin in Mushroom Sauce',
    'menu.dish3_desc': 'Tender pork tenderloin steak grilled or au gratin in a savory mushroom reduction. Served with crispy fries, salad, and natural juice.',
    'menu.dish4_name': '4. Grilled or Au Gratin Chicken Breast',
    'menu.dish4_desc': 'Juicy free-range chicken breast grilled or baked with melted cheese and mushrooms. Served with french fries, salad, and fresh juice.',
    'menu.dish5_name': '5. Artisan Burger Combo',
    'menu.dish5_desc': '100% prime beef burger with melted artisan cheese, bacon, and fresh garden veggies on brioche bun. Includes fries and Postobón soda (400ml).',
    'menu.book_dinner_btn': 'Book Stay with Meal Plan',

    // Map & Contact
    'map.title': 'Interactive Map & Natural Grounds',
    'map.desc': 'Explore the location of each dome, nature trails, viewpoints, and shared amenities across our glamping property.',
    'contact.title': 'Contact & Location',
    'contact.desc': 'We are located in the tropical warm microclimate of Chinauta (Fusagasugá, Cundinamarca), just 1.5 hours from Bogotá.',
    'contact.address': 'Main Highway Chinauta Km 4.5, Fusagasugá, Cundinamarca, Colombia',
    'contact.whatsapp': 'WhatsApp: +57 321 310 9331 / +57 310 123 4567',
    'contact.email': 'contacto@ecoglampingchinauta.com',
    'contact.hours': 'Front Desk Support: Daily 7:00 AM - 9:00 PM',

    // Footer
    'footer.brand_desc': 'Hospitality technology platform and nature glamping tourism in Fusagasugá, Cundinamarca, Colombia.',
    'footer.domes_title': 'Ancestral Domes',
    'footer.links_title': 'Quick Links',
    'footer.contact_title': 'Location & Contact',
    'footer.copyright': '© 2026 Eco Glamping Chinauta. All rights reserved. Comprehensive Booking System v2.5.'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('preferred_language');
      if (saved === 'es' || saved === 'en') return saved;
      // Auto-detect browser language
      if (navigator.language && navigator.language.startsWith('en')) {
        return 'en';
      }
    } catch (_) {
      // fallback
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('preferred_language', lang);
    } catch (_) {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['es'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
