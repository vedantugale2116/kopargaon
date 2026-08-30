import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LOGO_URL } from './Navbar';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/official', icon: 'dashboard' },
    { label: 'Live Map', path: '/official/map', icon: 'map' },
    { label: 'Fleet Management', path: '/official/fleet', icon: 'directions_bus' },
    { label: 'Bus Depot Operations', path: '/official/depot', icon: 'warehouse' },
    { label: 'Schedule Management', path: '/official/schedules', icon: 'calendar_month' },
    { label: 'Shipments & Logistics', path: '/official/shipments', icon: 'local_shipping' },
    { label: 'Cargo Capacity Monitor', path: '/official/capacity', icon: 'inventory_2' },
    { label: 'Traffic & Safety Reports', path: '/official/traffic-safety', icon: 'traffic' },
    { label: 'Alert Management Center', path: '/official/alerts', icon: 'notifications_active' },
    { label: 'Data Resilience Center', path: '/official/recovery', icon: 'shield' },
    { label: 'EV Infrastructure', path: '/official/ev-infrastructure', icon: 'ev_station' },
    { label: 'Official Profile & Settings', path: '/official/settings', icon: 'settings' },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-white h-screen sticky top-0 flex flex-col border-r border-[#cbc4d2]/50 shrink-0 z-40 shadow-xs">
      {/* Top Header Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#cbc4d2]/40 gap-3">
        <img
          src={LOGO_URL}
          alt="KOPARGAON CONNECT Logo"
          className="h-9 w-auto object-contain"
        />
        <div className="flex flex-col">
          <span className="font-extrabold text-base text-[#1d1b20] tracking-tight">
            KOPARGAON <span className="text-[#765b00]">CONNECT</span>
          </span>
          <span className="text-[10px] font-bold text-[#765b00] tracking-wider uppercase">
            Official Portal
          </span>
        </div>
      </div>

      {/* Nav Items List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">
          Municipal Operations
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/official'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#e1d4fd] text-[#22005d] font-bold shadow-xs'
                  : 'text-[#494551] hover:bg-[#f2ecf4] hover:text-[#1d1b20]'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Switcher & User info */}
      <div className="p-3 border-t border-[#cbc4d2]/40 space-y-2 bg-[#fdf7ff]">
        <Link
          to="/citizen"
          className="w-full flex items-center justify-center gap-2 bg-[#c9a74d]/20 text-[#503d00] hover:bg-[#c9a74d]/30 font-bold text-xs py-2 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          Citizen Portal View
        </Link>

        <div className="flex items-center justify-between pt-2 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#765b00] text-white flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#1d1b20] leading-none truncate max-w-[110px]">
                {user?.name || 'Official Admin'}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5 leading-none">
                {user?.officialRole || 'Admin'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
