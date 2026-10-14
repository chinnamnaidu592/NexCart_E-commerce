import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu, LogOut, Shield } from 'lucide-react';

export default function AdminTopbar({
  onOpenMobileSidebar,
  onLogout,
  title = 'Store Administration',
}) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E7E5E4] px-6 sm:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
            aria-label="Open administration sidebar"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
          <div>
            <h1 className="font-sans text-xl sm:text-2xl font-normal text-[#1C1917] tracking-tight">
              {title}
            </h1>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#78716C] hidden sm:block">
              NexCart Atelier · Operations & Governance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-[#E7E5E4]">
            <div className="w-8 h-8 rounded-sm bg-[#F5F5F4] border border-[#E7E5E4] text-[#1C1917] flex items-center justify-center font-bold text-xs">
              <Shield className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-[#1C1917] leading-none">
                {user?.firstName || 'Admin'} {user?.lastName || ''}
              </p>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C]">
                Atelier Custodian
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-[#78716C] hover:text-[#991B1B] hover:bg-[#FEF2F2] rounded-sm transition-colors cursor-pointer"
            aria-label="Log out from admin"
          >
            <LogOut className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </header>
  );
}
