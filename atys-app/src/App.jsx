import React, { useState, useEffect } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import SensorChart from './components/SensorChart';
import SensorMap from './components/SensorMap';
import AIRecommendations from './components/AIRecommendations';
import DetailedMap from './components/DetailedMap';
import DetailedAnalytics from './components/DetailedAnalytics';
import DetailedAIHub from './components/DetailedAIHub';
import DetailedSettings from './components/DetailedSettings';
import Contributors from './components/Contributors';
import IrrigationManagement from './components/IrrigationManagement';
import Reports from './components/Reports';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [userName, setUserName] = useState(localStorage.getItem('atys_username') || 'Ümitcan');
  const data = useDashboardData();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Kullanıcı adı güncellendiğinde data.user.name de güncellenir (hook her 30s'de yenileniyor,
  // ancak anlık güncelleme için doğrudan userName state'ini kullan)
  const currentUser = { ...data.user, name: userName };

  const renderContent = () => {
    if (data.loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-[var(--text-primary)] opacity-50 space-y-4">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold tracking-widest uppercase">Sistem Bağlantısı Kuruluyor...</p>
        </div>
      );
    }

    if (data.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500 space-y-4 p-8 text-center">
          <div className="p-4 bg-red-500/10 rounded-full">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tighter mb-1">Bağlantı Hatası</h3>
            <p className="text-sm opacity-70">{data.error}</p>
            <p className="text-xs opacity-50 mt-4 max-w-md mx-auto">
              (Not: Eğer Vercel kullanıyorsanız "Vercel Authentication" ayarının kapalı olduğundan emin olun.)
            </p>
          </div>
        </div>
      );
    }

    switch(activeTab) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <StatCards stats={data.stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <SensorChart data={data.sensorHistory} />
                <SensorMap sensors={data.sensors} />
              </div>
              <div className="lg:col-span-1">
                <AIRecommendations recommendations={data.aiRecommendations} />
              </div>
            </div>
          </motion.div>
        );
      case 'map':
        return (
          <motion.div key="map" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full">
            <DetailedMap sensors={data.sensors} />
          </motion.div>
        );
      case 'analytics':
        return (
          <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <DetailedAnalytics data={data} />
          </motion.div>
        );
      case 'ai':
        return (
          <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full">
            <DetailedAIHub theme={theme} />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <DetailedSettings theme={theme} setTheme={setTheme} userName={userName} setUserName={setUserName} />
          </motion.div>
        );
      case 'irrigation':
        return (
          <motion.div key="irrigation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <IrrigationManagement />
          </motion.div>
        );
      case 'reports':
        return (
          <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Reports />
          </motion.div>
        );
      case 'contributors':
        return (
          <motion.div key="contributors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Contributors />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen transition-colors duration-500 overflow-hidden bg-apple-bg dark:bg-apple-dark">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen">
        <Header 
          weather={data.weather} 
          user={currentUser} 
          theme={theme} 
          setTheme={setTheme} 
        />
        
        <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>

        <footer className="hidden md:block px-8 py-4 text-[10px] text-center opacity-30 font-mono tracking-widest uppercase">
          ATYS Premium Agriculture OS v4.1.1 // Gemini 3 Flash Intelligence Online
        </footer>
      </main>
    </div>
  );
}

export default App;
