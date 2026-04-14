import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  Calendar, Users, Settings, DollarSign, ShoppingBag, MessageSquare, 
  ChevronRight, Star, Clock, Scissors, TrendingUp, Plus, User, Menu, X,
  CheckCircle, Award, Smartphone, LayoutDashboard, LogOut, ChevronLeft,
  Package, ArrowUpRight, ArrowDownRight, Gift, History, Bell, Moon, Sun, 
  Lock, Briefcase, ShoppingCart, Receipt, Trash2, Heart, MessageCircle, 
  Megaphone, MonitorPlay, Video, ShieldAlert, Key, ShieldCheck, Music, 
  Tv, Shield, Image as ImageIcon, Link as LinkIcon, Palette, Instagram,
  Volume2, VolumeX
} from 'lucide-react';

// --- CONFIGURAÇÃO DO FIREBASE ---
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
  appId = typeof __app_id !== 'undefined' ? __app_id : 'donna-salon-cloud';
} catch (error) {
  console.error("Erro Firebase:", error);
}

// --- COMPONENTES BASE ---

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
    primary: 'bg-theme text-black hover:brightness-110',
    outline: 'border border-theme text-theme hover:bg-theme hover:text-black',
    ghost: 'text-neutral-400 hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  return (
    <button 
      type={type} onClick={onClick} disabled={disabled}
      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- DADOS INICIAIS (FALLBACK) ---

