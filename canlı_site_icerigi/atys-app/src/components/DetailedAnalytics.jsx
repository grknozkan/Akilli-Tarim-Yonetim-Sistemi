import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Droplets, Leaf, Target } from 'lucide-react';
import { cn } from '../lib/utils';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];

const DetailedAnalytics = ({ data }) => {
  // Safe access to analytics data
  const analyticsData = data?.analytics || { weeklyGrowth: [], cropDistribution: [] };

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-12">
      <div className="px-2 md:px-0">
        <h2 className="text-2xl md:text-4xl font-black tracking-tighter">Veri Analitiği</h2>
        <p className="text-xs md:text-sm font-medium opacity-50">Çiftliğinizin performansını derinlemesine inceleyin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Growth Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card h-[300px] md:h-[400px]"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={20} />
              Haftalık Büyüme ve Su Tüketimi
            </h3>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={analyticsData.weeklyGrowth}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'gray', fontSize: 12, fontWeight: 600}} 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card-bg)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '16px',
                  color: 'var(--text-main)'
                }}
                itemStyle={{ color: 'var(--text-main)' }}
              />
              <Area type="monotone" dataKey="growth" stroke="#10B981" fillOpacity={1} fill="url(#colorGrowth)" strokeWidth={3} />
              <Area type="monotone" dataKey="water" stroke="#3B82F6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Crop Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 glass-card h-[300px] md:h-[400px]"
        >
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Leaf className="text-emerald-500" size={20} />
            Ürün Dağılımı
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={analyticsData.cropDistribution}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {analyticsData.cropDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Hedef Verimlilik', value: '%98', icon: Target, color: 'text-purple-500' },
          { title: 'Su Tasarrufu', value: '%24', icon: Droplets, color: 'text-blue-500' },
          { title: 'Karbon Ayak İzi', value: '-12%', icon: Leaf, color: 'text-emerald-500' },
          { title: 'Yıllık Tahmin', val: '142 Ton', icon: TrendingUp, color: 'text-amber-500' }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="glass-card"
          >
            <item.icon className={cn("mb-4", item.color)} size={32} />
            <h4 className="text-[10px] opacity-40 uppercase tracking-widest font-black">{item.title}</h4>
            <div className="text-2xl font-black mt-1">{item.value || item.val}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DetailedAnalytics;
