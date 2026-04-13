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
  // Quando for hospedar o sistema de verdade, cole as suas chaves aqui:
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
  // O sistema criará as pastas no seu banco de dados com este nome:
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

// --- MOCK DATA INICIAL (SERÁ USADO SE O BANCO ESTIVER VAZIO) ---

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
  const shortName = salonName.split(' ')[0].toUpperCase();

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
            src={branding.landingBg} 
            className="w-full h-full object-cover object-center scale-105 animate-slow-zoom opacity-40"
            alt="Ambiente cinematográfico e intrigante"
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

      <section className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-light mb-4 text-white">Serviços Exclusivos</h2>
            <p className="text-neutral-500 font-light">Curadoria completa para realçar sua melhor versão.</p>
          </div>
          <Button variant="ghost" className="px-0 md:px-6">Ver menu completo <ChevronRight size={18} /></Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {INITIAL_SERVICES.map(service => (
            <div key={service.id} className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-500">
              <div className="h-48 md:h-64 overflow-hidden">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-70" />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 block">{service.category}</span>
                <h4 className="text-lg md:text-xl font-medium mb-1">{service.name}</h4>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white font-light">R$ {service.price}</span>
                  <button onClick={() => setView('booking')} className="p-2 bg-neutral-800 rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 text-[#D4AF37]">
            <Instagram size={32} />
          </div>
          <h2 className="text-2xl md:text-4xl font-light mb-4">Acompanhe nosso Portfólio</h2>
          <p className="text-neutral-500 font-light">@{salonName.toLowerCase().replace(/\s+/g, '_')} no Instagram</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {branding.instagramImgs.map((img, i) => (
            <a key={i} href="https://www.instagram.com/donna_embelezamento/" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-xl aspect-square block border border-neutral-800 hover:border-[#D4AF37] transition-colors">
              <img src={img} alt="Instagram post" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white" size={32} />
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6 text-center bg-neutral-900">
        <h2 className="text-2xl md:text-5xl font-light mb-8 max-w-2xl mx-auto">Pronto para vivenciar a experiência {salonName}?</h2>
        <Button onClick={() => setView('booking')} className="px-8 md:px-16 py-4 md:py-6 text-lg md:text-xl mx-auto">Reservar Horário</Button>
      </section>

      <footer className="py-12 border-t border-neutral-900 px-6 text-center text-neutral-600 relative">
        <p className="mb-4">© 2026 {salonName}. Luxo e Tecnologia.</p>
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 text-sm">
          <a href="https://www.instagram.com/donna_embelezamento/" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">Instagram</a>
          <a href="#" className="hover:text-[#D4AF37]">Política de Privacidade</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setView('auth'); }} className="hover:text-white flex items-center justify-center gap-1"><Lock size={12}/> Acesso Restrito / Equipe</a>
        </div>
      </footer>
    </div>
  );
};

// --- AUTH SCREEN (LOGIN UNIFICADO) ---

const AuthScreen = ({ setView, professionals, setLoggedPro }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const adminProfile = { id: 'admin', name: 'Administração', role: 'Acesso Total ao Sistema', isAdmin: true, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80' };
  const allProfiles = [adminProfile, ...professionals];

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedProfile.isAdmin) {
      if (passwordInput === 'admin123') {
        setView('admin');
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
        <ChevronLeft /> <span className="hidden sm:inline">Voltar ao Site</span>
      </button>

      <div className="w-full max-w-md bg-black border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
        {!selectedProfile ? (
          <div className="p-6 sm:p-8 animate-fade-in">
            <h2 className="text-2xl font-light mb-2 text-white">Acesso Restrito</h2>
            <p className="text-neutral-500 mb-8 text-sm">Selecione o seu perfil de utilizador.</p>
            
            <div className="space-y-3">
              {allProfiles.map(profile => (
                <button 
                  key={profile.id}
                  onClick={() => { setSelectedProfile(profile); setError(false); setPasswordInput(''); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 transition-all text-left group ${profile.isAdmin ? 'hover:border-blue-500' : 'hover:border-[#D4AF37]'}`}
                >
                  {profile.isAdmin ? (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-900/20 text-blue-500 flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                      <Shield size={24} />
                    </div>
                  ) : (
                    <img src={profile.image} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0" alt={profile.name} />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-white truncate transition-colors ${profile.isAdmin ? 'group-hover:text-blue-500' : 'group-hover:text-[#D4AF37]'}`}>{profile.name}</h4>
                    <p className="text-neutral-500 text-xs truncate">{profile.role}</p>
                  </div>
                  <ChevronRight size={16} className="text-neutral-700 group-hover:text-white flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 animate-fade-in flex flex-col items-center pt-12 relative">
            <button onClick={() => setSelectedProfile(null)} className="absolute top-6 left-6 text-neutral-500 hover:text-white p-2">
              <ChevronLeft />
            </button>

            {selectedProfile.isAdmin ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-900/20 text-blue-500 flex items-center justify-center border-2 border-blue-500 mb-4">
                <Shield size={40} />
              </div>
            ) : (
              <img src={selectedProfile.image} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4 border-2 border-[#D4AF37]" alt="" />
            )}
            
            <h2 className="text-xl font-medium text-white mb-1 text-center">{selectedProfile.name}</h2>
            <p className="text-neutral-500 text-sm mb-8 text-center">Digite sua senha de acesso</p>
            
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full bg-neutral-900 border ${error ? 'border-red-500 text-red-500' : 'border-neutral-800 text-white'} rounded-xl p-4 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-${selectedProfile.isAdmin ? 'blue-500' : '[#D4AF37]'} transition-colors`}
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs text-center mt-2 absolute w-full">Senha incorreta.</p>}
              </div>
              <Button type="submit" className={`w-full py-4 mt-4 ${selectedProfile.isAdmin ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}>
                Acessar Sistema
              </Button>
              <p className="text-center text-neutral-700 text-xs mt-4">
                Dica de teste: Senha é {selectedProfile.isAdmin ? 'admin123' : '1234'}
              </p>
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
  const [selection, setSelection] = useState({ service: null, professional: null, date: '', time: '' });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

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
      registeredBy: 'Auto-cadastro Web'
    }]);
    nextStep();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-2xl mx-auto pt-8 md:pt-12">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <button onClick={() => step === 1 ? setView('landing') : prevStep()} className="text-neutral-500 hover:text-white flex items-center gap-2 text-sm md:text-base">
            <ChevronLeft /> Voltar
          </button>
          <div className="flex gap-1.5 md:gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-1 w-6 md:w-8 rounded-full transition-colors ${step >= i ? 'bg-[#D4AF37]' : 'bg-neutral-800'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light mb-2">Seja muito bem-vinda</h2>
            <p className="text-neutral-400 mb-8 text-sm md:text-base">Para solicitar seu horário, por favor, identifique-se.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Seu Nome Completo</label>
                <input 
                  type="text" 
                  value={clientData.name} 
                  onChange={e => setClientData({...clientData, name: e.target.value})} 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 md:p-4 text-white focus:border-[#D4AF37] outline-none" 
                  placeholder="Ex: Mariana Silva"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider mb-1 block">WhatsApp (Com DDD)</label>
                <input 
                  type="text" 
                  value={clientData.phone} 
                  onChange={e => setClientData({...clientData, phone: e.target.value})} 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 md:p-4 text-white focus:border-[#D4AF37] outline-none" 
                  placeholder="Ex: 5511999999999"
                />
              </div>
              <Button 
                onClick={nextStep} 
                disabled={!clientData.name || !clientData.phone} 
                className="w-full py-3.5 md:py-4 mt-4"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8">O que deseja realizar?</h2>
            <div className="grid gap-3 md:gap-4">
              {INITIAL_SERVICES.map(service => (
                <button 
                  key={service.id}
                  onClick={() => { setSelection({ ...selection, service }); nextStep(); }}
                  className="flex items-center justify-between p-4 md:p-6 rounded-2xl border border-neutral-800 hover:border-[#D4AF37] bg-neutral-900 transition-all text-left"
                >
                  <div>
                    <h4 className="text-base md:text-lg font-medium">{service.name}</h4>
                    <p className="text-neutral-500 text-xs md:text-sm">{service.time} • R$ {service.price}</p>
                  </div>
                  <ChevronRight className="text-neutral-700" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8">Escolha seu profissional</h2>
            <div className="grid gap-3 md:gap-4">
              {professionals.map(pro => (
                <button 
                  key={pro.id}
                  onClick={() => { setSelection({ ...selection, professional: pro }); nextStep(); }}
                  className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl border border-neutral-800 hover:border-[#D4AF37] bg-neutral-900 transition-all text-left"
                >
                  <img src={pro.image} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="text-base md:text-lg font-medium">{pro.name}</h4>
                    <p className="text-neutral-500 text-xs md:text-sm">{pro.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#D4AF37] text-sm md:text-base">
                    <Star size={16} fill="currentColor" /> {pro.rating}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8">Selecione o horário</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'].map(t => (
                <button 
                  key={t}
                  onClick={() => { setSelection({ ...selection, time: t }); handleSubmitRequest(); }}
                  className="p-3 md:p-4 rounded-xl border border-neutral-800 bg-neutral-900 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-sm md:text-base"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in text-center py-8 md:py-12">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-[#D4AF37]/20">
              <Clock size={40} className="md:w-12 md:h-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Solicitação Enviada!</h2>
            <p className="text-neutral-400 mb-6 md:mb-8 max-w-sm mx-auto text-sm md:text-base px-4">
              Olá, <strong>{clientData.name.split(' ')[0]}</strong>! O seu pedido de horário para <strong>{selection.service.name}</strong> com <strong>{selection.professional.name}</strong> (às {selection.time}) foi enviado para análise.
            </p>
            <div className="p-4 md:p-6 bg-neutral-900 rounded-2xl md:rounded-3xl border border-neutral-800 mb-8 text-left max-w-sm mx-auto">
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[#D4AF37] mb-2">
                <MessageSquare size={14} /> Aguarde no WhatsApp
              </div>
              <p className="italic text-neutral-500 text-xs md:text-sm">A nossa equipe ou o profissional responsável irá confirmar a disponibilidade e entrar em contato com você em breve.</p>
            </div>
            <Button onClick={() => setView('landing')} className="mx-auto">Voltar ao Início</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- CLIENT DASHBOARD ---

const ClientDashboard = ({ setView, theme, setTheme, salonName }) => {
  const [activeTab, setActiveTab] = useState('history');
  const [notifications, setNotifications] = useState(2);

  const totalPoints = MOCK_CLIENT_HISTORY.reduce((acc, curr) => acc + curr.points, 0);
  const clubName = `${salonName.split(' ')[0]} Club`;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#FAFAFA] text-neutral-900'} transition-colors duration-500 p-4 md:p-6 font-sans`}>
      <div className="max-w-5xl mx-auto pt-4 md:pt-8">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setView('landing')} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-neutral-900 text-white' : 'hover:bg-neutral-200 text-black'} transition-colors`}>
              <ChevronLeft />
            </button>
            <h1 className="text-2xl md:text-3xl font-light">Minha Área</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4 justify-between w-full sm:w-auto">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-neutral-900 text-[#D4AF37] border border-neutral-800' : 'bg-white text-yellow-600 shadow-md border border-neutral-200'} transition-all`} title="Alternar Modo Escuro Premium">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative cursor-pointer" onClick={() => setNotifications(0)}>
              <Bell size={24} className={theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                  {notifications}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 md:gap-3 sm:ml-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-medium text-sm md:text-base">MS</div>
              <div className="text-left">
                <div className="font-medium text-sm">Mariana Silva</div>
                <div className="text-[10px] md:text-xs text-[#D4AF37] font-medium tracking-wide uppercase">Membro Gold</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <aside className="space-y-6">
            <Card className={theme === 'dark' ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}>
              <div className="flex items-center gap-3 text-[#D4AF37] mb-4">
                <Gift size={24} />
                <h3 className="text-lg md:text-xl font-medium">{clubName}</h3>
              </div>
              <div className="mb-2 flex justify-between items-end">
                <span className={`text-3xl md:text-4xl font-light ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{totalPoints}</span>
                <span className="text-xs md:text-sm text-neutral-500 mb-1">pontos ganhos</span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-200" style={{ width: '60%' }} />
              </div>
              <p className="text-xs text-neutral-500">Faltam 42 pontos para o nível Platinum. Ganhe 1 ponto a cada R$ 10 em serviços.</p>
              <Button className="w-full mt-6 py-2 text-sm">Resgatar Benefícios</Button>
            </Card>

            <nav className={`flex flex-col gap-2 p-4 rounded-2xl ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'} border`}>
              <button onClick={() => setActiveTab('history')} className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm md:text-base ${activeTab === 'history' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-500 hover:bg-neutral-800 hover:text-white'}`}>
                <History size={18} /> Histórico de Atendimentos
              </button>
              <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm md:text-base ${activeTab === 'settings' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-500 hover:bg-neutral-800 hover:text-white'}`}>
                <Settings size={18} /> Configurações da Conta
              </button>
            </nav>
          </aside>

          <main className="lg:col-span-2">
            {activeTab === 'history' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-light">Seus Atendimentos</h2>
                  <Button onClick={() => setView('booking')} variant="outline" className="py-2 px-3 md:px-4 text-xs md:text-sm hidden sm:flex"><Plus size={16}/> Novo Agendamento</Button>
                </div>
                
                <div className="space-y-4">
                  {MOCK_CLIENT_HISTORY.map(item => (
                    <div key={item.id} className={`p-4 md:p-6 rounded-2xl border ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800 hover:border-[#D4AF37]' : 'bg-white border-neutral-200 hover:border-[#D4AF37] shadow-sm'} transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] shrink-0">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-base md:text-lg">{item.service}</h4>
                          <p className="text-neutral-500 text-xs md:text-sm">Com {item.pro} • {item.date}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right border-t border-neutral-800/50 sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                        <div className="font-medium text-sm md:text-base">R$ {item.value}</div>
                        <div className="text-[10px] md:text-xs text-[#D4AF37] font-medium mt-1 flex items-center gap-1 sm:justify-end">
                          <Star size={12} fill="currentColor" /> +{item.points} pts {clubName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setView('booking')} className="w-full py-3.5 sm:hidden mt-4 text-sm"><Plus size={16}/> Novo Agendamento</Button>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className={`animate-fade-in p-4 md:p-6 rounded-2xl border ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
                <h2 className="text-lg md:text-xl font-medium mb-6">Preferências e Notificações</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-sm md:text-base"><Bell size={16}/> Notificações Push</h4>
                      <p className="text-xs md:text-sm text-neutral-500 mt-1">Receber alertas e promoções no celular</p>
                    </div>
                    <div className="w-10 md:w-12 h-5 md:h-6 bg-[#D4AF37] rounded-full relative cursor-pointer shadow-inner flex-shrink-0">
                      <div className="w-3.5 md:w-4 h-3.5 md:h-4 bg-white rounded-full absolute right-1 top-1 shadow-md"></div>
                    </div>
                  </div>
                  <hr className={theme === 'dark' ? 'border-neutral-800' : 'border-neutral-100'} />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-sm md:text-base"><MessageSquare size={16}/> Mensagens via WhatsApp</h4>
                      <p className="text-xs md:text-sm text-neutral-500 mt-1">Confirmações automáticas e lembretes de agenda</p>
                    </div>
                    <div className="w-10 md:w-12 h-5 md:h-6 bg-[#D4AF37] rounded-full relative cursor-pointer shadow-inner flex-shrink-0">
                      <div className="w-3.5 md:w-4 h-3.5 md:h-4 bg-white rounded-full absolute right-1 top-1 shadow-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD ---

const AdminDashboard = ({ setView, appointments, setAppointments, professionals, setProfessionals, products, setProducts, sales, setSales, salonName, setSalonName, clients, setClients, setActiveCall, tvPlaylist, setTvPlaylist, tvVideoFit, setTvVideoFit, expenses, setExpenses, spotifyUrl, setSpotifyUrl, iptvUrl, setIptvUrl, premiumFeatures }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [selectedDayInfo, setSelectedDayInfo] = useState(null);

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ description: '', value: '', category: 'Fornecedor', date: new Date().toLocaleDateString('pt-BR') });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const confirmAppointment = (id) => {
    setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'Confirmado' } : app));
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (editingStaff.id) {
      setProfessionals(professionals.map(p => p.id === editingStaff.id ? editingStaff : p));
    } else {
      setProfessionals([...professionals, { 
        ...editingStaff, 
        id: Date.now(), 
        rating: 5.0, 
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' 
      }]);
    }
    setShowStaffModal(false);
    setEditingStaff(null);
  };

  const handleAddVideo = () => {
    const url = prompt("Cole o link (URL) direto do vídeo (ex: terminando em .mp4):");
    if (!url) return;
    const name = prompt("Digite um nome curto para o vídeo:");
    setTvPlaylist([...tvPlaylist, { id: Date.now(), name: name || 'Novo Vídeo', url }]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pdv': {
        const cartTotal = cart.reduce((acc, curr) => acc + curr.price, 0);

        const handleCheckout = () => {
          if (cart.length === 0) return;

          let newAppointments = [...appointments];
          let newProducts = [...products];
          let newSales = [...sales];

          cart.forEach(item => {
            if (item.type === 'service') {
              newAppointments = newAppointments.map(a => a.id === item.refId ? { ...a, status: 'Concluído' } : a);
              newSales.push({
                id: Date.now() + Math.random(),
                productName: `Serviço: ${item.name} (${item.client})`,
                price: item.price,
                proName: item.proName,
                commission: 0,
                date: new Date().toLocaleDateString('pt-BR'),
              });
            } else if (item.type === 'product') {
              newProducts = newProducts.map(p => p.id === item.refId ? { ...p, stock: p.stock - 1 } : p);
              newSales.push({
                id: Date.now() + Math.random(),
                productName: `Produto: ${item.name}`,
                price: item.price,
                proName: 'Recepção',
                commission: 0,
                date: new Date().toLocaleDateString('pt-BR'),
              });
            }
          });

          // Note: multiple setters trigger individual Firestore updates, which are merged successfully!
          setAppointments(newAppointments);
          setProducts(newProducts);
          setSales(newSales);
          setCart([]);
          alert('Venda finalizada e sincronizada com sucesso!');
        };

        const pendingAppointments = appointments.filter(a => a.status !== 'Concluído');

        return (
          <div className="animate-fade-in flex flex-col xl:flex-row gap-6 md:gap-8">
            <div className="flex-1 space-y-6 md:space-y-8">
              <Card>
                <h3 className="text-lg md:text-xl font-light mb-4 md:mb-6 flex items-center gap-2"><Calendar size={20} className="text-[#D4AF37]" /> Serviços Pendentes</h3>
                {pendingAppointments.length === 0 ? (
                  <p className="text-neutral-500 text-sm italic">Não há agendamentos pendentes de pagamento hoje.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {pendingAppointments.map(app => (
                      <div key={app.id} className="p-3 md:p-4 bg-black border border-neutral-800 rounded-xl hover:border-[#D4AF37] transition-colors flex justify-between items-center group">
                        <div>
                          <div className="font-medium text-white text-sm md:text-base">{app.client}</div>
                          <div className="text-[10px] md:text-xs text-neutral-500 mb-1">{app.service} • {app.time}</div>
                          <div className="text-xs md:text-sm font-medium text-[#D4AF37]">R$ {app.value.toFixed(2)}</div>
                        </div>
                        <button 
                          onClick={() => {
                            if(!cart.find(c => c.refId === app.id && c.type === 'service')) {
                              setCart([...cart, { type: 'service', refId: app.id, name: app.service, client: app.client, price: app.value, proName: professionals.find(p => p.id === app.proId)?.name || 'Profissional' }]);
                            }
                          }}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-[#D4AF37] group-hover:text-black transition-all shrink-0"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card>
                <h3 className="text-lg md:text-xl font-light mb-4 md:mb-6 flex items-center gap-2"><ShoppingBag size={20} className="text-[#D4AF37]" /> Venda de Balcão (Produtos)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {products.filter(p => p.stock > 0).map(product => (
                    <div key={product.id} className="p-3 md:p-4 bg-black border border-neutral-800 rounded-xl hover:border-[#D4AF37] transition-colors flex justify-between items-center group">
                      <div>
                        <div className="font-medium text-white text-sm md:text-base">{product.name}</div>
                        <div className="text-[10px] md:text-xs text-neutral-500 mb-1">Stock: {product.stock} un</div>
                        <div className="text-xs md:text-sm font-medium text-[#D4AF37]">R$ {product.price.toFixed(2)}</div>
                      </div>
                      <button 
                        onClick={() => {
                          setCart([...cart, { type: 'product', refId: product.id, name: product.name, price: product.price, id: Date.now() + Math.random() }]); 
                        }}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-[#D4AF37] group-hover:text-black transition-all shrink-0"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="w-full xl:w-96">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 md:p-6 xl:sticky xl:top-6 shadow-2xl">
                <h3 className="text-xl md:text-2xl font-light mb-4 md:mb-6 flex items-center gap-3"><Receipt className="text-[#D4AF37]" /> Checkout</h3>
                
                <div className="min-h-[150px] md:min-h-[200px] mb-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-600 italic gap-2 py-8 md:py-12">
                      <ShoppingCart size={28} className="opacity-20" />
                      <span className="text-sm md:text-base">O caixa está vazio.</span>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-2">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start border-b border-neutral-800 pb-2 md:pb-3">
                          <div className="flex-1 pr-2 md:pr-4 min-w-0">
                            <div className="text-xs md:text-sm font-medium text-white truncate">{item.name}</div>
                            {item.type === 'service' && <div className="text-[10px] md:text-xs text-neutral-500 truncate">{item.client}</div>}
                            <div className="text-[10px] md:text-xs text-[#D4AF37] mt-0.5 md:mt-1">R$ {item.price.toFixed(2)}</div>
                          </div>
                          <button 
                            onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                            className="text-neutral-600 hover:text-red-500 transition-colors p-1 shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-neutral-800 pt-4 md:pt-6 space-y-4 md:space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm md:text-base text-neutral-400">Total a Cobrar</span>
                    <span className="text-2xl md:text-3xl font-light text-white">R$ {cartTotal.toFixed(2)}</span>
                  </div>

                  <div>
                    <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Método de Pagamento</label>
                    <select 
                      value={paymentMethod} 
                      onChange={e => setPaymentMethod(e.target.value)} 
                      className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none"
                    >
                      <option value="PIX">PIX</option>
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Cartão de Débito">Cartão de Débito</option>
                      <option value="Dinheiro">Dinheiro</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className={`w-full py-3 md:py-4 rounded-xl text-sm md:text-base font-medium flex items-center justify-center gap-2 transition-all ${
                      cart.length === 0 
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                      : 'bg-[#D4AF37] text-black shadow-[0_5px_20px_rgba(212,175,55,0.2)] md:shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:bg-yellow-500 hover:-translate-y-0.5 md:hover:-translate-y-1'
                    }`}
                  >
                    <CheckCircle size={18} className="md:w-5 md:h-5" /> Finalizar Venda
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'overview': {
        return (
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="p-4 md:p-6">
                <div className="flex justify-between mb-2 md:mb-4">
                  <span className="text-neutral-500 text-xs md:text-sm">Faturamento</span>
                  <TrendingUp className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-xl md:text-3xl font-medium">R$ 12.450</div>
                <div className="text-[10px] md:text-xs text-green-500 mt-1 md:mt-2">+15% vs ontem</div>
              </Card>
              <Card className="p-4 md:p-6">
                <div className="flex justify-between mb-2 md:mb-4">
                  <span className="text-neutral-500 text-xs md:text-sm">Agenda</span>
                  <Calendar className="text-[#D4AF37] w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-xl md:text-3xl font-medium">42</div>
                <div className="text-[10px] md:text-xs text-neutral-500 mt-1 md:mt-2">8 pendentes</div>
              </Card>
              <Card className="p-4 md:p-6 hidden sm:block">
                <div className="flex justify-between mb-2 md:mb-4">
                  <span className="text-neutral-500 text-xs md:text-sm">Ticket Médio</span>
                  <DollarSign className="text-blue-500 w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-xl md:text-3xl font-medium">R$ 310</div>
                <div className="text-[10px] md:text-xs text-neutral-500 mt-1 md:mt-2">Padrão Premium</div>
              </Card>
              <Card className="p-4 md:p-6 hidden sm:block">
                <div className="flex justify-between mb-2 md:mb-4">
                  <span className="text-neutral-500 text-xs md:text-sm">Ocupação</span>
                  <Users className="text-purple-500 w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-xl md:text-3xl font-medium">92%</div>
                <div className="text-[10px] md:text-xs text-green-500 mt-1 md:mt-2">Alta performance</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <Card>
                <h3 className="text-lg md:text-xl font-medium mb-4 md:mb-6">Próximos Clientes</h3>
                <div className="space-y-3 md:space-y-4">
                  {appointments.map(app => (
                    <div key={app.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-black/40 rounded-xl border gap-3 ${app.status === 'Pendente' ? 'border-orange-500/50' : 'border-neutral-800'}`}>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-neutral-800 rounded-full flex items-center justify-center text-[#D4AF37] shrink-0">
                          <User size={16} className="md:w-5 md:h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium flex items-center gap-2 text-sm md:text-base truncate">
                            {app.client}
                            {app.status === 'Pendente' && <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-pulse shrink-0"></span>}
                          </div>
                          <div className="text-[10px] md:text-xs text-neutral-500 truncate">{app.service} • {app.time}</div>
                          <div className="text-[9px] md:text-[10px] text-[#D4AF37] mt-0.5 md:mt-1 flex items-center gap-1 font-medium tracking-wide truncate">
                            <Lock size={8} className="md:w-2.5 md:h-2.5" /> Registrado por: {app.registeredBy}
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t border-neutral-800 sm:border-t-0 pt-2 sm:pt-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] uppercase font-bold whitespace-nowrap ${
                            app.status === 'Confirmado' ? 'bg-green-500/10 text-green-500' : 
                            app.status === 'Pendente' ? 'bg-orange-500/10 text-orange-500' :
                            'bg-[#D4AF37]/10 text-[#D4AF37]'
                          }`}>
                            {app.status}
                          </span>
                          {(app.status === 'Confirmado' || app.status === 'Em andamento') && (
                            <button 
                              onClick={() => setActiveCall(app)}
                              title="Chamar na TV"
                              className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-neutral-800 hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-colors text-neutral-400 shrink-0"
                            >
                              <Megaphone size={10} className="md:w-3 md:h-3" />
                            </button>
                          )}
                        </div>
                        {app.status === 'Pendente' && (
                          <button onClick={() => confirmAppointment(app.id)} className="text-[9px] md:text-[10px] uppercase tracking-wider font-bold px-2 py-1 md:px-3 md:py-1 bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center gap-1 transition-colors whitespace-nowrap">
                            <CheckCircle size={10} /> Aprovar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg md:text-xl font-medium mb-4 md:mb-6">Performance Equipe</h3>
                <div className="space-y-4 md:space-y-6">
                  {professionals.map(pro => (
                    <div key={pro.id} className="flex items-center gap-3 md:gap-4">
                      <img src={pro.image} className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shrink-0" alt="" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-sm md:text-base truncate pr-2">{pro.name}</span>
                          <span className="text-xs md:text-sm text-neutral-400 shrink-0">{pro.rating} ★</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#D4AF37]" style={{ width: `${pro.id === 1 ? '95%' : '80%'}` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );
      }
      case 'agenda': {
        return (
          <div className="animate-fade-in relative">
            <div className="overflow-x-auto w-full">
              <div className="grid grid-cols-7 gap-1 border border-neutral-800 bg-neutral-800 rounded-2xl min-w-[600px] overflow-hidden">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                  <div key={d} className="bg-neutral-900 p-2 md:p-4 text-center text-xs md:text-sm font-medium text-neutral-500 uppercase tracking-widest">{d}</div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i + 1;
                  const isBusyDay = day === 13;
                  const dayAppointments = isBusyDay ? appointments : [];

                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedDayInfo({ day, appointments: dayAppointments })}
                      className="bg-neutral-950 h-24 md:h-32 p-2 md:p-3 hover:bg-neutral-900 transition-colors border border-neutral-900 relative group cursor-pointer"
                    >
                      <span className="text-[10px] md:text-xs text-neutral-700">{day}</span>
                      {dayAppointments.length > 0 && (
                        <div className="mt-1 md:mt-2 p-1 md:p-1.5 bg-[#D4AF37]/20 border-l-2 border-[#D4AF37] text-[8px] md:text-[10px] text-[#D4AF37] rounded font-medium truncate">
                          {dayAppointments.length} agenda.
                        </div>
                      )}
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedDayInfo && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-5 md:p-6 relative shadow-2xl max-h-[90vh] flex flex-col">
                  <button onClick={() => setSelectedDayInfo(null)} className="absolute top-4 right-4 md:top-6 md:right-6 text-neutral-500 hover:text-white bg-neutral-800 rounded-full p-1.5 md:p-2 transition-colors">
                    <X size={18} className="md:w-5 md:h-5" />
                  </button>
                  
                  <h3 className="text-xl md:text-2xl font-light mb-1 md:mb-2 flex items-center gap-2 md:gap-3">
                    <Calendar className="text-[#D4AF37] w-5 h-5 md:w-6 md:h-6" />
                    Agenda do Dia {selectedDayInfo.day}
                  </h3>
                  <p className="text-neutral-500 text-xs md:text-sm mb-4 md:mb-6">Visualização detalhada dos serviços e profissionais.</p>

                  <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-3 md:space-y-4">
                    {selectedDayInfo.appointments.length === 0 ? (
                      <div className="text-center py-8 md:py-12 text-neutral-600 text-sm italic border border-dashed border-neutral-800 rounded-2xl">
                        Nenhum agendamento para este dia. A equipe está livre.
                      </div>
                    ) : (
                      selectedDayInfo.appointments.map(app => {
                        const pro = professionals.find(p => p.id === app.proId);
                        return (
                          <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-black/50 rounded-xl border border-neutral-800 gap-3 md:gap-4">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="text-lg md:text-xl font-light text-[#D4AF37] w-12 md:w-16 text-center">{app.time}</div>
                              <div className="w-px h-8 md:h-10 bg-neutral-800 hidden sm:block"></div>
                              <div className="min-w-0">
                                <div className="font-medium text-white text-sm md:text-lg truncate">{app.client}</div>
                                <div className="text-xs md:text-sm text-neutral-400 truncate">{app.service}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 md:gap-6 justify-between sm:justify-end border-t border-neutral-800 sm:border-none pt-2 sm:pt-0 mt-1 sm:mt-0">
                              <div className="flex items-center gap-2 md:gap-3">
                                <img src={pro?.image} alt="" className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border border-neutral-700 shrink-0" />
                                <div className="text-xs md:text-sm min-w-0">
                                  <div className="text-white truncate">{pro?.name}</div>
                                  <div className="text-[8px] md:text-[10px] text-neutral-500 flex items-center gap-1 truncate">
                                    <Lock size={8} className="shrink-0" /> {app.registeredBy}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 md:gap-2 shrink-0">
                                <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] uppercase font-bold whitespace-nowrap ${
                                  app.status === 'Confirmado' ? 'bg-green-500/10 text-green-500' : 
                                  app.status === 'Concluído' ? 'bg-blue-500/10 text-blue-500' : 
                                  app.status === 'Pendente' ? 'bg-orange-500/10 text-orange-500' :
                                  'bg-[#D4AF37]/10 text-[#D4AF37]'
                                }`}>
                                  {app.status}
                                </span>
                                {app.status === 'Pendente' && (
                                  <button onClick={() => confirmAppointment(app.id)} className="text-[8px] md:text-[10px] uppercase tracking-wider font-bold px-2 py-1 md:px-3 md:py-1 bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center gap-1 transition-colors">
                                    <CheckCircle size={8} className="md:w-2.5 md:h-2.5" /> Aprovar
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'clients': {
        const calculateDaysAgo = (dateString) => {
          const [day, month, year] = dateString.split('/');
          const pastDate = new Date(`${year}-${month}-${day}T00:00:00`);
          const today = new Date('2026-04-11T00:00:00'); // Usando a data base de simulação de hoje
          const diffTime = Math.abs(today - pastDate);
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };

        const sendWhatsAppReminder = (client, service) => {
          const firstName = client.name.split(' ')[0];
          const message = `Olá, ${firstName}! 🌸 Tudo bem, maravilhosa?\n\nEstamos com saudades de você aqui na ${salonName}! ✨ Passando só para te lembrar com muito carinho que já está na época ideal para renovar a sua *${service.name}* e manter aquele resultado incrível sempre em dia.\n\nQue tal agendarmos o seu momento de autocuidado? Estamos te esperando com um café quentinho ☕!\n\nUm beijo grande de toda a nossa equipe. 💖`;
          const encodedMessage = encodeURIComponent(message);
          window.open(`https://api.whatsapp.com/send?phone=${client.phone}&text=${encodedMessage}`, '_blank');
        };

        const handleSaveClient = (e) => {
          e.preventDefault();
          const serviceInfo = INITIAL_SERVICES.find(s => s.id === Number(editingClient.lastServiceId));
          
          const newClient = {
            ...editingClient,
            id: editingClient.id || Date.now(),
            lastServiceName: serviceInfo ? serviceInfo.name : 'Nenhum'
          };

          if (editingClient.id) {
            setClients(clients.map(c => c.id === editingClient.id ? newClient : c));
          } else {
            setClients([...clients, newClient]);
          }
          
          setShowClientModal(false);
          setEditingClient(null);
        };

        return (
          <div className="space-y-6 md:space-y-8 animate-fade-in relative">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-light">Gestão de Clientes (CRM)</h3>
              <Button onClick={() => {
                setEditingClient({ name: '', phone: '', lastServiceId: '', lastVisit: new Date().toLocaleDateString('pt-BR') });
                setShowClientModal(true);
              }} className="py-2 px-4 text-sm w-full sm:w-auto"><Plus size={16} /> Novo Cliente</Button>
            </div>
            
            <Card>
              <p className="text-neutral-500 text-xs md:text-sm mb-4 md:mb-6">
                Acompanhe o tempo de retorno ideal para cada cliente e envie lembretes carinhosos diretamente pelo WhatsApp.
              </p>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="text-neutral-500 text-xs md:text-sm border-b border-neutral-800">
                      <th className="pb-3 md:pb-4 font-normal">Cliente</th>
                      <th className="pb-3 md:pb-4 font-normal">Último Serviço</th>
                      <th className="pb-3 md:pb-4 font-normal">Última Visita</th>
                      <th className="pb-3 md:pb-4 font-normal">Status</th>
                      <th className="pb-3 md:pb-4 font-normal text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {clients.map((client) => {
                      const serviceInfo = INITIAL_SERVICES.find(s => s.id === client.lastServiceId);
                      const daysAgo = calculateDaysAgo(client.lastVisit);
                      const interval = serviceInfo?.intervalDays || 30;
                      
                      const isDue = daysAgo >= interval;
                      const isOverdue = daysAgo > interval + 3; // Mais de 3 dias de atraso
                      
                      let statusText = 'Em dia';
                      let statusColor = 'text-neutral-500';
                      let statusBg = 'bg-neutral-800';

                      if (isOverdue) {
                        statusText = 'Atrasada';
                        statusColor = 'text-red-500';
                        statusBg = 'bg-red-500/10 border border-red-500/20';
                      } else if (isDue) {
                        statusText = 'Ideal Hoje';
                        statusColor = 'text-green-500';
                        statusBg = 'bg-green-500/10 border border-green-500/20';
                      } else {
                        statusText = `Faltam ${interval - daysAgo} dias`;
                      }

                      return (
                        <tr key={client.id} className="group hover:bg-white/5 transition-colors">
                          <td className="py-3 md:py-4">
                            <div className="font-medium text-white flex items-center gap-2 text-sm md:text-base">
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] md:text-xs text-[#D4AF37] shrink-0">
                                {client.name.charAt(0)}
                              </div>
                              <span className="truncate">{client.name}</span>
                            </div>
                          </td>
                          <td className="py-3 md:py-4 text-xs md:text-sm text-neutral-300">
                            {client.lastServiceName} <span className="text-neutral-600 text-[10px] md:text-xs">({interval} d)</span>
                          </td>
                          <td className="py-3 md:py-4 text-xs md:text-sm text-neutral-400">
                            {client.lastVisit} <span className="text-[10px] md:text-xs">({daysAgo}d atrás)</span>
                          </td>
                          <td className="py-3 md:py-4">
                            <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] uppercase font-bold whitespace-nowrap ${statusBg} ${statusColor}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="py-3 md:py-4 text-right">
                            <button 
                              onClick={() => sendWhatsAppReminder(client, serviceInfo)}
                              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl flex items-center gap-1 md:gap-2 ml-auto transition-all text-xs md:text-sm font-medium ${isDue ? 'bg-green-600 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(22,163,74,0.3)]' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                            >
                              <MessageCircle size={14} className="md:w-4 md:h-4" /> Lembrete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Modal de Cadastro/Edição de Cliente */}
            {showClientModal && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-5 md:p-6 relative shadow-2xl">
                  <button onClick={() => setShowClientModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-neutral-800 rounded-full p-1.5 md:p-1 transition-colors">
                    <X size={18} className="md:w-5 md:h-5" />
                  </button>

                  <h3 className="text-xl md:text-2xl font-light mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <Heart className="text-[#D4AF37] w-5 h-5 md:w-6 md:h-6" />
                    {editingClient.id ? 'Editar Cliente' : 'Novo Cliente'}
                  </h3>

                  <form onSubmit={handleSaveClient} className="space-y-3 md:space-y-4">
                    <div>
                      <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Nome Completo</label>
                      <input 
                        type="text" 
                        required 
                        value={editingClient.name} 
                        onChange={e => setEditingClient({...editingClient, name: e.target.value})} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors" 
                        placeholder="Ex: Ana Souza" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">WhatsApp (Com DDD)</label>
                      <input 
                        type="text" 
                        required 
                        value={editingClient.phone} 
                        onChange={e => setEditingClient({...editingClient, phone: e.target.value})} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors" 
                        placeholder="Ex: 5511999999999" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Último Serviço Realizado</label>
                      <select 
                        required 
                        value={editingClient.lastServiceId} 
                        onChange={e => setEditingClient({...editingClient, lastServiceId: e.target.value})} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors"
                      >
                        <option value="" disabled>Selecione um serviço...</option>
                        {INITIAL_SERVICES.map(s => (
                          <option key={s.id} value={s.id}>{s.name} (Retorno: {s.intervalDays} d)</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Data da Última Visita</label>
                      <input 
                        type="text" 
                        required 
                        value={editingClient.lastVisit} 
                        onChange={e => setEditingClient({...editingClient, lastVisit: e.target.value})} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors" 
                        placeholder="DD/MM/AAAA" 
                      />
                    </div>

                    <div className="flex justify-end gap-2 md:gap-3 pt-4 border-t border-neutral-800 mt-4 md:mt-6">
                      <Button variant="ghost" onClick={() => setShowClientModal(false)} className="text-sm">Cancelar</Button>
                      <Button type="submit" className="text-sm"><CheckCircle size={16} className="md:w-4 md:h-4" /> Salvar</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'financial': {
        const baseReceitas = 84200;
        const baseDespesas = 32150;
        
        const totalReceitas = baseReceitas + sales.reduce((acc, curr) => acc + curr.price, 0) + appointments.filter(a => a.status === 'Concluído').reduce((acc, curr) => acc + curr.value, 0);
        const totalDespesas = baseDespesas + expenses.reduce((acc, curr) => acc + Number(curr.value), 0);
        const lucroLiquido = totalReceitas - totalDespesas;

        const allTransactions = [
          ...sales.map(s => ({ id: s.id, date: s.date, desc: `Venda: ${s.productName}`, subDesc: `Registrado por ${s.proName} (Com: R$ ${s.commission.toFixed(2)})`, type: 'Receita', color: 'text-green-500', value: s.price, isExpense: false })),
          ...appointments.filter(a => a.status === 'Concluído').map(a => ({ id: a.id, date: new Date().toLocaleDateString('pt-BR'), desc: `Serviço: ${a.service} - ${a.client.split(' ')[0]}`, subDesc: `Por ${a.registeredBy}`, type: 'Receita', color: 'text-green-500', value: a.value, isExpense: false })),
          ...expenses.map(e => ({ id: e.id, date: e.date, desc: e.description, subDesc: `Cat: ${e.category}`, type: 'Despesa', color: 'text-red-500', value: Number(e.value), isExpense: true }))
        ].sort((a, b) => b.id - a.id);

        const handleSaveExpense = (e) => {
          e.preventDefault();
          setExpenses([...expenses, { ...expenseData, id: Date.now() }]);
          setShowExpenseModal(false);
          setExpenseData({ description: '', value: '', category: 'Fornecedor', date: new Date().toLocaleDateString('pt-BR') });
        };

        return (
          <div className="space-y-6 md:space-y-8 animate-fade-in relative">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-light">Gestão Financeira</h3>
              <Button onClick={() => setShowExpenseModal(true)} variant="danger" className="py-2 px-4 text-sm shadow-lg w-full sm:w-auto">
                <Plus size={16} /> Nova Despesa
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-gradient-to-br from-green-900/20 to-transparent border-green-900/30 p-4 md:p-6">
                <div className="flex justify-between items-center mb-2 md:mb-4">
                  <span className="text-xs md:text-sm text-neutral-400">Receitas</span>
                  <ArrowUpRight className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-xl md:text-2xl font-medium">R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </Card>
              <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-900/30 p-4 md:p-6">
                <div className="flex justify-between items-center mb-2 md:mb-4">
                  <span className="text-xs md:text-sm text-neutral-400">Despesas</span>
                  <ArrowDownRight className="text-red-500 w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-xl md:text-2xl font-medium">R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </Card>
              <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30 p-4 md:p-6">
                <div className="flex justify-between items-center mb-2 md:mb-4">
                  <span className="text-xs md:text-sm text-neutral-400">Lucro Líquido</span>
                  <DollarSign className="text-[#D4AF37] w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-xl md:text-2xl font-medium">R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </Card>
            </div>
            
            <Card>
              <h3 className="text-lg md:text-xl mb-4 md:mb-6 font-light">Lançamentos Recentes</h3>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="text-neutral-500 text-xs md:text-sm border-b border-neutral-800">
                      <th className="pb-3 md:pb-4 font-normal">Data</th>
                      <th className="pb-3 md:pb-4 font-normal">Descrição</th>
                      <th className="pb-3 md:pb-4 font-normal">Categoria</th>
                      <th className="pb-3 md:pb-4 font-normal text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {allTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-6 md:py-8 text-center text-neutral-600 text-sm italic">Nenhum lançamento registado.</td>
                      </tr>
                    ) : (
                      allTransactions.map((transaction, idx) => (
                        <tr key={`${transaction.type}-${transaction.id}-${idx}`} className="group hover:bg-white/5 transition-colors">
                          <td className="py-3 md:py-4 text-xs md:text-sm whitespace-nowrap">{transaction.date}</td>
                          <td className="py-3 md:py-4 font-medium flex flex-col gap-0.5 md:gap-1">
                            <span className="text-sm md:text-base truncate max-w-[200px] sm:max-w-xs">{transaction.desc}</span>
                            <span className="text-[10px] md:text-xs text-neutral-500 flex items-center gap-1 truncate">
                              <Lock size={8} className="shrink-0" /> {transaction.subDesc}
                            </span>
                          </td>
                          <td className={`py-3 md:py-4 text-xs md:text-sm ${transaction.color}`}>{transaction.type}</td>
                          <td className="py-3 md:py-4 font-medium text-right text-sm md:text-base whitespace-nowrap">
                            {transaction.isExpense ? '-' : '+'} R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Modal de Nova Despesa */}
            {showExpenseModal && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-5 md:p-6 relative shadow-2xl">
                  <button onClick={() => setShowExpenseModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-neutral-800 rounded-full p-1.5 md:p-1 transition-colors">
                    <X size={18} className="md:w-5 md:h-5" />
                  </button>

                  <h3 className="text-xl md:text-2xl font-light mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <ArrowDownRight className="text-red-500 w-5 h-5 md:w-6 md:h-6" />
                    Nova Despesa
                  </h3>

                  <form onSubmit={handleSaveExpense} className="space-y-3 md:space-y-4">
                    <div>
                      <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Descrição da Despesa</label>
                      <input 
                        type="text" 
                        required 
                        value={expenseData.description} 
                        onChange={e => setExpenseData({...expenseData, description: e.target.value})} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors" 
                        placeholder="Ex: Conta de Luz, Fornecedor X" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Valor (R$)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        required 
                        value={expenseData.value} 
                        onChange={e => setExpenseData({...expenseData, value: e.target.value})} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors" 
                        placeholder="0.00" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Categoria</label>
                      <select 
                        required 
                        value={expenseData.category} 
                        onChange={e => setExpenseData({...expenseData, category: e.target.value})} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors"
                      >
                        <option value="Fornecedor">Fornecedor de Produtos</option>
                        <option value="Custos Fixos">Custos Fixos (Luz, Água, Net)</option>
                        <option value="Manutenção">Manutenção / Obras</option>
                        <option value="Marketing">Marketing / Tráfego</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Data da Despesa</label>
                      <input 
                        type="text" 
                        required 
                        value={expenseData.date} 
                        onChange={e => setExpenseData({...expenseData, date: e.target.value})} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors" 
                        placeholder="DD/MM/AAAA" 
                      />
                    </div>

                    <div className="flex justify-end gap-2 md:gap-3 pt-4 border-t border-neutral-800 mt-4 md:mt-6">
                      <Button variant="ghost" onClick={() => setShowExpenseModal(false)} className="text-sm">Cancelar</Button>
                      <Button type="submit" variant="danger" className="text-sm"><CheckCircle size={16} className="md:w-4 md:h-4" /> Registrar Despesa</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'services': {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
            {INITIAL_SERVICES.map(s => (
              <Card key={s.id} className="relative group p-4 md:p-6">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className="p-2.5 md:p-3 bg-neutral-800 rounded-xl text-[#D4AF37]">
                    <Scissors size={20} className="md:w-6 md:h-6" />
                  </div>
                  <button className="text-neutral-600 hover:text-white transition-colors">
                    <Settings size={16} className="md:w-4 md:h-4" />
                  </button>
                </div>
                <h4 className="text-base md:text-lg font-medium truncate">{s.name}</h4>
                <div className="flex flex-wrap gap-2 md:gap-4 mt-2 md:mt-4 text-xs md:text-sm text-neutral-500">
                  <span className="flex items-center gap-1"><Clock size={12} className="md:w-3.5 md:h-3.5" /> {s.time}</span>
                  <span className="flex items-center gap-1"><DollarSign size={12} className="md:w-3.5 md:h-3.5" /> R$ {s.price}</span>
                </div>
                <div className="mt-4 md:mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1 py-1.5 md:py-2 text-[10px] md:text-xs">Editar</Button>
                  <Button variant="ghost" className="flex-1 py-1.5 md:py-2 text-[10px] md:text-xs">Desativar</Button>
                </div>
              </Card>
            ))}
            <button className="border-2 border-dashed border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-neutral-500 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all min-h-[150px]">
              <Plus size={28} className="mb-2 md:w-8 md:h-8" />
              <span className="text-sm md:text-base">Novo Serviço</span>
            </button>
          </div>
        );
      }
      case 'inventory': {
        return (
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <Card className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-3 md:p-4 bg-red-500/10 text-red-500 rounded-xl md:rounded-2xl shrink-0">
                    <Package size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm md:text-base truncate">Estoque Baixo</h4>
                    <p className="text-neutral-500 text-[10px] md:text-sm truncate">{products.filter(p => p.stock < 10).length} itens precisam de reposição</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-3 md:p-4 bg-green-500/10 text-green-500 rounded-xl md:rounded-2xl shrink-0">
                    <ShoppingBag size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm md:text-base truncate">Vendas Recentes</h4>
                    <p className="text-neutral-500 text-[10px] md:text-sm truncate">{sales.length} produtos vendidos pela equipe</p>
                  </div>
                </div>
              </Card>
            </div>
            <Card>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-light">Lista de Produtos</h3>
                <Button className="py-2 px-4 text-sm w-full sm:w-auto"><Plus size={16} /> Adicionar</Button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {products.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 md:p-4 bg-black/40 border border-neutral-800 rounded-xl gap-2">
                    <div className="flex gap-3 md:gap-4 items-center min-w-0">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500 shrink-0"><Package size={18} className="md:w-5 md:h-5"/></div>
                       <div className="min-w-0">
                         <div className="font-medium text-sm md:text-base truncate">{item.name}</div>
                         <div className="text-[10px] md:text-xs text-neutral-500">Qtd: {item.stock} unidades</div>
                       </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-medium text-sm md:text-base">R$ {item.price},00</div>
                      <div className={`text-[8px] md:text-[10px] uppercase ${item.stock < 10 ? 'text-red-500 font-bold' : 'text-neutral-500'}`}>
                        {item.stock < 10 ? 'Estoque Baixo' : 'Em estoque'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      }
      case 'staff': {
        return (
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-light">Gestão de Equipe e Comissões</h3>
              <Button onClick={() => {
                setEditingStaff({
                  name: '', role: '', password: '', commissions: INITIAL_SERVICES.reduce((acc, s) => ({ ...acc, [s.id]: 50 }), {})
                });
                setShowStaffModal(true);
              }} className="py-2 px-4 text-sm w-full sm:w-auto"><Plus size={16} /> Novo Profissional</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {professionals.map(pro => (
                <Card key={pro.id} className="relative group p-4 md:p-6 flex flex-col h-full">
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    <img src={pro.image} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover border border-neutral-800 shrink-0" alt="" />
                    <div className="min-w-0">
                      <h4 className="text-base md:text-lg font-medium truncate">{pro.name}</h4>
                      <p className="text-xs md:text-sm text-neutral-500 truncate">{pro.role}</p>
                      <div className="flex items-center gap-1 text-[#D4AF37] text-[10px] md:text-xs mt-0.5 md:mt-1">
                        <Star size={10} fill="currentColor" className="md:w-3 md:h-3" /> {pro.rating}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-neutral-800 flex-1">
                    <h5 className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1 md:gap-2"><DollarSign size={10} className="md:w-3 md:h-3" /> Comissões por Serviço</h5>
                    <div className="space-y-1.5 md:space-y-2 max-h-24 overflow-y-auto pr-1 md:pr-2">
                      {INITIAL_SERVICES.map(s => (
                        <div key={s.id} className="flex justify-between items-center text-xs md:text-sm">
                          <span className="text-neutral-300 truncate pr-2">{s.name}</span>
                          <span className="font-medium text-[#D4AF37] shrink-0">{pro.commissions?.[s.id] || 0}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button onClick={() => {
                      setEditingStaff({ ...pro, commissions: pro.commissions || {} });
                      setShowStaffModal(true);
                    }} variant="outline" className="flex-1 py-1.5 md:py-2 text-[10px] md:text-xs">Editar</Button>
                  </div>
                </Card>
              ))}
            </div>

            {showStaffModal && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-5 md:p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                  <button onClick={() => setShowStaffModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-neutral-800 rounded-full p-1.5 md:p-1 transition-colors">
                    <X size={18} className="md:w-5 md:h-5" />
                  </button>
                  
                  <h3 className="text-xl md:text-2xl font-light mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <Users className="text-[#D4AF37] w-5 h-5 md:w-6 md:h-6" />
                    {editingStaff.id ? 'Editar Profissional' : 'Novo Profissional'}
                  </h3>
                  
                  <form onSubmit={handleSaveStaff} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Nome Completo</label>
                        <input type="text" required value={editingStaff.name} onChange={e => setEditingStaff({...editingStaff, name: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Especialidade (Ex: Master Stylist)</label>
                        <input type="text" required value={editingStaff.role} onChange={e => setEditingStaff({...editingStaff, role: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Senha de Acesso (App do Profissional)</label>
                        <input type="text" required value={editingStaff.password} onChange={e => setEditingStaff({...editingStaff, password: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none" />
                      </div>
                    </div>

                    <hr className="border-neutral-800" />

                    <div>
                      <h4 className="text-base md:text-lg font-medium mb-1">Comissões por Serviço</h4>
                      <p className="text-[10px] md:text-sm text-neutral-500 mb-3 md:mb-4">Defina a porcentagem de repasse para cada tipo de serviço.</p>
                      
                      <div className="space-y-2 md:space-y-3 bg-black/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-neutral-800 mb-4 md:mb-6">
                        {INITIAL_SERVICES.map(service => (
                          <div key={service.id} className="flex items-center justify-between gap-2 md:gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs md:text-sm text-white truncate">{service.name}</div>
                              <div className="text-[9px] md:text-xs text-neutral-500 truncate">Valor: R$ {service.price}</div>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2 w-20 md:w-32 shrink-0">
                              <input 
                                type="number" 
                                min="0" 
                                max="100"
                                value={editingStaff.commissions?.[service.id] || 0}
                                onChange={e => setEditingStaff({
                                  ...editingStaff, 
                                  commissions: { ...editingStaff.commissions, [service.id]: parseInt(e.target.value) || 0 }
                                })}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 md:p-2 text-center text-xs md:text-sm text-white focus:border-[#D4AF37] outline-none"
                              />
                              <span className="text-neutral-500 text-xs md:text-sm">%</span>
                            </div>
                            <div className="w-16 md:w-24 text-right text-[10px] md:text-sm text-[#D4AF37] font-medium hidden sm:block">
                              R$ {((service.price * (editingStaff.commissions?.[service.id] || 0)) / 100).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <h4 className="text-base md:text-lg font-medium mb-1">Comissões por Venda de Produtos</h4>
                      <p className="text-[10px] md:text-sm text-neutral-500 mb-3 md:mb-4">Defina a porcentagem de repasse na venda de cada produto.</p>

                      <div className="space-y-2 md:space-y-3 bg-black/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-neutral-800">
                        {products.map(product => (
                          <div key={product.id} className="flex items-center justify-between gap-2 md:gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs md:text-sm text-white truncate">{product.name}</div>
                              <div className="text-[9px] md:text-xs text-neutral-500 truncate">Valor: R$ {product.price}</div>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2 w-20 md:w-32 shrink-0">
                              <input 
                                type="number" 
                                min="0" 
                                max="100"
                                value={editingStaff.productCommissions?.[product.id] || 0}
                                onChange={e => setEditingStaff({
                                  ...editingStaff, 
                                  productCommissions: { ...editingStaff.productCommissions, [product.id]: parseInt(e.target.value) || 0 }
                                })}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 md:p-2 text-center text-xs md:text-sm text-white focus:border-[#D4AF37] outline-none"
                              />
                              <span className="text-neutral-500 text-xs md:text-sm">%</span>
                            </div>
                            <div className="w-16 md:w-24 text-right text-[10px] md:text-sm text-[#D4AF37] font-medium hidden sm:block">
                              R$ {((product.price * (editingStaff.productCommissions?.[product.id] || 0)) / 100).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 md:gap-3 pt-4">
                      <Button variant="ghost" onClick={() => setShowStaffModal(false)} className="text-xs md:text-sm">Cancelar</Button>
                      <Button type="submit" className="text-xs md:text-sm"><CheckCircle size={16} className="md:w-4 md:h-4" /> Salvar</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'settings': {
        const handleSaveSettings = () => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000); 
        };

        const handleAddVideo = () => {
          const url = prompt("Cole o link (URL) direto do vídeo (ex: terminando em .mp4):");
          if (!url) return;
          const name = prompt("Digite um nome curto para o vídeo:");
          setTvPlaylist([...tvPlaylist, { id: Date.now(), name: name || 'Novo Vídeo', url }]);
        };

        return (
          <div className="animate-fade-in space-y-6 md:space-y-8">
            <Card className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-light mb-4 md:mb-6 flex items-center gap-2">
                <Settings size={20} className="text-[#D4AF37] w-5 h-5 md:w-6 md:h-6" /> 
                Configurações do Salão
              </h3>
              
              <div className="space-y-4 md:space-y-6 max-w-2xl">
                <div>
                  <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1.5 md:mb-2 block">Nome da Marca / Salão</label>
                  <input 
                    type="text" 
                    value={salonName} 
                    onChange={e => setSalonName(e.target.value)} 
                    className="w-full bg-black border border-neutral-800 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors"
                  />
                  <p className="text-[10px] md:text-xs text-neutral-500 mt-1.5 md:mt-2 leading-relaxed">
                    A alteração do nome reflete-se imediatamente no site, aplicativo do profissional, painel do cliente e mensagens de WhatsApp.
                  </p>
                </div>

                <hr className="border-neutral-800" />

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-3">
                    <div>
                      <h4 className="text-base md:text-lg font-medium flex items-center gap-2"><MonitorPlay size={16} className="text-[#D4AF37] md:w-5 md:h-5"/> Mídia da TV</h4>
                      <p className="text-[10px] md:text-xs text-neutral-500 mt-1">Configure vídeos online para rodar na TV da sala de espera.</p>
                    </div>
                    <div className="shrink-0 w-full sm:w-auto">
                      <button 
                        onClick={handleAddVideo}
                        className="bg-[#D4AF37] text-black px-3 py-2 md:px-4 md:py-2 rounded-xl font-medium flex items-center justify-center sm:justify-start gap-2 hover:bg-yellow-500 transition-all text-xs md:text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] w-full sm:w-auto"
                      >
                        <LinkIcon size={14} className="md:w-4 md:h-4" /> Inserir Link de Vídeo
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/50 border border-neutral-800 rounded-xl md:rounded-2xl p-3 md:p-4 space-y-2 max-h-48 md:max-h-64 overflow-y-auto">
                    {tvPlaylist.length === 0 ? (
                      <div className="text-center py-6 md:py-8 text-neutral-600 italic text-xs md:text-sm">
                        Nenhum vídeo na playlist. A TV ficará apenas com a imagem de descanso.
                      </div>
                    ) : (
                      tvPlaylist.map((video, idx) => (
                        <div key={video.id} className="flex items-center justify-between p-2 md:p-3 bg-neutral-900 border border-neutral-800 rounded-lg md:rounded-xl gap-2">
                          <div className="flex items-center gap-2 md:gap-3 min-w-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-md md:rounded-lg flex items-center justify-center text-neutral-500 shrink-0">
                              <Video size={14} className="md:w-4 md:h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs md:text-sm font-medium text-white truncate max-w-[150px] sm:max-w-xs">{video.name}</div>
                              <div className="text-[8px] md:text-[10px] text-[#D4AF37] uppercase tracking-wider">Vídeo {idx + 1} da fila</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => setTvPlaylist(tvPlaylist.filter(v => v.id !== video.id))}
                            className="text-neutral-500 hover:text-red-500 p-1.5 md:p-2 transition-colors shrink-0"
                            title="Remover vídeo"
                          >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4 md:mt-6">
                    <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1.5 md:mb-2 block">Formato de Exibição dos Vídeos na TV</label>
                    <select 
                      value={tvVideoFit} 
                      onChange={e => setTvVideoFit(e.target.value)} 
                      className="w-full bg-black border border-neutral-800 rounded-xl p-3 md:p-4 text-xs md:text-sm text-white focus:border-[#D4AF37] outline-none transition-colors"
                    >
                      <option value="contain">Enquadrar Inteiro (Ideal para vídeos verticais - Laterais Pretas)</option>
                      <option value="cover">Preencher Tela (Ideal para vídeos horizontais - Pode cortar bordas)</option>
                    </select>
                  </div>
                </div>

                <hr className="border-neutral-800" />

                <div>
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div>
                      <h4 className="text-base md:text-lg font-medium flex items-center gap-2">
                        <Music size={16} className={`md:w-5 md:h-5 ${premiumFeatures.spotify ? "text-[#1DB954]" : "text-neutral-600"}`}/> 
                        Player do Spotify {!premiumFeatures.spotify && <Lock size={12} className="text-[#D4AF37] md:w-3.5 md:h-3.5" />}
                      </h4>
                      <p className="text-[10px] md:text-xs text-neutral-500 mt-1">Som ambiente integrado em tela cheia para o salão.</p>
                    </div>
                  </div>
                  
                  {premiumFeatures.spotify ? (
                    <>
                      <input 
                        type="text" 
                        value={spotifyUrl} 
                        onChange={e => setSpotifyUrl(e.target.value)} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors"
                        placeholder="Ex: https://open.spotify.com/embed/playlist/37i9dQZF1DWZtZ8vUCzceJ"
                      />
                      <p className="text-[10px] md:text-xs text-neutral-500 mt-1.5 md:mt-2 leading-relaxed">
                        Dica: No Spotify, clique em "Compartilhar" {'>'} "Incorporar Playlist" e copie o link "src" gerado. Esse link será aberto na tela dedicada acessada pelo menu do Admin.
                      </p>
                    </>
                  ) : (
                    <div className="bg-black/50 border border-neutral-800 rounded-xl md:rounded-2xl p-4 md:p-6 text-center animate-fade-in">
                      <Lock size={24} className="text-neutral-600 mx-auto mb-2 md:w-8 md:h-8 md:mb-3" />
                      <h5 className="text-sm md:text-base text-white font-medium mb-1 md:mb-2">Módulo Premium Bloqueado</h5>
                      <p className="text-[10px] md:text-xs text-neutral-500 mb-3 md:mb-4 px-2">Adicione música ambiente com Spotify diretamente ao seu sistema. Entre em contato para adquirir esta funcionalidade.</p>
                      <Button onClick={() => window.open('https://wa.me/5511999999999?text=Olá,%20tenho%20interesse%20em%20liberar%20o%20módulo%20Spotify%20no%20meu%20sistema%20Donna.', '_blank')} variant="outline" className="mx-auto text-[10px] md:text-xs py-1.5 md:py-2">
                        Falar com Consultor
                      </Button>
                    </div>
                  )}
                </div>

                <hr className="border-neutral-800" />

                <div>
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div>
                      <h4 className="text-base md:text-lg font-medium flex items-center gap-2">
                        <Tv size={16} className={`md:w-5 md:h-5 ${premiumFeatures.iptv ? "text-blue-500" : "text-neutral-600"}`}/> 
                        Web Player IPTV {!premiumFeatures.iptv && <Lock size={12} className="text-[#D4AF37] md:w-3.5 md:h-3.5" />}
                      </h4>
                      <p className="text-[10px] md:text-xs text-neutral-500 mt-1">Integração com players de TV e Filmes.</p>
                    </div>
                  </div>
                  
                  {premiumFeatures.iptv ? (
                    <>
                      <input 
                        type="text" 
                        value={iptvUrl} 
                        onChange={e => setIptvUrl(e.target.value)} 
                        className="w-full bg-black border border-neutral-800 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none transition-colors"
                        placeholder="Ex: https://web.blessedplayer.com/"
                      />
                      <p className="text-[10px] md:text-xs text-neutral-500 mt-1.5 md:mt-2 leading-relaxed">
                        O Web Player ficará integrado numa tela de ecrã inteiro acessível pelo menu Admin.
                      </p>
                    </>
                  ) : (
                    <div className="bg-black/50 border border-neutral-800 rounded-xl md:rounded-2xl p-4 md:p-6 text-center animate-fade-in">
                      <Lock size={24} className="text-neutral-600 mx-auto mb-2 md:w-8 md:h-8 md:mb-3" />
                      <h5 className="text-sm md:text-base text-white font-medium mb-1 md:mb-2">Módulo Premium Bloqueado</h5>
                      <p className="text-[10px] md:text-xs text-neutral-500 mb-3 md:mb-4 px-2">Transforme sua tela numa central de entretenimento com Filmes e Canais VIP. Entre em contato para adquirir.</p>
                      <Button onClick={() => window.open('https://wa.me/5511999999999?text=Olá,%20tenho%20interesse%20em%20liberar%20o%20módulo%20IPTV%20no%20meu%20sistema%20Donna.', '_blank')} variant="outline" className="mx-auto text-[10px] md:text-xs py-1.5 md:py-2">
                        Falar com Consultor
                      </Button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <Button onClick={handleSaveSettings} className="w-full text-sm md:text-base py-3 md:py-4">
                    <CheckCircle size={16} className="md:w-5 md:h-5" /> Salvar Alterações
                  </Button>
                  
                  {saveSuccess && (
                    <div className="mt-3 md:mt-4 p-2 md:p-3 bg-green-500/10 border border-green-500/30 text-green-500 rounded-lg md:rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 animate-fade-in">
                      <CheckCircle size={14} className="md:w-4 md:h-4" /> Alteração salva com sucesso!
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        );
      }
      default:
        return <div className="text-neutral-500 italic text-sm">Esta funcionalidade está em desenvolvimento para a {salonName}.</div>;
    }
  };

  const shortAdminName = salonName.split(' ')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
      
      {/* Overlay Escuro para fechar menu mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Agora com suporte Mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 md:w-72 bg-black border-r border-neutral-800 flex flex-col transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none`}>
        <div className="p-5 md:p-6 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-light tracking-tighter flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-[#D4AF37] rounded-lg flex-shrink-0" /> 
            <span className="truncate">{shortAdminName}</span>
          </div>
          <button className="lg:hidden text-neutral-500 hover:text-white p-1" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto px-3 md:px-4 pb-6">
          <div className="text-[9px] md:text-[10px] text-neutral-600 font-bold uppercase tracking-widest mb-1.5 md:mb-2 mt-2 md:mt-4 px-2">Gestão do Salão</div>
          {[
            { id: 'pdv', icon: Receipt, label: 'Caixa (PDV)' },
            { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral' },
            { id: 'agenda', icon: Calendar, label: 'Agenda Global' },
            { id: 'clients', icon: Heart, label: 'Clientes (CRM)' },
            { id: 'financial', icon: DollarSign, label: 'Financeiro' },
            { id: 'services', icon: Scissors, label: 'Serviços' },
            { id: 'inventory', icon: ShoppingBag, label: 'Produtos' },
            { id: 'staff', icon: Briefcase, label: 'Equipe' },
            { id: 'settings', icon: Settings, label: 'Configurações' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl transition-all text-xs md:text-sm ${activeTab === item.id ? 'bg-neutral-900 text-[#D4AF37]' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <item.icon size={16} className="md:w-[18px] md:h-[18px]" /> {item.label}
            </button>
          ))}

          <div className="text-[9px] md:text-[10px] text-neutral-600 font-bold uppercase tracking-widest mb-1.5 md:mb-2 mt-6 md:mt-8 px-2">Telas & Mídia</div>
          <button 
            onClick={() => setView('tv')}
            className="flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl transition-all text-xs md:text-sm text-neutral-400 hover:text-white hover:bg-neutral-900"
          >
            <MonitorPlay size={16} className="text-blue-500 md:w-[18px] md:h-[18px]" /> Painel de Chamada (TV)
          </button>
        </nav>

        <div className="p-4 md:p-6 border-t border-neutral-900">
          <button onClick={() => setView('landing')} className="flex items-center justify-center gap-2 w-full py-2.5 md:py-3 text-xs md:text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut size={14} className="md:w-4 md:h-4" /> Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-neutral-950 w-full">
        <header className="flex justify-between items-center mb-6 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <button className="lg:hidden p-1.5 md:p-2 text-neutral-400 hover:text-white shrink-0" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} className="md:w-6 md:h-6" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light capitalize truncate">
                {activeTab === 'overview' ? 'Visão Geral' : activeTab === 'pdv' ? 'Caixa (PDV)' : activeTab}
              </h1>
              <p className="text-neutral-500 text-[10px] md:text-sm hidden sm:block truncate">Painel Administrativo.</p>
            </div>
          </div>
          <div className="flex gap-2 md:gap-4 shrink-0">
            <Button onClick={() => setView('booking')} className="py-2 px-3 md:px-6 text-xs md:text-base whitespace-nowrap"><Plus size={16} className="md:w-5 md:h-5" /> Novo<span className="hidden sm:inline">&nbsp;Lançamento</span></Button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

// --- PROFESSIONAL APP ---

const ProfessionalApp = ({ setView, loggedPro, appointments, setAppointments, professionals, products, setProducts, sales, setSales, salonName, setActiveCall }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({ client: '', time: '', type: 'Agendamento', authPass: '' });

  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleData, setSaleData] = useState({ productId: '', authPass: '' });

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (scheduleData.authPass === loggedPro.password) {
      const novoLancamento = {
        id: Date.now(),
        client: scheduleData.client,
        service: scheduleData.type === 'Bloqueio Pessoal' ? 'Bloqueio de Agenda' : 'Serviço Adicionado Manualmente',
        time: scheduleData.time,
        status: 'Confirmado',
        value: 0,
        proId: loggedPro.id,
        registeredBy: loggedPro.name 
      };
      
      setAppointments([...appointments, novoLancamento]);
      
      alert('Agendamento confirmado e assinado com sucesso!');
      setShowScheduleModal(false);
      setScheduleData({ client: '', time: '', type: 'Agendamento', authPass: '' });
    } else {
      alert('Senha incorreta. Agendamento bloqueado.');
    }
  };

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    if (saleData.authPass === loggedPro.password) {
      const product = products.find(p => p.id === parseInt(saleData.productId));
      if (!product || product.stock <= 0) {
        alert('Produto indisponível no estoque.');
        return;
      }

      const commPercent = loggedPro.productCommissions?.[product.id] || 0;
      const commValue = (product.price * commPercent) / 100;

      const novaVenda = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        proId: loggedPro.id,
        proName: loggedPro.name,
        commission: commValue,
        date: new Date().toLocaleDateString('pt-BR')
      };

      setSales([...sales, novaVenda]);
      setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));
      
      alert(`Venda registrada com sucesso! A sua comissão foi de R$ ${commValue.toFixed(2)}.`);
      setShowSaleModal(false);
      setSaleData({ productId: '', authPass: '' });
    } else {
      alert('Senha incorreta. Venda não autorizada.');
    }
  };

  const myAppointments = appointments.filter(a => loggedPro && a.proId === loggedPro.id);
  const shortProName = salonName.split(' ')[0];

  const confirmAppointmentPro = (id) => {
    setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'Confirmado' } : app));
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center">
      <div className="w-full max-w-md bg-black min-h-screen relative shadow-2xl md:border-x md:border-neutral-900 flex flex-col">
        
        <div className="p-4 md:p-6 border-b border-neutral-900 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-20">
          <button onClick={() => setView('landing')} className="text-neutral-500 hover:text-white flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
            <LogOut size={14} className="md:w-4 md:h-4" /> Sair
          </button>
          <div className="text-[#D4AF37] font-serif tracking-widest text-[10px] md:text-xs uppercase">{shortProName} Pro</div>
          <Briefcase size={16} className="text-neutral-700 md:w-5 md:h-5" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-light text-white">Agenda de Hoje</h2>
                <p className="text-[#D4AF37] text-xs md:text-sm mt-0.5 md:mt-1">{myAppointments.length} agendamentos</p>
              </div>
              <img src={loggedPro?.image} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-neutral-800 shrink-0" alt="" />
            </div>

            {myAppointments.length === 0 ? (
              <div className="text-center py-10 md:py-12 text-neutral-600 italic text-sm md:text-base border border-dashed border-neutral-800 rounded-xl md:rounded-2xl">
                Sua agenda está livre hoje.
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {myAppointments.map((app, index) => (
                  <div key={index} className={`bg-neutral-900 p-3 md:p-4 rounded-xl md:rounded-2xl border ${app.status === 'Pendente' ? 'border-orange-500/50' : 'border-neutral-800'} relative overflow-hidden`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${app.status === 'Confirmado' ? 'bg-green-500' : app.status === 'Pendente' ? 'bg-orange-500' : 'bg-[#D4AF37]'}`} />
                    <div className="flex justify-between items-start mb-1.5 md:mb-2 pl-2">
                      <span className="text-lg md:text-xl font-light text-white flex items-center gap-1.5 md:gap-2">
                        {app.time}
                        {app.status === 'Pendente' && <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-pulse shrink-0"></span>}
                      </span>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className={`text-[8px] md:text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md ${app.status === 'Confirmado' ? 'bg-green-500/10 text-green-500' : app.status === 'Pendente' ? 'bg-orange-500/10 text-orange-500' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                          {app.status}
                        </span>
                        {(app.status === 'Confirmado' || app.status === 'Em andamento') && (
                          <button 
                            onClick={() => setActiveCall(app)}
                            title="Chamar na TV"
                            className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-neutral-800 hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-colors text-neutral-400 shrink-0"
                          >
                            <Megaphone size={12} className="md:w-3.5 md:h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="pl-2 flex justify-between items-end">
                      <div className="min-w-0 pr-2">
                        <h4 className="font-medium text-white text-sm md:text-base truncate">{app.client}</h4>
                        <p className="text-neutral-500 text-[10px] md:text-sm truncate">{app.service}</p>
                      </div>
                      {app.status === 'Pendente' && (
                        <button onClick={() => confirmAppointmentPro(app.id)} className="bg-green-600 hover:bg-green-500 text-white rounded-lg p-1.5 md:p-2 transition-colors shrink-0">
                          <CheckCircle size={14} className="md:w-4 md:h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button for Professional */}
        <div className="absolute bottom-4 right-4 left-4 md:bottom-6 md:right-6 md:left-6 animate-fade-in-up flex flex-col gap-2">
          <button 
            onClick={() => setShowSaleModal(true)}
            className="w-full bg-neutral-800 text-white border border-neutral-700 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-medium text-sm md:text-base flex items-center justify-center gap-2 hover:bg-neutral-700 hover:border-[#D4AF37] transition-all shadow-lg"
          >
            <ShoppingCart size={16} className="md:w-[18px] md:h-[18px]" /> Registrar Venda
          </button>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="w-full bg-[#D4AF37] text-black py-3.5 md:py-4 rounded-xl md:rounded-2xl font-medium text-sm md:text-base shadow-[0_5px_20px_rgba(212,175,55,0.3)] md:shadow-[0_10px_40px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors"
          >
            <Plus size={18} className="md:w-5 md:h-5" /> Agendar Horário
          </button>
        </div>

        {/* Modal de Venda de Produto */}
        {showSaleModal && (
          <div className="absolute inset-0 bg-black/90 z-50 flex items-end sm:items-center justify-center animate-fade-in p-4">
            <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-5 md:p-6 relative animate-fade-in-up shadow-2xl max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowSaleModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-neutral-800 rounded-full p-1.5 md:p-1">
                <X size={16} className="md:w-5 md:h-5" />
              </button>
              
              <h3 className="text-lg md:text-xl font-medium text-white mb-1.5 md:mb-2 pr-8 flex items-center gap-2">
                <ShoppingCart className="text-[#D4AF37] w-4 h-4 md:w-5 md:h-5"/> Nova Venda
              </h3>
              <p className="text-[10px] md:text-sm text-neutral-400 mb-4 md:mb-6">Registre a saída do produto e garanta a sua comissão.</p>
              
              <form onSubmit={handleSaleSubmit} className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Produto Selecionado</label>
                  <select required value={saleData.productId} onChange={e => setSaleData({...saleData, productId: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none">
                    <option value="" disabled>Selecione o produto...</option>
                    {products.filter(p => p.stock > 0).map(p => (
                      <option key={p.id} value={p.id}>{p.name} - R$ {p.price} (Est. {p.stock})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 md:pt-4 border-t border-neutral-800 mt-2">
                  <label className="text-[10px] md:text-xs text-[#D4AF37] uppercase tracking-wider mb-1.5 md:mb-2 flex items-center gap-1">
                    <Lock size={10} className="md:w-3 md:h-3" /> Assinatura para Comissão
                  </label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Sua senha de acesso" 
                    value={saleData.authPass} 
                    onChange={e => setSaleData({...saleData, authPass: e.target.value})} 
                    className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-center text-sm md:text-base text-white tracking-[0.2em] md:tracking-[0.3em] focus:border-[#D4AF37] outline-none" 
                  />
                  <p className="text-[8px] md:text-[10px] text-neutral-500 mt-1.5 md:mt-2 text-center">A senha garante que a comissão será creditada a você.</p>
                </div>

                <Button type="submit" className="w-full mt-2 text-sm md:text-base py-3"><CheckCircle size={16} className="md:w-[18px] md:h-[18px]" /> Confirmar Venda</Button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Agendamento */}
        {showScheduleModal && (
          <div className="absolute inset-0 bg-black/90 z-50 flex items-end sm:items-center justify-center animate-fade-in p-4">
            <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-5 md:p-6 relative animate-fade-in-up shadow-2xl max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowScheduleModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-neutral-800 rounded-full p-1.5 md:p-1">
                <X size={16} className="md:w-5 md:h-5" />
              </button>
              
              <h3 className="text-lg md:text-xl font-medium text-white mb-4 md:mb-6 pr-8">Adicionar à Agenda</h3>
              
              <form onSubmit={handleScheduleSubmit} className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Horário</label>
                    <input type="time" required value={scheduleData.time} onChange={e => setScheduleData({...scheduleData, time: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Tipo</label>
                    <select required value={scheduleData.type} onChange={e => setScheduleData({...scheduleData, type: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none">
                      <option value="Agendamento">Agendamento</option>
                      <option value="Bloqueio Pessoal">Bloqueio Pessoal</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1 block">Cliente / Descrição</label>
                  <input type="text" required placeholder="Ex: Maria (Luzes)" value={scheduleData.client} onChange={e => setScheduleData({...scheduleData, client: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-sm md:text-base text-white focus:border-[#D4AF37] outline-none" />
                </div>

                <div className="pt-3 md:pt-4 border-t border-neutral-800 mt-2">
                  <label className="text-[10px] md:text-xs text-[#D4AF37] uppercase tracking-wider mb-1.5 md:mb-2 flex items-center gap-1">
                    <Lock size={10} className="md:w-3 md:h-3" /> Assinatura de Segurança
                  </label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Sua senha de acesso" 
                    value={scheduleData.authPass} 
                    onChange={e => setScheduleData({...scheduleData, authPass: e.target.value})} 
                    className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 md:p-3 text-center text-sm md:text-base text-white tracking-[0.2em] md:tracking-[0.3em] focus:border-[#D4AF37] outline-none" 
                  />
                  <p className="text-[8px] md:text-[10px] text-neutral-500 mt-1.5 md:mt-2 text-center">Somente você pode alterar sua agenda.</p>
                </div>

                <Button type="submit" className="w-full mt-2 text-sm md:text-base py-3"><CheckCircle size={16} className="md:w-[18px] md:h-[18px]" /> Lançar</Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// --- TV PANEL SCREEN ---

const TvPanelScreen = ({ activeCall, salonName, professionals, tvPlaylist, tvVideoFit, setView, branding }) => {
  const shortName = salonName.split(' ')[0].toUpperCase();
  const [currentVidIndex, setCurrentVidIndex] = useState(0);

  useEffect(() => {
    if (activeCall) {
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-airport-announcement-ding-1567.mp3');
      audio.play().catch(e => console.log('O navegador bloqueou o áudio automático.'));
    }
  }, [activeCall]);

  const handleVideoEnd = () => {
    if (tvPlaylist.length > 0) {
      setCurrentVidIndex((prev) => (prev + 1) % tvPlaylist.length);
    }
  };

  useEffect(() => {
    if (currentVidIndex >= tvPlaylist.length) {
      setCurrentVidIndex(0);
    }
  }, [tvPlaylist.length, currentVidIndex]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative">
      
      <button 
        onClick={() => setView('admin')} 
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 p-2.5 md:p-3 bg-neutral-900/80 border border-neutral-700 text-white rounded-full opacity-30 hover:opacity-100 transition-all flex items-center gap-1.5 md:gap-2"
      >
        <ChevronLeft size={16} /> <span className="text-xs md:text-sm font-medium">Voltar ao Admin</span>
      </button>

      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src={branding?.tvBg || ''} 
          className="w-full h-full object-cover object-center scale-105"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black z-10" />
      </div>

      {!activeCall && tvPlaylist.length > 0 && tvPlaylist[currentVidIndex] && (
        <div className="absolute inset-0 z-10 animate-fade-in transition-all bg-black flex items-center justify-center">
          <div className="w-full h-full max-h-screen">
             <video 
              src={tvPlaylist[currentVidIndex].url}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              className={`w-full h-full bg-black ${tvVideoFit === 'cover' ? 'object-cover opacity-90' : 'object-contain opacity-100'}`}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 md:p-6 pt-16 md:pt-24 z-20">
            <p className="text-xs md:text-sm text-neutral-300 uppercase tracking-widest ml-2 md:ml-4 mb-1 md:mb-2">Apoio: <span className="text-white font-medium">{tvPlaylist[currentVidIndex].name.replace(/\.[^/.]+$/, "")}</span></p>
          </div>
        </div>
      )}

      <div className="relative z-30 text-center px-4 w-full max-w-5xl pointer-events-none">
        {activeCall ? (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl md:text-4xl lg:text-5xl text-[#D4AF37] font-light mb-4 md:mb-8 uppercase tracking-widest drop-shadow-md">
              Chegou a sua vez
            </h2>
            <h1 className="text-5xl sm:text-7xl md:text-[120px] font-bold text-green-400 animate-pulse mb-6 md:mb-8 tracking-tight leading-none drop-shadow-[0_0_30px_rgba(74,222,128,0.5)]">
              {activeCall.client.split(' ')[0]}
            </h1>
            <div className="mt-8 md:mt-12 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl md:rounded-3xl p-6 md:p-8 inline-block shadow-2xl">
              <p className="text-lg md:text-2xl text-neutral-400 mb-1 md:mb-2">Por favor, dirija-se ao profissional</p>
              <p className="text-2xl md:text-4xl text-white font-medium">
                {professionals.find(p => p.id === activeCall.proId)?.name || 'Nossa Equipe'}
              </p>
              <p className="text-base md:text-xl text-[#D4AF37] mt-2 md:mt-4">{activeCall.service}</p>
            </div>
          </div>
        ) : (
          tvPlaylist.length === 0 && (
            <div className="animate-fade-in opacity-40 transition-opacity duration-1000">
              <h1 className="text-4xl sm:text-6xl md:text-9xl font-serif text-[#D4AF37] tracking-[0.2em] drop-shadow-lg">{shortName}</h1>
              <p className="text-base md:text-2xl text-neutral-500 mt-4 md:mt-8 tracking-widest uppercase font-light">Aguarde ser chamado(a)</p>
            </div>
          )
        )}
      </div>

      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-1.5 md:gap-2 text-neutral-400 text-xs md:text-sm z-40 bg-black/40 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-white/5">
        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
        Painel TV
      </div>
    </div>
  );
};

// --- MÓDULO SPOTIFY FULL SCREEN ---

const SpotifyScreen = ({ setView, spotifyUrl }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col relative animate-fade-in">
      <div className="p-4 md:p-6 pb-3 md:pb-4 border-b border-neutral-900 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-20">
        <button onClick={() => setView('admin')} className="text-neutral-500 hover:text-white flex items-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm">
          <ChevronLeft size={16} /> Voltar
        </button>
        <div className="text-[#1DB954] font-bold tracking-widest flex items-center gap-1.5 md:gap-2 uppercase text-xs md:text-base">
          <SpotifyIcon size={18} className="md:w-5 md:h-5" /> Player Musical
        </div>
        <div className="w-16 md:w-20"></div> 
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8">
        {spotifyUrl ? (
          <div className="w-full max-w-5xl aspect-square sm:aspect-video max-h-[75vh] bg-neutral-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(29,185,84,0.1)] border border-neutral-800">
            <iframe 
              src={spotifyUrl} 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allowtransparency="true" 
              allow="encrypted-media"
              title="Spotify Full Player"
            ></iframe>
          </div>
        ) : (
          <div className="text-neutral-500 flex flex-col items-center text-center px-4">
            <Music size={40} className="mb-3 opacity-20 md:w-12 md:h-12 md:mb-4" />
            <p className="text-sm md:text-base">Nenhuma playlist configurada. Adicione o link nas Configurações do Admin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MÓDULO IPTV FULL SCREEN ---

const IptvScreen = ({ setView, iptvUrl }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col relative animate-fade-in">
      <div className="p-4 md:p-6 pb-3 md:pb-4 border-b border-neutral-900 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-20">
        <button onClick={() => setView('admin')} className="text-neutral-500 hover:text-white flex items-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm">
          <ChevronLeft size={16} /> Voltar
        </button>
        <div className="text-blue-500 font-bold tracking-widest flex items-center gap-1.5 md:gap-2 uppercase text-xs md:text-base">
          <Tv size={18} className="md:w-5 md:h-5" /> Player IPTV
        </div>
        {iptvUrl ? (
          <a href={iptvUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs text-neutral-400 hover:text-white border border-neutral-700 rounded-md md:rounded-lg px-2 py-1 md:px-3 md:py-1.5 transition-colors flex items-center shrink-0 text-center leading-none">
            <span className="hidden sm:inline">Abrir em</span> Nova Aba <ArrowUpRight size={10} className="ml-1 md:w-3 md:h-3"/>
          </a>
        ) : (
          <div className="w-16 md:w-20"></div>
        )}
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8">
        {iptvUrl ? (
          <div className="w-full max-w-6xl aspect-video max-h-[75vh] bg-neutral-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)] border border-neutral-800 relative">
            <iframe 
              src={iptvUrl} 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allowFullScreen
              allow="encrypted-media"
              title="IPTV Full Player"
              className="absolute inset-0"
            ></iframe>
          </div>
        ) : (
          <div className="text-neutral-500 flex flex-col items-center text-center px-4">
            <Tv size={40} className="mb-3 opacity-20 md:w-12 md:h-12 md:mb-4" />
            <p className="text-sm md:text-base">Nenhum Web Player configurado. Adicione o link nas Configurações do Admin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MÓDULO MASTER (DESENVOLVEDOR) ---

const MasterDashboard = ({ setView, subscriptionDueDate, setSubscriptionDueDate, premiumFeatures, setPremiumFeatures, branding, setBranding }) => {
  const today = new Date('2026-04-11T00:00:00'); // Simulando "hoje"
  const dueDate = new Date(subscriptionDueDate);
  const diffTime = dueDate - today;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const add30Days = () => {
    const newDate = new Date(dueDate);
    newDate.setDate(newDate.getDate() + 30);
    setSubscriptionDueDate(newDate.toISOString());
    alert('Licença estendida por 30 dias na nuvem com sucesso!');
  };

  const forceBlock = () => {
    const newDate = new Date(today);
    newDate.setDate(newDate.getDate() - 1);
    setSubscriptionDueDate(newDate.toISOString());
    alert('Sistema Bloqueado na Nuvem Imediatamente.');
  };

  const handleImageUrlChange = (target, index = null) => {
    const url = prompt("Cole o link (URL) da nova imagem online:");
    if (!url) return;

    if (target === 'landingBg') {
      setBranding(prev => ({ ...prev, landingBg: url }));
    } else if (target === 'tvBg') {
      setBranding(prev => ({ ...prev, tvBg: url }));
    } else if (target === 'instagram') {
      setBranding(prev => {
        const newImgs = [...prev?.instagramImgs || []];
        newImgs[index] = url;
        return { ...prev, instagramImgs: newImgs };
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto mt-6 md:mt-12">
        <h1 className="text-2xl md:text-3xl font-light mb-2 flex items-center gap-2 md:gap-3">
          <ShieldCheck className="text-blue-500 w-6 h-6 md:w-8 md:h-8" /> Painel Master
        </h1>
        <p className="text-sm md:text-base text-neutral-500 mb-6 md:mb-8">Gestão de Licenciamento, Nuvem e Setup do Sistema</p>

        {/* --- NOVO: MÓDULO WHITE LABEL --- */}
        <Card className="mb-6 md:mb-8 p-5 md:p-6 border-blue-900/30">
          <h2 className="text-lg md:text-xl font-medium mb-3 md:mb-4 flex items-center gap-2"><ImageIcon className="text-[#D4AF37] w-5 h-5 md:w-6 md:h-6"/> White Label (Nuvem)</h2>
          <p className="text-xs md:text-sm text-neutral-500 mb-4 md:mb-6">Insira links (URLs) das imagens para atualizar o visual do cliente na base de dados.</p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fundo do Site */}
              <div className="bg-black border border-neutral-800 rounded-xl p-4">
                <p className="text-sm font-medium mb-2">Fundo da Página Inicial</p>
                <div className="aspect-video w-full bg-neutral-900 rounded-lg overflow-hidden mb-3 relative group">
                  <img src={branding?.landingBg || ''} alt="Background Site" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleImageUrlChange('landingBg')} className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <LinkIcon size={16} /> Inserir Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Fundo da TV */}
              <div className="bg-black border border-neutral-800 rounded-xl p-4">
                <p className="text-sm font-medium mb-2">Fundo da Tela da TV</p>
                <div className="aspect-video w-full bg-neutral-900 rounded-lg overflow-hidden mb-3 relative group">
                  <img src={branding?.tvBg || ''} alt="Background TV" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleImageUrlChange('tvBg')} className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <LinkIcon size={16} /> Inserir Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagens do Instagram */}
            <div className="bg-black border border-neutral-800 rounded-xl p-4">
               <p className="text-sm font-medium mb-4">Galeria de Portfólio (Imagens Online)</p>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {branding?.instagramImgs?.map((imgUrl, idx) => (
                   <div key={idx} className="aspect-square w-full bg-neutral-900 rounded-lg overflow-hidden relative group border border-neutral-800">
                     <img src={imgUrl} alt={`Insta ${idx}`} className="w-full h-full object-cover opacity-70" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleImageUrlChange('instagram', idx)} className="bg-neutral-800 text-white p-2 rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors">
                         <LinkIcon size={16} />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </Card>

        <Card className="mb-6 md:mb-8 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-medium mb-4">Status da Licença Cloud</h2>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
            <div>
              <p className="text-[10px] md:text-sm text-neutral-400 uppercase tracking-wider mb-1">Vencimento Programado</p>
              <p className="text-xl md:text-2xl">{dueDate.toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] md:text-sm text-neutral-400 uppercase tracking-wider mb-1">Dias Restantes</p>
              <p className={`text-3xl md:text-4xl font-bold ${daysRemaining <= 0 ? 'text-red-500' : daysRemaining <= 5 ? 'text-orange-500' : 'text-green-500'}`}>
                {daysRemaining <= 0 ? 'Expirado' : daysRemaining}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 border-t border-neutral-800 pt-4 md:pt-6">
            <Button onClick={add30Days} className="bg-blue-600 text-white hover:bg-blue-700 text-sm md:text-base py-3">
              <Plus size={16} className="md:w-[18px] md:h-[18px]" /> Adicionar 30 Dias
            </Button>
            <Button onClick={forceBlock} variant="danger" className="text-sm md:text-base py-3">
              <Lock size={16} className="md:w-[18px] md:h-[18px]" /> Bloquear Agora
            </Button>
          </div>
        </Card>

        <Card className="mb-6 md:mb-8 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-medium mb-3 md:mb-4 flex items-center gap-2"><Award className="text-[#D4AF37] w-5 h-5 md:w-6 md:h-6"/> Módulos Premium</h2>
          <p className="text-xs md:text-sm text-neutral-500 mb-4 md:mb-6">Ative ou desative as funcionalidades extras comercializadas separadamente para este cliente.</p>
          
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between p-3 md:p-4 bg-black rounded-xl border border-neutral-800 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                 <div className="p-2 bg-[#1DB954]/10 rounded-lg shrink-0"><Music className="text-[#1DB954]" size={18} /></div>
                 <div className="min-w-0">
                   <p className="font-medium text-sm md:text-base truncate">Spotify Player</p>
                   <p className="text-[10px] md:text-xs text-neutral-500 truncate">Música em tela cheia</p>
                 </div>
              </div>
              <div 
                 onClick={() => setPremiumFeatures({...premiumFeatures, spotify: !premiumFeatures.spotify})}
                 className={`w-10 h-5 md:w-12 md:h-6 rounded-full relative cursor-pointer transition-colors shadow-inner shrink-0 ${premiumFeatures.spotify ? 'bg-green-500' : 'bg-neutral-800'}`}>
                <div className={`w-3.5 h-3.5 md:w-4 md:h-4 bg-white rounded-full absolute top-[3px] md:top-1 shadow-sm transition-transform ${premiumFeatures.spotify ? 'right-[3px] md:right-1 translate-x-0' : 'left-[3px] md:left-1 translate-x-0'}`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 bg-black rounded-xl border border-neutral-800 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                 <div className="p-2 bg-blue-500/10 rounded-lg shrink-0"><Tv className="text-blue-500" size={18} /></div>
                 <div className="min-w-0">
                   <p className="font-medium text-sm md:text-base truncate">Web Player IPTV</p>
                   <p className="text-[10px] md:text-xs text-neutral-500 truncate">Filmes e Canais na TV</p>
                 </div>
              </div>
              <div 
                 onClick={() => setPremiumFeatures({...premiumFeatures, iptv: !premiumFeatures.iptv})}
                 className={`w-10 h-5 md:w-12 md:h-6 rounded-full relative cursor-pointer transition-colors shadow-inner shrink-0 ${premiumFeatures.iptv ? 'bg-green-500' : 'bg-neutral-800'}`}>
                <div className={`w-3.5 h-3.5 md:w-4 md:h-4 bg-white rounded-full absolute top-[3px] md:top-1 shadow-sm transition-transform ${premiumFeatures.iptv ? 'right-[3px] md:right-1 translate-x-0' : 'left-[3px] md:left-1 translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-3 md:gap-4">
          <Button onClick={() => setView('admin')} variant="outline" className="w-full text-sm md:text-base py-3 md:py-4">
            <Settings size={16} className="md:w-5 md:h-5" /> Sair do Master e Entrar no Salão
          </Button>
          <Button onClick={() => setView('landing')} variant="ghost" className="w-full text-sm md:text-base py-3 md:py-4">
            Voltar ao Site Principal
          </Button>
        </div>
      </div>
    </div>
  );
};

const BlockedScreen = () => {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-6 animate-fade-in relative">
      <ShieldAlert size={48} className="text-red-500 mb-4 md:mb-6 animate-pulse md:w-16 md:h-16" />
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-white mb-3 md:mb-4">Sistema Suspenso</h1>
      <p className="text-neutral-400 text-sm md:text-lg max-w-md mb-6 md:mb-8 leading-relaxed">
        Sua licença de uso expirou. Por favor, regularize o pagamento para restaurar o acesso imediato e total ao seu salão.
      </p>
    </div>
  );
};

// --- APP COMPONENT (ROOT COM FIREBASE) ---

export default function App() {
  const [view, setView] = useState('landing');
  const [theme, setTheme] = useState('dark'); 
  const [activeCall, setActiveCall] = useState(null);
  const [loggedPro, setLoggedPro] = useState(null);

  const [masterMode, setMasterMode] = useState(false);
  const [showMasterLogin, setShowMasterLogin] = useState(false);
  const [masterPassInput, setMasterPassInput] = useState('');
  const [masterError, setMasterError] = useState(false);

  // --- FIREBASE STATES ---
  const [user, setUser] = useState(null);
  const [dbState, setDbState] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // 1. Inicializa a Autenticação do Firebase
  useEffect(() => {
    const initAuth = async () => {
      if (!auth) return;
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Erro na autenticação do Firebase", e);
      }
    };
    initAuth();

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return () => unsubscribe();
    }
  }, []);

  // 2. Sincroniza em Tempo Real o Banco de Dados
  useEffect(() => {
    if (!user || !db) return;

    // Criamos um Documento único na Cloud que guarda TODO o estado do salão (reduz leituras e aumenta velocidade)
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'salon_state', 'core');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setDbState(docSnap.data());
        setLoadingData(false);
      } else {
        // Se a base de dados estiver vazia (Primeira vez), injetamos os dados iniciais
        const initialState = {
          salonName: 'Donna Embelezamento',
          tvVideoFit: 'contain',
          tvPlaylist: [
            { id: 1, name: 'Propaganda Padrão - Sistema Donna', url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-rubbing-lotion-on-her-hands-4886-large.mp4' }
          ],
          spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZtZ8vUCzceJ?utm_source=generator&theme=0',
          iptvUrl: '',
          appointments: MOCK_APPOINTMENTS,
          professionals: INITIAL_PROFESSIONALS,
          products: INITIAL_PRODUCTS,
          sales: [],
          clients: MOCK_CLIENTS,
          expenses: [
            { id: 1, date: '10/04/2026', description: 'Compra: Produtos L\'Oréal', category: 'Fornecedor', value: 1200 },
            { id: 2, date: '11/04/2026', description: 'Conta de Luz', category: 'Custos Fixos', value: 450 }
          ],
          premiumFeatures: { spotify: false, iptv: false },
          subscriptionDueDate: '2026-04-15T00:00:00',
          branding: {
            landingBg: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1920&q=80',
            tvBg: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1920&q=80',
            instagramImgs: [
              'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1600948836101-f9ff16013a7b?auto=format&fit=crop&w=300&q=80'
            ]
          }
        };
        setDoc(docRef, initialState);
      }
    }, (error) => {
      console.error("Erro ao ler dados da nuvem:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Função centralizada para guardar dados no Firebase
  const updateGlobalState = (partialState) => {
    if (!db || !user) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'salon_state', 'core');
    // A opção "merge: true" garante que só altera o que você enviar, mantendo o resto intacto na nuvem
    setDoc(docRef, partialState, { merge: true });
  };


  // --- CONTROLO DO ATALHO MASTER (CTRL + ALT + A) ---
  const handleMasterAuth = (e) => {
    e.preventDefault();
    if (masterPassInput === 'master2026') { 
      setMasterMode(true);
      setShowMasterLogin(false);
      setView('master');
      setMasterError(false);
      setMasterPassInput('');
    } else {
      setMasterError(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowMasterLogin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let timer;
    if (activeCall) {
      timer = setTimeout(() => {
        setActiveCall(null);
      }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [activeCall]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Tela de Carregamento Luxuosa enquanto liga ao Banco de Dados
  if (loadingData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#D4AF37]">
        <div className="w-12 h-12 border-t-2 border-[#D4AF37] border-solid rounded-full animate-spin mb-6"></div>
        <p className="font-serif tracking-widest text-sm animate-pulse">A SINCRONIZAR COM A NUVEM...</p>
      </div>
    );
  }

  // --- DESCONSTRUIR DADOS DA NUVEM (Com Fallbacks de segurança) ---
  const {
    salonName = 'Donna Embelezamento',
    tvVideoFit = 'contain',
    tvPlaylist = [],
    spotifyUrl = '',
    iptvUrl = '',
    appointments = [],
    professionals = [],
    products = [],
    sales = [],
    clients = [],
    expenses = [],
    premiumFeatures = { spotify: false, iptv: false },
    subscriptionDueDate = '2026-04-15T00:00:00',
    branding = {}
  } = dbState || {};

  // --- CRIADORES DE ATUALIZAÇÃO (WRAPPERS) PARA O FIREBASE ---
  // Isto permite que o resto do sistema continue a funcionar exatamente como antes, 
  // mas agora cada "set" envia os dados diretos para a nuvem!
  const makeSetter = (key, currentValue) => (val) => {
    const nextValue = typeof val === 'function' ? val(currentValue) : val;
    updateGlobalState({ [key]: nextValue });
  };

  const setSalonName = makeSetter('salonName', salonName);
  const setTvVideoFit = makeSetter('tvVideoFit', tvVideoFit);
  const setTvPlaylist = makeSetter('tvPlaylist', tvPlaylist);
  const setSpotifyUrl = makeSetter('spotifyUrl', spotifyUrl);
  const setIptvUrl = makeSetter('iptvUrl', iptvUrl);
  const setAppointments = makeSetter('appointments', appointments);
  const setProfessionals = makeSetter('professionals', professionals);
  const setProducts = makeSetter('products', products);
  const setSales = makeSetter('sales', sales);
  const setClients = makeSetter('clients', clients);
  const setExpenses = makeSetter('expenses', expenses);
  const setPremiumFeatures = makeSetter('premiumFeatures', premiumFeatures);
  const setSubscriptionDueDate = makeSetter('subscriptionDueDate', subscriptionDueDate);
  const setBranding = makeSetter('branding', branding);

  // Cálculos de Bloqueio da Nuvem
  const today = new Date('2026-04-11T00:00:00'); 
  const dueDate = new Date(subscriptionDueDate);
  const diffTime = dueDate - today;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isBlocked = daysRemaining <= 0 && !masterMode;
  const isWarning = daysRemaining > 0 && daysRemaining <= 5 && !masterMode;


  // Bloqueio Global do Sistema
  if (isBlocked && view !== 'master') {
    return (
      <>
        <BlockedScreen />
        {showMasterLogin && (
          <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4 animate-fade-in backdrop-blur-md">
            <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-5 md:p-6 relative shadow-2xl">
              <button onClick={() => setShowMasterLogin(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-neutral-800 rounded-full p-1.5 md:p-1">
                <X size={18} className="md:w-5 md:h-5" />
              </button>
              <h3 className="text-lg md:text-xl font-light mb-4 flex items-center gap-2 text-white"><Key className="text-blue-500 w-4 h-4 md:w-5 md:h-5"/> Acesso Master</h3>
              <form onSubmit={handleMasterAuth} className="space-y-3 md:space-y-4">
                <input 
                  type="password" 
                  placeholder="Senha Master"
                  value={masterPassInput}
                  onChange={e => setMasterPassInput(e.target.value)}
                  className={`w-full bg-black border ${masterError ? 'border-red-500 text-red-500' : 'border-neutral-800 text-white'} rounded-xl p-2.5 md:p-3 text-sm md:text-base focus:border-blue-500 outline-none`}
                  autoFocus
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base py-2.5 md:py-3">Verificar</Button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`font-sans antialiased min-h-screen relative ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#FAFAFA] text-black'} transition-colors duration-500 overflow-x-hidden`}>
      
      {/* ALERTA GLOBAL DE VENCIMENTO DO SISTEMA */}
      {isWarning && (view === 'admin' || view === 'pro_app') && (
        <div className="bg-red-600 text-white text-center py-2 px-3 md:px-4 text-[10px] sm:text-xs md:text-sm font-medium flex justify-center items-center gap-1.5 md:gap-2 z-50 sticky top-0 shadow-lg animate-fade-in leading-snug">
          <ShieldAlert size={14} className="md:w-4 md:h-4 shrink-0" />
          <span>Atenção: A sua licença irá bloquear em <strong>{daysRemaining} dia(s)</strong>. Regularize.</span>
        </div>
      )}

      {/* ROTEAMENTO DE VISÕES */}
      {view === 'landing' && <LandingPage setView={setView} salonName={salonName} branding={branding} />}
      {view === 'booking' && <BookingFlow setView={setView} professionals={professionals} salonName={salonName} appointments={appointments} setAppointments={setAppointments} />}
      {view === 'auth' && <AuthScreen setView={setView} professionals={professionals} setLoggedPro={setLoggedPro} />}
      {view === 'admin' && <AdminDashboard setView={setView} appointments={appointments} setAppointments={setAppointments} professionals={professionals} setProfessionals={setProfessionals} products={products} setProducts={setProducts} sales={sales} setSales={setSales} salonName={salonName} setSalonName={setSalonName} clients={clients} setClients={setClients} setActiveCall={setActiveCall} tvPlaylist={tvPlaylist} setTvPlaylist={setTvPlaylist} tvVideoFit={tvVideoFit} setTvVideoFit={setTvVideoFit} expenses={expenses} setExpenses={setExpenses} spotifyUrl={spotifyUrl} setSpotifyUrl={setSpotifyUrl} iptvUrl={iptvUrl} setIptvUrl={setIptvUrl} premiumFeatures={premiumFeatures} />}
      {view === 'client' && <ClientDashboard setView={setView} theme={theme} setTheme={setTheme} salonName={salonName} />}
      {view === 'pro_app' && <ProfessionalApp setView={setView} loggedPro={loggedPro} appointments={appointments} setAppointments={setAppointments} professionals={professionals} products={products} setProducts={setProducts} sales={sales} setSales={setSales} salonName={salonName} setActiveCall={setActiveCall} />}
      {view === 'tv' && <TvPanelScreen activeCall={activeCall} salonName={salonName} professionals={professionals} tvPlaylist={tvPlaylist} tvVideoFit={tvVideoFit} setView={setView} branding={branding} />}
      {view === 'spotify' && <SpotifyScreen setView={setView} spotifyUrl={spotifyUrl} />}
      {view === 'iptv' && <IptvScreen setView={setView} iptvUrl={iptvUrl} />}
      {view === 'master' && <MasterDashboard setView={setView} subscriptionDueDate={subscriptionDueDate} setSubscriptionDueDate={setSubscriptionDueDate} premiumFeatures={premiumFeatures} setPremiumFeatures={setPremiumFeatures} branding={branding} setBranding={setBranding} />}

      {/* Modal Master Global (Disparado pelo atalho Ctrl+Alt+A) */}
      {showMasterLogin && view !== 'master' && !isBlocked && (
        <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4 animate-fade-in backdrop-blur-md">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-5 md:p-6 relative shadow-2xl">
            <button onClick={() => setShowMasterLogin(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-neutral-800 rounded-full p-1.5 md:p-1">
              <X size={18} className="md:w-5 md:h-5" />
            </button>
            <h3 className="text-lg md:text-xl font-light mb-4 flex items-center gap-2 text-white"><Key className="text-blue-500 w-4 h-4 md:w-5 md:h-5"/> Acesso Master</h3>
            <form onSubmit={handleMasterAuth} className="space-y-3 md:space-y-4">
              <input 
                type="password" 
                placeholder="Senha Master"
                value={masterPassInput}
                onChange={e => setMasterPassInput(e.target.value)}
                className={`w-full bg-black border ${masterError ? 'border-red-500 text-red-500' : 'border-neutral-800 text-white'} rounded-xl p-2.5 md:p-3 text-sm md:text-base focus:border-blue-500 outline-none`}
                autoFocus
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base py-2.5 md:py-3">Verificar</Button>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-slow-zoom { animation: slow-zoom 20s infinite alternate linear; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        /* Hide scrollbar */
        ::-webkit-scrollbar { width: 0px; background: transparent; }
        
        body {
          background-color: black;
          color: white;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        `}
      </style>
    </div>
  );
}