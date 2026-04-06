import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Search, UserCircle, Wallet, LayoutDashboard, Receipt, BarChart3, User, X, Zap, LogOut, Map } from 'lucide-react';
import useStore from '../store/useStore';

const Header = () => {
  const { isDarkMode, toggleDarkMode, role, setRole, userProfile, security, logout } = useStore();
  const [isRecovering, setIsRecovering] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { label: 'Transactions', icon: <Receipt size={18} />, path: '/transactions' },
    { label: 'Intelligence', icon: <Zap size={18} />, path: '/intelligence' },
    { label: 'Insights', icon: <BarChart3 size={18} />, path: '/insights' },
    { label: 'Roadmap', icon: <Map size={18} />, path: '/roadmap' },
  ];

  const initials = (userProfile?.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const avatarColor = userProfile?.avatarColor || '#8b5cf6';

  return (
    <div className="fixed top-0 left-0 w-full z-[100] bg-white/70 dark:bg-black/70 backdrop-blur-3xl border-b border-emerald-500/10 dark:border-emerald-500/20 transition-all duration-500">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full h-16 px-4 md:px-10">
        {/* Left Cluster: Logo & Navigation */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 overflow-hidden rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-accent/10">
               <img src="/logo.png" alt="Zenith Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">ZENITH</span>
              
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path) || (item.path === '/dashboard' && location.pathname === '/');
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 group/nav
                    ${isActive 
                      ? 'text-accent' 
                      : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}
                  `}
                >
                  <span className={`transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-40 group-hover/nav:opacity-100 group-hover/nav:scale-110'}`}>{item.icon}</span>
                  {item.label}
                  {/* Premium Underside Glow */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full animate-in fade-in slide-in-from-bottom-1 duration-500 shadow-[0_4px_12px_rgba(16,185,129,0.8)]" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right Cluster: Consolidated Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Utility Group: Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-accent/20 rounded-2xl transition-all duration-500 hover:scale-110 active:scale-95 group/theme"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-500 group-hover/theme:rotate-90 transition-transform duration-500" /> : <Moon size={18} className="text-accent group-hover/theme:rotate-12 transition-transform duration-500" />}
          </button>

          <div className="h-6 w-[1px] bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block" />

          {/* Account Group: Secure Switcher & Profile */}
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-1.5 rounded-[1.5rem] border border-emerald-500/10 dark:border-emerald-500/20 text-gray-900 dark:text-white">
            {/* Executive Badge Switcher */}
            <div className="hidden sm:block relative overflow-visible h-9 min-w-[140px] z-[120]">
              {role === 'admin_verify' ? (
                <div className="absolute top-0 right-0 h-9 flex items-center px-3 bg-white dark:bg-black rounded-2xl border border-accent/40 animate-in zoom-in duration-300 shadow-xl shadow-accent/10 whitespace-nowrap overflow-hidden">
                  <span className="text-[8px] font-black uppercase text-accent tracking-tighter mr-1.5">PIN:</span>
                  <input
                    autoFocus
                    type="password"
                    maxLength={4}
                    placeholder="****"
                    className="w-10 bg-transparent text-[10px] font-black tracking-[0.3em] outline-none text-accent placeholder-accent/20"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === (security?.pin || '1357')) {
                        setRole('admin');
                      } else if (val.length === 4) {
                        e.target.value = '';
                        e.target.classList.add('shake');
                        setTimeout(() => e.target.classList.remove('shake'), 400);
                      }
                    }}
                  />
                  <div className="text-[6px] font-black uppercase text-gray-400 leading-[1.2] border-l border-gray-200 dark:border-white/10 pl-2 ml-1 w-max hidden md:block">
                    Prototype PIN: <span className="text-accent text-[7px]">1357</span><br/>
                    <span className="opacity-60 text-[5px] tracking-[0.2em]">Change in Profile &rarr; Security</span>
                  </div>
                  <button onClick={() => setRole('viewer')} className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"><X size={10} /></button>
                </div>
              ) : (
                <div className="relative h-full"
                     onMouseEnter={() => setDropdownOpen(true)}
                     onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="w-full h-full flex items-center justify-between gap-3 px-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent hover:border-emerald-500/20 transition-all font-black uppercase text-[9px] tracking-widest outline-none">
                    {role === 'admin' ? (
                      <span className="text-accent font-serif italic tracking-[0.2em] capitalize text-[11px] leading-none mt-0.5">Executive</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Viewer Mode</span>
                    )}
                    <span className="text-gray-400 opacity-50 text-[7px] pointer-events-none">▼</span>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute top-full pt-1.5 w-full origin-top z-50">
                      <div className="rounded-2xl bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 shadow-2xl p-1.5 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-300">
                        <button 
                          onClick={() => { setRole('viewer'); setDropdownOpen(false); }}
                          className={`px-3 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl text-left transition-colors ${role === 'viewer' ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                          Viewer Mode
                        </button>
                        <button 
                          onClick={() => { if(role !== 'admin') setRole('admin_verify'); setDropdownOpen(false); }}
                          className={`px-3 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl text-left transition-colors ${role === 'admin' ? 'bg-accent/10 text-accent font-serif italic tracking-[0.2em] capitalize text-[11px]' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-accent font-serif italic tracking-[0.2em] capitalize text-[11px]'}`}
                        >
                          Executive
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-[11px] font-black shadow-lg hover:scale-105 active:scale-95 transition-all duration-500 relative group/avatar"
              style={{ backgroundColor: avatarColor }}
              aria-label="Go to profile"
            >
              {userProfile?.name ? initials : <User size={16} />}
              <div className="absolute inset-x-1 bottom-1 h-0.5 bg-white/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
            </button>
            
            {/* Logical Logout Grouping */}
            <button
              onClick={() => {
                if (window.confirm("Terminate secure executive session?")) {
                  logout();
                  navigate('/');
                }
              }}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all duration-500 active:scale-90"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
      </div>
    </div>
  </div>
    </div>
  );
};

export default Header;
