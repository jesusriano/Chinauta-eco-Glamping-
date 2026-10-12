import React, { useState } from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets, RefreshCw, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface WeatherData {
  temp: number;
  conditionKey: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  forecast: { dayKey: string; temp: number; icon: string }[];
}

export const WeatherWidget: React.FC = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData>({
    temp: 24,
    conditionKey: 'weather.partly_cloudy',
    humidity: 68,
    windSpeed: 12,
    feelsLike: 25,
    forecast: [
      { dayKey: 'weather.today', temp: 24, icon: 'partly-cloudy' },
      { dayKey: 'weather.tomorrow', temp: 26, icon: 'sunny' },
      { dayKey: 'weather.sat', temp: 23, icon: 'rain' },
      { dayKey: 'weather.sun', temp: 25, icon: 'sunny' }
    ]
  });
  const [loading, setLoading] = useState(false);

  // Optional real API fetch or refresh simulation
  const refreshWeather = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate slight variation
      const randomTemp = Math.floor(Math.random() * 4) + 23;
      setWeather(prev => ({
        ...prev,
        temp: randomTemp,
        feelsLike: randomTemp + 1,
        humidity: Math.floor(Math.random() * 10) + 62
      }));
      setLoading(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/50 relative overflow-hidden"
    >
      {/* Background ambient blur */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        
        {/* Location & Current Condition */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-medium uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{t('weather.live_title')}</span>
          </div>
          
          <div className="flex items-baseline space-x-4">
            <div className="text-5xl sm:text-6xl font-extrabold tracking-tight">
              {weather.temp}°C
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-emerald-100 flex items-center space-x-2">
                <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
                <span>{t(weather.conditionKey)}</span>
              </div>
              <p className="text-xs text-slate-300">
                {t('weather.feels_like')} {weather.feelsLike}°C • {t('weather.perfect_climate')}
              </p>
            </div>
          </div>
        </div>

        {/* Details & Refresh */}
        <div className="flex flex-col sm:items-end space-y-4 w-full sm:w-auto">
          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>{t('weather.humidity')}: {weather.humidity}%</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-emerald-300" />
              <span>{t('weather.wind')}: {weather.windSpeed} km/h</span>
            </div>
          </div>

          <button
            onClick={refreshWeather}
            disabled={loading}
            className="inline-flex items-center space-x-2 text-xs text-emerald-300 hover:text-white transition-colors bg-emerald-900/60 hover:bg-emerald-800/80 px-3 py-1.5 rounded-xl border border-emerald-700/50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('weather.refresh')}</span>
          </button>
        </div>

      </div>

      {/* 4-Day Forecast Strip */}
      <div className="mt-8 pt-6 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {weather.forecast.map((item, idx) => (
          <div key={idx} className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-3.5 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-emerald-300">{t(item.dayKey)}</span>
              <div className="text-base font-bold mt-0.5">{item.temp}°C</div>
            </div>
            {item.icon === 'sunny' ? (
              <Sun className="w-6 h-6 text-amber-400" />
            ) : item.icon === 'rain' ? (
              <CloudRain className="w-6 h-6 text-cyan-400" />
            ) : (
              <Cloud className="w-6 h-6 text-slate-300" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
