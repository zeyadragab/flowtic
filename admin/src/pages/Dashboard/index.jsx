import { useState, useEffect } from 'react';
import { C } from './constants';
import { Toast } from './ui';
import Sidebar       from './Sidebar';
import OverviewTab   from './tabs/OverviewTab';
import EventsTab     from './tabs/EventsTab';
import UsersTab      from './tabs/UsersTab';
import FoodTab       from './tabs/FoodTab';
import ResaleTab     from './tabs/ResaleTab';
import PurchasesTab  from './tabs/PurchasesTab';
import AnalyticsTab  from './tabs/AnalyticsTab';
import { Search, Moon, Sun, Bell, MessageSquare, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const [active, setActive] = useState('overview');
  const [toast,  setToast]  = useState(null);
  const [isDark, setIsDark] = useState(false);

  const user     = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const tabProps = { toast: (msg, type = 'success') => setToast({ msg, type }) };

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 transition-colors duration-300" style={{ background: 'var(--bg-main)' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      <Sidebar active={active} setActive={setActive}/>

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-colors duration-300">
        {/* Top Header */}
        <header className="h-[80px] shrink-0 flex items-center justify-between px-8 header-border z-20 transition-colors duration-300" style={{ background: 'var(--bg-header)' }}>
          
          <div className="flex items-center gap-4 flex-1">
            <div className="relative hidden sm:block w-full max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-body)]">
                <Search size={20} />
              </span>
              <input 
                type="text" 
                placeholder="Type to search..." 
                className="w-full bg-transparent pl-12 pr-4 py-2 outline-none text-sm placeholder-[var(--text-body)] text-[var(--text-bold)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 sm:gap-7">
            {/* Quick Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[var(--border-hairline)] bg-[var(--bg-hover)] text-[var(--text-body)] hover:text-[var(--primary)] transition-all"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[var(--border-hairline)] bg-[var(--bg-hover)] text-[var(--text-body)] hover:text-[var(--primary)] transition-all">
                <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-[var(--danger)]">
                  <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-[var(--danger)] opacity-75"></span>
                </span>
                <Bell size={20} />
              </button>

              <button className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[var(--border-hairline)] bg-[var(--bg-hover)] text-[var(--text-body)] hover:text-[var(--primary)] transition-all">
                <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-[var(--primary)]">
                  <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75"></span>
                </span>
                <MessageSquare size={20} />
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="text-right hidden sm:block">
                <span className="block text-sm font-medium text-[var(--text-bold)]">{user.firstName} {user.lastName}</span>
                <span className="block text-xs font-medium text-[var(--text-body)]">Admin Designer</span>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-[var(--primary)] bg-[var(--bg-hover)] shadow-sm border border-[var(--border-hairline)]">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <ChevronDown size={18} className="text-[var(--text-body)] hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Workspace - Dedicated scrolling area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto p-4 md:p-6 2xl:p-10 reveal-snappy">
            {active === 'overview'  && <OverviewTab  {...tabProps}/>}
            {active === 'events'    && <EventsTab    {...tabProps}/>}
            {active === 'users'     && <UsersTab     {...tabProps}/>}
            {active === 'food'      && <FoodTab      {...tabProps}/>}
            {active === 'resale'    && <ResaleTab    {...tabProps}/>}
            {active === 'purchases' && <PurchasesTab {...tabProps}/>}
            {active === 'analytics' && <AnalyticsTab {...tabProps}/>}
          </div>
        </div>
      </main>
    </div>
  );
}
