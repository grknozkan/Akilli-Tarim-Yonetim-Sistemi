import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Line
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-xl border border-black/5 dark:border-white/20 shadow-2xl">
        <p className="text-xs font-bold mb-2 text-apple-dark/50 dark:text-white/50">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-semibold text-apple-dark dark:text-white">
              {entry.name}: <span className="font-extrabold">{entry.value.toFixed(1)}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SensorChart = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card mb-8 h-[400px]"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-apple-dark dark:text-white">Canlı Sensör Verileri</h2>
          <p className="text-sm text-apple-dark/50 dark:text-white/50">Son 24 saatlik değişim analizi</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-apple-dark/60 dark:text-white/60">Nem (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-apple-dark/60 dark:text-white/60">Sıcaklık (°C)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorNem" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSicaklik" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: 'rgba(128,128,128,0.8)', fontWeight: 600 }}
            dy={10}
          />
          <YAxis hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            name="Nem"
            type="monotone" 
            dataKey="nem" 
            stroke="#10B981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorNem)" 
          />
          <Area 
            name="Sıcaklık"
            type="monotone" 
            dataKey="sicaklik" 
            stroke="#3B82F6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSicaklik)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SensorChart;
