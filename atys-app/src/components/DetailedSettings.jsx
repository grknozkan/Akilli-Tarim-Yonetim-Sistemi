import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Smartphone, 
  Globe, 
  Moon, 
  Sun,
  ChevronRight,
  LogOut,
  X,
  Check,
  Edit3,
  Volume2,
  Vibrate,
  Mail,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const DetailedSettings = ({ theme, setTheme, userName, setUserName }) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName || 'Ümitcan');
  const [notifPanel, setNotifPanel] = useState(false);
  const [langPanel, setLangPanel] = useState(false);
  const [notifications, setNotifications] = useState({
    critical: true,
    email: true,
    sms: false,
    sound: true,
    push: true,
  });
  const [selectedLang, setSelectedLang] = useState('tr');
  const [savingName, setSavingName] = useState(false);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    setTimeout(() => {
      setUserName(nameInput.trim());
      localStorage.setItem('atys_username', nameInput.trim());
      setSavingName(false);
      setEditingName(false);
    }, 800);
  };

  const sections = [
    {
      title: 'Hesap Ayarları',
      items: [
        {
          label: 'Profil Bilgileri',
          icon: User,
          value: userName || 'Ümitcan',
          action: () => setEditingName(true),
        },
        { label: 'Güvenlik', icon: Shield, value: 'İki Adımlı Doğrulama Aktif', action: null },
      ]
    },
    {
      title: 'Sistem',
      items: [
        { 
          label: 'Tema', 
          icon: theme === 'dark' ? Moon : Sun, 
          value: theme === 'dark' ? 'Karanlık Mod' : 'Aydınlık Mod',
          action: () => setTheme(theme === 'dark' ? 'light' : 'dark')
        },
        {
          label: 'Bildirimler',
          icon: Bell,
          value: notifications.critical ? 'Sadece Kritik Uyarılar' : 'Devre Dışı',
          action: () => { setNotifPanel(true); setLangPanel(false); }
        },
        {
          label: 'Dil',
          icon: Globe,
          value: selectedLang === 'tr' ? 'Türkçe' : selectedLang === 'en' ? 'English' : 'Deutsch',
          action: () => { setLangPanel(true); setNotifPanel(false); }
        },
      ]
    },
    {
      title: 'Veri ve Bağlantı',
      items: [
        { label: 'Sensör Ağ Durumu', icon: Database, value: '5/5 Cihaz Bağlı', action: null },
        { label: 'Mobil Uygulama', icon: Smartphone, value: 'Eşleşti (iPhone 15 Pro)', action: null },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl pb-20">
      <div>
        <h2 className="text-4xl font-black tracking-tighter !text-[var(--text-primary)]">Ayarlar</h2>
        <p className="text-sm font-medium opacity-50 !text-[var(--text-primary)]">Hesap ve sistem tercihlerini yönetin.</p>
      </div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-xs font-black opacity-40 uppercase tracking-widest pl-4 !text-[var(--text-primary)]">
              {section.title}
            </h3>
            <div className="glass-card p-0 overflow-hidden !bg-[var(--card-bg)]">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  disabled={!item.action}
                  className={cn(
                    "w-full flex items-center justify-between p-5 transition-all border-b border-black/5 dark:border-white/5 last:border-none group",
                    item.action ? "hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" : "cursor-default opacity-70"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-gray-500/10 !text-[var(--text-primary)] group-hover:scale-110 transition-transform">
                      <item.icon size={22} />
                    </div>
                    <span className="font-bold tracking-tight !text-[var(--text-primary)]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold opacity-40 !text-[var(--text-primary)]">{item.value}</span>
                    {item.action && <ChevronRight size={16} className="opacity-30" style={{ color: 'var(--text-primary)' }} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Bildirim Ayarları Paneli */}
        <AnimatePresence>
          {notifPanel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card !bg-[var(--card-bg)] border border-emerald-500/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-lg tracking-tight !text-[var(--text-primary)] flex items-center gap-2">
                  <Bell size={18} className="text-emerald-500" />
                  Bildirim Tercihleri
                </h3>
                <button onClick={() => setNotifPanel(false)} className="p-1.5 rounded-xl hover:bg-gray-500/10 transition-all">
                  <X size={16} style={{ color: 'var(--text-primary)' }} className="opacity-50" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'critical', label: 'Kritik Uyarılar', desc: 'Acil durum bildirimleri', icon: Bell },
                  { key: 'email', label: 'E-posta Bildirimleri', desc: 'Günlük özet ve raporlar', icon: Mail },
                  { key: 'sms', label: 'SMS Bildirimleri', desc: 'Anlık uyarı mesajları', icon: Phone },
                  { key: 'sound', label: 'Ses Bildirimleri', desc: 'Bildirim sesi', icon: Volume2 },
                  { key: 'push', label: 'Push Bildirimleri', desc: 'Mobil uygulama bildirimleri', icon: Vibrate },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-gray-500/5 border border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="text-emerald-500" />
                        <div>
                          <p className="font-bold text-sm !text-[var(--text-primary)]">{item.label}</p>
                          <p className="text-[10px] opacity-40 font-bold !text-[var(--text-primary)]">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={cn(
                          "w-11 h-6 rounded-full transition-all duration-300 relative",
                          notifications[item.key] ? "bg-emerald-500" : "bg-gray-300 dark:bg-white/20"
                        )}
                      >
                        <motion.div
                          animate={{ x: notifications[item.key] ? 20 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dil Seçim Paneli */}
        <AnimatePresence>
          {langPanel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card !bg-[var(--card-bg)] border border-blue-500/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-lg tracking-tight !text-[var(--text-primary)] flex items-center gap-2">
                  <Globe size={18} className="text-blue-500" />
                  Dil Seçimi
                </h3>
                <button onClick={() => setLangPanel(false)} className="p-1.5 rounded-xl hover:bg-gray-500/10 transition-all">
                  <X size={16} style={{ color: 'var(--text-primary)' }} className="opacity-50" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', native: 'Türkçe' },
                  { code: 'en', label: 'İngilizce', flag: '🇬🇧', native: 'English' },
                  { code: 'de', label: 'Almanca', flag: '🇩🇪', native: 'Deutsch' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                      selectedLang === lang.code
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                        : "bg-gray-500/5 border-black/5 dark:border-white/5 hover:bg-gray-500/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left">
                        <p className={cn("font-black text-sm", selectedLang === lang.code ? "text-blue-500" : "!text-[var(--text-primary)]")}>{lang.label}</p>
                        <p className="text-[10px] opacity-40 font-bold !text-[var(--text-primary)]">{lang.native}</p>
                      </div>
                    </div>
                    {selectedLang === lang.code && <Check size={18} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="flex items-center gap-3 p-5 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-500/10 rounded-2xl transition-all w-full md:w-auto border border-red-500/20 shadow-sm">
          <LogOut size={20} />
          Oturumu Kapat
        </button>
      </div>

      {/* İsim Değiştirme Modalı */}
      <AnimatePresence>
        {editingName && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingName(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-[201] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full max-w-sm rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <Edit3 size={18} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-black tracking-tight !text-[var(--text-primary)]">İsim Değiştir</h3>
                      <p className="text-[10px] opacity-40 font-bold !text-[var(--text-primary)]">Ana menüde görünen isminiz</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingName(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-all">
                    <X size={18} style={{ color: 'var(--text-primary)' }} className="opacity-40" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-[10px] font-black opacity-40 uppercase tracking-widest !text-[var(--text-primary)] block mb-2">
                      Yeni İsim
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                      className="w-full px-4 py-4 rounded-2xl border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm font-bold transition-all"
                      style={{ backgroundColor: 'var(--app-bg)', color: 'var(--text-primary)' }}
                      placeholder="İsminizi girin..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingName(false)}
                      className="flex-1 py-3.5 rounded-2xl border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest hover:bg-gray-500/5 transition-all !text-[var(--text-primary)]"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleSaveName}
                      disabled={savingName || !nameInput.trim()}
                      className="flex-1 py-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {savingName ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Kaydediliyor
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          Kaydet
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetailedSettings;
