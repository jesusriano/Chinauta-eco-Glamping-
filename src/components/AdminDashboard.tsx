import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CalendarDays, BedDouble, Users, DollarSign, 
  FileText, Shield, Settings, LogOut, Search, Plus, CheckCircle2, 
  XCircle, AlertCircle, Clock, TrendingUp, BarChart3, ChevronRight, Filter, Download, Camera, Utensils
} from 'lucide-react';
import { CHINAUTA_MENU_ITEMS } from './FoodMenuSection';
import { ImageCarousel } from './ImageCarousel';
import { getDomeImages } from '../utils/domeImages';
import { AdminUser, Reservation, Dome, Customer, Payment, MaintenanceBlock, AuditLog } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [metrics, setMetrics] = useState<any>(null);
  const [domes, setDomes] = useState<Dome[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceBlock[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [finances, setFinances] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedResIdForPayment, setSelectedResIdForPayment] = useState<number | null>(null);

  // New reservation form state
  const [newResDomeId, setNewResDomeId] = useState<number>(1);
  const [newResCheckIn, setNewResCheckIn] = useState('');
  const [newResCheckOut, setNewResCheckOut] = useState('');
  const [newResGuests, setNewResGuests] = useState(2);
  const [newResName, setNewResName] = useState('');
  const [newResPhone, setNewResPhone] = useState('');
  const [newResEmail, setNewResEmail] = useState('');
  const [newResAmount, setNewResAmount] = useState(380000);

  // Maintenance form state
  const [maintDomeId, setMaintDomeId] = useState(1);
  const [maintStart, setMaintStart] = useState('');
  const [maintEnd, setMaintEnd] = useState('');
  const [maintReason, setMaintReason] = useState('Mantenimiento preventivo');

  // Payment form state
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState('Transferencia Bancaria');

  useEffect(() => {
    loadAllData();
  }, [activeMenu]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [mRes, dRes, rRes, cRes, pRes, mnRes, aRes, fRes, sRes, uRes] = await Promise.all([
        fetch('/api/dashboard/metrics').then(r => r.json()),
        fetch('/api/domes').then(r => r.json()),
        fetch('/api/reservations').then(r => r.json()),
        fetch('/api/customers').then(r => r.json()),
        fetch('/api/payments').then(r => r.json()),
        fetch('/api/maintenance').then(r => r.json()),
        fetch('/api/audit').then(r => r.json()),
        fetch('/api/finances/summary').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/users').then(r => r.json())
      ]);

      if (mRes) setMetrics(mRes);
      if (Array.isArray(dRes)) setDomes(dRes);
      if (Array.isArray(rRes)) setReservations(rRes);
      if (Array.isArray(cRes)) setCustomers(cRes);
      if (Array.isArray(pRes)) setPayments(pRes);
      if (Array.isArray(mnRes)) setMaintenance(mnRes);
      if (Array.isArray(aRes)) setAuditLogs(aRes);
      if (fRes) setFinances(fRes);
      if (sRes) setSettings(sRes);
      if (Array.isArray(uRes)) setUsersList(uRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, user_name: user.full_name })
      });
      loadAllData();
    } catch (err) {
      alert("Error al actualizar estado");
    }
  };

  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dome_id: maintDomeId,
          start_date: maintStart,
          end_date: maintEnd,
          reason: maintReason,
          user_name: user.full_name
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowMaintenanceModal(false);
      loadAllData();
      alert("Bloqueo de mantenimiento creado exitosamente.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResIdForPayment) return;
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservation_id: selectedResIdForPayment,
          amount: payAmount,
          method: payMethod,
          user_name: user.full_name
        })
      });
      if (!res.ok) throw new Error("Error registrando pago");

      setShowPaymentModal(false);
      setSelectedResIdForPayment(null);
      loadAllData();
      alert("Pago registrado exitosamente.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateDomeImage = async (domeId: number, newUrl: string) => {
    try {
      const domeToUpdate = domes.find(d => d.id === domeId);
      if (!domeToUpdate) return;
      const res = await fetch(`/api/domes/${domeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...domeToUpdate,
          image_url: newUrl,
          user_name: user.full_name
        })
      });
      if (!res.ok) throw new Error("Error al actualizar la imagen");
      loadAllData();
      alert("¡Imagen del domo actualizada exitosamente!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateDomeGallery = async (domeId: number, newImages: string[]) => {
    try {
      const domeToUpdate = domes.find(d => d.id === domeId);
      if (!domeToUpdate) return;
      const res = await fetch(`/api/domes/${domeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...domeToUpdate,
          image_url: newImages[0] || domeToUpdate.image_url,
          images: newImages,
          user_name: user.full_name
        })
      });
      if (!res.ok) throw new Error("Error al actualizar las fotos");
      loadAllData();
      alert("¡Galería de fotos del domo actualizada exitosamente!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              EGC
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Panel Administrativo</h2>
              <p className="text-xs text-emerald-400 font-medium">Eco Glamping Chinauta</p>
            </div>
          </div>

          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveMenu('reservations')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'reservations' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <FileText className="w-5 h-5" />
              <span>Reservas</span>
            </button>

            <button
              onClick={() => setActiveMenu('calendar')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'calendar' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <CalendarDays className="w-5 h-5" />
              <span>Calendario Operativo</span>
            </button>

            <button
              onClick={() => setActiveMenu('domes')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'domes' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <BedDouble className="w-5 h-5" />
              <span>Estado de Domos</span>
            </button>

            <button
              onClick={() => setActiveMenu('customers')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'customers' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <Users className="w-5 h-5" />
              <span>Clientes CRM</span>
            </button>

            <button
              onClick={() => setActiveMenu('finances')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'finances' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Finanzas y Pagos</span>
            </button>

            <button
              onClick={() => setActiveMenu('audit')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'audit' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <Shield className="w-5 h-5" />
              <span>Auditoría</span>
            </button>

            {user.role === 'SUPERADMIN' && (
              <button
                onClick={() => setActiveMenu('users')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
              >
                <Users className="w-5 h-5" />
                <span>Administradores</span>
              </button>
            )}

            <button
              onClick={() => setActiveMenu('images')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'images' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <Camera className="w-5 h-5" />
              <span>Gestión de Imágenes</span>
            </button>

            <button
              onClick={() => setActiveMenu('restaurant')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'restaurant' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <Utensils className="w-5 h-5 text-emerald-400" />
              <span>Restaurante / Menú</span>
            </button>

            <button
              onClick={() => setActiveMenu('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
            >
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-white">{user.full_name}</p>
              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 mt-1">
                {user.role}
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              {activeMenu === 'dashboard' ? 'Dashboard General' :
               activeMenu === 'reservations' ? 'Gestión de Reservas' :
               activeMenu === 'calendar' ? 'Calendario Operativo' :
               activeMenu === 'domes' ? 'Estado de los Domos y Mantenimiento' :
               activeMenu === 'customers' ? 'Clientes CRM' :
               activeMenu === 'finances' ? 'Finanzas y Pagos' :
               activeMenu === 'audit' ? 'Registro de Auditoría' :
               activeMenu === 'users' ? 'Gestión de Administradores' : 'Configuración General'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Sistema Integrado de Operación • Zona Horaria: America/Bogota</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMaintenanceModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Bloquear Mantenimiento</span>
            </button>
          </div>
        </div>

        {/* 1. DASHBOARD VIEW */}
        {activeMenu === 'dashboard' && metrics && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Reservas Hoy</p>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-3xl font-bold text-slate-900">{metrics.reservationsToday}</h3>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Activo</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Check-ins Hoy</p>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-3xl font-bold text-slate-900">{metrics.checkInsToday}</h3>
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">Llegadas</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Domos Ocupados / Total</p>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-3xl font-bold text-slate-900">{metrics.occupiedDomes} / {metrics.activeDomesList?.length || 6}</h3>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    {Math.round((metrics.occupiedDomes / 6) * 100)}% Ocupación
                  </span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Ingresos del Mes</p>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-emerald-700">
                    ${finances?.monthRevenue?.toLocaleString('es-CO')}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">COP</span>
                </div>
              </div>
            </div>

            {/* Financial Chart */}
            {finances && finances.dailyChart && (
              <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Ingresos Recientes (Últimos 7 días)</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={finances.dailyChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip formatter={(val: any) => [`$${Number(val).toLocaleString('es-CO')} COP`, 'Ingresos']} />
                      <Area type="monotone" dataKey="total" stroke="#059669" fill="#10b981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. RESERVATIONS VIEW */}
        {activeMenu === 'reservations' && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Listado General de Reservas ({reservations.length})</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
                      <th className="p-4">Código</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Domo</th>
                      <th className="p-4">Fechas</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Pago</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {reservations.map(resv => (
                      <tr key={resv.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-emerald-700">{resv.reservation_code}</td>
                        <td className="p-4 font-medium text-slate-900">
                          {resv.customer_name}
                          <div className="text-xs text-slate-500">{resv.customer_phone}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-800">{resv.dome_name}</td>
                        <td className="p-4 text-xs text-slate-600">{resv.check_in} al {resv.check_out}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            resv.status === 'Confirmada' || resv.status === 'Hospedado' ? 'bg-emerald-100 text-emerald-800' :
                            resv.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {resv.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs font-bold ${resv.payment_status === 'Pagado' ? 'text-emerald-700' : 'text-amber-600'}`}>
                            {resv.payment_status} (${resv.amount_pending?.toLocaleString('es-CO')} pend.)
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-900">${resv.total_amount?.toLocaleString('es-CO')}</td>
                        <td className="p-4 text-right space-x-2">
                          <select
                            value={resv.status}
                            onChange={e => handleUpdateStatus(resv.id, e.target.value)}
                            className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Confirmada">Confirmada</option>
                            <option value="Hospedado">Hospedado</option>
                            <option value="Check-out">Check-out</option>
                            <option value="Cancelada">Cancelada</option>
                          </select>
                          <button
                            onClick={() => {
                              setSelectedResIdForPayment(resv.id);
                              setPayAmount(resv.amount_pending || resv.total_amount);
                              setShowPaymentModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                          >
                            Abonar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. CALENDAR OPERATIVO */}
        {activeMenu === 'calendar' && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Calendario Operativo & Property Management</h3>
            <p className="text-sm text-slate-600">Visualización de reservas actuales y distribución de ocupación por domo.</p>
            
            <div className="space-y-4 pt-4">
              {domes.map(dome => {
                const domeResvs = reservations.filter(r => r.dome_id === dome.id && r.status !== 'Cancelada');
                return (
                  <div key={dome.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <img src={dome.image_url} alt={dome.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900">{dome.name} ({dome.code})</h4>
                        <p className="text-xs text-slate-500">Estado: <span className="font-semibold text-emerald-700">{dome.status}</span></p>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-wrap gap-2">
                      {domeResvs.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Sin reservas programadas recientemente</span>
                      ) : (
                        domeResvs.map(r => (
                          <div key={r.id} className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                            <strong>{r.reservation_code}</strong>: {r.check_in} al {r.check_out} ({r.status})
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. DOMES VIEW */}
        {activeMenu === 'domes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domes.map(dome => (
                <div key={dome.id} className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <ImageCarousel
                      images={getDomeImages(dome)}
                      alt={dome.name}
                      className="h-48"
                      overlayBadge={
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                          {dome.status}
                        </span>
                      }
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{dome.name}</h4>
                    <p className="text-xs text-slate-500">{dome.code} • ${dome.price_per_night?.toLocaleString('es-CO')} / noche</p>
                    <p className="text-xs text-slate-600 mt-2">{dome.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Bloqueos de Mantenimiento Activos</h3>
              <div className="space-y-2">
                {maintenance.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay bloqueos de mantenimiento registrados.</p>
                ) : (
                  maintenance.map(m => (
                    <div key={m.id} className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm flex justify-between items-center">
                      <div>
                        <strong>{m.dome_name}</strong>: Del {m.start_date} al {m.end_date} - Motivo: {m.reason}
                      </div>
                      <span className="text-xs text-amber-800 font-bold">Bloqueado</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. CUSTOMERS CRM */}
        {activeMenu === 'customers' && (
          <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Base de Datos de Clientes ({customers.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Teléfono / WhatsApp</th>
                    <th className="p-4">Correo</th>
                    <th className="p-4">Total Reservas</th>
                    <th className="p-4">Total Gastado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{c.name}</td>
                      <td className="p-4 text-slate-600">{c.whatsapp || c.phone}</td>
                      <td className="p-4 text-slate-600">{c.email}</td>
                      <td className="p-4 font-semibold text-slate-800">{c.total_reservations}</td>
                      <td className="p-4 font-bold text-emerald-700">${c.total_spent?.toLocaleString('es-CO')} COP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. FINANCES */}
        {activeMenu === 'finances' && finances && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Reservado</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">${finances.totalBooked?.toLocaleString('es-CO')}</h3>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Cobrado</p>
                <h3 className="text-2xl font-bold text-emerald-700 mt-1">${finances.totalCollected?.toLocaleString('es-CO')}</h3>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase">Saldo Pendiente</p>
                <h3 className="text-2xl font-bold text-amber-600 mt-1">${finances.totalPending?.toLocaleString('es-CO')}</h3>
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Historial de Pagos Recibidos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
                      <th className="p-4">Reserva</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Monto</th>
                      <th className="p-4">Método</th>
                      <th className="p-4">Registrado por</th>
                      <th className="p-4">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-emerald-700">{p.reservation_code}</td>
                        <td className="p-4 font-medium text-slate-900">{p.customer_name}</td>
                        <td className="p-4 font-bold text-slate-900">${p.amount?.toLocaleString('es-CO')} COP</td>
                        <td className="p-4 text-slate-600">{p.method}</td>
                        <td className="p-4 text-xs text-slate-500">{p.recorded_by}</td>
                        <td className="p-4 text-xs text-slate-500">{p.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. AUDIT */}
        {activeMenu === 'audit' && (
          <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Registro de Auditoría y Trazabilidad</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
                    <th className="p-4">Fecha / Hora</th>
                    <th className="p-4">Administrador</th>
                    <th className="p-4">Acción</th>
                    <th className="p-4">Objetivo</th>
                    <th className="p-4">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-4 text-xs text-slate-500 font-mono">{log.timestamp}</td>
                      <td className="p-4 font-bold text-slate-900">{log.user_name}</td>
                      <td className="p-4"><span className="px-2 py-1 rounded bg-slate-100 font-mono text-xs font-bold text-slate-700">{log.action}</span></td>
                      <td className="p-4 text-slate-600">{log.target_type} (#{log.target_id})</td>
                      <td className="p-4 text-slate-600 text-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. USERS */}
        {activeMenu === 'users' && user.role === 'SUPERADMIN' && (
          <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Gestión de Administradores ({usersList.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
                    <th className="p-4">Usuario</th>
                    <th className="p-4">Nombre Completo</th>
                    <th className="p-4">Correo</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-slate-800">{u.username}</td>
                      <td className="p-4 font-bold text-slate-900">{u.full_name}</td>
                      <td className="p-4 text-slate-600">{u.email}</td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">{u.role}</span></td>
                      <td className="p-4 text-xs font-semibold text-emerald-600">{u.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. IMAGES MANAGEMENT */}
        {activeMenu === 'images' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="text-xl font-bold text-slate-900">📸 Gestión Sencilla de Imágenes</h3>
              <p className="text-sm text-slate-600">
                Cambia la foto de cualquier domo de forma inmediata pegando una nueva URL de imagen, seleccionando una de nuestras opciones preestablecidas o subiendo un archivo desde tu computador.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domes.map(dome => (
                <div key={dome.id} className="glass-card p-5 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between bg-white shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{dome.name}</h4>
                      <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {dome.code}
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-slate-200">
                      <ImageCarousel
                        images={getDomeImages(dome)}
                        alt={dome.name}
                        className="h-44"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">URL de la Imagen</label>
                      <input
                        type="text"
                        defaultValue={dome.image_url}
                        id={`dome-img-input-${dome.id}`}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex space-x-2">
                      <label className="flex-1 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl text-center transition-colors">
                        📁 Subir archivo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const localUrl = URL.createObjectURL(file);
                              const inputEl = document.getElementById(`dome-img-input-${dome.id}`) as HTMLInputElement;
                              if (inputEl) inputEl.value = localUrl;
                              handleUpdateDomeImage(dome.id, localUrl);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      
                      <button
                        onClick={() => {
                          const inputEl = document.getElementById(`dome-img-input-${dome.id}`) as HTMLInputElement;
                          if (inputEl) {
                            handleUpdateDomeImage(dome.id, inputEl.value);
                          }
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors shadow-sm"
                      >
                        💾 Guardar
                      </button>
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          const url = "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80";
                          const inputEl = document.getElementById(`dome-img-input-${dome.id}`) as HTMLInputElement;
                          if (inputEl) inputEl.value = url;
                          handleUpdateDomeImage(dome.id, url);
                        }}
                        className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded-lg flex-1"
                      >
                        ✨ Jacuzzi
                      </button>
                      <button
                        onClick={() => {
                          const url = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80";
                          const inputEl = document.getElementById(`dome-img-input-${dome.id}`) as HTMLInputElement;
                          if (inputEl) inputEl.value = url;
                          handleUpdateDomeImage(dome.id, url);
                        }}
                        className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded-lg flex-1"
                      >
                        🌙 Cúpula
                      </button>
                      <button
                        onClick={() => {
                          const url = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80";
                          const inputEl = document.getElementById(`dome-img-input-${dome.id}`) as HTMLInputElement;
                          if (inputEl) inputEl.value = url;
                          handleUpdateDomeImage(dome.id, url);
                        }}
                        className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded-lg flex-1"
                      >
                        🌲 Bosque
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESTAURANTE / MENÚ DE COMIDAS */}
        {activeMenu === 'restaurant' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Gestión de Menú Chinauta Eco Glamping</h3>
                  <p className="text-xs text-slate-500">Configuración de platos, precios y acompañamientos para cenas y almuerzos.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  5 Platos Activos
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {CHINAUTA_MENU_ITEMS.map((item: any) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="relative h-40 rounded-xl overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        #{item.item_number} {item.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                      <div><strong className="text-slate-700">Preparaciones:</strong> {item.preparations.join(', ')}</div>
                      <div><strong className="text-slate-700">Acompañamientos:</strong> {item.sides.join(' + ')}</div>
                      <div><strong className="text-slate-700">Bebida:</strong> {item.beverage}</div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-500 font-medium">Precio al público:</span>
                      <span className="text-sm font-black text-emerald-700">${item.price.toLocaleString('es-CO')} COP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. SETTINGS */}
        {activeMenu === 'settings' && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">Configuración General del Glamping</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nombre del Negocio</label>
                <input
                  type="text"
                  value={settings.glamping_name || 'Eco Glamping Chinauta'}
                  onChange={e => setSettings({...settings, glamping_name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">WhatsApp de Contacto</label>
                <input
                  type="text"
                  value={settings.whatsapp || ''}
                  onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Correo Electrónico</label>
                <input
                  type="text"
                  value={settings.email || ''}
                  onChange={e => setSettings({...settings, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>
              <button
                onClick={async () => {
                  await fetch('/api/settings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settings)
                  });
                  alert("Configuración guardada correctamente.");
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 bg-white space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Bloquear Domo por Mantenimiento</h3>
            <form onSubmit={handleCreateMaintenance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Seleccionar Domo</label>
                <select
                  value={maintDomeId}
                  onChange={e => setMaintDomeId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {domes.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  value={maintStart}
                  onChange={e => setMaintStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Fecha Fin</label>
                <input
                  type="date"
                  value={maintEnd}
                  onChange={e => setMaintEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Motivo</label>
                <input
                  type="text"
                  value={maintReason}
                  onChange={e => setMaintReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMaintenanceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                >
                  Bloquear Domo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 bg-white space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Registrar Abono o Pago</h3>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Monto a Abonar (COP)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Método de Pago</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Wompi">Wompi</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Datáfono">Datáfono</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                >
                  Registrar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
