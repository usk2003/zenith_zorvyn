import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Zap, BarChart3 } from 'lucide-react';
import useStore from '../store/useStore';

const FloatingNav = () => {
  const { isDarkMode } = useStore();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'Transactions', icon: <Receipt size={20} />, path: '/transactions' },
    { label: 'Intelligence', icon: <Zap size={20} />, path: '/intelligence' },
    { label: 'Insights', icon: <BarChart3 size={20} />, path: '/insights' },
  ];

  // Find active index for sliding logic (approximate layout)
  const activeIndex = useMemo(() => {
    const idx = navItems.findIndex(item => location.pathname.startsWith(item.path) || (item.path === '/dashboard' && location.pathname === '/'));
    return idx === -1 ? 0 : idx;
  }, [location.pathname]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-12 duration-1000 ease-out">
      <nav className={`
        relative flex items-center p-1.5 rounded-[2.5rem] border shadow-[0_25px_60px_rgba(0,0,0,0.2)] backdrop-blur-3xl transition-all duration-700
        ${isDarkMode 
          ? 'bg-black/40 border-white/10 text-white' 
          : 'bg-white/60 border-gray-200 text-gray-900'}
      `}>
        
        {/* Sliding Active Pill (Simulated) */}
        {/* Since widths are dynamic based on labels, we use a simpler standard approach for each item */}
        
        {navItems.map((item, idx) => {
          const isActive = location.pathname.startsWith(item.path) || (item.path === '/dashboard' && location.pathname === '/');
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                relative flex items-center gap-3 px-6 py-3.5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden group
                ${isActive 
                  ? 'bg-accent text-white shadow-xl shadow-accent/30 scale-105 active-pill' 
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/5'}
              `}
              style={{
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div className={`transition-transform duration-700 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}
                   style={{ transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                {item.icon}
              </div>
              <span className={`
                transition-all duration-700 whitespace-nowrap overflow-hidden
                ${isActive ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 hidden sm:inline'}
              `}
              style={{
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                 {item.label}
              </span>
              
              {/* Shine Internal Animation */}
              {isActive && (
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-40 animate-pulse pointer-events-none" />
              )}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Dynamic Glow Base */}
      <div className={`
        absolute -inset-10 bg-accent/20 blur-[80px] -z-10 opacity-30 transition-all duration-1000 pointer-events-none
        ${isDarkMode ? 'opacity-40' : 'opacity-20'}
      `} />
    </div>
  );
};

export default FloatingNav;
