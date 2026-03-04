import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Ticket, Users, UtensilsCrossed, RefreshCw,
  ShoppingCart, BarChart2, LogOut, Shield, Settings, Mail
} from 'lucide-react';

const MENU_ITEMS = [
  { key: 'overview',  icon: <LayoutDashboard size={18}/>, label: 'Dashboard' },
  { key: 'analytics', icon: <BarChart2 size={18}/>,       label: 'Analytics' },
  { key: 'purchases', icon: <ShoppingCart size={18}/>,    label: 'eCommerce' }
];

const APP_ITEMS = [
  { key: 'events',    icon: <Ticket size={18}/>,          label: 'Events'         },
  { key: 'users',     icon: <Users size={18}/>,           label: 'Users'          },
  { key: 'food',      icon: <UtensilsCrossed size={18}/>, label: 'Menu'           },
  { key: 'resale',    icon: <RefreshCw size={18}/>,       label: 'Resale'         },
];

export default function Sidebar({ active, setActive }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  }

  return (
    <aside className="w-[280px] h-full shrink-0 flex flex-col sidebar-border z-30 transition-all duration-300" style={{ background: 'var(--bg-sidebar)' }}>
      {/* Brand - Sharp & Clean */}
      <div className="h-20 flex items-center px-6 mb-2 mt-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-sm bg-blue-600 flex items-center justify-center">
              <Shield size={20} className="text-white" />
           </div>
           <span className="font-bold text-2xl text-white">Flowtic</span>
        </div>
      </div>

      {/* Navigation - Fixed width buttons */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar mt-4">
        
        <div>
          <h3 className="mb-4 ml-4 text-sm font-semibold !text-[#8A99AF]">MENU</h3>
          <ul className="mb-6 flex flex-col gap-1.5">
            {MENU_ITEMS.map(({ key, icon, label }) => {
              const isActive = active === key;
              return (
                <li key={key}>
                  <button
                    onClick={() => setActive(key)}
                    className={`nav-link w-full flex items-center gap-2.5 px-4 py-2.5 rounded-sm font-medium transition-all
                      ${isActive 
                        ? 'nav-link-active' 
                        : '!text-[#8A99AF] hover:!text-white hover:bg-[#333A48]'}`}
                  >
                    <span className="shrink-0">{icon}</span>
                    <span className="flex-1 text-left truncate-pro">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div>
          <h3 className="mb-4 ml-4 text-sm font-semibold !text-[#8A99AF]">APPLICATIONS</h3>
          <ul className="mb-6 flex flex-col gap-1.5">
            {APP_ITEMS.map(({ key, icon, label }) => {
              const isActive = active === key;
              return (
                <li key={key}>
                  <button
                    onClick={() => setActive(key)}
                    className={`nav-link w-full flex items-center gap-2.5 px-4 py-2.5 rounded-sm font-medium transition-all
                      ${isActive 
                        ? 'nav-link-active' 
                        : '!text-[#8A99AF] hover:!text-white hover:bg-[#333A48]'}`}
                  >
                    <span className="shrink-0">{icon}</span>
                    <span className="flex-1 text-left truncate-pro">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        
      </nav>

      {/* Footer Settings */}
      <div className="p-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-sm font-medium !text-[#8A99AF] hover:!text-rose-500 hover:bg-[#333A48] transition-all"
        >
          <LogOut size={18} />
          <span className="truncate-pro">Logout User</span>
        </button>
      </div>
    </aside>
  );
}
