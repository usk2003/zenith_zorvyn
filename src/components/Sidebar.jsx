import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, Settings, LogOut, Wallet } from 'lucide-react';

const Sidebar = ({ isOpen, setOpen }) => {
  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'Transactions', icon: <Receipt size={20} />, path: '/transactions' },
    { label: 'Insights', icon: <BarChart3 size={20} />, path: '/insights' },
  ];

  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800`}>
      <div className="flex flex-col h-full px-4 py-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2 bg-accent/20 rounded-xl">
            <Wallet className="text-accent" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Zenith</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)} // Close on mobile navigation
              className={({ isActive }) => `
                flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <button className="flex items-center w-full p-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/10 dark:hover:text-red-400 transition-colors">
            <LogOut className="mr-3" size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
