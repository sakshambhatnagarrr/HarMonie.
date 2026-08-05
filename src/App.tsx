import React, { useState, useEffect } from 'react';
import { User, ClassificationResult } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ClassifierView } from './components/ClassifierView';
import { CarrierTrackingView } from './components/CarrierTrackingView';
import { ReportsDashboardView } from './components/ReportsDashboardView';
import { DeclarationModal } from './components/DeclarationModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classifier' | 'carrier-tracking' | 'reports-history'>('classifier');
  
  // User Session State
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('harmonie_user_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    return {
      id: guestId,
      email: '',
      name: 'Guest User',
      isAuthenticated: false,
      isGuest: true
    };
  });

  // Free Try Counter for Guest Users (1 Free Search / Try)
  const [freeTriesRemaining, setFreeTriesRemaining] = useState<number>(() => {
    if (user.isAuthenticated) return 999;
    const used = localStorage.getItem('harmonie_guest_free_try_used');
    return used === 'true' ? 0 : 1;
  });

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);

  // Customs Declaration Modal State
  const [declarationModalOpen, setDeclarationModalOpen] = useState(false);
  const [selectedClassificationForDeclaration, setSelectedClassificationForDeclaration] = useState<ClassificationResult | null>(null);

  useEffect(() => {
    if (user.isAuthenticated) {
      localStorage.setItem('harmonie_user_session', JSON.stringify(user));
      setFreeTriesRemaining(999);
    }
  }, [user]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAuthModalOpen(false);
    setFreeTriesRemaining(999);
  };

  const handleSignOut = () => {
    localStorage.removeItem('harmonie_user_session');
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    setUser({
      id: guestId,
      email: '',
      name: 'Guest User',
      isAuthenticated: false,
      isGuest: true
    });
    const used = localStorage.getItem('harmonie_guest_free_try_used');
    setFreeTriesRemaining(used === 'true' ? 0 : 1);
  };

  const consumeFreeTry = (): boolean => {
    if (user.isAuthenticated) return true;
    if (freeTriesRemaining > 0) {
      setFreeTriesRemaining(0);
      localStorage.setItem('harmonie_guest_free_try_used', 'true');
      return true;
    }
    return false;
  };

  const handleRequireAuth = (reason: string) => {
    setAuthReason(reason);
    setAuthModalOpen(true);
  };

  const handleClassificationComplete = (result: ClassificationResult) => {
    // Optionally automatically prompt declaration view
  };

  const handleOpenDeclarationModal = (cls: ClassificationResult) => {
    if (!user.isAuthenticated && freeTriesRemaining <= 0) {
      handleRequireAuth('Please sign in or register to view and generate official Customs Declaration Certificates.');
      return;
    }
    setSelectedClassificationForDeclaration(cls);
    setDeclarationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#97d6c1] text-[#104927] flex flex-col font-sans selection:bg-emerald-400 selection:text-[#061d0f]">
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        freeTriesRemaining={freeTriesRemaining}
        onOpenAuth={() => { setAuthReason(undefined); setAuthModalOpen(true); }}
        onSignOut={handleSignOut}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        {activeTab === 'classifier' && (
          <ClassifierView
            user={user}
            freeTriesRemaining={freeTriesRemaining}
            consumeFreeTry={consumeFreeTry}
            onRequireAuth={handleRequireAuth}
            onClassificationComplete={handleClassificationComplete}
            onGenerateDeclaration={handleOpenDeclarationModal}
          />
        )}

        {activeTab === 'carrier-tracking' && (
          <CarrierTrackingView
            user={user}
            onRequireAuth={handleRequireAuth}
            freeTriesRemaining={freeTriesRemaining}
          />
        )}

        {activeTab === 'reports-history' && (
          <ReportsDashboardView
            user={user}
            onRequireAuth={handleRequireAuth}
            onSelectClassificationForDeclaration={handleOpenDeclarationModal}
            freeTriesRemaining={freeTriesRemaining}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        reasonText={authReason}
      />

      {/* Official Customs Declaration Modal */}
      <DeclarationModal
        isOpen={declarationModalOpen}
        onClose={() => setDeclarationModalOpen(false)}
        classification={selectedClassificationForDeclaration}
        user={user}
      />

      {/* Footer */}
      <footer className="bg-[#0b2213] border-t border-[#1a4f2c] text-emerald-300 py-6 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-extrabold tracking-tight text-white font-sans text-sm">
            HarMonie<span className="text-emerald-400">.</span>
          </span>
          <p className="text-emerald-400/80">
            © 2026 HarMonie AI Customs & Trade Engine. World Customs Organization (WCO) & CBIC Tariff Compliant.
          </p>
          <div className="flex items-center gap-3 text-emerald-300 font-semibold">
            <span>ICEGATE EDI Connected</span>
            <span>•</span>
            <span>US HTSUS / EU TARIC 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
