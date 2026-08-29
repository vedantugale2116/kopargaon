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
    setIsMobileMenuOpen(false);
    if (role === 'FARMER') {
      navigate('/citizen/farmer');
    } else if (role === 'TRANSPORTER') {
      navigate('/citizen/transporter');
    } else {
      navigate('/citizen');
    }
  };

  const handleQuickRoleToggle = () => {
    if (user?.citizenRole === 'FARMER') {
      handleRoleChange('TRANSPORTER');
    } else if (user?.citizenRole === 'TRANSPORTER') {
      handleRoleChange('FARMER');
    } else {
      handleRoleChange('FARMER');
    }
  };

  const getPortalHomeLink = () => {
    if (!isAuthenticated) return '/';
    if (isOfficial) return '/official';
    if (user?.citizenRole === 'FARMER') return '/citizen/farmer';
    if (user?.citizenRole === 'TRANSPORTER') return '/citizen/transporter';
    return '/citizen';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-[500] w-full bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 shadow-xs">
        <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 h-16 flex items-center justify-between gap-2 lg:gap-4">
          
          {/* ================================================================= */}
          {/* 1. BRAND SECTION + ROLE SWITCHER                                  */}
          {/* ================================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link to={getPortalHomeLink()} className="flex items-center gap-2 group shrink-0">
              <img
                src={LOGO_URL}
                alt="Kopargaon Connect Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-xs transition-transform group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm sm:text-base text-[#1d1b20] tracking-tight whitespace-nowrap">
                  KOPARGAON <span className={isOfficial ? 'text-[#765b00]' : 'text-[#4f378a]'}>CONNECT</span>
                </span>
                <span className="text-[8.5px] uppercase font-semibold tracking-wider text-[#494551] hidden 2xl:block whitespace-nowrap">
                  Smart Mobility & Rural Logistics
                </span>
              </div>
            </Link>

            {/* Role Switcher Pill (Desktop) */}
            {isAuthenticated && (
              <div className="relative shrink-0 hidden md:block">
                {!isOfficial ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#e1d4fd] text-[#4f378a] hover:bg-[#cfbcff] active:scale-95 transition-all border border-[#4f378a]/20 shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
                      title="Switch Role"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {user?.citizenRole === 'FARMER' ? 'agriculture' :
                         user?.citizenRole === 'TRANSPORTER' ? 'local_shipping' : 'person'}
                      </span>
                      <span className="hidden xl:inline">
                        {user?.citizenRole === 'FARMER' ? 'Farmer / Sender' :
                         user?.citizenRole === 'TRANSPORTER' ? 'Transporter' : 'General Citizen'}
                      </span>
                      <span className="xl:hidden">
                        {user?.citizenRole === 'FARMER' ? 'Farmer' :
                         user?.citizenRole === 'TRANSPORTER' ? 'Transporter' : 'Citizen'}
                      </span>
                      <span className="material-symbols-outlined text-[15px] text-[#4f378a]">swap_horiz</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isRoleDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#cbc4d2] py-2 z-50 animate-in fade-in slide-in-from-top-1">
                        <div className="px-3 py-1 text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">
                          Select Citizen Role
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRoleChange('FARMER')}
                          className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 hover:bg-[#f2ecf4] transition-colors cursor-pointer ${
                            user?.citizenRole === 'FARMER' ? 'font-bold text-[#4f378a] bg-[#e1d4fd]/30' : 'text-gray-700'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px] text-emerald-700">agriculture</span>
                          <div>
                            <div className="font-bold">Farmer / Sender</div>
                            <div className="text-[10px] text-gray-500">Agri freight & dispatch</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleChange('TRANSPORTER')}
                          className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 hover:bg-[#f2ecf4] transition-colors cursor-pointer ${
                            user?.citizenRole === 'TRANSPORTER' ? 'font-bold text-[#4f378a] bg-[#e1d4fd]/30' : 'text-gray-700'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px] text-purple-700">local_shipping</span>
                          <div>
                            <div className="font-bold">Private Transporter</div>
                            <div className="text-[10px] text-gray-500">Publish trips & haul freight</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleChange('GENERAL_CITIZEN')}
                          className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 hover:bg-[#f2ecf4] transition-colors cursor-pointer ${
                            user?.citizenRole === 'GENERAL_CITIZEN' ? 'font-bold text-[#4f378a] bg-[#e1d4fd]/30' : 'text-gray-700'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px] text-blue-700">person</span>
                          <div>
                            <div className="font-bold">General Citizen</div>
                            <div className="text-[10px] text-gray-500">Bus travel & traffic map</div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFD814]/30 text-[#765b00] border border-[#765b00]/30 shrink-0 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                    <span>Official: {user?.officialRole === 'ADMIN' ? 'Admin' : user?.officialRole === 'DEPOT_MANAGER' ? 'Depot Head' : 'Traffic Safety'}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* 2. NAVIGATION CONTAINER (CENTER)                                 */}
          {/* ================================================================= */}
          <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center px-1 lg:px-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 xl:gap-1.5 shrink-0 py-1">
              {!isOfficial ? (
                <>
                  <Link
                    to={getPortalHomeLink()}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive(getPortalHomeLink())
                        ? 'text-[#4f378a] bg-[#e1d4fd]/60 font-bold shadow-2xs'
                        : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/citizen/journey"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/citizen/journey')
                        ? 'text-[#4f378a] bg-[#e1d4fd]/60 font-bold shadow-2xs'
                        : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                    }`}
                  >
                    Plan Journey
                  </Link>
                  <Link
                    to="/citizen/bus-schedules"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/citizen/bus-schedules')
                        ? 'text-[#4f378a] bg-[#e1d4fd]/60 font-bold shadow-2xs'
                        : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                    }`}
                  >
                    Bus Schedules
                  </Link>
                  <Link
                    to="/citizen/map"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/citizen/map')
                        ? 'text-[#4f378a] bg-[#e1d4fd]/60 font-bold shadow-2xs'
                        : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                    }`}
                  >
                    Live Map
                  </Link>

                  {/* Role Specific Actions */}
                  {user?.citizenRole === 'FARMER' && (
                    <>
                      <Link
                        to="/citizen/farmer/send-goods"
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                          isActive('/citizen/farmer/send-goods')
                            ? 'text-white bg-emerald-700 shadow-2xs'
                            : 'text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                        <span>Send Goods</span>
                      </Link>
                      <Link
                        to="/citizen/farmer/shipments"
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                          isActive('/citizen/farmer/shipments')
                            ? 'text-[#4f378a] bg-[#e1d4fd]/60 font-bold shadow-2xs'
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
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                          isActive('/citizen/transporter/publish-trip')
                            ? 'text-white bg-purple-700 shadow-2xs'
                            : 'text-purple-900 bg-purple-100/80 hover:bg-purple-200/80'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">add_circle</span>
                        <span>Publish Trip</span>
                      </Link>
                      <Link
                        to="/citizen/transporter/requests"
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                          isActive('/citizen/transporter/requests')
                            ? 'text-[#4f378a] bg-[#e1d4fd]/60 font-bold shadow-2xs'
                            : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                        }`}
                      >
                        Requests
                      </Link>
                    </>
                  )}

                  <Link
                    to="/citizen/report-traffic"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/citizen/report-traffic')
                        ? 'text-[#4f378a] bg-[#e1d4fd]/60 font-bold shadow-2xs'
                        : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                    }`}
                  >
                    Report Traffic
                  </Link>
                  <Link
                    to="/citizen/safety"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/citizen/safety')
                        ? 'text-[#4f378a] bg-[#e1d4fd]/60 font-bold shadow-2xs'
                        : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                    }`}
                  >
                    Safety & Alerts
                  </Link>
                  <Link
                    to="/citizen/ev-stations"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/citizen/ev-stations')
                        ? 'text-[#4f378a] bg-[#e1d4fd]/60 font-bold shadow-2xs'
                        : 'text-[#494551] hover:text-[#1d1b20] hover:bg-[#f2ecf4]'
                    }`}
                  >
                    EV Stations
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/official"
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                      isActive('/official')
                        ? 'text-white bg-[#765b00] shadow-2xs'
                        : 'text-[#765b00] bg-[#FFD814]/20 hover:bg-[#FFD814]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">dashboard</span>
                    <span>Overview</span>
                  </Link>
                  <Link
                    to="/official/map"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/official/map')
                        ? 'text-[#765b00] bg-[#FFD814]/30 font-bold shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Live Fleet Map
                  </Link>
                  <Link
                    to="/official/depot"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/official/depot')
                        ? 'text-[#765b00] bg-[#FFD814]/30 font-bold shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Depot
                  </Link>
                  <Link
                    to="/official/schedules"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/official/schedules')
                        ? 'text-[#765b00] bg-[#FFD814]/30 font-bold shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Schedules
                  </Link>
                  <Link
                    to="/official/fleet"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/official/fleet')
                        ? 'text-[#765b00] bg-[#FFD814]/30 font-bold shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Fleet
                  </Link>
                  <Link
                    to="/official/traffic-safety"
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive('/official/traffic-safety')
                        ? 'text-[#765b00] bg-[#FFD814]/30 font-bold shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Traffic & Safety
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* ================================================================= */}
          {/* 3. USER SECTION (RIGHT)                                           */}
          {/* ================================================================= */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Notification Bell */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-black transition-colors flex items-center justify-center cursor-pointer shrink-0"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[21px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-0.5 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs ring-2 ring-white pointer-events-none animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {/* Profile Pill */}
                <Link
                  to={isOfficial ? "/official/profile" : "/citizen/profile"}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                  title="Profile & Settings"
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs ${
                    isOfficial ? 'bg-[#765b00]' : 'bg-[#4f378a]'
                  }`}>
                    {user?.name ? user.name[0].toUpperCase() : (isOfficial ? 'A' : 'U')}
                  </div>
                  <div className="text-left hidden 2xl:block">
                    <div className="text-xs font-bold text-[#1d1b20] leading-none max-w-[100px] truncate">
                      {user?.name || (isOfficial ? 'Official' : 'Citizen')}
                    </div>
                    <div className="text-[9.5px] text-gray-500 mt-0.5 leading-none">
                      {isOfficial ? (user?.officialRole === 'ADMIN' ? 'Admin' : user?.officialRole) : (user?.citizenRole === 'FARMER' ? 'Farmer' : user?.citizenRole === 'TRANSPORTER' ? 'Transporter' : 'Citizen')}
                    </div>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[19px]">logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Link
                  to="/citizen/login"
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-[#4f378a] border border-[#4f378a] hover:bg-[#e1d4fd]/30 transition-all whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/official/login"
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#765b00] text-white hover:bg-[#503d00] transition-all shadow-xs whitespace-nowrap"
                >
                  Official
                </Link>
              </div>
            )}

            {/* Mobile / Tablet Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl shrink-0 flex items-center justify-center cursor-pointer"
              title="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[23px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* MOBILE SLIDE-DOWN NAVIGATION DRAWER                                */}
        {/* =================================================================== */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#cbc4d2] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
            {isAuthenticated && (
              <div className="p-3 bg-[#fdf7ff] rounded-2xl border border-[#e1d4fd] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#1d1b20]">{user?.name}</div>
                  <div className="text-xs text-gray-500">{isOfficial ? (user?.department || 'Municipal Administration') : (user?.email || 'Citizen')}</div>
                </div>
                {!isOfficial && (
                  <button
                    type="button"
                    onClick={handleQuickRoleToggle}
                    className="text-xs bg-[#e1d4fd] text-[#4f378a] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <span>{user?.citizenRole === 'FARMER' ? '🌾 Farmer' : user?.citizenRole === 'TRANSPORTER' ? '🚛 Transporter' : '👤 Citizen'}</span>
                    <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  </button>
                )}
              </div>
            )}

            {!isOfficial ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  to={getPortalHomeLink()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">home</span>
                  Home
                </Link>
                <Link
                  to="/citizen/journey"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">alt_route</span>
                  Plan Journey
                </Link>
                <Link
                  to="/citizen/bus-schedules"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">schedule</span>
                  Bus Schedules
                </Link>
                <Link
                  to="/citizen/map"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">map</span>
                  Live Map
                </Link>
                <Link
                  to="/citizen/farmer/send-goods"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  Send Goods
                </Link>
                <Link
                  to="/citizen/farmer/shipments"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">inventory_2</span>
                  My Shipments
                </Link>
                <Link
                  to="/citizen/transporter/publish-trip"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-purple-50 text-purple-900 font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  Publish Trip
                </Link>
                <Link
                  to="/citizen/transporter/requests"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">task</span>
                  Trip Requests
                </Link>
                <Link
                  to="/citizen/report-traffic"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4f378a]">traffic</span>
                  Report Traffic
                </Link>
                <Link
                  to="/citizen/safety"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px] text-red-600">warning</span>
                  Safety & Alerts
                </Link>
                <Link
                  to="/citizen/ev-stations"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#e1d4fd]/30 font-semibold flex items-center gap-2 text-gray-800 col-span-2"
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
                  className="p-2.5 rounded-xl bg-amber-50 font-bold text-[#765b00] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  Overview
                </Link>
                <Link
                  to="/official/map"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  Live Fleet Map
                </Link>
                <Link
                  to="/official/fleet"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                  Fleet
                </Link>
                <Link
                  to="/official/depot"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px]">warehouse</span>
                  Bus Depot
                </Link>
                <Link
                  to="/official/schedules"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 font-semibold flex items-center gap-2 text-gray-800"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Schedules
                </Link>
                <Link
                  to="/official/traffic-safety"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 font-semibold flex items-center gap-2 text-gray-800"
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
