import React from 'react';
import { Bell, CloudSun, User, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ weather, user, theme, setTheme }) => {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 sticky top-0 z-40 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-colors duration-500" style={{ backgroundColor: 'var(--app-bg)' }}>
      <div className="flex flex-col">
        <h1 className="text-xl md:text-3xl font-black tracking-tighter m-0 !text-[var(--text-primary)]">
          Merhaba, {user.name} 👋
        </h1>
        <p className="hidden md:block text-sm font-bold opacity-50 !text-[var(--text-primary)]">
          İşte çiftliğinin bugünkü durumu.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Weather Widget */}
        <div className="hidden md:flex items-center gap-3 bg-gray-500/5 px-4 py-2 rounded-2xl border border-black/5 dark:border-white/10">
          <CloudSun className="text-amber-500 w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-sm font-black !text-[var(--text-primary)]">{weather.temp}°C</span>
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest !text-[var(--text-primary)]">{weather.condition}</span>
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
        <button className="relative p-3 rounded-2xl bg-gray-500/5 hover:bg-gray-500/10 transition-all active:scale-90 group border border-transparent hover:border-black/5 dark:hover:border-white/10">
          <Bell className="w-5 h-5 group-hover:text-emerald-500 transition-colors" style={{ color: 'var(--text-primary)' }} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--app-bg)]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-black/5 dark:border-white/10">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <User className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
