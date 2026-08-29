import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, CitizenRole, OfficialRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserType?: 'CITIZEN' | 'OFFICIAL' | 'ANY';
  requiredCitizenRole?: CitizenRole;
  requiredOfficialRole?: OfficialRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedUserType = 'CITIZEN',
  requiredCitizenRole,
  requiredOfficialRole
}) => {
  const { user, isAuthenticated, isOfficial, authLoading } = useAuth();
  const location = useLocation();

  // Prevent flash during initial session recovery
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fdf7ff] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#4f378a]/20 border-t-[#4f378a] rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-[#494551] animate-pulse">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (allowedUserType === 'OFFICIAL') {
      return <Navigate to="/official/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/citizen/login" state={{ from: location }} replace />;
  }

  // Access control: Citizen attempting to access Official routes
  if (allowedUserType === 'OFFICIAL' && !isOfficial) {
    return (
      <div className="min-h-screen bg-[#fdf7ff] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-red-200">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">gpp_maybe</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Official Access Restricted</h2>
          <p className="text-xs text-gray-600 mb-6">
            Your authenticated account does not have municipal administrative privileges. Please use the Citizen Portal.
          </p>
          <a
            href="/citizen"
            className="inline-block bg-[#4f378a] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#3b276b] transition-all"
          >
            Return to Citizen Portal
          </a>
        </div>
      </div>
    );
  }

  // Access control: Official attempting to access Citizen-only routes
  if (allowedUserType === 'CITIZEN' && isOfficial) {
    return <Navigate to="/official" replace />;
  }

  // Official Role specific checks if needed
  if (isOfficial && requiredOfficialRole && requiredOfficialRole.length > 0) {
    if (user?.officialRole && !requiredOfficialRole.includes(user.officialRole)) {
      return (
        <div className="min-h-screen bg-[#fdf7ff] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-amber-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">lock</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Departmental Clearance Required</h2>
            <p className="text-xs text-gray-600 mb-6">
              This operational console requires specific departmental authorization ({requiredOfficialRole.join(', ')}).
            </p>
            <a
              href="/official"
              className="inline-block bg-[#765b00] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#5a4500] transition-all"
            >
              Back to Overview
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
