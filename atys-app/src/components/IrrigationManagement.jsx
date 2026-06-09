import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Power, Clock, ChevronRight, Zap, Calendar, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const irrigationZones = [
  { id: 1, name: 'Tarla A - Mısır', area: '4.2 hektar', status: 'active', moisture: 72, nextSchedule: '14:30', autoMode: true, lastIrrigated: '2 saat önce' },
  { id: 2, name: 'Tarla B - Buğday', area: '6.8 hektar', status: 'scheduled', moisture: 48, nextSchedule: '16:00', autoMode: true, lastIrrigated: '5 saat önce' },
  { id: 3, name: 'Tarla C - Yonca', area: '2.1 hektar', status: 'idle', moisture: 61, nextSchedule: 'Yarın 08:00', autoMode: false, lastIrrigated: 'Dün' },
  { id: 4, name: 'Sera Bölgesi', area: '0.8 hektar', status: 'active', moisture: 85, nextSchedule: '18:00', autoMode: true, lastIrrigated: '30 dk önce' },
];

const weeklyData = [
  { gun: 'Pzt', litre: 1200, hedef: 1000 },
  { gun: 'Sal', litre: 950, hedef: 1000 },
  { gun: 'Çar', litre: 1100, hedef: 1000 },
  { gun: 'Per', litre: 800, hedef: 1000 },
  { gun: 'Cum', litre: 1350, hedef: 1000 },
  { gun: 'Cmt', litre: 700, hedef: 1000 },
  { gun: 'Paz', litre: 900, hedef: 1000 },
];

const recentHistory = [
  { zone: 'Tarla A - Mısır', duration: '45 dk', amount: '320 L', time: 'Bugün 10:15', status: 'completed' },
  { zone: 'Sera Bölgesi', duration: '20 dk', amount: '85 L', time: 'Bugün 09:30', status: 'completed' },
  { zone: 'Tarla B - Buğday', duration: '60 dk', amount: '520 L', time: 'Dün 16:00', status: 'completed' },
  { zone: 'Tarla C - Yonca', duration: '35 dk', amount: '210 L', time: 'Dün 08:00', status: 'completed' },
];

const IrrigationManagement = () => {
  const [zones, setZones] = useState(irrigationZones);
  const [activatingId, setActivatingId] = useState(null);

  const toggleZone = (id) => {
    setActivatingId(id);
    setTimeout(() => {
      setZones(prev => prev.map(z =>
        z.id === id ? { ...z, status: z.status === 'active' ? 'idle' : 'active' } : z
      ));
      setActivatingId(null);
    }, 1000);
  };

  const toggleAuto = (id) => {
    setZones(prev => prev.map(z =>
      z.id === id ? { ...z, autoMode: !z.autoMode } : z
    ));
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active': return { label: 'Sulama Aktif', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500' };
      case 'scheduled': return { label: 'Planlandı', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-500' };
      default: return { label: 'Beklemede', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20', dot: 'bg-gray-400' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 pb-20"
    >
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter !text-[var(--text-primary)]">Sulama Yönetimi</h2>
          <p className="text-sm font-medium opacity-50 !text-[var(--text-primary)]">Tüm sulama bölgelerini kontrol edin ve planlayın.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">2 Bölge Aktif</span>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Bugün Kullanılan', value: '1.24 m³', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Aktif Bölge', value: '2 / 4', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Haftalık Tasarruf', value: '%18', icon: TrendingDown, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'Sonraki Sulama', value: '14:30', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card"
          >
            <div className={`p-2.5 rounded-xl border w-fit mb-3 ${item.bg}`}>
              <item.icon size={20} className={item.color} />
            </div>
            <div className="text-2xl font-black tracking-tighter !text-[var(--text-primary)]">{item.value}</div>
            <div className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1 !text-[var(--text-primary)]">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Sulama Bölgeleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone, idx) => {
          const statusCfg = getStatusConfig(zone.status);
          const isActivating = activatingId === zone.id;
          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.08 }}
              className="glass-card group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black tracking-tight !text-[var(--text-primary)]">{zone.name}</h3>
                  <p className="text-xs opacity-40 font-bold !text-[var(--text-primary)]">{zone.area}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg border ${statusCfg.bg} ${statusCfg.color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${zone.status === 'active' ? 'animate-pulse' : ''}`} />
                  {statusCfg.label}
                </span>
              </div>

              {/* Nem Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] font-black opacity-50 uppercase tracking-widest !text-[var(--text-primary)]">Toprak Nemi</span>
                  <span className={cn("text-xs font-black", zone.moisture < 50 ? 'text-amber-500' : 'text-emerald-500')}>%{zone.moisture}</span>
                </div>
                <div className="w-full bg-gray-500/10 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.moisture}%` }}
                    transition={{ duration: 1, delay: 0.3 + idx * 0.1, ease: 'circOut' }}
                    className={cn("h-full rounded-full", zone.moisture < 50 ? 'bg-amber-500' : 'bg-emerald-500')}
                  />
                </div>
              </div>

              {/* Alt bilgi */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-50 !text-[var(--text-primary)]">
                  <Clock size={12} />
                  <span>Son: {zone.lastIrrigated}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-50 !text-[var(--text-primary)]">
                  <Calendar size={12} />
                  <span>Sonraki: {zone.nextSchedule}</span>
                </div>
              </div>

              {/* Kontroller */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleZone(zone.id)}
                  disabled={isActivating}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border",
                    zone.status === 'active'
                      ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                  )}
                >
                  <Power size={14} className={isActivating ? 'animate-spin' : ''} />
                  {isActivating ? 'İşleniyor...' : zone.status === 'active' ? 'Durdur' : 'Başlat'}
                </button>
                <button
                  onClick={() => toggleAuto(zone.id)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                    zone.autoMode
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                  )}
                >
                  {zone.autoMode ? 'Oto' : 'Manuel'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Haftalık Su Tüketimi Grafiği */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card h-[300px]"
      >
        <h3 className="font-black text-lg tracking-tight !text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <Droplets className="text-blue-500" size={20} />
          Haftalık Su Tüketimi (Litre)
        </h3>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorLitre" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="gun" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'gray', fontWeight: 600 }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
              }}
            />
            <Area type="monotone" dataKey="litre" name="Tüketim (L)" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorLitre)" />
            <Area type="monotone" dataKey="hedef" name="Hedef (L)" stroke="#10B981" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Son Sulama Geçmişi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card"
      >
        <h3 className="font-black text-lg tracking-tight !text-[var(--text-primary)] mb-4">Son Sulama Geçmişi</h3>
        <div className="space-y-3">
          {recentHistory.map((entry, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-500/5 border border-black/5 dark:border-white/5 hover:bg-gray-500/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Droplets size={14} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-black !text-[var(--text-primary)]">{entry.zone}</p>
                  <p className="text-[10px] opacity-40 font-bold !text-[var(--text-primary)]">{entry.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold opacity-50 !text-[var(--text-primary)]">{entry.duration}</span>
                <span className="text-xs font-black text-blue-500">{entry.amount}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IrrigationManagement;
