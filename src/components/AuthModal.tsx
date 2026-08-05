import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight, X, Sparkles, Building } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  reasonText?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  reasonText
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const newUser: User = {
      id: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      name: name || email.split('@')[0],
      companyName: companyName || 'Global Trade Compliance Corp',
      isAuthenticated: true,
      isGuest: false
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickDemoLogin = (demoType: 'trader' | 'customs_broker') => {
    const demoUser: User = {
      id: demoType === 'trader' ? 'usr_trader_demo' : 'usr_broker_demo',
      email: demoType === 'trader' ? 'trader@harmonie.trade' : 'broker@harmonie.trade',
      name: demoType === 'trader' ? 'Alex Rivera (Trader)' : 'Sarah Chen (Customs Broker)',
      companyName: demoType === 'trader' ? 'Rivera Global Goods' : 'Apex Clearance Services',
      isAuthenticated: true,
      isGuest: false
    };

    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0e2c19] text-[#e3f4eb] border border-[#206339] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-[#1a4a2b] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-[#0a2313] shadow-lg">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            HarMonie<span className="text-emerald-400">.</span>
          </h2>
          <p className="text-xs text-emerald-300 mt-1">
            {isRegister ? 'Create your trade compliance account' : 'Sign in to access unlimited AI Customs Tools'}
          </p>

          {reasonText && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{reasonText}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#153f25] border border-[#276e42] rounded-lg text-white placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Company Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Global Exports Pvt Ltd"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#153f25] border border-[#276e42] rounded-lg text-white placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-emerald-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@company.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#153f25] border border-[#276e42] rounded-lg text-white placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-200 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#153f25] border border-[#276e42] rounded-lg text-white placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-[#0a2313] font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{isRegister ? 'Register & Unlock Account' : 'Sign In to HarMonie'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#1a4e2c]">
          <p className="text-center text-xs text-emerald-400/80 mb-3 font-medium">Or Quick Demo Login with 1-Click:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('trader')}
              className="px-3 py-2 rounded-lg bg-[#184529] hover:bg-[#205935] text-xs font-semibold text-emerald-200 border border-[#276e42] transition-colors text-center"
            >
              Demo Trader
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customs_broker')}
              className="px-3 py-2 rounded-lg bg-[#184529] hover:bg-[#205935] text-xs font-semibold text-emerald-200 border border-[#276e42] transition-colors text-center"
            >
              Demo Broker
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-xs text-emerald-300 hover:text-white underline underline-offset-2"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