const INITIAL_SERVICES = [
  { id: 1, name: 'Corte Visagista', price: 250, time: '60 min', category: 'Cabelo', intervalDays: 60, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Coloração Premium', price: 480, time: '120 min', category: 'Cabelo', intervalDays: 15, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Manicure Spa', price: 120, time: '45 min', category: 'Estética', intervalDays: 5, image: 'https://images.unsplash.com/photo-1610991140665-013547f41420?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Hidratação de Caviar', price: 350, time: '90 min', category: 'Tratamentos', intervalDays: 30, image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=400&q=80' },
];

const INITIAL_PRODUCTS = [
  { id: 101, name: 'Shampoo Caviar 1L', price: 120, stock: 10, image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=400&q=80', description: 'Limpeza suave com extrato de caviar para brilho intenso.' },
  { id: 102, name: 'Condicionador Platinum 1L', price: 170, stock: 8, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', description: 'Hidratação profunda para fios loiros e platinados.' },
  { id: 103, name: 'Óleo Argan Premium', price: 220, stock: 15, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80', description: 'Brilho intenso, reparação de pontas e proteção térmica.' },
  { id: 104, name: 'Máscara Reconstrutora', price: 190, stock: 12, image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=400&q=80', description: 'Reconstrução capilar avançada para fios danificados.' }
];

const INITIAL_PROFESSIONALS = [
  { id: 1, name: 'Helena Soares', role: 'Master Stylist', rating: 4.9, password: '1234', image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80', commissions: { 1: 50, 2: 40, 3: 30, 4: 40 }, productCommissions: { 101: 10, 102: 10, 103: 15 } },
  { id: 2, name: 'Marcus Vinícius', role: 'Color Specialist', rating: 5.0, password: '1234', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', commissions: { 1: 40, 2: 60, 3: 30, 4: 40 }, productCommissions: { 101: 15, 102: 15, 103: 20 } },
];

const MOCK_APPOINTMENTS = [
  { id: 101, client: 'Mariana Silva', service: 'Corte Visagista', time: '14:00', status: 'Confirmado', value: 250, proId: 1, registeredBy: 'Sistema' },
  { id: 102, client: 'Julia Costa', service: 'Coloração Premium', time: '15:30', status: 'Pendente', value: 480, proId: 1, registeredBy: 'Website' },
];

const MOCK_CLIENTS = [
  { id: 1, name: 'Mariana Silva', phone: '5511999999991', lastServiceId: 1, lastServiceName: 'Corte Visagista', lastVisit: '05/04/2026' },
  { id: 2, name: 'Julia Costa', phone: '5511999999992', lastServiceId: 2, lastServiceName: 'Coloração Premium', lastVisit: '26/03/2026' },
];

// --- LANDING PAGE ---

const LandingPage = ({ setView, salonName, branding, products = [], onProductClick }) => {
  const shortName = (salonName || "DONNA").split(' ')[0].toUpperCase();

  return (
    <div className="bg-black text-white transition-colors duration-500 overflow-x-hidden">
      <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-theme font-serif tracking-widest text-lg pt-1">{shortName}</div>
        <div className="flex flex-col items-end gap-2">
          <button onClick={() => setView('client_login')} className="flex items-center gap-2 text-sm font-medium hover:text-theme transition-colors"><User size={16} /> Área do Cliente</button>
          <button onClick={(e) => { e.preventDefault(); setView('auth'); }} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-400 hover:text-white transition-colors"><Lock size={10} className="sm:w-3 sm:h-3" /> Acesso Restrito / Equipe</button>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16 px-4 md:pt-40 md:pb-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 z-10" />
          <img src={branding?.landingBg || 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1920&q=80'} className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-40" alt="" />
        </div>
        
        <div className="relative z-20 text-center w-full max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-theme-10 border border-theme-30 text-theme mb-8 animate-fade-in-up">
            <Star size={14} fill="currentColor" />
            <span className="text-xs uppercase tracking-widest font-bold">A {shortName} Evoluiu</span>
            <Star size={14} fill="currentColor" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light mb-6 leading-tight animate-fade-in-up delay-100">
            O seu momento de beleza,<br/>
            <span className="italic font-serif text-theme drop-shadow-lg">agora com tecnologia de luxo.</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light animate-fade-in-up delay-200 leading-relaxed">
            Reinventamos o nosso atendimento para valorizar o seu tempo. Um novo sistema pensado exclusivamente para o seu conforto, transparência e benefícios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Button onClick={() => setView('booking')} className="px-10 py-4 text-base shadow-theme">Agendar Horário</Button>
            <Button variant="outline" onClick={() => setView('client_login')} className="px-10 py-4 text-base border-neutral-700 text-neutral-300 hover:border-theme hover:text-theme bg-black/40 backdrop-blur-md">Minha Área VIP</Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto border-y border-neutral-900 bg-neutral-950/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Tudo pensado para você</h2>
          <p className="text-neutral-500 font-light max-w-2xl mx-auto">Conheça as facilidades que trouxemos para tornar a sua experiência connosco ainda mais inesquecível.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-black p-8 rounded-3xl border border-neutral-800 hover:border-theme transition-colors group">
            <Smartphone className="text-theme mb-6 group-hover:scale-110 transition-transform" size={36} />
            <h3 className="text-xl font-medium mb-3">Agendamento 24h</h3>
            <p className="text-neutral-500 text-sm font-light leading-relaxed">Faça a sua reserva a qualquer momento. Escolha o serviço, o profissional e o horário ideal diretamente do seu telemóvel.</p>
          </div>

          <div className="bg-black p-8 rounded-3xl border border-neutral-800 hover:border-theme transition-colors group">
            <MessageSquare className="text-theme mb-6 group-hover:scale-110 transition-transform" size={36} />
            <h3 className="text-xl font-medium mb-3">Avisos no WhatsApp</h3>
            <p className="text-neutral-500 text-sm font-light leading-relaxed">Sem preocupações! O nosso sistema envia lembretes automáticos e carinhosos para o avisar da sua marcação.</p>
          </div>

          <div className="bg-black p-8 rounded-3xl border border-neutral-800 hover:border-theme transition-colors group">
            <Gift className="text-theme mb-6 group-hover:scale-110 transition-transform" size={36} />
            <h3 className="text-xl font-medium mb-3">Clube de Fidelidade</h3>
            <p className="text-neutral-500 text-sm font-light leading-relaxed">Sabe aquele cuidado especial? Agora ele gera pontos na sua conta que podem ser trocados por mimos e descontos exclusivos.</p>
          </div>

          <div className="bg-black p-8 rounded-3xl border border-neutral-800 hover:border-theme transition-colors group">
            <History className="text-theme mb-6 group-hover:scale-110 transition-transform" size={36} />
            <h3 className="text-xl font-medium mb-3">A sua Área Vip</h3>
            <p className="text-neutral-500 text-sm font-light leading-relaxed">Aceda à "Área do Cliente" para ter controlo total. Veja o seu histórico de serviços, pontuação do clube e muito mais.</p>
          </div>
        </div>
      </section>

      {/* BOUTIQUE CAROUSEL */}
      <section className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-4xl font-light mb-2">Boutique Exclusiva</h2>
            <p className="text-neutral-500 font-light">Leve a nossa qualidade profissional para casa.</p>
          </div>
          <button onClick={() => setView('store')} className="text-theme text-sm font-medium hover:underline hidden md:block">
            Ver todos os produtos
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {products.map(p => (
            <div key={p.id} onClick={() => onProductClick(p)} className="min-w-[240px] md:min-w-[280px] snap-start cursor-pointer group">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 mb-4 border border-neutral-800 group-hover:border-theme transition-colors relative">
                <img src={p.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="bg-theme text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                     <ShoppingBag size={16} /> Comprar
                   </span>
                </div>
              </div>
              <h4 className="text-base md:text-lg font-medium text-white mb-1 truncate">{p.name}</h4>
              <p className="text-theme font-medium">R$ {p.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setView('store')} className="w-full py-4 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white md:hidden mt-4">
          Ver todos os produtos
        </button>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="text-center mb-12">
          <a href={branding?.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 hover:border-theme text-theme mb-6 transition-colors group">
            <Instagram size={32} className="group-hover:scale-110 transition-transform" />
          </a>
          <h2 className="text-2xl md:text-4xl font-light mb-4">Acompanhe o nosso Portfólio</h2>
          <a href={branding?.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-theme font-light transition-colors">
            Siga a nossa equipa no Instagram
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(branding?.instagramImgs || []).map((img, i) => (
            <a key={i} href={branding?.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-xl aspect-square block border border-neutral-800 hover:border-theme transition-colors">
              <img src={img} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" alt={`Portfolio ${i}`} />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white" size={32} />
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="py-12 px-6 flex flex-col items-center gap-6 text-neutral-600 relative bg-neutral-950">
        <div className="flex gap-6 text-sm">
          <a href={branding?.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-theme flex items-center gap-2 transition-colors"><Instagram size={16}/> Instagram</a>
          <button onClick={(e) => { e.preventDefault(); setView('auth'); }} className="hover:text-white flex items-center gap-2 transition-colors"><Lock size={16}/> Acesso Equipe</button>
        </div>
        <p className="text-xs">© 2026 {salonName}. Plataforma SaaS.</p>
      </footer>
    </div>
  );
};

// --- AUTH SCREEN ---

const AuthScreen = ({ setView, professionals, setLoggedPro, adminSettings, setShowMasterLogin }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const adminProfile = { id: 'admin', name: adminSettings?.name || 'Proprietário', role: 'Acesso Total ao Sistema', isAdmin: true, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80' };
  const allProfiles = [adminProfile, ...professionals];

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedProfile.isAdmin) {
      if (passwordInput === (adminSettings?.password || 'admin123')) setView('admin');
      else if (passwordInput === 'master2026') setShowMasterLogin(true);
      else setError(true);
    } else {
      if (passwordInput === selectedProfile.password) { setLoggedPro(selectedProfile); setView('pro_app'); }
      else setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-black border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl p-8 animate-fade-in">
        {!selectedProfile ? (
          <>
            <h2 className="text-2xl font-light mb-8 text-white flex items-center gap-2"><Briefcase size={24} className="text-theme"/> Acesso Equipe</h2>
            <div className="space-y-3">
              {allProfiles.map(profile => (
                <button key={profile.id} onClick={() => { setSelectedProfile(profile); setError(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 transition-all text-left hover:border-theme">
                  <img src={profile.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{profile.name}</h4>
                    <p className="text-neutral-500 text-xs">{profile.role}</p>
                  </div>
                  <ChevronRight size={16} className="text-neutral-700" />
                </button>
              ))}
              <button onClick={() => setView('landing')} className="w-full text-center text-neutral-500 mt-6 text-sm hover:text-white">Voltar ao Início</button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in flex flex-col items-center pt-8 relative">
            <button onClick={() => setSelectedProfile(null)} className="absolute -top-4 -left-4 text-neutral-500 hover:text-white p-2"><ChevronLeft /></button>
            <h2 className="text-xl font-medium text-white mb-8">Olá, {selectedProfile.name}</h2>
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4 text-center">
              <input type="password" placeholder="Senha" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className={`w-full bg-neutral-900 border ${error ? 'border-red-500' : 'border-neutral-800'} rounded-xl p-4 text-center text-white outline-none focus:border-theme`} autoFocus />
              <Button type="submit" className="w-full py-4">Entrar</Button>
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
    setAppointments([...appointments, { id: Date.now(), client: clientData.name, phone: clientData.phone, service: selection.service.name, time: selection.time, status: 'Pendente', value: selection.service.price, proId: selection.professional.id, registeredBy: 'Website' }]);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="space-y-6">
              <h2 className="text-3xl font-light">Agendamento Digital</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Seu Nome Completo" onChange={e => setClientData({...clientData, name: e.target.value})} className="w-full bg-neutral-900 p-4 rounded-xl border border-neutral-800 outline-none focus:border-theme" />
                <input type="text" placeholder="WhatsApp (DDD)" onChange={e => setClientData({...clientData, phone: e.target.value})} className="w-full bg-neutral-900 p-4 rounded-xl border border-neutral-800 outline-none focus:border-theme" />
                <Button onClick={() => setStep(2)} className="w-full py-4" disabled={!clientData.name || !clientData.phone}>Ver Serviços</Button>
                <button onClick={() => setView('landing')} className="w-full text-neutral-500 py-2 hover:text-white">Cancelar</button>
              </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-light mb-6">O que deseja realizar?</h2>
            {INITIAL_SERVICES.map(s => (
              <button key={s.id} onClick={() => { setSelection({...selection, service: s}); setStep(3); }} className="w-full p-5 bg-neutral-900 rounded-xl border border-neutral-800 text-left hover:border-theme transition-all flex justify-between items-center">
                <span>{s.name}</span>
                <span className="text-theme text-sm">R$ {s.price}</span>
              </button>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-light mb-6">Escolha o Profissional</h2>
            {professionals.map(p => (
              <button key={p.id} onClick={() => { setSelection({...selection, professional: p}); setStep(4); }} className="w-full p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-left hover:border-theme transition-all flex items-center gap-4">
                <img src={p.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-light mb-6">Selecione o Horário</h2>
            <div className="grid grid-cols-3 gap-2">
              {['09:00', '10:30', '14:00', '15:30', '17:00', '18:30'].map(t => (
                <button key={t} onClick={() => { setSelection({...selection, time: t}); handleSubmitRequest(); }} className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:text-theme hover:border-theme">{t}</button>
              ))}
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="text-center space-y-6">
            <CheckCircle size={80} className="text-green-500 mx-auto" />
            <h2 className="text-3xl font-light">Solicitado com Sucesso!</h2>
            <p className="text-neutral-400">Verifique o seu WhatsApp. Entraremos em contato em instantes.</p>
            <Button onClick={() => setView('landing')} className="mx-auto">Voltar ao Início</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- STORE FLOW (BOUTIQUE / PÁGINA DE VENDAS) ---

const StoreFlow = ({ setView, products, initialProduct, salonName }) => {
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [step, setStep] = useState(initialProduct ? 2 : 1);
  const [clientData, setClientData] = useState({ name: '', phone: '' });

  const handleOrder = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleWhatsAppRedirect = () => {
    const message = `Olá! Gostaria de encomendar o produto *${selectedProduct.name}* (R$ ${selectedProduct.price.toFixed(2)}).\n\nMeu nome é ${clientData.name}.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5511999999999?text=${encoded}`, '_blank');
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 animate-fade-in relative">
      <button onClick={() => {
        if (step === 2 && !initialProduct) setStep(1);
        else setView('landing');
      }} className="absolute top-6 left-6 text-neutral-500 hover:text-white flex items-center gap-2 transition-colors z-50">
        <ChevronLeft /> Voltar
      </button>

      <div className="max-w-5xl mx-auto pt-12 md:pt-8">
        {step === 1 && (
          <div className="animate-fade-in">
             <div className="text-center mb-12">
               <h1 className="text-3xl md:text-5xl font-light mb-4">Boutique <span className="text-theme font-serif">{salonName.split(' ')[0]}</span></h1>
               <p className="text-neutral-400">Linha exclusiva de cuidados para manter o resultado do salão em casa.</p>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(p => (
                  <div key={p.id} onClick={() => { setSelectedProduct(p); setStep(2); }} className="cursor-pointer group">
                    <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 mb-4 border border-neutral-800 group-hover:border-theme transition-colors">
                      <img src={p.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                    </div>
                    <h4 className="text-lg font-medium text-white mb-1">{p.name}</h4>
                    <p className="text-theme font-medium">R$ {p.price.toFixed(2)}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {step === 2 && selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center animate-fade-in">
            <div className="rounded-3xl overflow-hidden border border-neutral-800 aspect-square md:aspect-[4/5] bg-neutral-900 relative">
               <img src={selectedProduct.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80'} className="w-full h-full object-cover" alt={selectedProduct.name} />
            </div>
            
            <div>
               <div className="inline-block px-3 py-1 bg-theme-10 text-theme text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                 Pronta Entrega
               </div>
               <h1 className="text-3xl md:text-5xl font-light mb-4">{selectedProduct.name}</h1>
               <p className="text-2xl font-medium text-theme mb-6">R$ {selectedProduct.price.toFixed(2)}</p>
               <p className="text-neutral-400 leading-relaxed mb-8">
                 {selectedProduct.description || 'Produto de alta performance com qualidade profissional garantida pelo nosso salão.'}
               </p>

               <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                 <h3 className="font-medium mb-4 flex items-center gap-2"><ShoppingBag size={18} className="text-theme"/> Reservar Produto</h3>
                 <form onSubmit={handleOrder} className="space-y-4">
                   <input 
                     type="text" required placeholder="Seu Nome Completo" 
                     value={clientData.name} onChange={e => setClientData({...clientData, name: e.target.value})}
                     className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-sm text-white focus:border-theme outline-none" 
                   />
                   <input 
                     type="text" required placeholder="Seu WhatsApp (DDD)" 
                     value={clientData.phone} onChange={e => setClientData({...clientData, phone: e.target.value})}
                     className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-sm text-white focus:border-theme outline-none" 
                   />
                   <Button type="submit" className="w-full py-4 mt-2">Garantir o Meu</Button>
                 </form>
               </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center max-w-md mx-auto pt-12 animate-fade-in">
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-light mb-4">Produto Reservado!</h2>
            <p className="text-neutral-400 mb-8 leading-relaxed">
              Separamos o seu <strong>{selectedProduct.name}</strong>. Por favor, envie uma mensagem para o nosso WhatsApp para combinarmos o pagamento e a retirada no salão.
            </p>
            <Button onClick={handleWhatsAppRedirect} className="w-full py-4 mb-4">
              <MessageCircle size={18} /> Chamar no WhatsApp
            </Button>
            <button onClick={() => setView('landing')} className="text-neutral-500 hover:text-white text-sm">
              Voltar ao Início
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- CLIENT LOGIN SCREEN ---

const ClientLoginScreen = ({ setView, clients, setLoggedClient }) => {
  const [phoneInput, setPhoneInput] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanPhone = phoneInput.replace(/\D/g, ''); // Remove espaços e formatações
    const client = clients.find(c => c.phone.replace(/\D/g, '') === cleanPhone);

    if (client) {
      setLoggedClient(client);
      setView('client');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center items-center p-4 relative">
      <button onClick={() => setView('landing')} className="absolute top-6 left-6 text-neutral-500 hover:text-white flex items-center gap-2 transition-colors z-50">
        <ChevronLeft /> Voltar ao Site
      </button>

      <div className="w-full max-w-md bg-black border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-theme-10 text-theme rounded-full flex items-center justify-center mb-4">
            <Star size={32} fill="currentColor" />
          </div>
          <h2 className="text-2xl font-light text-white">Área VIP do Cliente</h2>
          <p className="text-neutral-500 text-sm mt-2 text-center">Digite o número do seu WhatsApp cadastrado para aceder aos seus benefícios e histórico.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Ex: 5511999999999"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className={`w-full bg-neutral-900 border ${error ? 'border-red-500' : 'border-neutral-800'} rounded-xl p-4 text-center text-white outline-none focus:border-theme tracking-widest text-lg`}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs text-center mt-2 animate-pulse">Telefone não encontrado. Verifique se incluiu o DDD ou fale com a nossa equipa.</p>}
          </div>
          <Button type="submit" className="w-full py-4">Aceder aos meus Benefícios</Button>
        </form>
      </div>
    </div>
  );
};

// --- CLIENT DASHBOARD ---

const ClientDashboard = ({ setView, theme, setTheme, salonName, loggedClient, appointments, professionals }) => {
  const clubName = `${(salonName || "DONNA").split(' ')[0]} Club`;
  
  // Procura o histórico real na nuvem baseado no nome do cliente
  const myAppointments = appointments.filter(a => a.client === loggedClient?.name && a.status === 'Concluído');
  
  // Cálculo de pontos: ganha 1 ponto a cada R$ 10,00 gastos
  const totalPoints = myAppointments.reduce((acc, curr) => acc + Math.floor((curr.value || 0) / 10), 0);

  // Define a inicial do cliente (Letra no círculo)
  const clientInitials = loggedClient?.name ? loggedClient.name.charAt(0).toUpperCase() : 'VIP';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#FAFAFA] text-neutral-900'} transition-colors duration-500 p-4 md:p-6 font-sans`}>
      <div className="max-w-5xl mx-auto pt-4 md:pt-8">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setView('landing')} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-neutral-900 text-white' : 'hover:bg-neutral-200 text-black'} transition-colors`}><ChevronLeft /></button>
            <h1 className="text-2xl md:text-3xl font-light">Minha Área</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4 justify-between w-full sm:w-auto">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-neutral-900 text-theme border border-neutral-800' : 'bg-white text-yellow-600 shadow-md border border-neutral-200'} transition-all`}><Sun size={20} /></button>
            <div className="flex items-center gap-2 md:gap-3 sm:ml-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-theme rounded-full flex items-center justify-center text-black font-medium text-sm md:text-base">{clientInitials}</div>
              <div className="text-left">
                <div className="font-medium text-sm">{loggedClient?.name || 'Cliente Premium'}</div>
                <div className="text-[10px] md:text-xs text-theme font-medium tracking-wide uppercase">Membro Gold</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <aside className="space-y-6">
            <Card className={theme === 'dark' ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}>
              <div className="flex items-center gap-3 text-theme mb-4"><Gift size={24} /><h3 className="text-lg md:text-xl font-medium">{clubName}</h3></div>
              <div className="mb-2 flex justify-between items-end"><span className={`text-3xl md:text-4xl font-light ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{totalPoints}</span><span className="text-xs md:text-sm text-neutral-500 mb-1">pontos</span></div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden mb-4"><div className="h-full bg-theme" style={{ width: '60%' }} /></div>
              <Button className="w-full mt-6 py-2 text-sm">Resgatar Benefícios</Button>
            </Card>
          </aside>

          <main className="lg:col-span-2">
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center mb-4 md:mb-6"><h2 className="text-xl md:text-2xl font-light">Seus Atendimentos</h2></div>
              
              {myAppointments.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center ${theme === 'dark' ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-400'}`}>
                  <History size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Nenhum atendimento finalizado até o momento.</p>
                  <Button onClick={() => setView('booking')} className="mt-6">Agendar meu primeiro horário</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAppointments.map(item => {
                    const pro = professionals.find(p => p.id === item.proId);
                    const pointsGained = Math.floor((item.value || 0) / 10);
                    
                    return (
                      <div key={item.id} className={`p-4 md:p-6 rounded-2xl border ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800 hover:border-theme' : 'bg-white border-neutral-200 shadow-sm'} transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-theme-10 rounded-full flex items-center justify-center text-theme shrink-0"><CheckCircle size={20} /></div>
                          <div>
                            <h4 className="font-medium text-base md:text-lg">{item.service}</h4>
                            <p className="text-neutral-500 text-xs md:text-sm">Com {pro ? pro.name : 'Nossa Equipe'} • {item.time || 'Data Indisponível'}</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right border-t border-neutral-800/50 sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                          <div className="font-medium text-sm md:text-base">R$ {item.value}</div>
                          <div className="text-[10px] md:text-xs text-theme font-medium mt-1 flex items-center gap-1 sm:justify-end"><Star size={12} fill="currentColor" /> +{pointsGained} pts</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// --- PROFESSIONAL APP ---

const ProfessionalApp = ({ setView, loggedPro, appointments, setAppointments, professionals, products, setProducts, sales, setSales, salonName, setActiveCall }) => {
  const myAppointments = appointments.filter(a => loggedPro && a.proId === loggedPro.id);
  const shortProName = (salonName || "DONNA").split(' ')[0];

  const confirmAppointmentPro = (id) => {
    setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'Confirmado' } : app));
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center">
      <div className="w-full max-w-md bg-black min-h-screen relative shadow-2xl md:border-x md:border-neutral-900 flex flex-col">
        <div className="p-4 md:p-6 border-b border-neutral-900 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-20">
          <button onClick={() => setView('landing')} className="text-neutral-500 hover:text-white flex items-center gap-1.5 md:gap-2 text-xs md:text-sm"><LogOut size={14} /> Sair</button>
          <div className="text-theme font-serif tracking-widest text-[10px] md:text-xs uppercase">{shortProName} Pro</div>
          <Briefcase size={16} className="text-neutral-700" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-light text-white">Agenda de Hoje</h2>
                <p className="text-theme text-xs md:text-sm mt-0.5 md:mt-1">{myAppointments.length} agendamentos</p>
              </div>
              <img src={loggedPro?.image} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-neutral-800 shrink-0" alt="" />
            </div>

            {myAppointments.length === 0 ? (
              <div className="text-center py-10 md:py-12 text-neutral-600 italic text-sm md:text-base border border-dashed border-neutral-800 rounded-xl md:rounded-2xl">Sua agenda está livre hoje.</div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {myAppointments.map((app, index) => (
                  <div key={index} className={`bg-neutral-900 p-3 md:p-4 rounded-xl md:rounded-2xl border ${app.status === 'Pendente' ? 'border-orange-500/50' : 'border-neutral-800'} relative overflow-hidden`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${app.status === 'Confirmado' ? 'bg-green-500' : app.status === 'Pendente' ? 'bg-orange-500' : 'bg-theme'}`} />
                    <div className="flex justify-between items-start mb-1.5 md:mb-2 pl-2">
                      <span className="text-lg md:text-xl font-light text-white flex items-center gap-1.5 md:gap-2">{app.time}</span>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className={`text-[8px] md:text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md ${app.status === 'Confirmado' ? 'bg-green-500/10 text-green-500' : app.status === 'Pendente' ? 'bg-orange-500/10 text-orange-500' : 'bg-theme-10 text-theme'}`}>{app.status}</span>
                        {(app.status === 'Confirmado' || app.status === 'Em andamento') && (
                          <button onClick={() => setActiveCall(app)} className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-neutral-800 hover:bg-theme hover:text-black flex items-center justify-center transition-colors text-neutral-400 shrink-0"><Megaphone size={12} /></button>
                        )}
                      </div>
                    </div>
                    <div className="pl-2 flex justify-between items-end">
                      <div className="min-w-0 pr-2"><h4 className="font-medium text-white text-sm md:text-base truncate">{app.client}</h4><p className="text-neutral-500 text-[10px] md:text-sm truncate">{app.service}</p></div>
                      {app.status === 'Pendente' && <button onClick={() => confirmAppointmentPro(app.id)} className="bg-green-600 hover:bg-green-500 text-white rounded-lg p-1.5 md:p-2 transition-colors shrink-0"><CheckCircle size={14} /></button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TV PANEL SCREEN ---

const TvPanelScreen = ({ activeCall, salonName, professionals, tvPlaylist = [], tvVideoFit = 'contain', setView, branding }) => {
  const shortName = (salonName || "DONNA").split(' ')[0].toUpperCase();
  const [currentVidIndex, setCurrentVidIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // EFEITO SONORO SINTETIZADO COM VOZ TTS (100% FIÁVEL)
  useEffect(() => {
    if (activeCall && audioEnabled) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          ctx.resume().then(() => {
            const playNote = (freq, delay) => {
              const osc = ctx.createOscillator();
              const gainNode = ctx.createGain();
              
              osc.type = 'triangle';
              osc.frequency.value = freq;
              
              gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
              gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + delay + 0.05);
              gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 2.0);
              
              osc.connect(gainNode);
              gainNode.connect(ctx.destination);
              
              osc.start(ctx.currentTime + delay);
              osc.stop(ctx.currentTime + delay + 2.1);
            };

            // Toca o Ding-Dong
            playNote(783.99, 0);    // Sol
            playNote(659.25, 0.6);  // Mi
            
            // Espera o Ding-Dong terminar para falar (Aprox 2 segundos)
            setTimeout(() => {
              if ('speechSynthesis' in window) {
                const clientFirstName = activeCall.client.split(' ')[0];
                const professionalName = professionals.find(p => p.id === activeCall.proId)?.name || 'Nossa Equipe';
                
                const message = `${clientFirstName}, a profissional ${professionalName} lhe aguarda!`;
                const utterance = new SpeechSynthesisUtterance(message);
                
                utterance.lang = 'pt-BR'; // Português do Brasil
                utterance.rate = 0.85;    // Velocidade mais suave e pausada
                utterance.pitch = 1;      // Tom padrão
                
                // Tenta procurar a voz do Google Brasil se existir no dispositivo, senão usa a padrão
                const voices = window.speechSynthesis.getVoices();
                const ptVoice = voices.find(v => v.lang === 'pt-BR' && v.name.includes('Google'));
                if(ptVoice) utterance.voice = ptVoice;
                
                window.speechSynthesis.speak(utterance);
              }
            }, 2000);
          });
        }
      } catch(e) {
        console.log("O navegador bloqueou o áudio.", e);
      }
    }
  }, [activeCall, audioEnabled, professionals]);

  const handleMediaEnd = () => {
    if (tvPlaylist.length > 0) setCurrentVidIndex((prev) => (prev + 1) % tvPlaylist.length);
  };

  useEffect(() => {
    if (currentVidIndex >= tvPlaylist.length) setCurrentVidIndex(0);
  }, [tvPlaylist.length, currentVidIndex]);

  useEffect(() => {
    if (!activeCall && tvPlaylist.length > 0) {
      const currentMedia = tvPlaylist[currentVidIndex];
      if (currentMedia && currentMedia.type === 'image') {
        const timer = setTimeout(() => {
          handleMediaEnd();
        }, currentMedia.duration || 15000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeCall, currentVidIndex, tvPlaylist]);

  const currentMedia = tvPlaylist[currentVidIndex];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative">
      <button onClick={() => setView('admin')} className="absolute top-4 left-4 md:top-6 md:left-6 z-50 p-2.5 md:p-3 bg-neutral-900/80 border border-neutral-700 text-white rounded-full opacity-30 hover:opacity-100 transition-all flex items-center gap-1.5 md:gap-2">
        <ChevronLeft size={16} /> <span className="text-xs md:text-sm font-medium">Voltar ao Admin</span>
      </button>

      <button 
        onClick={() => {
          setAudioEnabled(!audioEnabled);
          try { const AudioContext = window.AudioContext || window.webkitAudioContext; if(AudioContext) new AudioContext().resume(); } catch(e){}
        }} 
        className={`absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 md:p-3 rounded-full border transition-all flex items-center gap-1.5 md:gap-2 ${
          audioEnabled 
            ? 'bg-theme-10 border-theme text-theme hover:bg-theme-20' 
            : 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20 animate-pulse'
        }`}
      >
        {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span className="text-xs md:text-sm font-medium">{audioEnabled ? 'Áudio Ligado' : 'Ativar Áudio'}</span>
      </button>

      <div className="absolute inset-0 z-0 opacity-20">
        <img src={branding?.tvBg || ''} className="w-full h-full object-cover object-center scale-105" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black z-10" />
      </div>

      {!activeCall && tvPlaylist.length > 0 && currentMedia && (
        <div className="absolute inset-0 z-10 animate-fade-in transition-all bg-black flex items-center justify-center">
          <div className="w-full h-full max-h-screen">
            {currentMedia.type === 'video' ? (
               <video src={currentMedia.url} autoPlay muted playsInline onEnded={handleMediaEnd} className={`w-full h-full bg-black ${tvVideoFit === 'cover' ? 'object-cover opacity-90' : 'object-contain opacity-100'}`} />
            ) : (
               <img src={currentMedia.url} className={`w-full h-full bg-black ${tvVideoFit === 'cover' ? 'object-cover opacity-90' : 'object-contain opacity-100'}`} alt="Propaganda" />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 md:p-6 pt-16 md:pt-24 z-20">
            <p className="text-xs md:text-sm text-neutral-300 uppercase tracking-widest ml-2 md:ml-4 mb-1 md:mb-2">Apoio: <span className="text-white font-medium">{currentMedia.name}</span></p>
          </div>
        </div>
      )}

      <div className="relative z-30 text-center px-4 w-full max-w-5xl pointer-events-none">
        {activeCall ? (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl md:text-4xl lg:text-5xl text-theme font-light mb-4 md:mb-8 uppercase tracking-widest drop-shadow-md">Chegou a sua vez</h2>
            <h1 className="text-5xl sm:text-7xl md:text-[120px] font-bold text-green-400 animate-pulse mb-6 md:mb-8 tracking-tight leading-none drop-shadow-[0_0_30px_rgba(74,222,128,0.5)]">{activeCall.client.split(' ')[0]}</h1>
            <div className="mt-8 md:mt-12 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl md:rounded-3xl p-6 md:p-8 inline-block shadow-2xl">
              <p className="text-lg md:text-2xl text-neutral-400 mb-1 md:mb-2">Por favor, dirija-se ao profissional</p>
              <p className="text-2xl md:text-4xl text-white font-medium">{professionals.find(p => p.id === activeCall.proId)?.name || 'Nossa Equipe'}</p>
              <p className="text-base md:text-xl text-theme mt-2 md:mt-4">{activeCall.service}</p>
            </div>
          </div>
        ) : (
          tvPlaylist.length === 0 && (
            <div className="animate-fade-in opacity-40 transition-opacity duration-1000">
              <h1 className="text-4xl sm:text-6xl md:text-9xl font-serif text-theme tracking-[0.2em] drop-shadow-lg">{shortName}</h1>
              <p className="text-base md:text-2xl text-neutral-500 mt-4 md:mt-8 tracking-widest uppercase font-light">Aguarde ser chamado(a)</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// --- MÓDULOS FULL SCREEN EXTRA ---

const SpotifyScreen = ({ setView, spotifyUrl }) => (
  <div className="min-h-screen bg-black flex flex-col relative animate-fade-in">
    <div className="p-4 md:p-6 pb-3 md:pb-4 border-b border-neutral-900 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-20">
      <button onClick={() => setView('admin')} className="text-neutral-500 hover:text-white flex items-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm"><ChevronLeft size={16} /> Voltar</button>
      <div className="text-[#1DB954] font-bold tracking-widest flex items-center gap-1.5 md:gap-2 uppercase text-xs md:text-base"><SpotifyIcon size={18} className="md:w-5 md:h-5" /> Player Musical</div>
      <div className="w-16 md:w-20"></div> 
    </div>
    <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8">
      {spotifyUrl ? (
        <div className="w-full max-w-5xl aspect-square sm:aspect-video max-h-[75vh] bg-neutral-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(29,185,84,0.1)] border border-neutral-800">
          <iframe src={spotifyUrl} width="100%" height="100%" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="Spotify Full Player"></iframe>
        </div>
      ) : (
        <div className="text-neutral-500 flex flex-col items-center text-center px-4"><Music size={40} className="mb-3 opacity-20 md:w-12 md:h-12 md:mb-4" /><p className="text-sm md:text-base">Nenhuma playlist configurada.</p></div>
      )}
    </div>
  </div>
);

const IptvScreen = ({ setView, iptvUrl }) => (
  <div className="min-h-screen bg-black flex flex-col relative animate-fade-in">
    <div className="p-4 md:p-6 pb-3 md:pb-4 border-b border-neutral-900 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-20">
      <button onClick={() => setView('admin')} className="text-neutral-500 hover:text-white flex items-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm"><ChevronLeft size={16} /> Voltar</button>
      <div className="text-blue-500 font-bold tracking-widest flex items-center gap-1.5 md:gap-2 uppercase text-xs md:text-base"><Tv size={18} className="md:w-5 md:h-5" /> Player IPTV</div>
      {iptvUrl ? <a href={iptvUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs text-neutral-400 hover:text-white border border-neutral-700 rounded-md md:rounded-lg px-2 py-1 md:px-3 md:py-1.5 transition-colors flex items-center shrink-0 text-center leading-none"><span className="hidden sm:inline">Abrir em</span> Nova Aba <ArrowUpRight size={10} className="ml-1 md:w-3 md:h-3"/></a> : <div className="w-16 md:w-20"></div>}
    </div>
    <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8">
      {iptvUrl ? (
        <div className="w-full max-w-6xl aspect-video max-h-[75vh] bg-neutral-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)] border border-neutral-800 relative">
          <iframe src={iptvUrl} width="100%" height="100%" frameBorder="0" allowFullScreen allow="encrypted-media" title="IPTV Full Player" className="absolute inset-0"></iframe>
        </div>
      ) : (
        <div className="text-neutral-500 flex flex-col items-center text-center px-4"><Tv size={40} className="mb-3 opacity-20 md:w-12 md:h-12 md:mb-4" /><p className="text-sm md:text-base">Nenhum Web Player configurado.</p></div>
      )}
    </div>
  </div>
);

// --- ADMIN DASHBOARD ---

const AdminDashboard = ({ 
  setView, appointments, setAppointments, professionals, setProfessionals, 
  products, setProducts, sales, setSales, salonName, setSalonName, 
  clients, setClients, setActiveCall, tvPlaylist, setTvPlaylist, tvVideoFit, setTvVideoFit,
  expenses, setExpenses, premiumFeatures, adminSettings, setAdminSettings 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [cart, setCart] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const totalReceitas = sales.reduce((acc, curr) => acc + curr.price, 0) + appointments.filter(a => a.status === 'Concluído').reduce((acc, curr) => acc + curr.value, 0);
  const totalDespesas = expenses.reduce((acc, curr) => acc + Number(curr.value || 0), 0);
  const lucroLiquido = totalReceitas - totalDespesas;

  const renderContent = () => {
    switch (activeTab) {
      case 'pdv': return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-theme"><Clock size={20}/> Serviços para Cobrança</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {appointments.filter(a => a.status !== 'Concluído').map(app => (
                  <div key={app.id} className="p-4 bg-black rounded-xl border border-neutral-800 flex justify-between items-center group hover:border-theme transition-all">
                    <div>
                      <div className="font-medium text-white">{app.client}</div>
                      <div className="text-xs text-neutral-500">{app.service} • R$ {app.value}</div>
                    </div>
                    <button onClick={() => setCart([...cart, { ...app, type: 'service' }])} className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 group-hover:bg-theme group-hover:text-black transition-all"><Plus size={18}/></button>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-theme"><ShoppingBag size={20}/> Venda de Produtos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="p-4 bg-black rounded-xl border border-neutral-800 flex justify-between items-center group hover:border-theme transition-all">
                    <div>
                      <div className="font-medium text-white">{p.name}</div>
                      <div className="text-xs text-neutral-500">Estoque: {p.stock} • R$ {p.price}</div>
                    </div>
                    <button onClick={() => setCart([...cart, { ...p, type: 'product' }])} className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 group-hover:bg-theme group-hover:text-black transition-all"><Plus size={18}/></button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-neutral-950 border-theme-30">
               <h3 className="text-xl font-light mb-8 flex items-center gap-2 text-theme"><Receipt size={24}/> Checkout</h3>
               <div className="space-y-4 mb-8 min-h-[200px]">
                 {cart.map((item, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-neutral-800 pb-2">
                     <span className="text-sm text-white">{item.client || item.name}</span>
                     <div className="flex items-center gap-3">
                        <span className="text-theme font-medium">R$ {item.value || item.price}</span>
                        <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-neutral-600 hover:text-red-500"><Trash2 size={16}/></button>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="border-t border-neutral-800 pt-6">
                 <div className="flex justify-between text-2xl font-light mb-8">
                   <span>Total</span>
                   <span className="text-white font-bold">R$ {cart.reduce((acc, i) => acc + (i.value || i.price), 0).toFixed(2)}</span>
                 </div>
                 <Button onClick={() => {
                   setSales([...sales, ...cart.map(c => ({ id: Date.now() + Math.random(), productName: c.client ? `Serviço: ${c.service}` : c.name, price: c.value || c.price, date: new Date().toLocaleDateString('pt-BR'), proName: 'Administrador' }))]);
                   setAppointments(appointments.map(a => cart.find(c => c.id === a.id) ? { ...a, status: 'Concluído' } : a));
                   setCart([]);
                   alert('Venda Finalizada!');
                 }} className="w-full py-4 text-lg" disabled={cart.length === 0}>Finalizar Pagamento</Button>
               </div>
            </Card>
          </div>
        </div>
      );
      case 'overview': return (
        <div className="animate-fade-in space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <Card className="text-center"><p className="text-neutral-500 text-xs uppercase mb-2">Faturamento Hoje</p><p className="text-3xl font-bold">R$ {totalReceitas.toFixed(2)}</p></Card>
             <Card className="text-center"><p className="text-neutral-500 text-xs uppercase mb-2">Agendamentos</p><p className="text-3xl font-bold">{appointments.length}</p></Card>
             <Card className="text-center"><p className="text-neutral-500 text-xs uppercase mb-2">Clientes CRM</p><p className="text-3xl font-bold">{clients.length}</p></Card>
             <Card className="text-center"><p className="text-neutral-500 text-xs uppercase mb-2">Lucro Líquido</p><p className="text-3xl font-bold text-green-500">R$ {lucroLiquido.toFixed(2)}</p></Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-medium mb-6">Próximos da Agenda</h3>
              <div className="space-y-4">
                {appointments.map(a => (
                  <div key={a.id} className="p-4 bg-black rounded-xl border border-neutral-800 flex justify-between items-center hover:border-theme transition-colors">
                    <div><p className="font-medium">{a.client}</p><p className="text-xs text-neutral-500">{a.service} • {a.time}</p></div>
                    <button onClick={() => setActiveCall(a)} className="p-2 text-theme hover:bg-theme-10 rounded-full transition-all"><Megaphone size={20}/></button>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-medium mb-6">Equipe em Atividade</h3>
              <div className="space-y-6">
                 {professionals.map(p => (
                   <div key={p.id} className="flex items-center gap-4">
                     <img src={p.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                     <div className="flex-1">
                       <div className="flex justify-between mb-1"><span className="font-medium">{p.name}</span><span className="text-theme">{p.rating} ★</span></div>
                       <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden"><div className="h-full bg-theme" style={{ width: '85%' }} /></div>
                     </div>
                   </div>
                 ))}
              </div>
            </Card>
          </div>
        </div>
      );
      case 'financial': return (
        <div className="animate-fade-in space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-light">Fluxo de Caixa</h3>
              <Button onClick={() => {
                const desc = prompt("Descrição da despesa:");
                const val = prompt("Valor (R$):");
                if(desc && val) setExpenses([...expenses, { id: Date.now(), description: desc, value: Number(val), date: new Date().toLocaleDateString('pt-BR') }]);
              }} variant="danger" className="text-xs"><Plus size={16}/> Nova Despesa</Button>
           </div>
           <Card>
             <table className="w-full text-left">
               <thead className="text-neutral-500 text-xs uppercase border-b border-neutral-800"><tr className="pb-4"><th className="pb-4">Data</th><th className="pb-4">Descrição</th><th className="pb-4">Tipo</th><th className="pb-4 text-right">Valor</th></tr></thead>
               <tbody className="divide-y divide-neutral-800">
                 {sales.map(s => (<tr key={s.id} className="hover:bg-white/5"><td className="py-4 text-sm">{s.date}</td><td className="py-4 font-medium">{s.productName}</td><td className="py-4 text-green-500 text-sm">Receita</td><td className="py-4 text-right font-bold text-green-500">+ R$ {s.price.toFixed(2)}</td></tr>))}
                 {expenses.map(e => (<tr key={e.id} className="hover:bg-white/5"><td className="py-4 text-sm">{e.date}</td><td className="py-4 font-medium">{e.description}</td><td className="py-4 text-red-500 text-sm">Despesa</td><td className="py-4 text-right font-bold text-red-500">- R$ {e.value.toFixed(2)}</td></tr>))}
               </tbody>
             </table>
           </Card>
        </div>
      );
      case 'clients': return (
        <div className="animate-fade-in space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-light">Gestão de Clientes (CRM)</h3>
            <Button className="text-xs"><Plus size={16}/> Novo Cliente</Button>
          </div>
          <Card>
             <table className="w-full text-left">
               <thead className="text-neutral-500 text-xs uppercase border-b border-neutral-800"><tr className="pb-4"><th className="pb-4">Cliente</th><th className="pb-4">WhatsApp</th><th className="pb-4">Última Visita</th><th className="pb-4 text-right">Ação</th></tr></thead>
               <tbody className="divide-y divide-neutral-800">
                 {clients.map(c => (
                   <tr key={c.id} className="group hover:bg-white/5 transition-colors">
                     <td className="py-4 font-medium text-white">{c.name}</td>
                     <td className="py-4 text-neutral-400 text-sm">{c.phone}</td>
                     <td className="py-4 text-neutral-500 text-sm">{c.lastVisit}</td>
                     <td className="py-4 text-right">
                        <button onClick={() => window.open(`https://wa.me/${c.phone}?text=Olá ${c.name.split(' ')[0]}! Estamos com saudades...`, '_blank')} className="px-4 py-2 bg-green-900/30 text-green-500 rounded-xl text-xs hover:bg-green-500 hover:text-black transition-all">Lembrete</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </Card>
        </div>
      );
      case 'inventory': return (
        <div className="animate-fade-in space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-light">Controle de Estoque</h3>
            <Button onClick={() => {
              const name = prompt("Nome do Produto:");
              if (!name) return;
              const price = parseFloat(prompt("Preço (R$):") || "0");
              const stock = parseInt(prompt("Quantidade Inicial em Estoque:") || "0");
              const image = prompt("URL da Imagem (opcional):") || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80";
              const desc = prompt("Breve Descrição (opcional):") || "Produto de alta qualidade.";
              
              setProducts([...products, { id: Date.now(), name, price, stock, image, description: desc }]);
            }} className="text-xs"><Plus size={16}/> Novo Produto</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <Card key={p.id} className="relative group overflow-hidden flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                     <img src={p.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock < 5 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>{p.stock} un.</span>
                </div>
                <h4 className="text-lg font-medium">{p.name}</h4>
                <p className="text-neutral-500 text-sm mb-4 line-clamp-2 leading-snug flex-1">{p.description}</p>
                <p className="text-theme font-medium mb-6">Preço: R$ {p.price.toFixed(2)}</p>
                <div className="flex gap-2 mt-auto">
                  <Button variant="outline" onClick={() => {
                     const novoStock = parseInt(prompt(`Atualizar estoque de ${p.name}:`, p.stock));
                     if(!isNaN(novoStock)) setProducts(products.map(prod => prod.id === p.id ? {...prod, stock: novoStock} : prod));
                  }} className="flex-1 py-2 text-xs">Estoque</Button>
                  <Button variant="ghost" onClick={() => {
                     if(window.confirm(`Tem certeza que deseja apagar ${p.name}?`)) {
                        setProducts(products.filter(prod => prod.id !== p.id));
                     }
                  }} className="flex-1 py-2 text-xs text-red-500"><Trash2 size={14}/></Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
      case 'settings': return (
        <div className="animate-fade-in space-y-8 max-w-2xl">
          <Card>
            <h3 className="text-xl font-light mb-8 flex items-center gap-2 text-theme"><Settings size={22}/> Configurações Donna</h3>
            <div className="space-y-8">
              <div>
                <label className="text-xs text-neutral-500 uppercase mb-2 block tracking-widest">Nome da Marca</label>
                <input type="text" value={salonName} onChange={e => setSalonName(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-white focus:border-theme outline-none" />
              </div>
              <hr className="border-neutral-800" />
              <div>
                <h4 className="text-base font-medium mb-4 flex items-center gap-2"><Shield size={18} className="text-theme"/> Credenciais Admin</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nome do Dono" value={adminSettings?.name || ''} onChange={e => setAdminSettings({...adminSettings, name: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-theme outline-none" />
                  <input type="text" placeholder="Senha Master" value={adminSettings?.password || ''} onChange={e => setAdminSettings({...adminSettings, password: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-theme outline-none" />
                </div>
              </div>

              <hr className="border-neutral-800" />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-base font-medium flex items-center gap-2"><MonitorPlay size={18} className="text-theme"/> Mídia da TV</h4>
                    <p className="text-xs text-neutral-500 mt-1">Configure vídeos ou banners para rodar na TV da sala de espera.</p>
                  </div>
                  <Button onClick={() => {
                    const type = prompt("Digite 'V' para Vídeo ou 'I' para Imagem (Banner):");
                    if (!type || (type.toUpperCase() !== 'V' && type.toUpperCase() !== 'I')) return;
                    
                    const url = prompt(`Cole o link (URL) d${type.toUpperCase() === 'V' ? 'o Vídeo' : 'a Imagem'}:`);
                    if (!url) return;
                    
                    const name = prompt("Digite um nome curto:");
                    let duration = 15000;
                    if (type.toUpperCase() === 'I') duration = (parseInt(prompt("Quantos segundos na tela?", "15")) || 15) * 1000;
                    
                    setTvPlaylist([...(tvPlaylist || []), { id: Date.now(), name: name || 'Nova Mídia', url, type: type.toUpperCase() === 'V' ? 'video' : 'image', duration }]);
                  }} className="text-xs py-2 px-3"><Plus size={14}/> Adicionar</Button>
                </div>

                <div className="bg-black/50 border border-neutral-800 rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto mb-4">
                  {!tvPlaylist || tvPlaylist.length === 0 ? (
                     <p className="text-center text-neutral-600 italic text-sm py-4">Nenhuma mídia configurada.</p>
                  ) : (
                     tvPlaylist.map((media) => (
                       <div key={media.id} className="flex justify-between items-center p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-theme">{media.type === 'video' ? <Video size={14}/> : <ImageIcon size={14}/>}</div>
                           <div><p className="font-medium text-sm text-white">{media.name}</p><p className="text-xs text-neutral-500">{media.type === 'video' ? 'Vídeo' : `Imagem (${media.duration / 1000}s)`}</p></div>
                         </div>
                         <button onClick={() => setTvPlaylist(tvPlaylist.filter(m => m.id !== media.id))} className="text-neutral-500 hover:text-red-500"><Trash2 size={16}/></button>
                       </div>
                     ))
                  )}
                </div>

                <select value={tvVideoFit} onChange={e => setTvVideoFit(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-sm text-white focus:border-theme outline-none">
                  <option value="contain">Enquadrar Inteiro (mantém as proporções originais)</option>
                  <option value="cover">Preencher Tela Inteira (sem bordas pretas)</option>
                </select>
              </div>

              <hr className="border-neutral-800" />
              <Button onClick={() => { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }} className="w-full py-4">Salvar Alterações</Button>
              {saveSuccess && <div className="text-green-500 text-center text-sm animate-pulse">Sincronizado na nuvem com sucesso!</div>}
            </div>
          </Card>
        </div>
      );
      default: return <div className="text-neutral-500 italic">Módulo em construção...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <aside className="w-64 border-r border-neutral-800 p-6 flex flex-col gap-6 bg-neutral-950/50">
        <div className="text-xl font-serif tracking-widest text-theme flex items-center gap-2 mb-8"><div className="w-4 h-4 bg-theme rounded-full"></div> ADMIN</div>
        <nav className="flex flex-col gap-1 flex-1">
          <button onClick={() => setActiveTab('pdv')} className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${activeTab === 'pdv' ? 'bg-theme-10 text-theme' : 'text-neutral-500 hover:text-white'}`}><Receipt size={18}/> Caixa (PDV)</button>
          <button onClick={() => setActiveTab('overview')} className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${activeTab === 'overview' ? 'bg-theme-10 text-theme' : 'text-neutral-500 hover:text-white'}`}><LayoutDashboard size={18}/> Visão Geral</button>
          <button onClick={() => setActiveTab('clients')} className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${activeTab === 'clients' ? 'bg-theme-10 text-theme' : 'text-neutral-500 hover:text-white'}`}><Heart size={18}/> Clientes CRM</button>
          <button onClick={() => setActiveTab('financial')} className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${activeTab === 'financial' ? 'bg-theme-10 text-theme' : 'text-neutral-500 hover:text-white'}`}><DollarSign size={18}/> Financeiro</button>
          <button onClick={() => setActiveTab('inventory')} className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${activeTab === 'inventory' ? 'bg-theme-10 text-theme' : 'text-neutral-500 hover:text-white'}`}><Package size={18}/> Produtos</button>
          <button onClick={() => setActiveTab('settings')} className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${activeTab === 'settings' ? 'bg-theme-10 text-theme' : 'text-neutral-500 hover:text-white'}`}><Settings size={18}/> Configurações</button>
          <hr className="my-4 border-neutral-900" />
          <button onClick={() => setView('tv')} className="p-3 text-left text-blue-500 flex items-center gap-3 hover:bg-blue-500/5 rounded-xl transition-all"><MonitorPlay size={18}/> Painel TV</button>
          <button onClick={() => premiumFeatures?.spotify ? setView('spotify') : setActiveTab('settings')} className={`p-3 text-left flex items-center gap-3 rounded-xl transition-all ${premiumFeatures?.spotify ? 'text-[#1DB954] hover:bg-[#1DB954]/5' : 'text-neutral-600'}`}><SpotifyIcon size={18}/> Spotify Web {!premiumFeatures?.spotify && <Lock size={12}/>}</button>
          <button onClick={() => premiumFeatures?.iptv ? setView('iptv') : setActiveTab('settings')} className={`p-3 text-left flex items-center gap-3 rounded-xl transition-all ${premiumFeatures?.iptv ? 'text-blue-400 hover:bg-blue-400/5' : 'text-neutral-600'}`}><Tv size={18}/> Player IPTV {!premiumFeatures?.iptv && <Lock size={12}/>}</button>
        </nav>
        <button onClick={() => setView('landing')} className="p-3 text-red-500 flex items-center gap-3 hover:bg-red-500/5 rounded-xl transition-all mt-auto"><LogOut size={18}/> Sair</button>
      </aside>
      <main className="flex-1 p-12 bg-neutral-950 overflow-y-auto">
        <h1 className="text-4xl font-light mb-12 capitalize tracking-tighter">{activeTab === 'pdv' ? 'Frente de Caixa' : activeTab}</h1>
        {renderContent()}
      </main>
    </div>
  );
};

// --- MASTER DASHBOARD (SaaS Control & White Label) ---

const MasterDashboard = ({ setView, subscriptionDueDate, setSubscriptionDueDate, premiumFeatures, setPremiumFeatures, branding, setBranding }) => {
  return (
    <div className="min-h-screen bg-black text-white p-12 flex flex-col items-center animate-fade-in overflow-y-auto">
       <div className="w-full max-w-4xl space-y-10 py-10">
          <div className="flex justify-between items-end border-b border-blue-900/30 pb-6">
             <div><h1 className="text-3xl font-light text-blue-500 flex items-center gap-3"><ShieldCheck size={40}/> Painel Master</h1><p className="text-neutral-600 uppercase tracking-widest text-xs mt-2">Central de Licenciamento SaaS</p></div>
             <Button onClick={() => setView('admin')} variant="outline" className="text-xs">Painel do Salão</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-blue-900/20">
              <h3 className="text-neutral-500 text-xs mb-4 uppercase tracking-wider">Vencimento da Conta Cloud</h3>
              <p className="text-3xl font-medium mb-6">{new Date(subscriptionDueDate).toLocaleDateString('pt-BR')}</p>
              <Button onClick={() => {
                const d = new Date(subscriptionDueDate); d.setDate(d.getDate() + 30); setSubscriptionDueDate(d.toISOString());
              }} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Estender Licença 30 dias</Button>
            </Card>
            
            <Card className="border-blue-900/20">
              <h3 className="text-neutral-500 text-xs mb-4 uppercase tracking-wider">Módulos Premium</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-sm">Spotify Business</span><input type="checkbox" checked={premiumFeatures.spotify} onChange={() => setPremiumFeatures({...premiumFeatures, spotify: !premiumFeatures.spotify})} className="w-5 h-5 accent-blue-500" /></div>
                <div className="flex justify-between items-center"><span className="text-sm">Player IPTV 4K</span><input type="checkbox" checked={premiumFeatures.iptv} onChange={() => setPremiumFeatures({...premiumFeatures, iptv: !premiumFeatures.iptv})} className="w-5 h-5 accent-blue-500" /></div>
              </div>
            </Card>
          </div>

          <Card className="border-purple-900/30 bg-gradient-to-b from-purple-900/10 to-transparent">
            <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-purple-400"><Palette size={20}/> White Label (Personalização)</h3>
            <p className="text-sm text-neutral-500 mb-8">Personalize completamente o sistema para este cliente específico.</p>
            
            <div className="space-y-8">
              <div>
                <label className="text-xs text-neutral-400 uppercase tracking-wider block mb-3">Cor Principal do Sistema (Tema)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={branding?.primaryColor || '#D4AF37'} 
                    onChange={e => setBranding({...branding, primaryColor: e.target.value})}
                    className="w-16 h-16 rounded-xl cursor-pointer bg-black border border-neutral-800"
                  />
                  <div className="text-sm text-neutral-500">A cor define botões, destaques e ícones.<br/>Atualmente: <span className="text-white font-medium">{branding?.primaryColor || '#D4AF37'}</span></div>
                </div>
              </div>

              <hr className="border-neutral-800"/>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-wider block mb-2">Fundo: Página Inicial (Link URL)</label>
                  <input type="text" value={branding?.landingBg || ''} onChange={e => setBranding({...branding, landingBg: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none" placeholder="https://exemplo.com/imagem.jpg" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-wider block mb-2">Fundo: Painel da TV (Link URL)</label>
                  <input type="text" value={branding?.tvBg || ''} onChange={e => setBranding({...branding, tvBg: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none" placeholder="https://exemplo.com/tv.jpg" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-neutral-400 uppercase tracking-wider block mb-2">Link de Destino do Instagram (URL)</label>
                  <input type="text" value={branding?.instagramUrl || ''} onChange={e => setBranding({...branding, instagramUrl: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none" placeholder="https://instagram.com/seu_salao" />
                </div>
              </div>

              <hr className="border-neutral-800"/>

              <div>
                <label className="text-xs text-neutral-400 uppercase tracking-wider block mb-4">Galeria de Portfólio (4 Imagens Iniciais)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map(i => (
                    <input 
                      key={i} type="text" placeholder={`Link da Imagem ${i+1}`} 
                      value={branding?.instagramImgs?.[i] || ''}
                      onChange={e => {
                        const newImgs = [...(branding?.instagramImgs || ['', '', '', ''])];
                        newImgs[i] = e.target.value;
                        setBranding({...branding, instagramImgs: newImgs});
                      }} 
                      className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none" 
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <button onClick={() => setView('landing')} className="w-full text-center text-neutral-700 hover:text-white transition-colors text-sm pb-10">Sair do Painel Master</button>
       </div>
    </div>
  );
};

// --- APP COMPONENT (ROOT) ---

export default function App() {
  const [view, setView] = useState('landing');
  const [loggedPro, setLoggedPro] = useState(null);
  const [loggedClient, setLoggedClient] = useState(null);
  const [selectedProductForStore, setSelectedProductForStore] = useState(null);
  const [user, setUser] = useState(null);
  const [dbState, setDbState] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showMasterLogin, setShowMasterLogin] = useState(false);
  const [masterPass, setMasterPass] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [theme, setTheme] = useState('dark');

  // Gatilho Secreto Master
  useEffect(() => {
    if (clickCount === 3) { setShowMasterLogin(true); setClickCount(0); }
    const timer = setTimeout(() => setClickCount(0), 1200);
    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleSecretTrigger = () => setClickCount(prev => prev + 1);

  useEffect(() => {
    const handleKD = (e) => { if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') { e.preventDefault(); setShowMasterLogin(true); } };
    window.addEventListener('keydown', handleKD);
    return () => window.removeEventListener('keydown', handleKD);
  }, []);

  // Firebase Lifecycle
  useEffect(() => {
    const initAuth = async () => {
      if (!auth) return;
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
      else await signInAnonymously(auth);
    };
    initAuth();
    if (auth) onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'salon_state', 'core');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) { setDbState(docSnap.data()); } 
      else {
        setDoc(docRef, {
          salonName: 'Donna Embelezamento',
          adminSettings: { name: 'João Proprietário', password: 'admin123' },
          branding: { 
            primaryColor: '#D4AF37',
            landingBg: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1920&q=80', 
            tvBg: '', 
            instagramUrl: 'https://instagram.com/donna_embelezamento',
            instagramImgs: [
              'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1600948836101-f9ff16013a7b?auto=format&fit=crop&w=300&q=80'
            ] 
          },
          appointments: MOCK_APPOINTMENTS, professionals: INITIAL_PROFESSIONALS, products: INITIAL_PRODUCTS,
          clients: MOCK_CLIENTS, sales: [], expenses: [], premiumFeatures: { spotify: true, iptv: false },
          subscriptionDueDate: '2026-12-31T00:00:00',
          activeCall: null // NOVO ESTADO DE CHAMADA NA NUVEM
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

  const { 
    salonName, adminSettings, professionals, appointments, clients, products, 
    sales, expenses, branding, premiumFeatures, subscriptionDueDate, activeCall 
  } = dbState || {};

  const makeSetter = (key) => (val) => {
    const newVal = typeof val === 'function' ? val(dbState[key]) : val;
    updateGlobalState({ [key]: newVal });
  };

  // Função para efetuar chamada global na nuvem
  const handleSetActiveCall = (callData) => {
    updateGlobalState({ activeCall: callData });
    if (callData) {
      setTimeout(() => {
        updateGlobalState({ activeCall: null });
      }, 10000); // Limpa o aviso de chamada da nuvem ao fim de 10s
    }
  };

  // VARIÁVEIS CSS DINÂMICAS PARA A COR DO WHITE LABEL
  const primaryColor = branding?.primaryColor || '#D4AF37';
  
  if (loadingData) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white" style={{color: primaryColor}}>
      <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mb-6" style={{borderColor: primaryColor, borderTopColor: 'transparent'}}></div>
      <p className="font-serif tracking-widest text-sm animate-pulse uppercase">Conectando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black font-sans antialiased" onClick={handleSecretTrigger}>
      
      {/* INJEÇÃO DO TEMA WHITE LABEL - CSS CLÁSSICO E ROBUSTO */}
      <style>{`
        :root {
          --primary: ${primaryColor};
          --primary-10: ${primaryColor}1A;
          --primary-20: ${primaryColor}33;
          --primary-30: ${primaryColor}4D;
        }
        
        .text-theme { color: var(--primary) !important; }
        .bg-theme { background-color: var(--primary) !important; }
        .bg-theme-10 { background-color: var(--primary-10) !important; }
        .border-theme { border-color: var(--primary) !important; }
        .border-theme-30 { border-color: var(--primary-30) !important; }
        .shadow-theme { box-shadow: 0 0 40px var(--primary-30) !important; }
        
        .hover\\:text-theme:hover { color: var(--primary) !important; }
        .hover\\:bg-theme:hover { background-color: var(--primary) !important; }
        .hover\\:bg-theme-10:hover { background-color: var(--primary-10) !important; }
        .hover\\:border-theme:hover { border-color: var(--primary) !important; }
        
        .focus\\:border-theme:focus { border-color: var(--primary) !important; outline: none; }
        .group:hover .group-hover\\:bg-theme { background-color: var(--primary) !important; }
        .group:hover .group-hover\\:border-theme { border-color: var(--primary) !important; }
        
        ::selection { background-color: var(--primary-30); }
        @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        ::-webkit-scrollbar { width: 0; }
        body { background: black; -webkit-tap-highlight-color: transparent; }
      `}</style>

      {view === 'landing' && <LandingPage setView={setView} salonName={salonName} branding={branding} products={products} onProductClick={(p) => { setSelectedProductForStore(p); setView('store'); }} />}
      {view === 'auth' && <AuthScreen setView={setView} professionals={professionals} setLoggedPro={setLoggedPro} adminSettings={adminSettings} setShowMasterLogin={setShowMasterLogin} />}
      {view === 'admin' && <AdminDashboard setView={setView} salonName={salonName} setSalonName={makeSetter('salonName')} adminSettings={adminSettings} setAdminSettings={makeSetter('adminSettings')} appointments={appointments} setAppointments={makeSetter('appointments')} professionals={professionals} setProfessionals={makeSetter('professionals')} products={products} setProducts={makeSetter('products')} sales={sales} setSales={makeSetter('sales')} clients={clients} setClients={makeSetter('clients')} expenses={expenses} setExpenses={makeSetter('expenses')} tvPlaylist={dbState?.tvPlaylist || []} setTvPlaylist={makeSetter('tvPlaylist')} tvVideoFit={dbState?.tvVideoFit || 'contain'} setTvVideoFit={makeSetter('tvVideoFit')} setActiveCall={handleSetActiveCall} premiumFeatures={premiumFeatures} />}
      {view === 'booking' && <BookingFlow setView={setView} professionals={professionals} appointments={appointments} setAppointments={makeSetter('appointments')} />}
      {view === 'store' && <StoreFlow setView={setView} products={products} initialProduct={selectedProductForStore} salonName={salonName} />}
      {view === 'master' && <MasterDashboard setView={setView} subscriptionDueDate={subscriptionDueDate} setSubscriptionDueDate={makeSetter('subscriptionDueDate')} premiumFeatures={premiumFeatures} setPremiumFeatures={makeSetter('premiumFeatures')} branding={branding} setBranding={makeSetter('branding')} />}
      
      {view === 'client_login' && <ClientLoginScreen setView={setView} clients={clients} setLoggedClient={setLoggedClient} />}
      {view === 'client' && <ClientDashboard setView={setView} theme={theme} setTheme={setTheme} salonName={salonName} loggedClient={loggedClient} appointments={appointments} professionals={professionals} />}
      
      {view === 'pro_app' && <ProfessionalApp setView={setView} loggedPro={loggedPro} appointments={appointments} setAppointments={makeSetter('appointments')} professionals={professionals} products={products} setProducts={makeSetter('products')} sales={sales} setSales={makeSetter('sales')} salonName={salonName} setActiveCall={handleSetActiveCall} />}
      {view === 'tv' && <TvPanelScreen activeCall={activeCall} salonName={salonName} professionals={professionals} tvPlaylist={dbState?.tvPlaylist || []} tvVideoFit={dbState?.tvVideoFit || 'contain'} setView={setView} branding={branding} />}
      {view === 'spotify' && <SpotifyScreen setView={setView} spotifyUrl={dbState?.spotifyUrl || ''} />}
      {view === 'iptv' && <IptvScreen setView={setView} iptvUrl={dbState?.iptvUrl || ''} />}

      {/* Alerta Chamada TV para o Administrador ou Profissional */}
      {activeCall && (view === 'admin' || view === 'pro_app') && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in p-6">
          <div className="text-center max-w-2xl">
            <h2 className="text-2xl text-theme mb-4 font-light tracking-[0.3em]">CHAMADA ENVIADA À TV</h2>
            <h1 className="text-6xl md:text-9xl font-bold text-green-400 mb-8 animate-pulse">{activeCall.client.split(' ')[0]}</h1>
            <p className="text-xl text-neutral-400 font-light">Dirija-se ao profissional <span className="text-white font-medium">{professionals.find(p => p.id === activeCall.proId)?.name}</span></p>
            <Button onClick={() => handleSetActiveCall(null)} variant="outline" className="mt-12 px-12">Fechar Alerta</Button>
          </div>
        </div>
      )}

      {showMasterLogin && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in p-4" onClick={(e) => e.stopPropagation()}>
          <Card className="w-full max-w-sm border-blue-900/50">
            <div className="flex justify-between items-center mb-8"><h3 className="text-blue-500 font-bold tracking-widest flex items-center gap-2"><Key size={18}/> ACESSO MASTER</h3><button onClick={() => setShowMasterLogin(false)} className="text-neutral-600 hover:text-white"><X/></button></div>
            <input type="password" placeholder="Introduza Senha Mestra" className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-center mb-4 focus:border-blue-500 outline-none text-white" autoFocus onChange={e => setMasterPass(e.target.value)} />
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4" onClick={() => { if(masterPass === 'master2026') { setView('master'); setShowMasterLogin(false); } else { alert('Senha Inválida'); } }}>Autenticar Desenvolvedor</Button>
          </Card>
        </div>
      )}
    </div>
  );
}