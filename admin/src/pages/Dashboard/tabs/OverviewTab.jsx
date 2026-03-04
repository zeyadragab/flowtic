import { useState, useEffect } from 'react';
import { Eye, ShoppingCart, ShoppingBag, Users as UsersIcon, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../../services/api';
import { MONTHS } from '../constants';
import { Loader, Err } from '../ui';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function OverviewTab() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/analytics')
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader/>;
  if (!data)   return <Err msg="Telemetry disconnected"/>;

  const { stats, revenueByMonth, recentPurchases } = data;

  const chartData = revenueByMonth.map(m => ({
    name: MONTHS[m._id.month-1],
    revenue: m.revenue
  }));

  const kpis = [
    { icon: <Eye size={22}/>,             label: 'Total Events',      value: stats.totalEvents, rate: '0.43%', up: true, color: 'var(--primary)' },
    { icon: <ShoppingCart size={22}/>,    label: 'Total Revenue',     value: `${(stats.totalRevenue/1000).toFixed(1)}K`, rate: '4.35%', up: true, color: 'var(--primary)' },
    { icon: <ShoppingBag size={22}/>,     label: 'Total Orders',      value: stats.totalPurchases, rate: '2.59%', up: true, color: 'var(--primary)' },
    { icon: <UsersIcon size={22}/>,       label: 'Total Users',       value: stats.totalUsers, rate: '0.95%', up: false, color: 'var(--primary)' },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 2xl:gap-7.5">
        {kpis.map(k => (
          <div key={k.label} className="card-elevated p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--primary)] shrink-0">
              {k.icon}
            </div>
            
            <div className="flex flex-col items-center gap-1 mt-2">
              <h4 className="text-2xl font-bold text-[var(--text-bold)] leading-none mb-1">
                {k.value}
              </h4>
              <span className="text-sm font-semibold text-[var(--text-body)] uppercase tracking-wider">{k.label}</span>
              
              <span className={`flex items-center justify-center gap-1 text-sm font-bold mt-1 ${k.up ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                {k.rate}
                {k.up ? <ArrowUp size={16}/> : <ArrowDown size={16}/>}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 2xl:gap-7.5">
        {/* Momentum Chart */}
        <div className="lg:col-span-2">
          <div className="card-elevated p-6 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--text-bold)]">Revenue Overview</h3>
              <div className="flex gap-2">
                <span className="text-sm font-medium text-[var(--primary)] bg-[var(--bg-hover)] px-3 py-1 rounded">Monthly</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full flex items-center justify-center">
              {revenueByMonth.length === 0 ? (
                <p className="text-base font-bold text-[var(--text-body)] text-center">No telemetry available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-hairline)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-body)', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-body)', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-hairline)', color: 'var(--text-bold)', borderRadius: 8 }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Live Activity (Recent Purchases) */}
        <div>
          <div className="card-elevated p-6 min-h-[400px]">
             <h3 className="text-xl font-bold text-[var(--text-bold)] mb-6">Live Stream</h3>
             
             <div className="flex flex-col flex-1 justify-center gap-6 h-full min-h-[250px]">
               {recentPurchases.length === 0 ? (
                 <div className="flex-1 flex items-center justify-center">
                   <p className="text-base font-bold text-[var(--text-body)] text-center">Quiet for now</p>
                 </div>
               ) : (
                 recentPurchases.slice(0, 5).map((p) => (
                   <div key={p._id} className="flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-full bg-[var(--bg-hover)] flex items-center justify-center text-sm font-bold text-[var(--primary)] border border-[var(--border-hairline)] shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                       {p.user?.firstName?.[0] || '?'}{p.user?.lastName?.[0] || '?'}
                     </div>
                     <div className="flex-1 min-w-0">
                       <h5 className="font-semibold text-[var(--text-bold)] truncate">{p.user?.firstName} {p.user?.lastName}</h5>
                       <p className="text-xs text-[var(--text-body)] truncate mt-0.5">{p.event?.title}</p>
                     </div>
                     <div className="text-right shrink-0">
                       <span className="block text-sm font-bold text-[var(--success)]">+{p.totalPrice.toLocaleString()} EGP</span>
                       <span className="block text-xs font-medium text-[var(--text-body)] mt-0.5">Paid</span>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
