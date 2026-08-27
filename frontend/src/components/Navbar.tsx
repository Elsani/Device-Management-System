import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Laptop, LogOut, Shield, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                DeviceHub
              </span>
              <span className="text-xs text-slate-400">IT Asset Management System</span>
            </div>
          </div>

          {/* User Profile & Actions */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2.5 bg-slate-800/80 border border-slate-700/60 px-3.5 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-semibold text-xs border border-blue-500/30">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-slate-200 block">{user.fullName}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    {isAdmin ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <Shield className="w-2.5 h-2.5" /> Admin
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-0.5">
                        <UserIcon className="w-2.5 h-2.5" /> Employee
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-slate-700"
                title="Dil nga sistemi"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Dil</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};
