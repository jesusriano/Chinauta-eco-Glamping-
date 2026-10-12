import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Compass, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, CreditCard, Sparkles, Heart, Sun, Clock, Dog, Wine } from 'lucide-react';
import { Dome } from '../types';
import { ImageCarousel } from './ImageCarousel';
import { getDomeImages } from '../utils/domeImages';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomeId?: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  onSuccess: (code: string) => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  initialDomeId,
  initialCheckIn,
  initialCheckOut,
  onSuccess
}) => {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(); dayAfter.setDate(dayAfter.getDate() + 3);

  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState<'estadia' | 'pasadia'>('estadia');
  const [checkIn, setCheckIn] = useState(initialCheckIn || tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(initialCheckOut || dayAfter.toISOString().split('T')[0]);
  const [guests, setGuests] = useState(2);
  const [domes, setDomes] = useState<any[]>([]);
  const [selectedDomeId, setSelectedDomeId] = useState<number | null>(initialDomeId || null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Pets & Addons
  const [hasPet, setHasPet] = useState(false);
  const [petCount, setPetCount] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<{
    bonoTime: boolean;
    decorVip: boolean;
    decorBasic: boolean;
    coupleMassage: boolean;
  }>({
    bonoTime: false,
    decorVip: false,
    decorBasic: false,
    coupleMassage: false
  });
  const [customMessage, setCustomMessage] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Customer form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [notes, setNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedCode, setConfirmedCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialDomeId) setSelectedDomeId(initialDomeId);
      if (initialCheckIn) setCheckIn(initialCheckIn);
      if (initialCheckOut) setCheckOut(initialCheckOut);
      fetchAvailability();
    }
  }, [isOpen, checkIn, checkOut, bookingType]);

  const fetchAvailability = async () => {
    setLoadingAvailability(true);
    try {
      const effectiveCheckOut = bookingType === 'pasadia' ? checkIn : checkOut;
      const res = await fetch(`/api/availability?checkIn=${checkIn}&checkOut=${effectiveCheckOut}`);
      const data = await res.json();
      if (Array.isArray(data)) setDomes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAvailability(false);
    }
  };

  if (!isOpen) return null;

  const selectedDome = domes.find(d => idMatch(d.id, selectedDomeId));
  function idMatch(a: any, b: any) {
    return Number(a) === Number(b);
  }

  // Calculate nights & pricing
  const start = new Date(checkIn);
  const end = new Date(bookingType === 'pasadia' ? checkIn : checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = bookingType === 'pasadia' ? 1 : Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const baseRate = bookingType === 'pasadia' ? 250000 : (selectedDome ? selectedDome.price_per_night : 380000);
  const baseTotal = bookingType === 'pasadia' ? baseRate : nights * baseRate;

  // Extra persons ($70,000 per extra person per night if guests > dome capacity or base 2)
  const baseCapacity = selectedDome ? (selectedDome.capacity || 2) : 2;
  const extraPersons = Math.max(0, guests - baseCapacity);
  const extraPersonsFee = extraPersons * 70000 * (bookingType === 'pasadia' ? 1 : nights);

  // Pets ($30,000 per pet)
  const petsFee = hasPet ? petCount * 30000 : 0;

  // Addons fees
  const bonoTimeFee = selectedAddons.bonoTime ? 50000 : 0;
  const decorFee = selectedAddons.decorVip ? 150000 : (selectedAddons.decorBasic ? 75000 : 0);
  const massageFee = selectedAddons.coupleMassage ? 250000 : 0;
  const addonsTotal = bonoTimeFee + decorFee + massageFee;

  const subtotal = baseTotal + extraPersonsFee + petsFee + addonsTotal;

  // Check if check-in is between Monday (1) and Thursday (4)
  const checkInDayOfWeek = new Date(checkIn).getDay();
  const isWeekday = checkInDayOfWeek >= 1 && checkInDayOfWeek <= 4;

  // Automatic weekday discount calculation (10%, 15%, or 20% depending on services and consumption)
  let effectiveDiscountPercent = 0;
  if (isWeekday) {
    const activeServicesCount = Object.values(selectedAddons).filter(Boolean).length;
    if (activeServicesCount >= 3 || addonsTotal >= 300000) {
      effectiveDiscountPercent = 20;
    } else if (activeServicesCount >= 2 || addonsTotal >= 150000) {
      effectiveDiscountPercent = 15;
    } else {
      effectiveDiscountPercent = 10;
    }
  } else {
    effectiveDiscountPercent = discountPercent; // Weekend manual promo code option if desired
  }

  const discountAmount = (subtotal * effectiveDiscountPercent) / 100;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const validateStep2 = () => {
    if (bookingType === 'pasadia') {
      const dayOfWeek = new Date(checkIn).getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
      // Mon to Thu: 1, 2, 3, 4
      if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
        setErrorMsg("⚠️ Las pasadías solo están disponibles de lunes a jueves. Por favor seleccione un día válido.");
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDome || !name || !phone || !email) {
      setErrorMsg("Por favor completa todos los campos obligatorios.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const effectiveCheckOut = bookingType === 'pasadia' ? checkIn : checkOut;
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dome_id: selectedDome.id,
          check_in: checkIn,
          check_out: effectiveCheckOut,
          guests,
          total_amount: totalAmount,
          notes: `[${bookingType.toUpperCase()}] Mascotas: ${hasPet ? petCount : 0}. Addons: ${Object.entries(selectedAddons).filter(([k,v]) => v).map(([k]) => k).join(', ')}. Mensaje decorativo: ${customMessage}. Notas: ${notes}`,
          customer: {
            name,
            phone,
            whatsapp: whatsapp || phone,
            email,
            document_id: documentId,
            notes
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la reserva');
      }

      setConfirmedCode(data.reservation_code);
      setStep(8); // Confirmation step
      onSuccess(data.reservation_code);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de red o doble reserva detectada.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden bg-white my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Compass className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Reserva • Eco Glamping Chinauta</h3>
              <p className="text-xs text-emerald-200">Paso {step} de 8</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Wizard Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Choose Booking Type */}
          {step === 1 && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-900">¿Qué tipo de experiencia deseas vivir?</h4>
              <p className="text-sm text-slate-600">Selecciona la modalidad de tu visita en Eco Glamping Chinauta.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setBookingType('estadia')}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                    bookingType === 'estadia' ? 'border-emerald-600 bg-emerald-50/50 shadow-md' : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-base">Estadía en Domo</h5>
                    <p className="text-xs text-slate-500 mt-1">Check-in: 3:00 p.m. • Check-out: 11:00 a.m. Disfruta de la noche con jacuzzi, fogata y estrellas.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">Disponible todos los días →</span>
                </div>

                <div
                  onClick={() => setBookingType('pasadia')}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                    bookingType === 'pasadia' ? 'border-emerald-600 bg-emerald-50/50 shadow-md' : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-base">Pasadía Exclusiva</h5>
                    <p className="text-xs text-slate-500 mt-1">Horario: 8:00 a.m. a 4:00 p.m. Exclusivo de lunes a jueves. Desde $250.000 COP.</p>
                  </div>
                  <span className="text-xs font-bold text-teal-700">Lunes a Jueves →</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Guests */}
          {step === 2 && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-900">
                {bookingType === 'pasadia' ? 'Selecciona la Fecha de tu Pasadía (Lunes a Jueves)' : 'Selecciona tus Fechas de Estadía'}
              </h4>
              <p className="text-sm text-slate-600">
                {bookingType === 'pasadia' ? 'Horario de disfrute: 8:00 a.m. a 4:00 p.m.' : 'Check-in 3:00 p.m. | Check-out 11:00 a.m.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                    {bookingType === 'pasadia' ? 'Fecha de Pasadía' : 'Fecha de Entrada'}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => {
                      setCheckIn(e.target.value);
                      if (bookingType === 'pasadia') setCheckOut(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium focus:outline-hidden focus:border-emerald-500 bg-white"
                  />
                </div>
                {bookingType === 'estadia' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Fecha de Salida</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium focus:outline-hidden focus:border-emerald-500 bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Select Dome */}
          {step === 3 && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-900">Domos Disponibles</h4>
              <p className="text-sm text-slate-600">Elige el espacio ideal para tu experiencia en Eco Glamping Chinauta.</p>

              {loadingAvailability ? (
                <div className="text-center py-8 text-slate-500">Verificando disponibilidad en tiempo real...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {domes.map(dome => (
                    <div
                      key={dome.id}
                      onClick={() => dome.isAvailable && setSelectedDomeId(dome.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        selectedDomeId === dome.id
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-md'
                          : dome.isAvailable
                          ? 'border-slate-200 hover:border-emerald-400 bg-white'
                          : 'border-slate-200 opacity-50 bg-slate-100 cursor-not-allowed'
                      }`}
                    >
                      <div className="rounded-xl overflow-hidden mb-3">
                        <ImageCarousel
                          images={getDomeImages(dome)}
                          alt={dome.name}
                          className="h-36 sm:h-40"
                          showCounter={true}
                          overlayBadge={
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                              dome.isAvailable ? 'bg-emerald-100/95 text-emerald-800' : 'bg-rose-100/95 text-rose-800'
                            }`}>
                              {dome.isAvailable ? 'Disponible' : dome.reason}
                            </span>
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-sm">{dome.name}</h5>
                          <span className="text-xs text-slate-500 font-medium">{dome.code}</span>
                        </div>
                        <p className="text-xs text-emerald-700 font-bold mt-1">
                          ${(bookingType === 'pasadia' ? 250000 : dome.price_per_night).toLocaleString('es-CO')} {bookingType === 'pasadia' ? 'pasadía' : '/ noche'}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{dome.description}</p>
                      </div>
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                        ✨ Capacidad: hasta {dome.capacity || 2} huéspedes {dome.id === 1 ? '• Con Jacuzzi pequeño' : dome.id === 2 ? '• Permite cama adicional' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Guests & Extra Persons */}
          {step === 4 && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-900">Número de Huéspedes</h4>
              <p className="text-sm text-slate-600">
                El domo seleccionado tiene capacidad base para {selectedDome?.capacity || 2} personas. Personas adicionales tienen un costo de $70.000 COP por persona.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Cantidad de Huéspedes</label>
                <select
                  value={guests}
                  onChange={e => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium focus:outline-hidden focus:border-emerald-500 bg-white text-sm"
                >
                  <option value={1}>1 Huésped</option>
                  <option value={2}>2 Huéspedes (Incluido en base)</option>
                  <option value={3}>3 Huéspedes {selectedDome?.id === 2 ? '(Permite cama adicional)' : ''}</option>
                  <option value={4}>4 Huéspedes (Familiar)</option>
                </select>
              </div>

              {extraPersons > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  💡 Se han agregado {extraPersons} {extraPersons === 1 ? 'persona adicional' : 'personas adicionales'} (+${extraPersonsFee.toLocaleString('es-CO')} COP).
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Pets */}
          {step === 5 && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-900">¿Traerás mascotas?</h4>
              <p className="text-sm text-slate-600">En Eco Glamping Chinauta amamos a tus peluditos. El costo por mascota es de $30.000 COP.</p>

              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setHasPet(false)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer text-center font-bold text-sm transition-all ${
                    !hasPet ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-700 bg-white'
                  }`}
                >
                  No, sin mascotas
                </div>
                <div
                  onClick={() => setHasPet(true)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer text-center font-bold text-sm transition-all ${
                    hasPet ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-700 bg-white'
                  }`}
                >
                  🐾 Sí, llevaré mascotas
                </div>
              </div>

              {hasPet && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Cantidad de Mascotas</label>
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={petCount}
                    onChange={e => setPetCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                  <p className="text-xs text-slate-500">Recargo por mascota: $30.000 COP c/u.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Addons (Bono Time, Decor, Masaje) */}
          {step === 6 && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-900">Servicios y Complementos Adicionales</h4>
              <p className="text-sm text-slate-600">Personaliza tu experiencia con nuestros complementos de alta gama.</p>

              <div className="space-y-3">
                {/* Bono Time */}
                <div
                  onClick={() => setSelectedAddons({...selectedAddons, bonoTime: !selectedAddons.bonoTime})}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedAddons.bonoTime ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">BONO TIME (+3 horas)</h5>
                      <p className="text-xs text-slate-500">Agrega 3 horas adicionales a tu estadía.</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700 text-sm">+$50.000 COP</span>
                </div>

                {/* Decoración VIP */}
                <div
                  onClick={() => setSelectedAddons({...selectedAddons, decorVip: true, decorBasic: false})}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedAddons.decorVip ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <Wine className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Decoración VIP</h5>
                      <p className="text-xs text-slate-500">1 botella de vino, 2 postres, 5 snacks, batas, 2 aguas y mensaje personalizado.</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700 text-sm">+$150.000 COP</span>
                </div>

                {/* Decoración Básica */}
                <div
                  onClick={() => setSelectedAddons({...selectedAddons, decorBasic: true, decorVip: false})}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedAddons.decorBasic ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Decoración Básica</h5>
                      <p className="text-xs text-slate-500">Incluye mensaje personalizado elegido por el cliente.</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700 text-sm">+$75.000 COP</span>
                </div>

                {/* Masaje en Pareja */}
                <div
                  onClick={() => setSelectedAddons({...selectedAddons, coupleMassage: !selectedAddons.coupleMassage})}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedAddons.coupleMassage ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Masaje en Pareja</h5>
                      <p className="text-xs text-slate-500">Relajación profesional en pareja (60 min).</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700 text-sm">+$250.000 COP</span>
                </div>
              </div>

              {(selectedAddons.decorVip || selectedAddons.decorBasic) && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Mensaje Personalizado para la Decoración</label>
                  <input
                    type="text"
                    value={customMessage}
                    onChange={e => setCustomMessage(e.target.value)}
                    placeholder="Ej. Te amo mi amor / Feliz Cumpleaños / ¿Te casarías conmigo?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Guest Details & Payment */}
          {step === 7 && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-900">Datos de Contacto y Pago</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. María Fernanda Pérez"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+57 310 1234567"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Cédula o Documento</label>
                  <input
                    type="text"
                    value={documentId}
                    onChange={e => setDocumentId(e.target.value)}
                    placeholder="Número de documento"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Automatic Weekday Discount Notice */}
              {isWeekday ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium space-y-1">
                  <div className="font-bold flex items-center space-x-1.5 text-emerald-800">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Descuento Automático Entre Semana ({effectiveDiscountPercent}% Aplicado):</span>
                  </div>
                  <p>Por ser una estadía de lunes a jueves y según los servicios y consumo seleccionados, el sistema ha aplicado automáticamente un <strong>{effectiveDiscountPercent}% de descuento</strong> a tu reserva (-${discountAmount.toLocaleString('es-CO')} COP).</p>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">¿Tienes un código de descuento o promoción?</label>
                  <div className="flex space-x-2">
                    <select
                      value={discountPercent}
                      onChange={e => setDiscountPercent(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                    >
                      <option value={0}>Sin descuento</option>
                      <option value={10}>Descuento Especial (10%)</option>
                      <option value={15}>Descuento Promocional (15%)</option>
                      <option value={20}>Descuento VIP (20%)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase">Método de Pago</label>
                {[
                  { id: 'Transferencia Bancaria', title: 'Transferencia Bancaria (Bancolombia / Nequi / Daviplata)' },
                  { id: 'Wompi', title: 'Pasarela Wompi (Tarjetas / PSE / Nequi)' },
                  { id: 'Mercado Pago', title: 'Mercado Pago' }
                ].map(method => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${
                      paymentMethod === method.id ? 'border-emerald-600 bg-emerald-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === method.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-slate-900 text-xs">{method.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Full Summary & Confirmation */}
          {step === 8 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-900">¡Reserva Confirmada con Éxito!</h4>
                <p className="text-slate-600 text-xs">
                  Tu código de reserva es <strong className="text-emerald-700 font-mono text-base">{confirmedCode}</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Tipo de Reserva:</span><span className="font-bold uppercase text-slate-900">{bookingType}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Domo:</span><span className="font-bold text-slate-900">{selectedDome?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Fecha:</span><span className="font-bold text-slate-900">{checkIn} {bookingType === 'estadia' ? `al ${checkOut}` : '(8am - 4pm)'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Huéspedes:</span><span className="font-bold text-slate-900">{guests} personas</span></div>
                {extraPersons > 0 && <div className="flex justify-between"><span className="text-slate-500">Personas Adicionales:</span><span className="font-bold text-slate-900">+{extraPersons} ($${extraPersonsFee.toLocaleString('es-CO')})</span></div>}
                {hasPet && <div className="flex justify-between"><span className="text-slate-500">Mascotas:</span><span className="font-bold text-slate-900">+{petCount} ($${petsFee.toLocaleString('es-CO')})</span></div>}
                {addonsTotal > 0 && <div className="flex justify-between"><span className="text-slate-500">Servicios Adicionales:</span><span className="font-bold text-slate-900">+${addonsTotal.toLocaleString('es-CO')}</span></div>}
                {effectiveDiscountPercent > 0 && <div className="flex justify-between text-emerald-700"><span className="font-medium">Descuento {isWeekday ? 'Entre Semana (Automático)' : 'Promocional'} ({effectiveDiscountPercent}%):</span><span className="font-bold">-${discountAmount.toLocaleString('es-CO')}</span></div>}
                <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total Final:</span>
                  <span className="text-emerald-700">${totalAmount.toLocaleString('es-CO')} COP</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {step > 1 && step < 8 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : <div />}

          <div className="w-full sm:w-auto flex justify-end">
            {step < 7 && (
              <button
                onClick={() => {
                  if (step === 2 && !validateStep2()) return;
                  if (step === 3 && !selectedDomeId) {
                    setErrorMsg("Por favor selecciona un domo disponible.");
                    return;
                  }
                  setStep(prev => prev + 1);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 flex items-center justify-center space-x-2 text-sm shadow-md shadow-emerald-600/20"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 7 && (
              <button
                onClick={handleConfirmBooking}
                disabled={submitting}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-700/30 flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-50"
              >
                <span>{submitting ? 'Confirmando Reserva...' : `Confirmar Reserva ($${totalAmount.toLocaleString('es-CO')} COP)`}</span>
                <ShieldCheck className="w-5 h-5 shrink-0" />
              </button>
            )}

            {step === 8 && (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 text-sm"
              >
                Cerrar y Volver al Inicio
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
