import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, TrendingUp, Leaf, Droplets, BarChart3, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const reports = [
  {
    id: 1,
    title: 'Haftalık Performans Raporu',
    date: '2 Haziran – 8 Haziran 2026',
    type: 'Haftalık',
    status: 'Hazır',
    size: '1.2 MB',
    highlights: ['Sistem sağlığı %97.3', 'Su tasarrufu %18', '12 alarm çözüldü'],
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 2,
    title: 'Aylık Verimlilik Analizi',
    date: 'Mayıs 2026',
    type: 'Aylık',
    status: 'Hazır',
    size: '3.8 MB',
    highlights: ['Ortalama nem %64', 'Ürün büyümesi +8.2%', 'Karbon azaltımı -15%'],
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 3,
    title: 'Sulama Tüketim Raporu',
    date: 'Mayıs 2026',
    type: 'Aylık',
    status: 'Hazır',
    size: '0.9 MB',
    highlights: ['Toplam tüketim 28.4 m³', 'Hedefin %12 altında', 'En verimli: Tarla A'],
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 4,
    title: 'Sensör Ağı Durum Raporu',
    date: 'Nisan 2026',
    type: 'Aylık',
    status: 'Arşivlendi',
    size: '2.1 MB',
    highlights: ['10/10 sensör aktif', 'Ortalama uptime %99.1', '2 bakım yapıldı'],
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 5,
    title: 'Yapay Zeka Öneri Özeti',
    date: 'Nisan 2026',
    type: 'Aylık',
    status: 'Arşivlendi',
    size: '1.5 MB',
    highlights: ['48 öneri oluşturuldu', '%91 uygulama oranı', 'Verim artışı +6.4%'],
    color: 'text-purple-500',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
];

const performanceSummary = [
  { label: 'Raporlanan Dönem', value: '6 Ay', icon: Calendar, color: 'text-blue-500' },
  { label: 'Toplam Rapor', value: '24', icon: FileText, color: 'text-emerald-500' },
  { label: 'Ortalama Verim', value: '%94.2', icon: TrendingUp, color: 'text-amber-500' },
  { label: 'Su Tasarrufu', value: '142 m³', icon: Droplets, color: 'text-blue-400' },
];

const Reports = () => {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (id) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 2000);
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
          <h2 className="text-4xl font-black tracking-tighter !text-[var(--text-primary)]">Raporlar</h2>
          <p className="text-sm font-medium opacity-50 !text-[var(--text-primary)]">Çiftlik performansını dönemsel raporlarla takip edin.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
          <BarChart3 size={16} />
          Yeni Rapor Oluştur
        </button>
      </div>

      {/* Performans Özeti */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {performanceSummary.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card"
          >
            <item.icon size={24} className={cn('mb-3', item.color)} />
            <div className="text-2xl font-black tracking-tighter !text-[var(--text-primary)]">{item.value}</div>
            <div className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1 !text-[var(--text-primary)]">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Rapor Listesi */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-5 border-b border-black/5 dark:border-white/5">
          <h3 className="font-black text-lg tracking-tight !text-[var(--text-primary)]">Rapor Arşivi</h3>
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {reports.map((report, idx) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.08 }}
              className="flex items-center gap-4 p-5 hover:bg-gray-500/5 transition-all group"
            >
              {/* İkon */}
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${report.bg}`}>
                <FileText size={20} className={report.color} />
              </div>

              {/* Bilgi */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-black tracking-tight !text-[var(--text-primary)] truncate">{report.title}</h4>
                  <span className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0",
                    report.status === 'Hazır'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  )}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] opacity-40 font-bold !text-[var(--text-primary)] flex items-center gap-1">
                    <Calendar size={10} />
                    {report.date}
                  </span>
                  <span className="text-[10px] opacity-30 font-bold !text-[var(--text-primary)]">{report.size}</span>
                </div>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {report.highlights.map((h, i) => (
                    <span key={i} className="flex items-center gap-1 text-[9px] font-bold opacity-50 !text-[var(--text-primary)]">
                      <CheckCircle2 size={10} className="text-emerald-500" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* İndirme Butonu */}
              <button
                onClick={() => handleDownload(report.id)}
                className={cn(
                  "shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                  downloading === report.id
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-gray-500/5 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20 border-black/10 dark:border-white/10 !text-[var(--text-primary)]"
                )}
              >
                {downloading === report.id ? (
                  <>
                    <CheckCircle2 size={14} />
                    Hazırlandı
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    İndir
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Otomatik Raporlama Ayarı */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card border border-blue-500/10 bg-gradient-to-r from-blue-500/5 to-transparent"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Clock size={22} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-black tracking-tight !text-[var(--text-primary)]">Otomatik Raporlama</h3>
              <p className="text-xs opacity-50 font-bold !text-[var(--text-primary)]">Her pazartesi 08:00'de haftalık rapor e-posta ile gönderilir</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-500">Aktif</span>
            <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Reports;
