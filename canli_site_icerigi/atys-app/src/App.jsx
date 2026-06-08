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
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
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
        return <DetailedMap sensors={data.sensors} />;
      case 'analytics':
        return <DetailedAnalytics data={data} />;
      case 'ai':
        return <DetailedAIHub theme={theme} />;
      case 'settings':
        return <DetailedSettings theme={theme} setTheme={setTheme} />;
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
          user={data.user} 
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
