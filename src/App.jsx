import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, Calendar, CheckCircle, XCircle, 
  LogOut, Building, PlusCircle, AlertTriangle, 
  ArrowLeft, Lock, Mail, Loader, X, CreditCard,
  Filter, ChevronDown, Bug, UserPlus, Edit, Trash2,
  ChevronLeft, ChevronRight, Clock, Check, Search
} from 'lucide-react';

import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
const SUPABASE_URL = 'https://tgnmkxmdqfzmmqcexcvy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbm1reG1kcWZ6bW1xY2V4Y3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Mjg0NjYsImV4cCI6MjA3OTUwNDQ2Nn0.jJCpRarh4R2vh3HgbOGC2_92Ssqddam5tf6kiB6Wrsw';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- CONFIGURACIÓN DE MARCA ---
const BRAND_COLOR = '#9e6a81'; 
const BRAND_NAME = 'CIMASUR';
const LOGO_URL = "LOGO-01.png"; 

// --- Perfiles de Acceso Rápido ---
const QUICK_LOGIN_USERS = [
  { id: 1, role_label: 'Administrador', email: 'admin@cimasur.com', icon_color: BRAND_COLOR, description: 'Control total' },
  { id: 2, role_label: 'Mesa Directiva', email: 'mesa@cimasur.com', icon_color: '#059669', description: 'Visor global' }, 
  { id: 3, role_label: 'Propietario / Residente', email: 'vecino@cimasur.com', icon_color: '#475569', description: 'Pagos y reservas' },
];

