import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Cpu, Database, MessageSquare, GitBranch, ExternalLink, Star } from 'lucide-react';

const contributors = [
  {
    id: 1,
    name: 'Ümitcan Çınar',
    initials: 'ÜÇ',
    role: 'Sistem Arayüz Mimarı & DevOps',
    description: 'Tüm kullanıcı arayüzünün tasarımı ve frontend geliştirme süreci. Responsive yapılandırma, bileşen mimarisi, animasyon sistemi ve projenin Vercel üzerinden canlı ortama başarıyla deploy edilmesi.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Vercel'],
    icon: Code2,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 2,
    name: 'Gürkan Özkan',
    initials: 'GÖ',
    role: 'Proje Lideri & Backend Mimar',
    description: 'Projenin genel teknik liderliği ve stratejik yol haritasının belirlenmesi. RESTful API mimarisinin tasarımı, backend altyapı yönetimi ve ekip içi teknik standartların oluşturulması.',
    tags: ['Node.js', 'REST API', 'Proje Yönetimi', 'Mimari Tasarım'],
    icon: GitBranch,
    gradient: 'from-blue-500/20 to-indigo-500/10',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    avatarBg: 'bg-blue-600',
  },
  {
    id: 3,
    name: 'Mehmet Kerem Küçük',
    initials: 'MK',
    role: 'API Geliştirici & Entegrasyon Uzmanı',
    description: 'Backend API endpoint\'lerinin geliştirilmesi ve implementasyonu. IoT sensör veri entegrasyonu, üçüncü parti servis bağlantıları, API güvenliği ve performans optimizasyonu.',
    tags: ['Express.js', 'API Geliştirme', 'IoT Entegrasyon', 'Güvenlik'],
    icon: Cpu,
    gradient: 'from-purple-500/20 to-violet-500/10',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    avatarBg: 'bg-purple-600',
  },
  {
    id: 4,
    name: 'Neva Yıldız',
    initials: 'NY',
    role: 'Veritabanı Mühendisi',
    description: 'Veritabanı şema tasarımı ve veri modellemesi. Sensör verilerinin verimli depolanması, sorgu optimizasyonu, yedekleme stratejileri ve sistemin veri katmanının tümüyle entegrasyonu.',
    tags: ['MongoDB', 'Veri Modelleme', 'Optimizasyon', 'Şema Tasarımı'],
    icon: Database,
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 5,
    name: 'Avşin Pelin Bilgiç',
    initials: 'AB',
    role: 'Proje İletişim Koordinatörü',
    description: 'Ekip içi koordinasyon ve süreç yönetimi. Paydaş iletişimi, görev takibi, sprint planlaması, dökümentasyon ve projenin zamanında ve eksiksiz teslim edilmesinin sağlanması.',
    tags: ['Ekip Koordinasyonu', 'İletişim', 'Görev Takibi', 'Dokümantasyon'],
    icon: MessageSquare,
    gradient: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/20',
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    avatarBg: 'bg-rose-600',
  },
];

const Contributors = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 pb-20"
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tighter !text-[var(--text-primary)]">Katkı Sunanlar</h2>
        <p className="text-sm font-medium opacity-50 !text-[var(--text-primary)]">
          ATYS'yi hayata geçiren ekibimizle tanışın.
        </p>
      </div>

      {/* Ekip Istatistikleri */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ekip Üyesi', value: '5' },
          { label: 'Katkı Alanı', value: '12+' },
          { label: 'Proje Versiyonu', value: 'v4.1.1' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card text-center"
          >
            <div className="text-3xl font-black tracking-tighter text-emerald-500">{item.value}</div>
            <div className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1 !text-[var(--text-primary)]">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Katkı Sunan Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contributors.map((person, idx) => {
          const Icon = person.icon;
          return (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              className={`glass-card group relative overflow-hidden border ${person.border} hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
            >
              {/* Arka plan gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${person.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="relative z-10">
                {/* Üst satır: Avatar + İsim */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${person.avatarBg} flex items-center justify-center shadow-lg shrink-0`}>
                    <span className="text-white text-lg font-black tracking-tight">{person.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-lg tracking-tight !text-[var(--text-primary)] truncate">{person.name}</h3>
                    <div className={`flex items-center gap-1.5 mt-0.5`}>
                      <div className={`p-1 rounded-lg border ${person.iconBg}`}>
                        <Icon size={12} className={person.iconColor} />
                      </div>
                      <p className="text-[11px] font-bold opacity-60 !text-[var(--text-primary)] leading-tight">{person.role}</p>
                    </div>
                  </div>
                  <Star size={16} className="opacity-20 group-hover:opacity-60 transition-opacity text-amber-400 shrink-0 mt-1" />
                </div>

                {/* Açıklama */}
                <p className="text-sm font-medium opacity-60 leading-relaxed mb-5 !text-[var(--text-primary)]">
                  {person.description}
                </p>

                {/* Teknoloji tag'leri */}
                <div className="flex flex-wrap gap-2">
                  {person.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider ${person.iconBg} ${person.iconColor}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* ATYS Proje Kartı — 5. kişi tek kalmışsa yan alanı doldurmak için tam genişlik */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="md:col-span-2 glass-card relative overflow-hidden border border-emerald-500/10 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl">
                <span className="text-white text-2xl font-black">🌱</span>
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tighter !text-[var(--text-primary)]">ATYS Projesi</h3>
                <p className="text-xs font-bold opacity-40 uppercase tracking-widest !text-[var(--text-primary)]">Akıllı Tarım Yönetim Sistemi</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium opacity-60 leading-relaxed !text-[var(--text-primary)]">
                ATYS, Türkiye'nin dijital tarım dönüşümüne katkı sağlamak amacıyla geliştirilen, IoT sensör ağları, yapay zeka analizleri ve gerçek zamanlı veri görselleştirmeyi bir araya getiren modern bir akıllı tarım yönetim platformudur.
              </p>
            </div>
            <div className="shrink-0">
              <div className="flex flex-col items-center gap-1 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-2xl font-black text-emerald-500">v4.1.1</span>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-50 !text-[var(--text-primary)]">Güncel Sürüm</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contributors;
