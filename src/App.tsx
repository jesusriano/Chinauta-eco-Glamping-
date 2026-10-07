import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePortal } from './components/HomePortal';
import { AvailabilityChecker } from './components/AvailabilityChecker';
import { ContactView } from './components/ContactView';
import { InteractiveMap } from './components/InteractiveMap';
import { FoodMenuSection } from './components/FoodMenuSection';
import { BookingWizardModal } from './components/BookingWizardModal';
import { MyReservationsModal } from './components/MyReservationsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AiConciergeChat } from './components/AiConciergeChat';
import { AdminUser } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Dynamic SEO meta-tag updater based on active tab and selected language
  useEffect(() => {
    let title = language === 'en'
      ? 'Eco Glamping Chinauta | Luxury Domes with Private Jacuzzi'
      : 'Eco Glamping Chinauta | Domos de Lujo con Jacuzzi Privado';
    let description = language === 'en'
      ? 'Live a unique nature and relaxation experience at Eco Glamping Chinauta, Colombia. Geodesic domes with private jacuzzi, fire pit, and warm climate.'
      : 'Vive una experiencia única de desconexión y naturaleza en Eco Glamping Chinauta, Cundinamarca. Domos geodésicos con jacuzzi privado, zona de fogatas y clima templado.';

    if (adminUser) {
      title = language === 'en' ? 'Eco Glamping Chinauta | Admin Portal' : 'Eco Glamping Chinauta | Panel Administrativo';
      description = language === 'en' ? 'Complete booking management, domes, and finance operations.' : 'Gestión integral de reservas, domos, finanzas y operaciones de Eco Glamping Chinauta.';
    } else {
      switch (activeTab) {
        case 'availability':
          title = language === 'en' ? 'Eco Glamping Chinauta | Check Availability & Rates' : 'Eco Glamping Chinauta | Consultar Disponibilidad y Reservas';
          description = language === 'en' ? 'Check real-time rates, verify dome availability, and book your stay.' : 'Consulta tarifas en tiempo real, verifica disponibilidad de domos geodésicos y reserva tu estancia.';
          break;
        case 'domes':
          title = language === 'en' ? 'Eco Glamping Chinauta | Ancestral Domes & VIP Cabins' : 'Eco Glamping Chinauta | Domos Ancestrales y Cabañas VIP';
          description = language === 'en' ? 'Explore our exclusive domes with private jacuzzi, fire pits, and scenic views.' : 'Explora nuestros exclusivos domos equipados con jacuzzi, fogata privada y vistas panorámicas.';
          break;
        case 'contact':
          title = language === 'en' ? 'Eco Glamping Chinauta | Contact & Location' : 'Eco Glamping Chinauta | Contacto y Ubicación';
          description = language === 'en' ? 'Contact our team and learn how to reach Main Highway Chinauta Km 4.5, Fusagasugá.' : 'Comunícate con nuestro equipo y conoce cómo llegar a Vía Principal Chinauta Km 4.5, Fusagasugá.';
          break;
        case 'map':
          title = language === 'en' ? 'Eco Glamping Chinauta | Interactive Grounds & Map' : 'Eco Glamping Chinauta | Mapa Interactivo y Entorno Natural';
          description = language === 'en' ? 'Explore dome distribution, common areas, nature trails, and scenic viewpoints.' : 'Explora la distribución de los domos, zonas comunes, senderos y miradores en el bosque nativo.';
          break;
        case 'menu':
          title = language === 'en' ? 'Eco Glamping Chinauta | Lunch & Dinner Menu' : 'Eco Glamping Chinauta | Menú de Cenas y Almuerzos';
          description = language === 'en' ? 'Explore our artisan culinary menu: trout, beef, pork, chicken breast, and craft burgers.' : 'Conoce nuestro exclusivo menú gastronómico de trucha, carne, cerdo, pechuga y hamburguesa artesanal con jugo natural.';
          break;
        default:
          break;
      }
    }

    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [activeTab, adminUser, language]);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDomeId, setBookingDomeId] = useState<number | undefined>(undefined);
  const [bookingCheckIn, setBookingCheckIn] = useState<string | undefined>(undefined);
  const [bookingCheckOut, setBookingCheckOut] = useState<string | undefined>(undefined);

  const [isMyReservationsOpen, setIsMyReservationsOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const handleOpenBooking = (domeId?: number) => {
    setBookingDomeId(domeId);
    setBookingCheckIn(undefined);
    setBookingCheckOut(undefined);
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithDates = (checkIn: string, checkOut: string, domeId: number) => {
    setBookingCheckIn(checkIn);
    setBookingCheckOut(checkOut);
    setBookingDomeId(domeId);
    setIsBookingOpen(true);
  };

  // If admin is logged in, show admin dashboard
  if (adminUser) {
    return (
      <AdminDashboard
        user={adminUser}
        onLogout={() => setAdminUser(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* Navbar with Language Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenMyReservations={() => setIsMyReservationsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 pb-20 lg:pb-0 overflow-x-hidden">
        {activeTab === 'home' && (
          <HomePortal
            onOpenBooking={handleOpenBooking}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'availability' && (
          <AvailabilityChecker
            onOpenBookingWithDates={handleOpenBookingWithDates}
          />
        )}

        {activeTab === 'domes' && (
          <HomePortal
            onOpenBooking={handleOpenBooking}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView />
        )}

        {activeTab === 'map' && (
          <InteractiveMap />
        )}

        {activeTab === 'menu' && (
          <FoodMenuSection onOpenBooking={handleOpenBooking} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-slate-800">
                <img src="/logo.jpg" alt="Eco Glamping Chinauta" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="font-bold text-white text-base">Eco Glamping Chinauta</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer.brand_desc')}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">{t('footer.domes_title')}</h4>
            <ul className="space-y-2 text-xs">
              <li>Domo 1 — Huitaca</li>
              <li>Domo 2 — Bochica</li>
              <li>Domo 3 — Bachué</li>
              <li>Domo 4 — Luna Chía</li>
              <li>Domo 5 — Chiminichagua</li>
              <li>Domo 6 — Xue Sol</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">{t('footer.links_title')}</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-emerald-400">{t('nav.home')}</button></li>
              <li><button onClick={() => setActiveTab('availability')} className="hover:text-emerald-400">{t('nav.availability')}</button></li>
              <li><button onClick={() => setActiveTab('map')} className="hover:text-emerald-400">{t('nav.map')}</button></li>
              <li><button onClick={() => setIsMyReservationsOpen(true)} className="hover:text-emerald-400">{t('nav.my_reservations')}</button></li>
              <li><button onClick={() => setIsAdminLoginOpen(true)} className="hover:text-emerald-400">{t('nav.admin')}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">{t('footer.contact_title')}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vía Principal Chinauta Km 4.5<br />
              Fusagasugá, Cundinamarca, Colombia<br />
              WhatsApp: +57 321 310 9331 / +57 310 123 4567<br />
              contacto@ecoglampingchinauta.com
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          {t('footer.copyright')}
        </div>
      </footer>

      {/* Floating AI Concierge Chatbot */}
      <AiConciergeChat />

      {/* Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDomeId={bookingDomeId}
        initialCheckIn={bookingCheckIn}
        initialCheckOut={bookingCheckOut}
        onSuccess={(code) => {
          // Success callback
        }}
      />

      {/* My Reservations Modal */}
      <MyReservationsModal
        isOpen={isMyReservationsOpen}
        onClose={() => setIsMyReservationsOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(user) => setAdminUser(user)}
      />

    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

