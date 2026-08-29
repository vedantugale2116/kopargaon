import React from 'react';

export type VerificationStatus = 'VERIFIED' | 'UNDER_REVIEW' | 'UNVERIFIED' | 'REJECTED' | 'OUTDATED';

interface VerificationBadgeProps {
  status: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  duplicateCount?: number;
  size?: 'xs' | 'sm' | 'md';
  showDetails?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  verifiedBy,
  verifiedAt,
  duplicateCount = 1,
  size = 'sm',
  showDetails = false,
  className = ''
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
          icon: 'verified',
          label: 'Officially Verified',
          desc: verifiedBy ? `Confirmed by ${verifiedBy}` : 'Validated by Municipal Operations'
        };
      case 'UNDER_REVIEW':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-500',
          icon: 'hourglass_top',
          label: 'Citizen Report • Under Review',
          desc: 'Awaiting verification from municipal staff'
        };
      case 'UNVERIFIED':
        return {
          bg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          dot: 'bg-yellow-500',
          icon: 'warning',
          label: 'Unverified Report',
          desc: 'Crowdsourced submission without secondary confirmation'
        };
      case 'REJECTED':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
          icon: 'cancel',
          label: 'Rejected / Disproved',
          desc: 'Inspected and dismissed by official dispatch'
        };
      case 'OUTDATED':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
          icon: 'history',
          label: 'Outdated Information',
          desc: 'Past incident now cleared or no longer active'
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          dot: 'bg-gray-400',
          icon: 'help',
          label: 'Citizen Report',
          desc: 'Community submitted'
        };
    }
  };

  const config = getBadgeConfig();

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[9px] gap-1',
    sm: 'px-2.5 py-1 text-[11px] gap-1.5',
    md: 'px-3 py-1.5 text-xs gap-2'
  }[size];

  const iconSizes = {
    xs: 'text-[12px]',
    sm: 'text-[14px]',
    md: 'text-[16px]'
  }[size];

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div
        className={`inline-flex items-center font-bold rounded-full border shadow-2xs ${config.bg} ${sizeClasses} shrink-0`}
        title={`${config.label} - ${config.desc}`}
      >
        <span className={`material-symbols-outlined ${iconSizes} shrink-0`}>
          {config.icon}
        </span>
        <span className="truncate">{config.label}</span>

        {duplicateCount > 1 && (
          <span className="ml-1 px-1.5 py-0.2 bg-white/80 rounded-full text-[9px] font-black tracking-tight text-gray-800 border border-gray-300/60 shrink-0">
            {duplicateCount} reports
          </span>
        )}
      </div>

      {showDetails && (verifiedBy || verifiedAt) && (
        <div className="text-[10px] text-gray-500 mt-1 pl-1 flex items-center gap-1.5">
          {verifiedBy && <span>Verified by <strong>{verifiedBy}</strong></span>}
          {verifiedAt && <span>• {verifiedAt}</span>}
        </div>
      )}
    </div>
  );
};
