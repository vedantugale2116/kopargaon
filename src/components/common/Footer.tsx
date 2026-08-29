import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_URL } from './Navbar';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#cbc4d2]/40 text-[#494551] text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} alt="Kopargaon Connect" className="w-8 h-8 object-contain" />
              <span className="font-extrabold text-sm text-[#1d1b20]">KOPARGAON CONNECT</span>
            </div>
            <p className="text-xs text-[#494551] leading-relaxed">
              Smart Mobility & Rural Logistics Platform. Empowering rural farmers, transporters, and citizens with intelligent transport allocation and live monitoring.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-[#1d1b20] uppercase text-[11px] tracking-wider mb-3">Citizen Services</h4>
            <ul className="space-y-2">
              <li><Link to="/citizen/journey" className="hover:text-[#4f378a]">Plan Your Journey</Link></li>
              <li><Link to="/citizen/bus-schedules" className="hover:text-[#4f378a]">MSRTC Bus Schedules</Link></li>
              <li><Link to="/citizen/map" className="hover:text-[#4f378a]">Kopargaon Live Map</Link></li>
              <li><Link to="/citizen/report-traffic" className="hover:text-[#4f378a]">Report Traffic Incident</Link></li>
              <li><Link to="/citizen/ev-stations" className="hover:text-[#4f378a]">EV Charging Stations</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-[#1d1b20] uppercase text-[11px] tracking-wider mb-3">Rural Logistics</h4>
            <ul className="space-y-2">
              <li><Link to="/citizen/farmer/send-goods" className="hover:text-[#4f378a]">Farmer: Send Goods</Link></li>
              <li><Link to="/citizen/farmer/ai" className="hover:text-[#4f378a]">Connect AI Recommendation</Link></li>
              <li><Link to="/citizen/transporter/publish-trip" className="hover:text-[#4f378a]">Transporter: Publish Trip</Link></li>
              <li><Link to="/citizen/farmer/shipments" className="hover:text-[#4f378a]">Track Agro Shipment</Link></li>
              <li><Link to="/citizen/safety" className="hover:text-[#4f378a]">Safety & Road Advisories</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-[#1d1b20] uppercase text-[11px] tracking-wider mb-3">Official Operations</h4>
            <ul className="space-y-2">
              <li><Link to="/official/login" className="hover:text-[#765b00]">Official Portal Access</Link></li>
              <li><Link to="/official" className="hover:text-[#765b00]">Command Center Overview</Link></li>
              <li><Link to="/official/depot" className="hover:text-[#765b00]">Kopargaon Bus Depot</Link></li>
              <li><Link to="/official/fleet" className="hover:text-[#765b00]">Fleet Telemetry & Status</Link></li>
              <li><Link to="/official/alerts" className="hover:text-[#765b00]">Alert Management Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#cbc4d2]/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-500">
          <div>
            © 2026 Kopargaon Municipal Smart Mobility & Rural Logistics Directorate. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Platform Operational
            </span>
            <span>Kopargaon, Maharashtra 423601</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
