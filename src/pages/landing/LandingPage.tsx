import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      {/* Top minimal header */}
      <header className="w-full py-4 px-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Kopargaon Connect Logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#1d1b20]">
              KOPARGAON <span className="text-[#4f378a]">CONNECT</span>
            </span>
            <span className="text-[10px] font-semibold text-[#494551] uppercase tracking-wider">
              Smart Mobility & Rural Logistics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/citizen/login')}
            className="text-xs font-bold text-[#4f378a] hover:text-[#22005d] px-3 py-1.5"
          >
            Citizen Sign In
          </button>
          <button
            onClick={() => navigate('/official/login')}
            className="text-xs font-bold bg-[#FFD814] text-[#765b00] hover:bg-[#e6c200] px-4 py-2 rounded-full shadow-xs transition-all"
          >
            Official Portal
          </button>
        </div>
      </header>

      {/* Hero Section Matching Stitch Design */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
        {/* Background Rural Bus Imagery with Soft Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdf7ff] via-[#fdf7ff]/90 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Main Stitch Logo Badge */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mb-4 rounded-3xl bg-white p-3 shadow-lg border border-[#cbc4d2]/30 flex items-center justify-center">
              <img
                src={LOGO_URL}
                alt="Kopargaon Connect Logo"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#1d1b20] tracking-tight text-balance max-w-3xl leading-tight">
              Smart Mobility & Rural Logistics
            </h1>
            <p className="mt-3 text-base sm:text-lg text-[#494551] max-w-2xl text-balance">
              Bridging the gap between essential rural infrastructure, bus cargo utilization, and smart citizen transit in Kopargaon.
            </p>
          </div>

          {/* 2 Primary Choice Cards Matching Approved Stitch Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-4">
            {/* Citizen Access Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-[#cbc4d2]/40 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#4f378a]"></div>
              <div className="w-16 h-16 rounded-2xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-4 group-hover:bg-[#4f378a] group-hover:text-white transition-colors shadow-xs">
                <span className="material-symbols-outlined text-[36px]">person</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1d1b20] mb-2">Citizen Access</h2>
              <p className="text-sm text-[#494551] mb-6 leading-relaxed">
                Track buses, plan trips, book cargo space, send agricultural produce, and report local traffic.
              </p>
              <button
                onClick={() => navigate('/citizen/login')}
                className="mt-auto w-full bg-[#4f378a] text-white py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#382467] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Citizen Login</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Official Portal Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-[#cbc4d2]/40 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FFD814]"></div>
              <div className="w-16 h-16 rounded-2xl bg-[#FFD814]/30 text-[#765b00] flex items-center justify-center mb-4 group-hover:bg-[#765b00] group-hover:text-white transition-colors shadow-xs">
                <span className="material-symbols-outlined text-[36px]">admin_panel_settings</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1d1b20] mb-2">Official Portal</h2>
              <p className="text-sm text-[#494551] mb-6 leading-relaxed">
                Depot operations, fleet tracking, cargo schedule publishing, dynamic traffic alerts & EV management.
              </p>
              <button
                onClick={() => navigate('/official/login')}
                className="mt-auto w-full bg-[#765b00] text-white py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#503d00] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Official Login</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Quick Explore Link */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/citizen')}
              className="text-xs font-bold text-[#4f378a] hover:underline flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-[#cbc4d2]/50 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              Explore Platform in Guest Mode
            </button>
          </div>

          {/* Key Infrastructure Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mt-12 pt-8 border-t border-[#cbc4d2]/30 text-left">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#cbc4d2]/30">
              <span className="material-symbols-outlined text-[#4f378a] text-[24px] mb-1">inventory_2</span>
              <div className="font-bold text-xs text-[#1d1b20]">Bus Cargo Utilization</div>
              <p className="text-[11px] text-[#494551] mt-0.5">Utilize vacant MSRTC bus cargo space for local farm produce.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#cbc4d2]/30">
              <span className="material-symbols-outlined text-[#4f378a] text-[24px] mb-1">psychology</span>
              <div className="font-bold text-xs text-[#1d1b20]">Connect AI Matching</div>
              <p className="text-[11px] text-[#494551] mt-0.5">Deterministic route & capacity matching for optimal dispatch.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#cbc4d2]/30">
              <span className="material-symbols-outlined text-[#4f378a] text-[24px] mb-1">traffic</span>
              <div className="font-bold text-xs text-[#1d1b20]">Dynamic Traffic</div>
              <p className="text-[11px] text-[#494551] mt-0.5">Citizen photo reports driving color-coded congestion severity.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#cbc4d2]/30">
              <span className="material-symbols-outlined text-[#4f378a] text-[24px] mb-1">ev_station</span>
              <div className="font-bold text-xs text-[#1d1b20]">EV Charging Network</div>
              <p className="text-[11px] text-[#494551] mt-0.5">Real-time availability across Kopargaon rural corridors.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
