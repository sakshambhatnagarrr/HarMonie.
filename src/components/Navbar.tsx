import React from 'react';
import { User } from '../types';
import { 
  Sparkles, 
  Search, 
  Truck, 
  FileText, 
  UserCheck, 
  LogIn, 
  LogOut, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'classifier' | 'carrier-tracking' | 'reports-history';
  setActiveTab: (tab: 'classifier' | 'carrier-tracking' | 'reports-history') => void;
  user: User;
  freeTriesRemaining: number;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  freeTriesRemaining,
  onOpenAuth,
  onSignOut,
}) => {
  const handleTabClick = (e: React.MouseEvent, tab: 'classifier' | 'carrier-tracking' | 'reports-history') => {
    e.preventDefault();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d2a17] text-[#e3f4eb] border-b border-[#1b4d2c] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={(e) => handleTabClick(e, 'classifier')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1f6d3d] to-[#38a169] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-emerald-100" />
              </div>
              <div className="text-left">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  HarMonie<span className="text-emerald-400">.</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
                  AI Customs & Compliance Engine
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={(e) => handleTabClick(e, 'classifier')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'classifier'
                  ? 'bg-[#1b4d2c] text-white shadow-sm ring-1 ring-emerald-500/30'
                  : 'text-emerald-200 hover:text-white hover:bg-[#133a21]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Classifier</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleTabClick(e, 'carrier-tracking')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'carrier-tracking'
                  ? 'bg-[#1b4d2c] text-white shadow-sm ring-1 ring-emerald-500/30'
                  : 'text-emerald-200 hover:text-white hover:bg-[#133a21]'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Carrier Tracking</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleTabClick(e, 'reports-history')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'reports-history'
                  ? 'bg-[#1b4d2c] text-white shadow-sm ring-1 ring-emerald-500/30'
                  : 'text-emerald-200 hover:text-white hover:bg-[#133a21]'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Saved Reports</span>
              <span className="md:hidden">Reports</span>
            </button>
          </nav>

          {/* User & Free Try Status */}
          <div className="flex items-center gap-2">
            {!user.isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1.5 bg-[#174326] px-2.5 py-1 rounded-full border border-emerald-700/50 text-xs text-emerald-200">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {freeTriesRemaining > 0 ? (
                      <strong className="text-white">1 Free Try Remaining</strong>
                    ) : (
                      <span className="text-amber-300 font-semibold">Free Try Used — Login Required</span>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0a2313] font-semibold text-xs sm:text-sm shadow transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-[#174326] px-3 py-1 rounded-lg border border-emerald-700/50 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-100 font-medium">{user.name || user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-[#184226] hover:bg-red-950/80 hover:text-red-300 text-emerald-200 border border-emerald-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
