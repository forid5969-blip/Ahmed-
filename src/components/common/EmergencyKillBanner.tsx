import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmergencyKillBanner: React.FC = () => {
  const { emergencyKillSwitch, setEmergencyKillSwitch, userRole, cmsContent } = useApp();

  return (
    <>
      {/* Super Admin Emergency Kill Switch Activated Alert */}
      {emergencyKillSwitch && (
        <div className="w-full bg-rose-600 text-white text-xs px-4 py-2 flex items-center justify-between shadow-lg z-50">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
            <span>
              <strong>EMERGENCY KILL SWITCH ENGAGED:</strong> All algorithmic bots and live broker order routing are halted platform-wide to protect trader capital.
            </span>
          </div>
          {userRole === 'superadmin' && (
            <button
              onClick={() => setEmergencyKillSwitch(false)}
              className="px-2.5 py-1 bg-white text-rose-700 font-semibold rounded text-[11px] hover:bg-neutral-100 transition-colors shrink-0"
            >
              Disengage Kill Switch
            </button>
          )}
        </div>
      )}

      {/* Global CMS Announcement Banner */}
      {!emergencyKillSwitch && cmsContent.announcementBanner.enabled && (
        <div className="w-full bg-neutral-900 border-b border-neutral-800 text-neutral-300 text-xs px-4 py-1.5 flex items-center justify-center text-center">
          <span className="font-mono text-emerald-400 font-semibold mr-2">[UPDATE]</span>
          <span>{cmsContent.announcementBanner.text}</span>
        </div>
      )}
    </>
  );
};
