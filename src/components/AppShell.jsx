import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header'; 
import FloatingNav from './FloatingNav';
import Footer from './Footer';
import { Plus } from 'lucide-react';
import CommandPalette from './CommandPalette';
import useStore from '../store/useStore';

const AppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, userProfile } = useStore();
  
  useEffect(() => {
    // Strategic Redirect: Only redirect if not authenticated AND path is not a public node
    const publicNodes = ['/onboarding', '/terms', '/privacy', '/login', '/'];
    if (!userProfile.name && !publicNodes.includes(location.pathname)) {
      navigate('/onboarding');
    }
  }, [userProfile.name, location.pathname, navigate]);

  useEffect(() => {
    const handleGlobalShortcuts = (e) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

      const key = e.key.toLowerCase();
      if (key === 'd') navigate('/dashboard');
      if (key === 't') navigate('/transactions');
      if (key === 'i') navigate('/intelligence');
      if (key === 'a' && role === 'admin') navigate('/transactions/new');
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [navigate, role]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-emerald-500/20 transition-colors">
      <CommandPalette />
      
      {/* Main Content Area - Full Width */}
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-20 overflow-x-hidden pb-32">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

        <FloatingNav />
        
        {/* Floating Action Node */}
        <button 
          onClick={() => navigate('/transactions/new')}
          className="fixed bottom-10 right-10 z-[110] w-16 h-16 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-95 transition-all group animate-in zoom-in duration-700 delay-500"
          title="New Transaction (A)"
          aria-label="New Transaction"
        >
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
          <div className="absolute -inset-4 bg-emerald-500/20 blur-[40px] -z-10 opacity-30 animate-pulse pointer-events-none" />
        </button>

        <Footer />
      </div>
    </div>
  );
};

export default AppShell;
