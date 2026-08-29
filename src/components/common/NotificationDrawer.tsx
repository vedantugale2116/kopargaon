import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Filter notifications relevant to current user role
  const userRole = user?.roleType === 'OFFICIAL' 
    ? 'OFFICIAL' 
    : user?.citizenRole === 'FARMER' 
      ? 'FARMER' 
      : user?.citizenRole === 'TRANSPORTER' 
        ? 'TRANSPORTER' 
        : 'CITIZEN';

  const relevantNotifications = notifications.filter(
    n => n.targetRole === 'ALL' || n.targetRole === userRole || (!user && n.targetRole === 'CITIZEN')
  );

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#cbc4d2]/50 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#cbc4d2]/30 flex items-center justify-between bg-[#f8f2fa]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f378a]">notifications_active</span>
            <h3 className="font-bold text-base text-[#1d1b20]">Notifications & Alerts</h3>
            <span className="bg-[#e1d4fd] text-[#4f378a] text-xs px-2 py-0.5 rounded-full font-bold">
              {relevantNotifications.filter(n => !n.read).length} new
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2 bg-gray-50 flex justify-between items-center text-xs text-gray-500 border-b border-gray-100">
          <span>Role View: <strong className="text-[#4f378a]">{userRole}</strong></span>
          <button 
            onClick={clearAllNotifications}
            className="text-[#4f378a] hover:underline font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {relevantNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
              <p className="text-sm">No new notifications right now.</p>
            </div>
          ) : (
            relevantNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.actionUrl) {
                    navigate(notif.actionUrl);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-white border-gray-200 opacity-75'
                    : 'bg-[#fdf7ff] border-[#4f378a]/30 shadow-xs ring-1 ring-[#4f378a]/10'
                } hover:border-[#4f378a]`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    notif.category === 'BUS' ? 'bg-[#e1d4fd] text-[#4f378a]' :
                    notif.category === 'SHIPMENT' ? 'bg-amber-100 text-amber-800' :
                    notif.category === 'TRAFFIC' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {notif.category === 'BUS' ? 'directions_bus' :
                       notif.category === 'SHIPMENT' ? 'local_shipping' :
                       notif.category === 'TRAFFIC' ? 'traffic' : 'warning'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-[#1d1b20]">{notif.title}</h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#494551] mt-1 leading-relaxed">{notif.message}</p>
                    {notif.actionUrl && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4f378a] mt-2">
                        View Details <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
          Kopargaon Smart Mobility Realtime Broadcast
        </div>
      </div>
    </div>
  );
};
