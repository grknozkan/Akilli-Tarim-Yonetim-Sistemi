import React, { useState, useRef, useEffect } from 'react';
import { Bell, CloudSun, User, Moon, Sun, AlertTriangle, Droplets, Cpu, ThumbsUp, Wind, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const notifications = [
  {
    id: 1,
    type: 'warning',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Sensör S3 Uyarısı',
    message: 'Tarla A\'daki S3 sensöründe nem seviyesi %28\'e düştü. Kritik eşiğin altında.',
    time: '3 dk önce',
    unread: true,
  },
  {
    id: 2,
    type: 'info',
    icon: Cpu,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    title: 'AI Önerisi Oluşturuldu',
    message: 'Gemini yapay zeka motoru bu sabah için 4 yeni sulama önerisi oluşturdu.',
    time: '18 dk önce',
    unread: true,
  },
  {
    id: 3,
    type: 'warning',
    icon: Wind,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Hava Durumu Uyarısı',
    message: 'Yarın öğleden sonra kuvvetli rüzgar bekleniyor. Sulama programı güncellenmesi önerilir.',
    time: '45 dk önce',
    unread: true,
  },
  {
    id: 4,
    type: 'success',
    icon: Droplets,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Sulama Tamamlandı',
    message: 'Tarla B bölgesinin sulama döngüsü başarıyla tamamlandı. Toplam 520 litre.',
    time: '1 saat önce',
    unread: false,
  },
  {
    id: 5,
    type: 'success',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Sistem Günlük Kontrolü',
    message: 'Günlük sistem sağlık kontrolü tamamlandı. Tüm 10 sensör nominal değerlerde.',
    time: '3 saat önce',
    unread: false,
  },
];

const Header = ({ weather, user, theme, setTheme }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const unreadCount = notifications.filter(n => n.unread).length;

  // Panel dışına tıklanınca kapat
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 sticky top-0 z-40 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-colors duration-500"
      style={{ backgroundColor: 'var(--app-bg)' }}
    >
      <div className="flex flex-col">
        <h1 className="text-xl md:text-3xl font-black tracking-tighter m-0 !text-[var(--text-primary)]">
          Merhaba, {user?.name || 'Kullanıcı'} 👋
        </h1>
        <p className="hidden md:block text-sm font-bold opacity-50 !text-[var(--text-primary)]">
          İşte çiftliğinin bugünkü durumu.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Weather Widget */}
        <div className="hidden md:flex items-center gap-3 bg-gray-500/5 px-4 py-2 rounded-2xl border border-black/5 dark:border-white/10">
          <CloudSun className="text-amber-500 w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-sm font-black !text-[var(--text-primary)]">{weather?.temp}</span>
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest !text-[var(--text-primary)]">{weather?.condition}</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-2xl bg-gray-500/5 hover:bg-gray-500/10 transition-all active:scale-90 group border border-transparent hover:border-black/5 dark:hover:border-white/10"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600 group-hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            className={cn(
              "relative p-3 rounded-2xl transition-all active:scale-90 group border",
              notifOpen
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-gray-500/5 hover:bg-gray-500/10 border-transparent hover:border-black/5 dark:hover:border-white/10"
            )}
          >
            <Bell className={cn(
              "w-5 h-5 transition-colors",
              notifOpen ? "text-emerald-500" : "group-hover:text-emerald-500"
            )} style={{ color: notifOpen ? undefined : 'var(--text-primary)' }} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-[var(--app-bg)] flex items-center justify-center"
              >
                <span className="text-[8px] font-black text-white leading-none">{unreadCount}</span>
              </motion.span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-[360px] rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden z-50"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                {/* Dropdown Başlık */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
                  <div>
                    <h3 className="font-black tracking-tight !text-[var(--text-primary)]">Bildirimler</h3>
                    <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest !text-[var(--text-primary)]">
                      {unreadCount} okunmamış
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    Canlı
                  </span>
                </div>

                {/* Bildirim Listesi */}
                <div className="max-h-[400px] overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
                  {notifications.map((notif, idx) => {
                    const Icon = notif.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "flex gap-3 px-5 py-4 transition-colors",
                          notif.unread ? "bg-emerald-500/[0.03]" : ""
                        )}
                      >
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${notif.iconBg}`}>
                          <Icon size={16} className={notif.iconColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-sm font-black tracking-tight !text-[var(--text-primary)] leading-tight",
                            )}>
                              {notif.title}
                              {notif.unread && (
                                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full ml-2 mb-0.5" />
                              )}
                            </p>
                            <span className="text-[10px] opacity-30 font-bold shrink-0 !text-[var(--text-primary)]">{notif.time}</span>
                          </div>
                          <p className="text-[11px] opacity-50 font-medium leading-relaxed mt-1 !text-[var(--text-primary)]">
                            {notif.message}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Alt Footer */}
                <div className="px-5 py-3 border-t border-black/5 dark:border-white/5 text-center">
                  <p className="text-[10px] font-black opacity-30 uppercase tracking-widest !text-[var(--text-primary)]">
                    Bildirimler tıklanabilir değildir — Yalnızca görüntüleme
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-black/5 dark:border-white/10">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <User className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
