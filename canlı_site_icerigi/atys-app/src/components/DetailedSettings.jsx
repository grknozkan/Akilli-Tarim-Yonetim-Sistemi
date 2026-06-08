import React from 'react';
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
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const DetailedSettings = ({ theme, setTheme }) => {
  const sections = [
    {
      title: 'Hesap Ayarları',
      items: [
        { label: 'Profil Bilgileri', icon: User, value: 'Ümitcan Çınar' },
        { label: 'Güvenlik', icon: Shield, value: 'İki Adımlı Doğrulama Aktif' },
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
        { label: 'Bildirimler', icon: Bell, value: 'Sadece Kritik Uyarılar' },
        { label: 'Dil', icon: Globe, value: 'Türkçe' },
      ]
    },
    {
      title: 'Veri ve Bağlantı',
      items: [
        { label: 'Sensör Ağ Durumu', icon: Database, value: '5/5 Cihaz Bağlı' },
        { label: 'Mobil Uygulama', icon: Smartphone, value: 'Eşleşti (iPhone 15 Pro)' },
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
                  className="w-full flex items-center justify-between p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-all border-b border-black/5 dark:border-white/5 last:border-none group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-gray-500/10 !text-[var(--text-primary)] group-hover:scale-110 transition-transform">
                      <item.icon size={22} />
                    </div>
                    <span className="font-bold tracking-tight !text-[var(--text-primary)]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold opacity-40 !text-[var(--text-primary)]">{item.value}</span>
                    <ChevronRight size={16} className="opacity-30" style={{ color: 'var(--text-primary)' }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="flex items-center gap-3 p-5 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-500/10 rounded-2xl transition-all w-full md:w-auto border border-red-500/20 shadow-sm">
          <LogOut size={20} />
          Oturumu Kapat
        </button>
      </div>
    </div>
  );
};

export default DetailedSettings;
