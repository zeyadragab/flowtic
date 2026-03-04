import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { MONTHS } from '../constants';
import { Loader, Err, Badge } from '../ui';
import { TrendingUp, ShoppingBag, Users as UsersIcon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--success)', 'var(--warning)', '#bd93f9', '#ffb86c'];

export default function AnalyticsTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/analytics')
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader/>;
  if (!data)   return <Err msg="Analytics engine offline"/>;

  const { stats, revenueByMonth, salesByCategory } = data;

  const barData = revenueByMonth.map(m => ({
    name: MONTHS[m._id.month-1],
    revenue: m.revenue
  }));

  const pieData = salesByCategory.map(c => ({
    name: c._id || 'Other',
    value: c.revenue
  }));

  return (
    <div className="flex flex-col gap-4 md:gap-6 2xl:gap-7.5">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 2xl:gap-7.5">
        {[
          { label: 'Total Volume', value: `${(stats.totalRevenue/1000).toFixed(1)}K EGP`, icon: <TrendingUp size={24}/> },
          { label: 'Total Sales', value: stats.totalPurchases, icon: <ShoppingBag size={24}/> },
          { label: 'Growth rate', value: '+12.5%', icon: <UsersIcon size={24}/> },
        ].map((k, idx) => (
          <div key={k.label} className="card-elevated p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--primary)] shrink-0">
              {k.icon}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-[var(--text-bold)] leading-none mb-2">{k.value}</h4>
              <span className="text-sm font-semibold text-[var(--text-body)] uppercase tracking-wider">{k.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5">
        {/* Advanced Revenue Chart */}
        <div className="card-elevated p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--text-bold)]">Yield Curve</h3>
            <Badge label="12 Months" color="var(--primary)" />
          </div>
          
          <div className="flex-1 w-full h-[300px] flex items-center justify-center">
            {barData.length === 0 ? (
               <p className="text-base font-bold text-[var(--text-body)] text-center">No telemetry available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-hairline)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-body)', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-body)', fontSize: 12}} />
                  <RechartsTooltip 
                    cursor={{fill: 'var(--bg-hover)'}}
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-hairline)', color: 'var(--text-bold)', borderRadius: 8 }}
                    itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="card-elevated p-6 flex flex-col min-h-[400px]">
          <h3 className="text-xl font-bold text-[var(--text-bold)] mb-6">Category Distribution</h3>
          
          <div className="flex-1 w-full h-[300px] flex items-center justify-center">
            {pieData.length === 0 ? (
               <p className="text-base font-bold text-[var(--text-body)] text-center">No categories found</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-hairline)', borderRadius: 8 }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="var(--bg-card)"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
