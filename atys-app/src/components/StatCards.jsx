import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Droplets, AlertTriangle, TrendingUp, TrendingDown, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const detailData = {
  1: {
    title: 'Sistem Sağlığı Detayı',
    summary: 'Son 24 saatlik sistem operasyon raporu',
    items: [
      { label: 'Uptime (24 saat)', value: '%96.8', status: 'good' },
      { label: 'Çözülen Uyarılar', value: '12 adet', status: 'good' },
      { label: 'Ortalama Yanıt Süresi', value: '48 ms', status: 'good' },
      { label: 'API Başarı Oranı', value: '%99.2', status: 'good' },
      { label: 'Bant Genişliği Kullanımı', value: '%34', status: 'good' },
      { label: 'Son Yeniden Başlatma', value: '7 gün önce', status: 'neutral' },
    ],
    note: 'Sistem nominal değerlerde çalışmaya devam ediyor. Rutin bakım planlandı.',
  },
  2: {
    title: 'Ortalama Nem Detayı',
    summary: 'Tüm sensör bölgelerinin anlık nem dağılımı',
    items: [
      { label: 'Tarla A - Mısır', value: '%68', status: 'good' },
      { label: 'Tarla B - Buğday', value: '%48', status: 'warn' },
      { label: 'Tarla C - Yonca', value: '%71', status: 'good' },
      { label: 'Sera Bölgesi', value: '%85', status: 'good' },
      { label: 'Kuzey Parseli', value: '%55', status: 'neutral' },
      { label: 'Güney Parseli', value: '%62', status: 'good' },
    ],
    note: 'Tarla B nem seviyesi kritik eşiğe yaklaşıyor. Sulama planlanması önerilir.',
  },
  3: {
    title: 'Aktif Uyarılar Detayı',
    summary: 'Sistemdeki mevcut uyarı ve olaylar',
    items: [
      { label: 'S3 Sensörü - Düşük Nem', value: 'Yüksek', status: 'error' },
      { label: 'S7 Bağlantı Gecikmesi', value: 'Orta', status: 'warn' },
      { label: 'Hava Durumu Uyarısı', value: 'Düşük', status: 'warn' },
      { label: 'Sulama Planı Sapması', value: 'Bilgi', status: 'neutral' },
    ],
    note: 'Kritik uyarılar için AI asistanınızdan öneri alabilirsiniz.',
  },
};

const StatCards = ({ stats }) => {
  const [selectedStat, setSelectedStat] = useState(null);

  const getIcon = (id) => {
    switch(id) {
      case 1: return Activity;
      case 2: return Droplets;
      case 3: return AlertTriangle;
      default: return Activity;
    }
  };

  const getColorClasses = (color) => {
    switch(color) {
      case 'emerald': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'blue': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'amber': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'good': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'warn': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'error': return <AlertCircle size={14} className="text-red-500" />;
      default: return <Info size={14} className="text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return 'text-emerald-500';
      case 'warn': return 'text-amber-500';
      case 'error': return 'text-red-500';
      default: return 'opacity-60 !text-[var(--text-primary)]';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = getIcon(stat.id);
          const isPositive = stat.trend.startsWith('+');
          
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedStat(stat)}
              className="glass-card cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                stat.color === 'emerald' ? 'bg-emerald-500/5' :
                stat.color === 'blue' ? 'bg-blue-500/5' : 'bg-amber-500/5'
              )} />

              <div className="flex justify-between items-start relative z-10">
                <div className={cn("p-3 rounded-2xl border", getColorClasses(stat.color))}>
                  <Icon size={24} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter",
                  isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                )}>
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.trend}
                </div>
              </div>
              
              <div className="mt-6 relative z-10">
                <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">
                  {stat.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter">
                    {stat.value}
                  </span>
                  <span className="text-[10px] opacity-40 font-bold uppercase">Anlık</span>
                </div>
              </div>

              <div className="mt-6 w-full bg-gray-500/10 h-1.5 rounded-full overflow-hidden relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                  className={cn(
                    "h-full rounded-full",
                    stat.color === 'emerald' ? 'bg-emerald-500' : 
                    stat.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
                  )}
                />
              </div>

              <p className="text-[9px] font-black opacity-20 uppercase tracking-widest mt-3 relative z-10 group-hover:opacity-40 transition-opacity !text-[var(--text-primary)]">
                Detay için tıkla →
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedStat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStat(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-[201] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full max-w-md rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between p-6 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-2xl border", getColorClasses(selectedStat.color))}>
                      {React.createElement(getIcon(selectedStat.id), { size: 20 })}
                    </div>
                    <div>
                      <h3 className="font-black text-lg tracking-tight !text-[var(--text-primary)]">
                        {detailData[selectedStat.id]?.title}
                      </h3>
                      <p className="text-[10px] opacity-40 font-bold !text-[var(--text-primary)]">
                        {detailData[selectedStat.id]?.summary}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStat(null)}
                    className="p-2 rounded-xl hover:bg-gray-500/10 transition-all"
                  >
                    <X size={18} style={{ color: 'var(--text-primary)' }} className="opacity-40" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-3">
                  {detailData[selectedStat.id]?.items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-500/5 border border-black/5 dark:border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-sm font-bold !text-[var(--text-primary)] opacity-70">{item.label}</span>
                      </div>
                      <span className={cn("text-sm font-black", getStatusColor(item.status))}>
                        {item.value}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Note */}
                <div className="px-6 pb-6">
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-xs font-medium text-blue-500 leading-relaxed">
                      💡 {detailData[selectedStat.id]?.note}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StatCards;
