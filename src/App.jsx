import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  Calendar, 
  Users, 
  Settings, 
  DollarSign, 
  ShoppingBag, 
  MessageSquare, 
  ChevronRight, 
  Star, 
  Clock, 
  Scissors, 
  TrendingUp, 
  Plus, 
  User, 
  Menu, 
  X,
  CheckCircle,
  Award,
  Smartphone,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  Search,
  Filter,
  CreditCard,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Instagram,
  Gift,
  History,
  Bell,
  Moon,
  Sun,
  Lock,
  Unlock,
  Briefcase,
  ShoppingCart,
  Receipt,
  Trash2,
  Heart,
  MessageCircle,
  Megaphone,
  MonitorPlay,
  Upload,
  Video,
  ShieldAlert,
  Key,
  ShieldCheck,
  Music,
  Tv,
  Shield,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';

// --- FIREBASE INITIALIZATION ---
let app, auth, db, appId;
try {
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "AIzaSyAmE55qdLqjPDhRzDj0MGd9e6mXEca3B2A",
  authDomain: "donna-bb0dd.firebaseapp.com",
  projectId: "donna-bb0dd",
  storageBucket: "donna-bb0dd.firebasestorage.app",
  messagingSenderId: "864824985006",
  appId: "1:864824985006:web:94a76d3ffaf0d6b732743f"
};


  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  appId = typeof __app_id !== 'undefined' ? __app_id : 'donna-salon-app';
} catch (error) {
  console.error("Erro ao inicializar o Firebase:", error);
}

// --- COMPONENTES AUXILIARES ---

const SpotifyIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z" />
  </svg>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = "", onClick, type = "button", disabled = false }) => {
  const variants = {
    primary: 'bg-[#D4AF37] text-black hover:bg-[#b8962d]',
    outline: 'border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black',
    ghost: 'text-neutral-400 hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- DADOS DE SIMULAÇÃO (PARA CARREGAMENTO INICIAL NA NUVEM) ---

const INITIAL_SERVICES = [
  { id: 1, name: 'Corte Visagista', price: 250, time: '60 min', category: 'Cabelo', intervalDays: 60, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Coloração Premium', price: 480, time: '120 min', category: 'Cabelo', intervalDays: 15, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Manicure Spa', price: 120, time: '45 min', category: 'Estética', intervalDays: 5, image: 'https://images.unsplash.com/photo-1610991140665-013547f41420?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Hidratação de Caviar', price: 350, time: '90 min', category: 'Tratamentos', intervalDays: 30, image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=400&q=80' },
];

const INITIAL_PRODUCTS = [
  { id: 101, name: 'Shampoo Caviar 1L', price: 120, stock: 10 },
  { id: 102, name: 'Condicionador Platinum 1L', price: 170, stock: 8 },
  { id: 103, name: 'Óleo Argan Premium', price: 220, stock: 15 }
];

const INITIAL_PROFESSIONALS = [
  { id: 1, name: 'Helena Soares', role: 'Master Stylist', rating: 4.9, password: '1234', image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80', commissions: { 1: 50, 2: 40, 3: 30, 4: 40 }, productCommissions: { 101: 10, 102: 10, 103: 15 } },
  { id: 2, name: 'Marcus Vinícius', role: 'Color Specialist', rating: 5.0, password: '1234', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', commissions: { 1: 40, 2: 60, 3: 30, 4: 40 }, productCommissions: { 101: 15, 102: 15, 103: 20 } },
  { id: 3, name: 'Clara Mendes', role: 'Esteticista Facial', rating: 4.8, password: '1234', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', commissions: { 1: 30, 2: 30, 3: 70, 4: 50 }, productCommissions: { 101: 5, 102: 5, 103: 10 } },
];

const MOCK_APPOINTMENTS = [
  { id: 100, client: 'Ana Clara (Novo Cadastro)', service: 'Hidratação de Caviar', time: '11:00', status: 'Pendente', value: 350, proId: 1, registeredBy: 'Auto-cadastro Web' },
  { id: 101, client: 'Mariana Silva', service: 'Corte Visagista', time: '14:00', status: 'Confirmado', value: 250, proId: 1, registeredBy: 'Helena Soares' },
  { id: 102, client: 'Julia Costa', service: 'Coloração Premium', time: '15:30', status: 'Em andamento', value: 480, proId: 1, registeredBy: 'Sistema Web' },
  { id: 103, client: 'Fernanda Lima', service: 'Manicure Spa', time: '10:00', status: 'Concluído', value: 120, proId: 3, registeredBy: 'Clara Mendes' },
];

const MOCK_CLIENTS = [
  { id: 1, name: 'Mariana Silva', phone: '5511999999991', lastServiceId: 3, lastServiceName: 'Manicure Spa', lastVisit: '05/04/2026' },
  { id: 2, name: 'Julia Costa', phone: '5511999999992', lastServiceId: 2, lastServiceName: 'Coloração Premium', lastVisit: '26/03/2026' },
  { id: 3, name: 'Fernanda Lima', phone: '5511999999993', lastServiceId: 1, lastServiceName: 'Corte Visagista', lastVisit: '09/02/2026' },
  { id: 4, name: 'Camila Rocha', phone: '5511999999994', lastServiceId: 4, lastServiceName: 'Hidratação de Caviar', lastVisit: '08/04/2026' },
];

const MOCK_CLIENT_HISTORY = [
  { id: 1, date: '15/03/2026', service: 'Coloração Premium', pro: 'Marcus Vinícius', value: 480, points: 48 },
  { id: 2, date: '02/02/2026', service: 'Hidratação de Caviar', pro: 'Helena Soares', value: 350, points: 35 },
  { id: 3, date: '10/01/2026', service: 'Corte Visagista', pro: 'Helena Soares', value: 250, points: 25 },
];

// --- LANDING PAGE ---

const LandingPage = ({ setView, salonName, branding }) => {
  const shortName = (salonName || "DONNA").split(' ')[0].toUpperCase();

  return (
    <div className="bg-black text-white selection:bg-[#D4AF37]/30 transition-colors duration-500 overflow-x-hidden">
      <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-[#D4AF37] font-serif tracking-widest text-lg pt-1">{shortName}</div>
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={() => setView('client')}
            className="flex items-center gap-2 text-sm font-medium hover:text-[#D4AF37] transition-colors"
          >
            <User size={16} /> Área do Cliente
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setView('auth'); }}
            className="flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <Lock size={10} className="sm:w-3 sm:h-3" /> Acesso Restrito / Equipe
          </button>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 px-4 md:py-40">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 opacity-95" />
          <img 
            src={branding?.landingBg || 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1920&q=80'} 
            className="w-full h-full object-cover object-center scale-105 animate-slow-zoom opacity-40"
            alt="Ambiente cinematográfico"
          />
        </div>
        
        <div className="relative z-20 text-center w-full max-w-4xl mx-auto">
          <span className="text-[#D4AF37] tracking-[0.3em] uppercase text-sm mb-6 block animate-fade-in-up">{salonName}</span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-light mb-8 leading-tight animate-fade-in-up delay-100">
            Mais do que beleza.<br/>
            <span className="italic font-serif text-[#D4AF37] drop-shadow-lg">Um segredo a descobrir.</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light animate-fade-in-up delay-200">
            Entre num ambiente onde a sofisticação e o mistério se encontram para revelar a sua melhor versão.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Button onClick={() => setView('booking')} className="px-8 md:px-12 py-4 md:py-5 text-base md:text-lg shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)] w-full sm:w-auto">Descobrir Mais</Button>
            <Button variant="outline" className="px-8 md:px-12 py-4 md:py-5 text-base md:text-lg border-neutral-700 text-neutral-300 hover:border-[#D4AF37] hover:text-[#D4AF37] bg-black/40 backdrop-blur-md w-full sm:w-auto">O Nosso Espaço</Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto border-y border-neutral-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          <div className="group">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 border border-neutral-800 group-hover:border-[#D4AF37] transition-colors">
              <Smartphone className="text-[#D4AF37]" size={28} />
            </div>
            <h3 className="text-xl font-medium mb-3">Agendamento Inteligente</h3>
            <p className="text-neutral-500 font-light leading-relaxed">Sua reserva em segundos. Escolha profissional e horário com interface intuitiva.</p>
          </div>
          <div className="group">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 border border-neutral-800 group-hover:border-[#D4AF37] transition-colors">
              <Award className="text-[#D4AF37]" size={28} />
            </div>
            <h3 className="text-xl font-medium mb-3">Padrão Internacional</h3>
            <p className="text-neutral-500 font-light leading-relaxed">Produtos exclusivos das melhores marcas mundiais para um resultado impecável.</p>
          </div>
          <div className="group">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 border border-neutral-800 group-hover:border-[#D4AF37] transition-colors">
              <MessageSquare className="text-[#D4AF37]" size={28} />
            </div>
            <h3 className="text-xl font-medium mb-3">Lembretes WhatsApp</h3>
            <p className="text-neutral-500 font-light leading-relaxed">Confirmações e lembretes automáticos para que você nunca perca seu momento de cuidado.</p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-neutral-900 px-6 text-center text-neutral-600 relative">
        <p className="mb-4">© 2026 {salonName}. Luxo e Tecnologia.</p>
      </footer>
    </div>
  );
};

// --- AUTH SCREEN ---

const AuthScreen = ({ setView, professionals, setLoggedPro, adminSettings, setShowMasterLogin }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const adminProfile = { 
    id: 'admin', 
    name: adminSettings?.name || 'Proprietário', 
    role: 'Acesso Total ao Sistema', 
    isAdmin: true, 
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80' 
  };
  
  const allProfiles = [adminProfile, ...professionals];

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedProfile.isAdmin) {
      if (passwordInput === (adminSettings?.password || 'admin123')) {
        setView('admin');
      } else if (passwordInput === 'master2026') {
        setShowMasterLogin(true);
      } else {
        setError(true);
      }
    } else {
      if (passwordInput === selectedProfile.password) {
        setLoggedPro(selectedProfile);
        setView('pro_app');
      } else {
        setError(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center items-center p-4 relative">
      <button onClick={() => setView('landing')} className="absolute top-6 left-6 text-neutral-500 hover:text-white flex items-center gap-2 transition-colors z-50">
        <ChevronLeft /> Voltar ao Site
      </button>

      <div className="w-full max-w-md bg-black border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
        {!selectedProfile ? (
          <div className="p-6 sm:p-8 animate-fade-in">
            <h2 className="text-2xl font-light mb-8 text-white">Acesso de Equipe</h2>
            <div className="space-y-3">
              {allProfiles.map(profile => (
                <button 
                  key={profile.id}
                  onClick={() => { setSelectedProfile(profile); setError(false); setPasswordInput(''); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 transition-all text-left hover:border-[#D4AF37]"
                >
                  <img src={profile.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{profile.name}</h4>
                    <p className="text-neutral-500 text-xs">{profile.role}</p>
                  </div>
                  <ChevronRight size={16} className="text-neutral-700" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 animate-fade-in flex flex-col items-center pt-12 relative">
            <button onClick={() => setSelectedProfile(null)} className="absolute top-6 left-6 text-neutral-500 hover:text-white p-2">
              <ChevronLeft />
            </button>
            <h2 className="text-xl font-medium text-white mb-8">Olá, {selectedProfile.name}</h2>
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <input 
                type="password" 
                placeholder="Introduza a sua senha"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full bg-neutral-900 border ${error ? 'border-red-500' : 'border-neutral-800'} rounded-xl p-4 text-center text-white focus:outline-none`}
                autoFocus
              />
              <Button type="submit" className="w-full">Entrar no Sistema</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// --- BOOKING FLOW ---

const BookingFlow = ({ setView, professionals, appointments, setAppointments }) => {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState({ name: '', phone: '' });
  const [selection, setSelection] = useState({ service: null, professional: null, time: '' });

  const handleSubmitRequest = () => {
    setAppointments([...appointments, {
      id: Date.now(),
      client: clientData.name,
      phone: clientData.phone,
      service: selection.service.name,
      time: selection.time,
      status: 'Pendente',
      value: selection.service.price,
      proId: selection.professional.id,
      registeredBy: 'Website Donna'
    }]);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="space-y-6">
              <h2 className="text-3xl font-light">Seja Bem-vinda</h2>
              <p className="text-neutral-500">Inicie o seu agendamento de luxo.</p>
              <div className="space-y-4">
                <input type="text" placeholder="Nome Completo" onChange={e => setClientData({...clientData, name: e.target.value})} className="w-full bg-neutral-900 p-4 rounded-xl border border-neutral-800 outline-none focus:border-[#D4AF37]" />
                <input type="text" placeholder="WhatsApp (com DDD)" onChange={e => setClientData({...clientData, phone: e.target.value})} className="w-full bg-neutral-900 p-4 rounded-xl border border-neutral-800 outline-none focus:border-[#D4AF37]" />
                <Button onClick={() => setStep(2)} className="w-full py-4" disabled={!clientData.name || !clientData.phone}>Continuar</Button>
                <button onClick={() => setView('landing')} className="w-full text-neutral-500 py-2">Voltar</button>
              </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-light mb-6">O que deseja realizar?</h2>
            {INITIAL_SERVICES.map(s => (
              <button key={s.id} onClick={() => { setSelection({...selection, service: s}); setStep(3); }} className="w-full p-5 bg-neutral-900 rounded-xl border border-neutral-800 text-left hover:border-[#D4AF37] transition-all flex justify-between items-center">
                <span>{s.name}</span>
                <span className="text-[#D4AF37] text-sm">R$ {s.price}</span>
              </button>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-light mb-6">Escolha o Profissional</h2>
            {professionals.map(p => (
              <button key={p.id} onClick={() => { setSelection({...selection, professional: p}); setStep(4); }} className="w-full p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-left hover:border-[#D4AF37] transition-all flex items-center gap-4">
                <img src={p.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-light mb-6">Horários disponíveis hoje</h2>
            <div className="grid grid-cols-3 gap-2">
              {['09:00', '10:30', '14:00', '15:30', '17:00', '18:30'].map(t => (
                <button key={t} onClick={() => { setSelection({...selection, time: t}); handleSubmitRequest(); }} className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:text-[#D4AF37] hover:border-[#D4AF37]">{t}</button>
              ))}
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-light">Solicitação Enviada!</h2>
            <p className="text-neutral-400">Entraremos em contacto via WhatsApp em breves instantes para confirmar o seu horário.</p>
            <Button onClick={() => setView('landing')} className="mx-auto">Voltar ao Início</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD ---

const AdminDashboard = ({ setView, appointments, setAppointments, professionals, salonName, setSalonName, setActiveCall, adminSettings, setAdminSettings }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <Card>
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2"><Calendar size={20} className="text-[#D4AF37]"/> Próximos Agendamentos</h3>
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <p className="text-neutral-600 italic">Nenhum agendamento para hoje.</p>
              ) : (
                appointments.map(app => (
                  <div key={app.id} className="p-4 bg-black rounded-xl flex justify-between items-center border border-neutral-800 hover:border-[#D4AF37] transition-colors">
                    <div>
                      <div className="font-medium text-white">{app.client}</div>
                      <div className="text-xs text-neutral-500">{app.service} • {app.time}</div>
                    </div>
                    <button onClick={() => setActiveCall(app)} className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-full transition-colors"><Megaphone size={18}/></button>
                  </div>
                ))
              )}
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-green-500"/> Resumo Financeiro</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Receita Prevista</span>
                <span className="text-white font-medium">R$ {appointments.reduce((acc, a) => acc + a.value, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total de Atendimentos</span>
                <span className="text-white font-medium">{appointments.length}</span>
              </div>
            </div>
          </Card>
        </div>
      );
      case 'settings': return (
        <div className="animate-fade-in space-y-6 max-w-2xl">
          <Card>
            <h3 className="text-xl font-light mb-8 flex items-center gap-2 text-[#D4AF37]"><Settings size={22}/> Configurações Gerais</h3>
            
            <div className="space-y-8">
              <div>
                <label className="text-xs text-neutral-500 uppercase mb-2 block tracking-widest">Nome da Marca</label>
                <input 
                  type="text" 
                  value={salonName} 
                  onChange={e => setSalonName(e.target.value)} 
                  className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-white focus:border-[#D4AF37] outline-none transition-all"
                />
              </div>

              <hr className="border-neutral-800" />

              <div>
                <h4 className="text-base font-medium mb-2 flex items-center gap-2 text-white"><Shield size={18} className="text-[#D4AF37]"/> Credenciais do Administrador</h4>
                <p className="text-xs text-neutral-500 mb-6">Gerencie o seu login e perfil principal.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase mb-2 block tracking-widest">Nome de Perfil</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Carlos - Dono"
                      value={adminSettings?.name || ''} 
                      onChange={e => setAdminSettings({...adminSettings, name: e.target.value})} 
                      className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase mb-2 block tracking-widest">Senha de Acesso</label>
                    <input 
                      type="text" 
                      placeholder="Senha Master do Salão"
                      value={adminSettings?.password || ''} 
                      onChange={e => setAdminSettings({...adminSettings, password: e.target.value})} 
                      className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-neutral-800" />

              <Button onClick={() => { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }} className="w-full py-4">Salvar Alterações</Button>
              {saveSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-3 rounded-xl text-center text-sm animate-fade-in flex items-center justify-center gap-2">
                  <CheckCircle size={14} /> Sincronizado com a Nuvem!
                </div>
              )}
            </div>
          </Card>
        </div>
      );
      default: return <div className="text-neutral-500 italic">Módulo em desenvolvimento...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <aside className="w-64 border-r border-neutral-800 p-6 flex flex-col gap-8 bg-neutral-950/50">
        <div className="text-xl font-serif tracking-widest text-[#D4AF37] flex items-center gap-2">
          <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div> ADMIN
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <button onClick={() => setActiveTab('overview')} className={`p-4 rounded-xl text-left transition-all ${activeTab === 'overview' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-medium' : 'text-neutral-400 hover:text-white'}`}>Visão Geral</button>
          <button onClick={() => setActiveTab('settings')} className={`p-4 rounded-xl text-left transition-all ${activeTab === 'settings' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-medium' : 'text-neutral-400 hover:text-white'}`}>Configurações</button>
          <hr className="my-4 border-neutral-900" />
          <button onClick={() => setView('tv')} className="p-4 text-left text-blue-500 flex items-center gap-2 hover:bg-blue-500/5 rounded-xl transition-all"><Tv size={18}/> Painel TV</button>
        </nav>
        <button onClick={() => setView('landing')} className="p-4 text-red-500 flex items-center gap-2 hover:bg-red-500/5 rounded-xl transition-all mt-auto"><LogOut size={18}/> Sair</button>
      </aside>
      <main className="flex-1 p-8 bg-neutral-950 overflow-y-auto">
        <h1 className="text-4xl font-light mb-12 capitalize">{activeTab === 'overview' ? 'Estatísticas' : activeTab}</h1>
        {renderContent()}
      </main>
    </div>
  );
};

// --- MASTER DASHBOARD ---

const MasterDashboard = ({ setView, subscriptionDueDate, setSubscriptionDueDate, premiumFeatures, setPremiumFeatures }) => {
  const add30Days = () => {
    const d = new Date(subscriptionDueDate);
    d.setDate(d.getDate() + 30);
    setSubscriptionDueDate(d.toISOString());
    alert('Licença estendida!');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center animate-fade-in">
       <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-light mb-2 flex items-center gap-3"><ShieldCheck className="text-blue-500"/> Painel Master</h1>
          <p className="text-neutral-500 mb-12 uppercase tracking-widest text-xs">Gestão de Licenciamento</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <h3 className="text-neutral-500 text-xs mb-2 uppercase">Vencimento</h3>
              <p className="text-2xl font-medium">{new Date(subscriptionDueDate).toLocaleDateString('pt-BR')}</p>
              <Button onClick={add30Days} className="mt-6 w-full text-xs" variant="outline">Adicionar 30 Dias</Button>
            </Card>
            <Card>
              <h3 className="text-neutral-500 text-xs mb-2 uppercase">Módulos</h3>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Spotify</span>
                  <input type="checkbox" checked={premiumFeatures.spotify} onChange={() => setPremiumFeatures({...premiumFeatures, spotify: !premiumFeatures.spotify})} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>IPTV</span>
                  <input type="checkbox" checked={premiumFeatures.iptv} onChange={() => setPremiumFeatures({...premiumFeatures, iptv: !premiumFeatures.iptv})} />
                </div>
              </div>
            </Card>
          </div>
          
          <Button onClick={() => setView('admin')} variant="primary" className="w-full py-4">Painel do Salão</Button>
          <Button onClick={() => setView('landing')} variant="ghost" className="w-full mt-2">Página Inicial</Button>
       </div>
    </div>
  );
};

// --- APP COMPONENT ---

export default function App() {
  const [view, setView] = useState('landing');
  const [activeCall, setActiveCall] = useState(null);
  const [loggedPro, setLoggedPro] = useState(null);
  const [user, setUser] = useState(null);
  const [dbState, setDbState] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showMasterLogin, setShowMasterLogin] = useState(false);
  const [masterPass, setMasterPass] = useState('');

  // Lógica de cliques secretos para telemóvel (3 cliques em 1 segundo)
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount === 3) {
      setShowMasterLogin(true);
      setClickCount(0);
    }
    const timer = setTimeout(() => setClickCount(0), 1000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleSecretTrigger = () => {
    setClickCount(prev => prev + 1);
  };

  // Firebase Auth e Snapshot
  useEffect(() => {
    const initAuth = async () => {
      if (!auth) return;
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    if (auth) onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'salon_state', 'core');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setDbState(docSnap.data());
      } else {
        // Envia dados iniciais se for a primeira vez
        setDoc(docRef, {
          salonName: 'Donna Embelezamento',
          adminSettings: { name: 'João Proprietário', password: 'admin123' },
          branding: { landingBg: '', tvBg: '', instagramImgs: [] },
          appointments: MOCK_APPOINTMENTS,
          professionals: INITIAL_PROFESSIONALS,
          products: INITIAL_PRODUCTS,
          premiumFeatures: { spotify: true, iptv: false },
          subscriptionDueDate: '2026-12-31T00:00:00'
        });
      }
      setLoadingData(false);
    });
    return () => unsubscribe();
  }, [user]);

  const updateGlobalState = (partial) => {
    if (!user || !db) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'salon_state', 'core');
    setDoc(docRef, partial, { merge: true });
  };

  // Atalho Teclado
  useEffect(() => {
    const handleKD = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowMasterLogin(true);
      }
    };
    window.addEventListener('keydown', handleKD);
    return () => window.removeEventListener('keydown', handleKD);
  }, []);

  if (loadingData) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#D4AF37]">
      <div className="w-10 h-10 border-2 border-t-transparent border-[#D4AF37] rounded-full animate-spin mb-4"></div>
      <p className="font-serif tracking-widest text-sm animate-pulse uppercase">Conectando...</p>
    </div>
  );

  const {
    salonName = 'Donna',
    adminSettings = { name: 'Administração', password: 'admin123' },
    professionals = [],
    appointments = [],
    branding = {},
    premiumFeatures = { spotify: false, iptv: false },
    subscriptionDueDate = '2026-04-13T00:00:00'
  } = dbState || {};

  const makeSetter = (key) => (val) => {
    const nextVal = typeof val === 'function' ? val(dbState[key]) : val;
    updateGlobalState({ [key]: nextVal });
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased selection:bg-[#D4AF37]/30" onClick={handleSecretTrigger}>
      
      {view === 'landing' && <LandingPage setView={setView} salonName={salonName} branding={branding} />}
      {view === 'auth' && <AuthScreen setView={setView} professionals={professionals} setLoggedPro={setLoggedPro} adminSettings={adminSettings} setShowMasterLogin={setShowMasterLogin} />}
      {view === 'admin' && <AdminDashboard setView={setView} salonName={salonName} setSalonName={makeSetter('salonName')} adminSettings={adminSettings} setAdminSettings={makeSetter('adminSettings')} appointments={appointments} setAppointments={makeSetter('appointments')} professionals={professionals} setActiveCall={setActiveCall} />}
      {view === 'booking' && <BookingFlow setView={setView} professionals={professionals} appointments={appointments} setAppointments={makeSetter('appointments')} />}
      {view === 'master' && <MasterDashboard setView={setView} subscriptionDueDate={subscriptionDueDate} setSubscriptionDueDate={makeSetter('subscriptionDueDate')} premiumFeatures={premiumFeatures} setPremiumFeatures={makeSetter('premiumFeatures')} />}
      
      {/* Modal Chamada TV */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in p-6">
          <div className="text-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl text-[#D4AF37] mb-4 font-light tracking-[0.3em]">CHEGOU A SUA VEZ</h2>
            <h1 className="text-6xl md:text-9xl font-bold text-green-400 mb-8 animate-pulse">{activeCall.client.split(' ')[0]}</h1>
            <p className="text-xl md:text-2xl text-neutral-400 font-light">Dirija-se ao profissional <span className="text-white font-medium">{professionals.find(p => p.id === activeCall.proId)?.name}</span></p>
            <Button onClick={() => setActiveCall(null)} variant="outline" className="mt-12 px-12">Fechar Alerta</Button>
          </div>
        </div>
      )}

      {/* Modal Acesso Master */}
      {showMasterLogin && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in p-4" onClick={(e) => e.stopPropagation()}>
          <Card className="w-full max-w-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-blue-500 font-bold tracking-widest flex items-center gap-2"><Key size={18}/> ACESSO MASTER</h3>
               <button onClick={() => setShowMasterLogin(false)} className="text-neutral-600 hover:text-white"><X/></button>
            </div>
            <input 
              type="password" 
              placeholder="Senha Master" 
              className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-center mb-4 focus:border-blue-500 outline-none"
              autoFocus
              onChange={e => setMasterPass(e.target.value)}
            />
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={() => {
                if(masterPass === 'master2026') {
                  setView('master');
                  setShowMasterLogin(false);
                } else {
                  alert('Senha Incorreta!');
                }
              }}
            >Verificar</Button>
            <p className="text-center text-[10px] text-neutral-700 mt-4 uppercase">Área do Desenvolvedor</p>
          </Card>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        ::-webkit-scrollbar { width: 0; }
        body { background: black; -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}