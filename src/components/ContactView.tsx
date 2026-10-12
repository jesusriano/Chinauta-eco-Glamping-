import React from 'react';
import { MapPin, Phone, Mail, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageCarousel } from './ImageCarousel';
import { useLanguage } from '../context/LanguageContext';

export const ContactView: React.FC = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      q: t('contact.faq1_q'),
      a: t('contact.faq1_a')
    },
    {
      q: t('contact.faq2_q'),
      a: t('contact.faq2_a')
    },
    {
      q: t('contact.faq3_q'),
      a: t('contact.faq3_a')
    },
    {
      q: t('contact.faq4_q'),
      a: t('contact.faq4_a')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
    >
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-emerald-600 font-bold">{t('contact.badge')}</h2>
        <h3 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('contact.hero_title')}</h3>
        <p className="text-slate-600">
          {t('contact.hero_desc')}
        </p>
      </div>

      {/* Visual Tour Carousel of Facilities & Access */}
      <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        <ImageCarousel
          images={[
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80'
          ]}
          alt={t('contact.carousel_alt')}
          className="h-72 sm:h-96"
          overlayBadge={
            <div className="bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
              {t('contact.carousel_badge')}
            </div>
          }
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Phone className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">{t('contact.phone_title')}</h4>
          <p className="text-slate-600 text-sm">+57 321 310 9331</p>
          <a
            href="https://wa.me/573213109331"
            target="_blank"
            rel="noreferrer"
            className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
          >
            {t('contact.whatsapp_btn')}
          </a>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">{t('contact.email_card_title')}</h4>
          <p className="text-slate-600 text-sm">contacto@ecoglampingchinauta.com</p>
          <a
            href="mailto:contacto@ecoglampingchinauta.com"
            className="inline-block px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            {t('contact.email_btn')}
          </a>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <MapPin className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">{t('contact.location_card_title')}</h4>
          <p className="text-slate-600 text-sm">Vía Principal Chinauta Km 4.5, Fusagasugá, Cundinamarca</p>
          <span className="inline-block text-xs text-emerald-700 font-semibold">{t('contact.location_travel_time')}</span>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h4 className="text-2xl font-bold text-slate-900 text-center mb-8">{t('contact.faq_heading')}</h4>
        
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{faq.q}</span>
            </h5>
            <p className="text-slate-600 text-sm pl-7 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

    </motion.div>
  );
};
