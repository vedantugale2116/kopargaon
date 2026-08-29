import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, CitizenRole } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { NotificationDrawer } from './NotificationDrawer';

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1V-R-GdYj8oGJT_2bXM0Ak5657ky4PRlcbc9zGAmL3AFBn4730wb1To4DQMF2d-saEEEgg6AWVh8IwvogjoH8jxgvqOvGKl90Mp20WyVY4HG3zQm8wA8ToUVpJLMCYnpBjHR7bWep2w6rzbI4Y2-NNcvpf_kwL3vSxYfDfu4Zr5wdfhnBVXRi1SALqZLcoDf3rbQ3WH2-fJRDxhsq0rK8TT1DCHnZsmtT2STi_8XPRQHkKQ9FBRGM5_0Kc';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isOfficial, logout, setCitizenRole } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (role: CitizenRole) => {
    setCitizenRole(role);
    setIsRoleDropdownOpen(false);
    if (role === 'FARMER') navigate('/citizen/farmer');
    else if (role === 'TRANSPORTER') navigate('/citizen/transporter');
    else navigate('/citizen');
  };

  const getPortalHomeLink = () => {
    if (!isAuthenticated) return '/';
    if (isOfficial) return '/official';
    if (user?.citizenRole === 'FARMER') return '/citizen/farmer';
    if (user?.citizenRole === 'TRANSPORTER') return '/citizen/transporter';
    return '/citizen';
  };

  return (
    <>
      <header className="sticky top-0 z-[500] w-full bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link to={getPortalHomeLink()} className="flex items-center gap-2.5 group">
              <img
                src={LOGO_URL}
                alt="Kopargaon Connect Logo"
                className="w-10 h-10 object-contain drop-shadow-xs transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-[#1d1b20] tracking-tight flex items-center gap-1">
                  KOPARGAON <span className={isOfficial ? 'text-[#765b00]' : 'text-[#4f378a]'}>CONNECT</span>
                </span>
                <span className="text-[9px] uppercase font-semibold tracking-wider text-[#494551] hidden sm:block">
                  Smart Mobility & Rural Logistics
                </span>
              </div>
            </Link>

            {/* Current Active Role Badge */}
            {isAuthenticated && (
              <div className="relative ml-2 hidden md:block">
                {!isOfficial ? (
                  <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e1d4fd] text-[#4f378a] hover:bg-[#cfbcff] transition-colors border border-[#4f378a]/20"
                    title="Click to Switch Citizen Role"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {user?.citizenRole === 'FARMER' ? 'agriculture' :
                       user?.citizenRole === 'TRANSPORTER' ? 'local_shipping' : 'person'}
                    </span>
                    <span>
                      {user?.citizenRole === 'FARMER' ? 'Farmer / Sender' :
                       user?.citizenRole === 'TRANSPORTER' ? 'Private Transporter' : 'General Citizen'}
                    </span>
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFD814]/30 text-[#765b00] border border-[#765b00]/30">
                    <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                    <span>Official: {user?.officialRole || 'Admin'}</span>
                  </span>
                )}

                {/* Role Switcher Dropdown */}
                {isRoleDropdownOpen && !isOfficial && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#cbc4d2] py-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400">Switch Citizen Role</div>
                    <button
                      onClick={() => handleRoleChange('GENERAL_CITIZEN')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#f2ecf4] ${user?.citizenRole === 'GENERAL_CITIZEN' ? 'font-bold text-[#4f378a]' : 'text-gray-700'}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      General Citizen
                    </button>
                    <button
                      onClick={() => handleRoleChange('FARMER')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#f2ecf4] ${user?.citizenRole === 'FARMER' ? 'font-bold text-[#4f378a]' : 'text-gray-700'}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">agriculture</span>
                      Farmer / Goods Sender
                    </button>
                    <button
                      onClick={() => handleRoleChange('TRANSPORTER')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#f2ecf4] ${user?.citizenRole === 'TRANSPORTER' ? 'font-bold text-[#4f378a]' : 'text-gray-700'}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      Private Transporter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Links (For Citizen Portals) */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isOfficial ? (
              <>
                <Link
                  to={getPortalHomeLink()}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === getPortalHomeLink()
                      ? 'text-[#4f378a] bg-[#e1d4fd]/40 font-bold'
                      : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/citizen/journey"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/citizen/journey'
                      ? 'text-[#4f378a] bg-[#e1d4fd]/40 font-bold'
                      : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                  }`}
                >
                  Plan Journey
                </Link>
                <Link
                  to="/citizen/bus-schedules"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/citizen/bus-schedules'
                      ? 'text-[#4f378a] bg-[#e1d4fd]/40 font-bold'
                      : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                  }`}
                >
                  Bus Schedules
                </Link>
                <Link
                  to="/citizen/map"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/citizen/map'
                      ? 'text-[#4f378a] bg-[#e1d4fd]/40 font-bold'
                      : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                  }`}
                >
                  Live Map
                </Link>
                {user?.citizenRole === 'FARMER' && (
                  <>
                    <Link
                      to="/citizen/farmer/send-goods"
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-[#4f378a] bg-[#e1d4fd] hover:bg-[#cfbcff] transition-all flex items-center gap-1 font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      Send Goods
                    </Link>
                    <Link
                      to="/citizen/farmer/shipments"
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        location.pathname === '/citizen/farmer/shipments'
                          ? 'text-[#4f378a] bg-[#e1d4fd]/40 font-bold'
                          : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                      }`}
                    >
                      My Shipments
                    </Link>
                  </>
                )}
                {user?.citizenRole === 'TRANSPORTER' && (
                  <>
                    <Link
                      to="/citizen/transporter/publish-trip"
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-[#4f378a] bg-[#e1d4fd] hover:bg-[#cfbcff] transition-all flex items-center gap-1 font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      Publish Trip
                    </Link>
                    <Link
                      to="/citizen/transporter/requests"
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        location.pathname === '/citizen/transporter/requests'
                          ? 'text-[#4f378a] bg-[#e1d4fd]/40 font-bold'
                          : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                      }`}
                    >
                      Requests
                    </Link>
                  </>
                )}
                <Link
                  to="/citizen/report-traffic"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/citizen/report-traffic'
                      ? 'text-[#4f378a] bg-[#e1d4fd]/40 font-bold'
                      : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                  }`}
                >
                  Report Traffic
                </Link>
                <Link
                  to="/citizen/safety"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/citizen/safety'
                      ? 'text-[#4f378a] bg-[#e1d4fd]/40 font-bold'
                      : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                  }`}
                >
                  Safety & Alerts
                </Link>
                <Link
                  to="/citizen/ev-stations"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/citizen/ev-stations'
                      ? 'text-[#4f378a] bg-[#e1d4fd]/40 font-bold'
                      : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                  }`}
                >
                  EV Stations
                </Link>
              </>
            ) : (
              // Official Desktop Quick Nav
              <div className="flex items-center gap-2">
                <Link
                  to="/official"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#765b00] bg-[#FFD814]/20 hover:bg-[#FFD814]/40 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">dashboard</span>
                  Command Overview
                </Link>
                <Link
                  to="/official/map"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Live Fleet Map
                </Link>
                <Link
                  to="/official/depot"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Depot
                </Link>
                <Link
                  to="/official/traffic-safety"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Traffic Reports
                </Link>
              </div>
            )}
          </nav>

          {/* Right Action Icons & User Status */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to={isOfficial ? "/official/settings" : "/citizen/profile"}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  title="Profile & Settings"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                    isOfficial ? 'bg-[#765b00]' : 'bg-[#4f378a]'
                  }`}>
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold text-[#1d1b20] leading-none">{user?.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 leading-none">
                      {isOfficial ? user?.officialRole : (user?.citizenRole || 'Citizen')}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/citizen/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4f378a] border border-[#4f378a] hover:bg-[#e1d4fd]/30 transition-all"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/official/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#765b00] text-white hover:bg-[#503d00] transition-all shadow-xs"
                >
                  Official Portal
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#cbc4d2] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
            {isAuthenticated && (
              <div className="p-3 bg-[#fdf7ff] rounded-xl border border-[#e1d4fd] mb-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#1d1b20]">{user?.name}</div>
                  <div className="text-xs text-gray-500">{isOfficial ? user?.department : user?.email}</div>
                </div>
                {!isOfficial && (
                  <button
                    onClick={() => {
                      setIsRoleDropdownOpen(!isRoleDropdownOpen);
                    }}
                    className="text-xs bg-[#e1d4fd] text-[#4f378a] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{user?.citizenRole}</span>
                    <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                  </button>
                )}
              </div>
            )}

            {!isOfficial ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  to={getPortalHomeLink()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">home</span>
                  Home Portal
                </Link>
                <Link
                  to="/citizen/journey"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">alt_route</span>
                  Plan Journey
                </Link>
                <Link
                  to="/citizen/bus-schedules"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">schedule</span>
                  Bus Schedules
                </Link>
                <Link
                  to="/citizen/map"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">map</span>
                  Live Map
                </Link>
                <Link
                  to="/citizen/farmer/send-goods"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  Send Goods
                </Link>
                <Link
                  to="/citizen/farmer/shipments"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">inventory_2</span>
                  My Shipments
                </Link>
                <Link
                  to="/citizen/transporter/publish-trip"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-purple-50 text-purple-900 font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  Publish Trip
                </Link>
                <Link
                  to="/citizen/report-traffic"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">traffic</span>
                  Report Traffic
                </Link>
                <Link
                  to="/citizen/safety"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-red-600">warning</span>
                  Safety & Alerts
                </Link>
                <Link
                  to="/citizen/ev-stations"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">ev_station</span>
                  EV Stations
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/official"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-amber-50 font-bold text-[#765b00] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  Overview
                </Link>
                <Link
                  to="/official/map"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  Live Fleet Map
                </Link>
                <Link
                  to="/official/fleet"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                  Fleet
                </Link>
                <Link
                  to="/official/depot"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">warehouse</span>
                  Bus Depot
                </Link>
                <Link
                  to="/official/schedules"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Schedules
                </Link>
                <Link
                  to="/official/traffic-safety"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-50 font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">traffic</span>
                  Traffic & Safety
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Slide-in Notifications Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
