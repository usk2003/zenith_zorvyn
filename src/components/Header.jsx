import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Search, UserCircle, Wallet, LayoutDashboard, Receipt, BarChart3, User, X, Zap, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

const Header = () => {
  const { isDarkMode, toggleDarkMode, role, setRole, userProfile, security, logout } = useStore();
  const [isRecovering, setIsRecovering] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { label: 'Transactions', icon: <Receipt size={18} />, path: '/transactions' },
    { label: 'Intelligence', icon: <Zap size={18} />, path: '/intelligence' },
    { label: 'Insights', icon: <BarChart3 size={18} />, path: '/insights' },
  ];

  const initials = (userProfile?.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const avatarColor = userProfile?.avatarColor || '#8b5cf6';

  return (
    <div className="fixed top-0 left-0 w-full z-[100] bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 transition-all duration-500 shadow-sm">
       {/* Bottom Edge Fade */}
       <div className="absolute -bottom-10 left-0 w-full h-10 bg-gradient-to-b from-white/90 dark:from-black/90 to-transparent pointer-events-none" />
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full h-14 px-4 md:px-8">
        <div className="flex items-center gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 overflow-hidden rounded-xl">
               <img src="/logo.png" alt="Zenith Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">ZENITH</span>
          </div>

          <div className="hidden md:flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>FINANCE</span>
            <span className="mx-2 text-gray-300 dark:text-gray-700">/</span>
            <span className="text-gray-900 dark:text-white capitalize">
              {location.pathname.replace('/', '') || 'Dashboard'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Quick search..."
              className="pl-10 pr-4 py-2 text-xs bg-gray-100 dark:bg-gray-900/50 border-none rounded-full focus:ring-2 focus:ring-accent/20 dark:text-white transition-all outline-none"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="btn-secondary p-2.5"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-accent" />}
          </button>

          {/* Secure Executive Switcher */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 relative overflow-hidden">
            {role === 'viewer' ? (
              <button 
                onClick={() => setRole('admin_verify')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-accent transition-all group"
              >
                <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full group-hover:bg-accent animate-pulse" />
                Viewer Mode
              </button>
            ) : (
              <button 
                onClick={() => setRole('viewer')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-accent text-white shadow-lg shadow-accent/20 transition-all"
              >
                <UserCircle size={14} className="animate-in zoom-in" />
                Administrative
              </button>
            )}

            {/* In-Header Verification Overlay */}
            {role === 'admin_verify' && (
              <div className="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center animate-in slide-in-from-right-full duration-300">
                {!isRecovering ? (
                  <div className="flex items-center gap-2 px-3">
                    <span className="text-[8px] font-black uppercase text-accent tracking-tighter">Enter PIN:</span>
                    <input
                      autoFocus
                      type="password"
                      maxLength={4}
                      placeholder="****"
                      className="w-12 bg-transparent text-xs font-black tracking-[0.3em] outline-none text-accent placeholder-accent/20"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === security.pin) {
                          setRole('admin');
                        } else if (val.length === 4) {
                          e.target.value = '';
                          e.target.classList.add('shake');
                          setTimeout(() => e.target.classList.remove('shake'), 400);
                        }
                      }}
                    />
                    <button onClick={() => setIsRecovering(true)} className="text-[8px] font-black uppercase text-gray-400 hover:text-accent transition-colors underline">Forgot?</button>
                    <button onClick={() => setRole('viewer')} className="p-1 hover:text-red-500"><X size={12} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3 w-full">
                    <div className="flex-1 min-w-0">
                      <p className="text-[7px] font-black uppercase text-gray-400 truncate">{security.question || 'No security question set.'}</p>
                      <input
                        autoFocus
                        type="password"
                        placeholder="Answer..."
                        className="w-full bg-transparent text-[10px] font-black outline-none text-accent"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (e.target.value === security.answer) {
                              setRole('admin');
                              setIsRecovering(false);
                            } else {
                              e.target.value = '';
                              e.target.classList.add('shake');
                              setTimeout(() => e.target.classList.remove('shake'), 400);
                            }
                          }
                        }}
                      />
                    </div>
                    <button onClick={() => setIsRecovering(false)} className="p-1 hover:text-red-500"><X size={12} /></button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Avatar → navigates to Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-accent/40"
            style={{ backgroundColor: avatarColor }}
            aria-label="Go to profile"
            title={userProfile?.name || 'My Profile'}
          >
            {userProfile?.name ? initials : <User size={18} />}
          </button>
          <button
            onClick={() => {
              if (window.confirm("CRITICAL: This will terminate the executive session. Proceed?")) {
                logout();
                navigate('/');
              }
            }}
            className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-sm"
            aria-label="Logout"
            title="Terminate Session"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Header;