// --- COMPONENTE DE CALENDARIO ---
const BookingCalendar = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayBookings, setDayBookings] = useState([]);

  // Generar días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDayClick = (date) => {
    if (!date) return;
    const dateStr = date.toISOString().split('T')[0];
    const bookingsForDay = (bookings || []).filter(b => b.booking_date === dateStr && b.status !== 'rechazado');
    setSelectedDate(date);
    setDayBookings(bookingsForDay);
  };

  const hasBookings = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return (bookings || []).some(b => b.booking_date === dateStr && b.status !== 'rechazado');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendario Visual */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-800 capitalize">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft size={20}/></button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase mb-2">
          <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => (
            <div 
              key={idx} 
              onClick={() => handleDayClick(date)}
              className={`
                h-14 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all relative border
                ${!date ? 'bg-transparent border-transparent cursor-default' : 'hover:border-pink-300'}
                ${selectedDate && date && selectedDate.toDateString() === date.toDateString() ? 'bg-pink-50 border-pink-500' : 'bg-white border-slate-100'}
              `}
            >
              {date && (
                <>
                  <span className={`text-sm ${hasBookings(date) ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                    {date.getDate()}
                  </span>
                  {hasBookings(date) && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1"></span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span> Días con ocupación
        </div>
      </div>

      {/* Detalle del Día */}
      <div className="w-full md:w-80 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">
          {selectedDate ? `Reservas del ${selectedDate.getDate()}` : 'Selecciona un día'}
        </h3>
        
        {!selectedDate ? (
          <p className="text-slate-400 text-sm text-center py-8">Haz clic en un día para ver detalles.</p>
        ) : dayBookings.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto text-emerald-400 mb-2" size={32} />
            <p className="text-slate-500 font-medium">¡Todo libre!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayBookings.map(b => (
              <div key={b.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-700">{b.common_areas?.display_name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${b.status === 'aprobado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {b.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Clock size={12} />
                  {b.start_time ? b.start_time.slice(0,5) : '??'} - {b.end_time ? b.end_time.slice(0,5) : '??'}
                </div>
                {b.profiles && (
                  <p className="text-xs text-slate-400 mt-1 truncate">Por: {b.profiles.full_name}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 1. Pantalla de Login ---
const LoginScreen = ({ onLogin, supabase }) => {
  const [selectedProfile, setSelectedProfile] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    setEmail(profile.email);
    setError(null);
  };

  const handleBack = () => {
    setSelectedProfile(null);
    setPassword('');
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!supabase) {
      setError("Error: Supabase no está inicializado.");
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single(); 

      if (!profileData) throw new Error("Usuario sin perfil asignado.");

      const cleanRole = profileData.role ? profileData.role.trim().toLowerCase() : '';
      const finalProfile = { ...profileData, role: cleanRole };

      onLogin(finalProfile);

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message === "Invalid login credentials" ? "Contraseña incorrecta" : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: BRAND_COLOR }}
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-white/20 transition-all">
        <div className="text-center mb-6">
           <div className="flex justify-center mb-4">
             <img 
               src={LOGO_URL} 
               alt={BRAND_NAME} 
               className="h-20 object-contain"
               onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} 
             />
             <div className="w-20 h-20 rounded-full flex items-center justify-center hidden" style={{ backgroundColor: BRAND_COLOR }}>
               <Building className="text-white w-10 h-10" />
             </div>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-widest" style={{ color: BRAND_COLOR }}>{BRAND_NAME}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {selectedProfile ? 'Ingresa tus credenciales' : 'Selecciona tu perfil'}
          </p>
        </div>

        {!selectedProfile ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {QUICK_LOGIN_USERS.map((user) => (
              <button 
                key={user.id}
                onClick={() => handleProfileSelect(user)}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all group hover:shadow-md bg-white border-transparent hover:border-pink-200"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-full text-white transition-colors shadow-sm"
                    style={{ backgroundColor: user.icon_color }}
                  >
                    <Users size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-700 group-hover:text-pink-900">{user.role_label}</p>
                    <p className="text-xs text-slate-500">{user.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
             <button type="button" onClick={handleBack} className="flex items-center gap-1 text-slate-400 text-sm hover:text-slate-600 mb-2 transition-colors">
              <ArrowLeft size={16} /> Volver a selección
            </button>
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg flex items-center gap-2"><AlertTriangle size={16} /> {error}</div>}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 outline-none bg-slate-50" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoFocus className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300" required />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full text-white font-bold py-3 rounded-lg mt-6 shadow-lg shadow-pink-900/20 transition-transform active:scale-95 flex items-center justify-center gap-2" style={{ backgroundColor: BRAND_COLOR }}>
              {isLoading ? <Loader className="animate-spin" size={20} /> : 'Iniciar Sesión'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- 2. Dashboard Admin (CON FLUJO DE PAGOS Y CALENDARIO) ---
const AdminDashboard = ({ supabase }) => {
  const [tab, setTab] = useState('pagos');
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [residents, setResidents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResidentList, setShowResidentList] = useState(false);
  
  // Filtros
  const TOWERS = ["Boxta", "Matsu", "Argu", "Behui"];
  const [selectedTower, setSelectedTower] = useState('Todas');
  const [selectedApt, setSelectedApt] = useState('Todos');
  
  // Modales
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false); 

  const [newPayment, setNewPayment] = useState({ user_id: '', amount: '', description: '', payment_type: 'mantenimiento', due_date: '' });
  
  // Estado para nuevo/editar usuario
  const [newUser, setNewUser] = useState({ 
    email: '', 
    password: '', 
    full_name: '', 
    role: 'propietario / residente', 
    unit_number: '', 
    tower: 'Boxta' 
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    fetchData();
  }, [supabase]);

  const fetchData = async () => {
    setLoading(true);
    try {
        const { data: payData } = await supabase.from('payments').select('*, profiles(full_name, unit_number, tower, apartment)').order('created_at', { ascending: false });
        if (payData) setPayments(payData);

        const { data: bookData } = await supabase.from('bookings').select('*, profiles(full_name), common_areas(display_name)').order('created_at', { ascending: false });
        if (bookData) setBookings(bookData);

        const { data: resData, error: resError } = await supabase
            .from('profiles')
            .select('*')
            .order('unit_number', { ascending: true });
        
        if (resData) {
            const validResidents = resData.filter(p => 
                p.role && (
                    p.role.toLowerCase().includes('residente') || 
                    p.role.toLowerCase().includes('propietario') ||
                    p.role.toLowerCase().includes('vecino')
                )
            );
            setResidents(validResidents);
        }

    } catch (error) {
        console.error("Error general en fetch:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    if (!newPayment.user_id || !newPayment.amount) return alert("Faltan datos");

    const { error } = await supabase.from('payments').insert([{
      ...newPayment,
      is_paid: false,
      payment_status: 'pendiente' // Estado inicial
    }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setShowPaymentModal(false);
      setNewPayment({ user_id: '', amount: '', description: '', payment_type: 'mantenimiento', due_date: '' });
      fetchData(); 
    }
  };

  const openEditUser = (user) => {
    setNewUser({
      email: user.email,
      password: '', 
      full_name: user.full_name,
      role: user.role,
      unit_number: user.unit_number || '',
      tower: user.tower || 'Boxta'
    });
    setEditingId(user.id);
    setShowUserModal(true);
  };

  const openCreateUser = () => {
    setNewUser({ email: '', password: 'cimasur2025', full_name: '', role: 'propietario / residente', unit_number: '', tower: 'Boxta' });
    setEditingId(null);
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsCreatingUser(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: newUser.full_name,
            role: newUser.role,
            unit_number: newUser.unit_number,
            tower: newUser.tower,
            apartment: newUser.unit_number
          })
          .eq('id', editingId);

        if (error) throw error;
        alert("✅ Usuario actualizado correctamente.");

      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: newUser.email,
          password: newUser.password,
        });
        if (authError) throw authError;
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            email: newUser.email,
            role: newUser.role,
            full_name: newUser.full_name,
            unit_number: newUser.unit_number,
            tower: newUser.tower,
            apartment: newUser.unit_number, 
            created_at: new Date()
          }]);
        if (profileError) throw profileError;
        alert(`✅ Usuario creado.`);
      }

      setShowUserModal(false);
      setEditingId(null);
      fetchData();

    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const approveBooking = async (id) => {
    await supabase.from('bookings').update({ status: 'aprobado' }).eq('id', id);
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'aprobado' } : b));
  };
  
  const rejectBooking = async (id) => {
    await supabase.from('bookings').update({ status: 'rechazado' }).eq('id', id);
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'rechazado' } : b));
  };

  // --- NUEVA FUNCIÓN: APROBAR PAGO ---
  const approvePayment = async (paymentId) => {
    const { error } = await supabase
      .from('payments')
      .update({ 
        is_paid: true, 
        payment_status: 'pagado' 
      })
      .eq('id', paymentId);

    if (error) {
      alert("Error al aprobar pago: " + error.message);
    } else {
      // Actualizar localmente para feedback inmediato
      setPayments(payments.map(p => 
        p.id === paymentId ? { ...p, is_paid: true, payment_status: 'pagado' } : p
      ));
    }
  };

  const filteredPayments = payments.filter(p => {
    const tower = p.profiles?.tower;
    const apt = p.profiles?.apartment || p.profiles?.unit_number; 

    const matchTower = selectedTower === 'Todas' || tower === selectedTower;
    const matchApt = selectedApt === 'Todos' || apt === selectedApt;
    return matchTower && matchApt;
  });

  const availableApartments = [...new Set(payments
    .filter(p => p.profiles?.tower === selectedTower)
    .map(p => p.profiles?.apartment || p.profiles?.unit_number)
    .filter(Boolean) 
  )].sort();

  const totalPending = filteredPayments.filter(p => !p.is_paid).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalCollected = filteredPayments.filter(p => p.is_paid).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const pendingBookings = bookings.filter(b => b.status === 'pendiente').length;

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando datos del sistema...</div>;

  return (
    <div className="space-y-6 relative">
      {/* Botón Nuevo Usuario */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-slate-800">Panel de Administración</h2>
        <button 
          onClick={openCreateUser}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium"
        >
          <UserPlus size={18} /> Nuevo Usuario
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Filter size={20} /> <span className="uppercase text-xs font-bold">Filtrar Vista:</span>
        </div>
        
        <div className="relative w-full md:w-48">
            <select 
                value={selectedTower}
                onChange={(e) => { setSelectedTower(e.target.value); setSelectedApt('Todos'); }}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg outline-none focus:ring-2 focus:ring-pink-200"
            >
                <option value="Todas">Todas las Torres</option>
                {TOWERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative w-full md:w-48">
            <select 
                value={selectedApt}
                onChange={(e) => setSelectedApt(e.target.value)}
                disabled={selectedTower === 'Todas'}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg outline-none focus:ring-2 focus:ring-pink-200 disabled:opacity-50"
            >
                <option value="Todos">Todos los Deptos</option>
                {availableApartments.map(apt => <option key={apt} value={apt}>{apt}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>

        {(selectedTower !== 'Todas' || selectedApt !== 'Todos') && (
            <button onClick={() => { setSelectedTower('Todas'); setSelectedApt('Todos'); }} className="text-xs text-red-500 hover:underline">
                Limpiar
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', label: 'Pagos Pendientes', val: `$${totalPending.toFixed(2)}` },
          { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Recaudado Total', val: `$${totalCollected.toFixed(2)}` },
          { icon: Calendar, color: `text-[${BRAND_COLOR}]`, bg: 'bg-slate-50', label: 'Apartados', val: `${pendingBookings} Pendientes`, isBrand: true }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border-t-4 flex items-center gap-4 relative overflow-hidden"
               style={{ borderColor: item.isBrand ? BRAND_COLOR : 'transparent' }}>
            <div className={`p-4 rounded-full ${item.bg} ${item.color}`} style={item.isBrand ? { color: BRAND_COLOR, backgroundColor: `${BRAND_COLOR}15` } : {}}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-slate-800">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex p-1 bg-slate-200 rounded-lg w-fit mb-6">
        <button onClick={() => setTab('pagos')} className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${tab === 'pagos' ? 'bg-pink-800 text-white' : 'text-slate-500'}`}>Gestión de Pagos</button>
        <button onClick={() => setTab('reservas')} className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${tab === 'reservas' ? 'bg-pink-800 text-white' : 'text-slate-500'}`}>Reservas</button>
        <button onClick={() => setTab('usuarios')} className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${tab === 'usuarios' ? 'bg-pink-800 text-white' : 'text-slate-500'}`}>Usuarios</button>
        <button onClick={() => setTab('calendario')} className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${tab === 'calendario' ? 'bg-pink-800 text-white' : 'text-slate-500'}`}>Calendario</button>
      </div>

      {tab === 'pagos' && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-xl text-slate-800">Registro de Movimientos</h3>
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-white hover:opacity-90 transition" 
              style={{ backgroundColor: BRAND_COLOR }}
            >
              <PlusCircle size={18} /> Nueva Multa / Cargo
            </button>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-100 text-slate-500">
              <tr>
                <th className="px-6 py-4">Unidad</th>
                <th className="px-6 py-4">Concepto</th>
                <th className="px-6 py-4">Monto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700 block">{p.profiles?.unit_number || 'S/N'}</span>
                    <span className="text-xs text-slate-400">{p.profiles?.full_name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{p.description || p.payment_type}</td>
                  <td className="px-6 py-4 font-mono font-medium">${p.amount}</td>
                  <td className="px-6 py-4">
                    {/* Lógica de Estados: Pagado (Verde), En Tránsito (Naranja), Pendiente (Rojo/Gris) */}
                    {p.is_paid ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                        PAGADO
                      </span>
                    ) : p.payment_status === 'en_transito' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-orange-100 text-orange-700 border-orange-200">
                        EN REVISIÓN
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-100 text-slate-600 border-slate-200">
                        PENDIENTE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {/* Botón de Aprobar solo si está en tránsito */}
                    {!p.is_paid && p.payment_status === 'en_transito' && (
                      <button 
                        onClick={() => approvePayment(p.id)}
                        className="flex items-center gap-1 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
                        title="Confirmar recepción del pago"
                      >
                        <Check size={14} /> Aprobar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reservas' && (
        <div className="grid grid-cols-1 gap-4">
           {bookings.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-slate-100 text-slate-500"><Calendar size={24} /></div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{b.common_areas?.display_name}</h4>
                  <p className="text-slate-500 text-sm">{b.profiles?.full_name}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs font-mono text-slate-400">
                    <span>{b.booking_date}</span> • <span>{b.start_time} - {b.end_time}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {b.status === 'pendiente' ? (
                  <>
                    <button onClick={() => approveBooking(b.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle size={20} /></button>
                    <button onClick={() => rejectBooking(b.id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"><XCircle size={20} /></button>
                  </>
                ) : (
                  <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">{b.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'usuarios' && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b bg-slate-50">
            <h3 className="font-bold text-xl text-slate-800">Directorio de Usuarios</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-100 text-slate-500">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Ubicación</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {residents.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700">{r.full_name}</p>
                      <p className="text-xs text-slate-400">{r.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">{r.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      {r.tower} - {r.unit_number}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openEditUser(r)} 
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                        title="Editar Usuario"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- NUEVA PESTAÑA: CALENDARIO --- */}
      {tab === 'calendario' && (
        <div>
          <div className="mb-4">
            <h3 className="font-bold text-xl text-slate-800">Disponibilidad de Áreas</h3>
            <p className="text-sm text-slate-500">Vista global de todas las reservas aprobadas y pendientes.</p>
          </div>
          {/* Aquí usamos el componente nuevo pasándole todas las reservas */}
          <BookingCalendar bookings={bookings} />
        </div>
      )}

      {/* MODAL DE NUEVO PAGO */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-700">Crear Nuevo Cargo / Multa</h3>
                 <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreatePayment} className="p-6 space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Residente</label>
                    
                    {/* Input de Búsqueda */}
                    <div className="relative">
                        <input 
                            type="text"
                            className="w-full border rounded p-2 pl-8 text-sm bg-white focus:ring-2 focus:ring-pink-500 outline-none"
                            placeholder="Buscar por nombre o unidad..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowResidentList(true);
                                // Si borra, limpiamos la selección
                                if(e.target.value === '') setNewPayment({...newPayment, user_id: ''});
                            }}
                            onFocus={() => setShowResidentList(true)}
                        />
                        <Search className="absolute left-2 top-2.5 text-slate-400" size={16} />
                        
                        {/* Botón para limpiar selección si ya se eligió uno */}
                        {newPayment.user_id && (
                            <button 
                                type="button"
                                onClick={() => {
                                    setNewPayment({...newPayment, user_id: ''});
                                    setSearchTerm('');
                                    setShowResidentList(true);
                                }}
                                className="absolute right-2 top-2 text-slate-400 hover:text-red-500"
                            >
                                <X size={16}/>
                            </button>
                        )}
                    </div>

                    {/* Lista Desplegable Filtrada */}
                    {showResidentList && (
                        <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto">
                            {residents
                                .filter(r => 
                                    r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    r.unit_number.toString().includes(searchTerm) ||
                                    r.tower.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map(r => (
                                    <div 
                                        key={r.id}
                                        onClick={() => {
                                            setNewPayment({...newPayment, user_id: r.id});
                                            setSearchTerm(`${r.unit_number} - ${r.full_name}`); // Pone el nombre en el input
                                            setShowResidentList(false); // Cierra la lista
                                        }}
                                        className="p-2 hover:bg-slate-50 cursor-pointer text-sm border-b last:border-0 flex justify-between"
                                    >
                                        <span className="font-bold text-slate-700">{r.unit_number}</span>
                                        <span className="text-slate-600 truncate ml-2">{r.full_name}</span>
                                    </div>
                                ))
                            }
                            {residents.filter(r => r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || r.unit_number.toString().includes(searchTerm)).length === 0 && (
                                <div className="p-3 text-xs text-slate-400 text-center">No se encontraron residentes.</div>
                            )}
                        </div>
                    )}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                      <select 
                        className="w-full border rounded p-2"
                        value={newPayment.payment_type}
                        onChange={e => setNewPayment({...newPayment, payment_type: e.target.value})}
                      >
                         <option value="mantenimiento">Mantenimiento</option>
                         <option value="multa">Multa</option>
                         <option value="fondo_reserva">Fondo de Reserva</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monto ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full border rounded p-2"
                        value={newPayment.amount}
                        onChange={e => setNewPayment({...newPayment, amount: e.target.value})}
                        required
                      />
                   </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                    <input 
                      type="text" 
                      className="w-full border rounded p-2"
                      placeholder="Ej. Multa por ruido excesivo"
                      value={newPayment.description}
                      onChange={e => setNewPayment({...newPayment, description: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Límite</label>
                    <input 
                      type="date" 
                      className="w-full border rounded p-2"
                      value={newPayment.due_date}
                      onChange={e => setNewPayment({...newPayment, due_date: e.target.value})}
                    />
                 </div>
                 <button type="submit" className="w-full text-white font-bold py-3 rounded-lg mt-2" style={{ backgroundColor: BRAND_COLOR }}>
                   Guardar Cargo
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* --- MODAL MAESTRO (CREAR / EDITAR) --- */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    {editingId ? <Edit size={20} className="text-orange-600"/> : <UserPlus size={20} className="text-blue-600"/>}
                    {editingId ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
                 </h3>
                 <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                      <input type="text" required className="w-full border rounded p-2 text-sm" 
                        value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rol</label>
                      <select className="w-full border rounded p-2 text-sm bg-white"
                        value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                        <option value="propietario / residente">Residente</option>
                        <option value="mesa_directiva">Mesa Directiva</option>
                        <option value="admin">Administrador</option>
                      </select>
                   </div>
                 </div>

                 {newUser.role && newUser.role.includes('residente') && (
                   <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Torre</label>
                        <select className="w-full border rounded p-2 text-sm bg-white"
                          value={newUser.tower} onChange={e => setNewUser({...newUser, tower: e.target.value})}>
                          {TOWERS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Depto / Unidad</label>
                        <input type="text" placeholder="Ej: 1101" className="w-full border rounded p-2 text-sm"
                          value={newUser.unit_number} onChange={e => setNewUser({...newUser, unit_number: e.target.value})} />
                     </div>
                   </div>
                 )}

                 <div className={`space-y-3 pt-2 border-t border-slate-100 ${editingId ? 'opacity-50' : ''}`}>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Electrónico {editingId && '(No editable)'}</label>
                      <input type="email" required disabled={!!editingId} className="w-full border rounded p-2 text-sm disabled:bg-slate-100" 
                        value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                   </div>
                   {!editingId && (
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
                        <input type="text" required className="w-full border rounded p-2 font-mono text-sm bg-yellow-50 border-yellow-200 text-yellow-800" 
                          value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                        <p className="text-[10px] text-slate-400 mt-1">Comparte esta contraseña con el usuario.</p>
                     </div>
                   )}
                 </div>

                 <button type="submit" disabled={isCreatingUser} className="w-full text-white font-bold py-3 rounded-lg mt-2 flex justify-center items-center gap-2 shadow-lg hover:opacity-90" style={{ backgroundColor: BRAND_COLOR }}>
                   {isCreatingUser ? <Loader className="animate-spin" size={18}/> : (editingId ? 'Guardar Cambios' : 'Crear Usuario')}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// --- 3. Mesa Directiva ---
const BoardDashboard = ({ supabase }) => {
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    if (!supabase) return;
    const fetch = async () => {
      const { data, error } = await supabase.from('payments').select('*, profiles(full_name, unit_number)').order('created_at', { ascending: false });
      if(data) setPayments(data);
      if(error) console.error("Error cargando auditoría:", error);
    };
    fetch();
  }, [supabase]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="rounded-xl p-8 text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: BRAND_COLOR }}>
         <h2 className="text-2xl font-bold mb-2 relative z-10">Panel de Auditoría</h2>
         <p className="opacity-90 relative z-10">Vista de solo lectura para Mesa Directiva.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-6 py-3">Residente</th>
              <th className="px-6 py-3">Concepto</th>
              <th className="px-6 py-3">Monto</th>
              <th className="px-6 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
               <tr>
                 <td colSpan="4" className="text-center p-10 text-slate-400 italic">No hay registros para auditar aún.</td>
               </tr>
            ) : (
                payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-700">{p.profiles?.full_name || 'Desconocido'} ({p.profiles?.unit_number})</td>
                    <td className="px-6 py-4">{p.description || p.payment_type}</td>
                    <td className="px-6 py-4 font-bold" style={{ color: BRAND_COLOR }}>${p.amount}</td>
                    <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.is_paid ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                        {p.is_paid ? 'PAGADO' : 'PENDIENTE'}
                    </span>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 4. Dashboard Cliente (FLUJO DE PAGOS ACTUALIZADO) ---
const ClientDashboard = ({ user, supabase }) => {
  const [activeTab, setActiveTab] = useState('mis_pagos');
  const [myPayments, setMyPayments] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]); // Nuevas reservas globales para el calendario
  const [areas, setAreas] = useState([]);
  const [loadingPay, setLoadingPay] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentToProcess, setPaymentToProcess] = useState(null);

  // Form states
  const [newBooking, setNewBooking] = useState({ area_id: '', booking_date: '', start_time: '', end_time: '' });

  useEffect(() => {
    if (!supabase || !user) return;
    fetchData();
  }, [user, supabase]);

  const fetchData = async () => {
    // Mis Pagos
    const { data: pays } = await supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (pays) setMyPayments(pays);
    
    // Mis Reservas
    const { data: books } = await supabase.from('bookings').select('*, common_areas(display_name)').eq('user_id', user.id).order('created_at', { ascending: false });
    if (books) setMyBookings(books);

    // --- NUEVO: Descargar TODAS las reservas para el calendario ---
    const { data: allBooks } = await supabase.from('bookings').select('*, common_areas(display_name), profiles(full_name)').neq('status', 'rechazado');
    if (allBooks) setAllBookings(allBooks);

    // Áreas Disponibles
    const { data: areaList } = await supabase.from('common_areas').select('*');
    if (areaList) setAreas(areaList);
  };

  const handleBookingSubmit = async () => {
    if(!newBooking.area_id || !newBooking.booking_date) return alert("Completa los campos");
    
    const { error } = await supabase.from('bookings').insert([{
      user_id: user.id,
      area_id: newBooking.area_id,
      booking_date: newBooking.booking_date,
      start_time: newBooking.start_time,
      end_time: newBooking.end_time,
      status: 'pendiente'
    }]);

    if (!error) {
      alert("Solicitud enviada");
      fetchData(); // Recargar
      setNewBooking({ area_id: '', booking_date: '', start_time: '', end_time: '' });
    } else {
      alert("Error al reservar: " + error.message);
    }
  };

  // Abre el modal en lugar de usar confirm()
  const openPayModal = (payment) => {
    setPaymentToProcess(payment);
    setPayModalOpen(true);
  };

  // Procesa el pago (SOLICITA REVISIÓN)
  const confirmPayment = async () => {
    setLoadingPay(true);
    // Simulación de delay de pasarela de pago
    setTimeout(async () => {
      // ⚠️ CAMBIO CLAVE: NO ponemos is_paid: true directo.
      // Cambiamos el status a 'en_transito' para que el admin lo revise.
      const { error } = await supabase.from('payments').update({
        // is_paid: true, <--- YA NO SE PONE PAGADO DIRECTAMENTE
        payment_status: 'en_transito',
        paid_at: new Date().toISOString()
      }).eq('id', paymentToProcess.id);

      setLoadingPay(false);
      setPayModalOpen(false);

      if (error) {
        alert("Error en el sistema: " + error.message);
      } else {
        alert("¡Pago enviado! Está en revisión por la administración.");
        fetchData();
      }
    }, 1500);
  };

  const payAmount = myPayments.filter(p => !p.is_paid).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="space-y-8 relative">
       {/* Menú de Tarjetas Grandes */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => setActiveTab('mis_pagos')}
            className={`p-6 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${activeTab === 'mis_pagos' ? 'shadow-lg' : 'hover:border-slate-300 bg-white border-slate-100'}`}
            style={activeTab === 'mis_pagos' ? { borderColor: BRAND_COLOR, backgroundColor: 'white' } : {}}
          >
            <div className="relative z-10 flex items-center gap-4">
              <div className={`p-4 rounded-full transition-colors ${activeTab === 'mis_pagos' ? 'text-white' : 'bg-slate-100 text-slate-500'}`} style={activeTab === 'mis_pagos' ? { backgroundColor: BRAND_COLOR } : {}}>
                <DollarSign size={24}/>
              </div>
              <div>
                 <h3 className="font-bold text-lg text-slate-800">Mis Adeudos</h3>
                 <p className="text-sm text-slate-400">Estado de cuenta</p>
              </div>
            </div>
          </button>

          <button 
             onClick={() => setActiveTab('reservar')}
             className={`p-6 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${activeTab === 'reservar' ? 'shadow-lg' : 'hover:border-slate-300 bg-white border-slate-100'}`}
             style={activeTab === 'reservar' ? { borderColor: BRAND_COLOR, backgroundColor: 'white' } : {}}
          >
            <div className="relative z-10 flex items-center gap-4">
               <div className={`p-4 rounded-full transition-colors ${activeTab === 'reservar' ? 'text-white' : 'bg-slate-100 text-slate-500'}`} style={activeTab === 'reservar' ? { backgroundColor: BRAND_COLOR } : {}}>
                <Calendar size={24}/>
              </div>
              <div>
                 <h3 className="font-bold text-lg text-slate-800">Reservar Áreas</h3>
                 <p className="text-sm text-slate-400">Palapa, tenis y salón</p>
              </div>
            </div>
          </button>
       </div>

       {activeTab === 'mis_pagos' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
           <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Estado de Cuenta</h3>
                <p className="text-slate-500 text-sm">Unidad: {user.unit_number}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase font-bold">Total a Pagar</p>
                <p className="text-2xl font-bold" style={{ color: BRAND_COLOR }}>${payAmount.toFixed(2)}</p>
              </div>
           </div>

           {myPayments.length > 0 ? (
             <div className="grid gap-4">
               {myPayments.map(p => (
                 <div key={p.id} className="flex items-center justify-between p-5 border border-slate-100 rounded-xl hover:shadow-md transition-shadow bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      {/* Indicador Visual de Estado */}
                      <div className={`w-2 h-12 rounded-full ${
                          p.is_paid ? 'bg-emerald-400' : 
                          p.payment_status === 'en_transito' ? 'bg-orange-400' : 'bg-amber-400'
                      }`}></div>
                      
                      <div>
                        <p className="font-bold text-slate-700">{p.description || p.payment_type}</p>
                        <p className="text-sm text-slate-400">{p.due_date ? `Vence: ${p.due_date}` : 'Sin fecha límite'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-lg text-slate-700">${p.amount}</span>
                      
                      {/* LÓGICA DE BOTONES SEGÚN ESTADO */}
                      {p.is_paid ? (
                        <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                          <CheckCircle size={16}/> Pagado
                        </span>
                      ) : p.payment_status === 'en_transito' ? (
                        <span className="flex items-center gap-2 text-orange-600 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                          <Clock size={16}/> En Revisión
                        </span>
                      ) : (
                        <button 
                          onClick={() => openPayModal(p)}
                          className="text-white text-sm px-6 py-2 rounded-lg font-medium shadow-lg hover:opacity-90 disabled:opacity-50" 
                          style={{ backgroundColor: BRAND_COLOR }}
                        >
                          Pagar
                        </button>
                      )}
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <p className="text-slate-500 italic text-center py-10">¡Todo al día! No tienes pagos registrados.</p>
           )}
         </div>
       )}

       {activeTab === 'reservar' && (
         <div className="space-y-8">
            {/* NUEVO: CALENDARIO DE DISPONIBILIDAD PARA RESIDENTES */}
            <div>
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Calendar size={20}/> Disponibilidad Actual</h3>
              <p className="text-sm text-slate-500 mb-4">Revisa el calendario para ver horarios ocupados antes de solicitar.</p>
              <BookingCalendar bookings={allBookings} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border-t-4 p-6 h-fit" style={{ borderColor: BRAND_COLOR }}>
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <PlusCircle size={20} style={{ color: BRAND_COLOR }}/> Nueva Solicitud
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Área Común</label>
                      <select 
                        className="w-full border-slate-200 rounded-lg p-2.5 text-slate-700"
                        onChange={(e) => setNewBooking({...newBooking, area_id: e.target.value})}
                        value={newBooking.area_id}
                      >
                        <option value="">Seleccionar...</option>
                        {areas.map(a => <option key={a.id} value={a.id}>{a.display_name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                      <input type="date" className="w-full border-slate-200 rounded-lg p-2.5 text-slate-700" 
                        onChange={(e) => setNewBooking({...newBooking, booking_date: e.target.value})}
                        value={newBooking.booking_date}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Inicio</label>
                        <input type="time" className="w-full border-slate-200 rounded-lg p-2.5 text-slate-700" 
                          onChange={(e) => setNewBooking({...newBooking, start_time: e.target.value})}
                          value={newBooking.start_time}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fin</label>
                        <input type="time" className="w-full border-slate-200 rounded-lg p-2.5 text-slate-700" 
                          onChange={(e) => setNewBooking({...newBooking, end_time: e.target.value})}
                          value={newBooking.end_time}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleBookingSubmit}
                      className="w-full text-white font-bold py-3 rounded-lg mt-4 shadow-lg transition-transform active:scale-95"
                      style={{ backgroundColor: BRAND_COLOR }}
                    >
                      Confirmar Solicitud
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-bold text-slate-700 mb-2">Historial de Mis Reservas</h3>
                  {myBookings.map(b => (
                    <div key={b.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg text-slate-400">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{b.common_areas?.display_name}</h4>
                          <p className="text-sm text-slate-500">{b.booking_date} | {b.start_time}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status === 'aprobado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {b.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
            </div>
         </div>
       )}

       {/* MODAL DE CONFIRMACIÓN DE PAGO */}
       {payModalOpen && paymentToProcess && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-50 p-6 border-b flex justify-between items-start">
                  <div>
                     <h3 className="text-lg font-bold text-slate-800">Confirmar Pago</h3>
                     <p className="text-sm text-slate-500">Pasarela de pago segura</p>
                  </div>
                  <button onClick={() => setPayModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-6">
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="bg-white p-2 rounded shadow-sm">
                            <DollarSign className="text-emerald-600" size={24} />
                         </div>
                         <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Total a pagar</p>
                            <p className="text-xl font-bold text-slate-800">${paymentToProcess.amount}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase">Detalles de Tarjeta (Simulado)</label>
                      <div className="border rounded-lg p-3 flex items-center gap-3">
                         <CreditCard className="text-slate-400" />
                         <input type="text" placeholder="0000 0000 0000 0000" className="w-full outline-none text-slate-600 font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <input type="text" placeholder="MM/YY" className="border rounded-lg p-3 outline-none text-slate-600 text-center" />
                         <input type="text" placeholder="CVC" className="border rounded-lg p-3 outline-none text-slate-600 text-center" />
                      </div>
                   </div>

                   <button 
                      onClick={confirmPayment}
                      disabled={loadingPay}
                      className="w-full text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-900/10 transition-transform active:scale-95 flex items-center justify-center gap-2"
                      style={{ backgroundColor: BRAND_COLOR }}
                   >
                      {loadingPay ? <Loader className="animate-spin" /> : 'Confirmar y Pagar'}
                   </button>
                   
                   <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                      <Lock size={12} /> Transacción encriptada de extremo a extremo
                   </p>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};


// --- APP PRINCIPAL ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  if (!currentUser) return <LoginScreen onLogin={setCurrentUser} supabase={supabase} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="shadow-lg sticky top-0 z-50" style={{ backgroundColor: BRAND_COLOR }}>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="bg-white p-2 rounded-lg shadow-sm h-12 w-auto flex items-center">
                <img 
                 src={LOGO_URL} alt="Logo" className="h-full w-auto object-contain"
                 onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                />
                <Building className="text-pink-900 w-6 h-6 hidden" />
             </div>
             <div className="hidden md:block">
               <span className="font-bold text-white text-lg tracking-wide block leading-tight">{BRAND_NAME}</span>
               <span className="text-pink-100 text-xs font-light">Panel de Administración</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right hidden md:block">
               <p className="text-sm font-bold text-white">{currentUser.full_name}</p>
               <p className="text-xs text-pink-200 uppercase">
                 {currentUser.role === 'mesa_directiva' ? 'Mesa Directiva' : currentUser.role}
               </p>
             </div>
             <button onClick={handleLogout} className="text-pink-100 hover:text-white hover:bg-white/10 p-2 rounded-full">
               <LogOut size={22} />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        {currentUser.role && currentUser.role.trim().toLowerCase() === 'admin' && <AdminDashboard supabase={supabase} />}
        {currentUser.role && currentUser.role.trim().toLowerCase() === 'mesa_directiva' && <BoardDashboard supabase={supabase} />}
        {currentUser.role && currentUser.role.trim().toLowerCase() === 'propietario / residente' && <ClientDashboard user={currentUser} supabase={supabase} />}

        {/* --- PROTECCIÓN CONTRA ROLES DESCONOCIDOS (EVITA PANTALLA BLANCA) --- */}
        {!['admin', 'mesa_directiva', 'propietario / residente'].includes(currentUser.role ? currentUser.role.trim().toLowerCase() : '') && (
            <div className="flex flex-col items-center justify-center h-96 text-center animate-in zoom-in duration-500">
                <div className="bg-slate-100 p-8 rounded-full mb-6">
                    <Bug size={64} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Acceso Restringido o Rol Desconocido</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    Tu usuario <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-yellow-800 font-bold">{currentUser.email}</span> tiene el rol: 
                    <br/><br/>
                    <span className="font-mono bg-red-100 text-red-800 px-4 py-2 rounded-lg border border-red-200 text-lg font-bold">"{currentUser.role}"</span>
                </p>
                <p className="text-slate-400 text-sm mt-6">Contacta al administrador para que corrija tu perfil en la base de datos.</p>
                <button onClick={handleLogout} className="mt-8 text-blue-600 hover:underline">Cerrar Sesión</button>
            </div>
        )}
      </main>
      
      {/* DEBUG BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-black/80 text-white text-xs p-1 text-center z-50">
        DEBUG: Rol detectado = "{currentUser.role}" | Email = {currentUser.email}
      </div>
    </div>
  );
}