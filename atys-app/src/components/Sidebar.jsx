import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Cpu, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Leaf,
  Droplets,
  FileText,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuGroups = [
    {
      label: 'Ana Menü',
      items: [
        { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
        { id: 'map', label: 'Harita', icon: MapIcon },
        { id: 'ai', label: 'Yapay Zeka', icon: Cpu },
        { id: 'analytics', label: 'Analizler', icon: BarChart3 },
      ]
    },
    {
      label: 'Tarım',
      items: [
        { id: 'irrigation', label: 'Sulama', icon: Droplets },
        { id: 'reports', label: 'Raporlar', icon: FileText },
      ]
    },
    {
      label: 'Sistem',
      items: [
        { id: 'contributors', label: 'Katkı Sunanlar', icon: Users },
        { id: 'settings', label: 'Ayarlar', icon: Settings },
      ]
    },
  ];

  // Flat list for mobile
  const allMenuItems = menuGroups.flatMap(g => g.items);
  // Only show first 5 items in mobile nav (most important)
  const mobileItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'map', label: 'Harita', icon: MapIcon },
    { id: 'ai', label: 'AI', icon: Cpu },
    { id: 'irrigation', label: 'Sulama', icon: Droplets },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="hidden md:flex h-screen sticky top-0 left-0 z-50 flex-col transition-all duration-500 border-r border-black/5 dark:border-white/5"
        style={{ backgroundColor: 'var(--sidebar-bg)' }}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-black/5 dark:border-white/5">
          <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30 shadow-sm shrink-0">
            <Leaf className="text-emerald-500 w-5 h-5" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black text-xl tracking-tighter text-emerald-600 dark:text-emerald-500"
            >
              ATYS
            </motion.span>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
          {menuGroups.map((group) => (
            <div key={group.label}>
              {!isCollapsed && (
                <p className="text-[9px] font-black opacity-30 uppercase tracking-widest px-4 mb-2 !text-[var(--text-primary)]">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "sidebar-link w-full group transition-all duration-300",
                      activeTab === item.id && "sidebar-link-active",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors shrink-0",
                      activeTab === item.id ? "text-emerald-500" : "group-hover:text-emerald-500"
                    )} />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="whitespace-nowrap font-bold text-sm tracking-tight"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-black/5 dark:border-white/5">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="sidebar-link w-full justify-center hover:bg-black/5 dark:hover:bg-white/5"
          >
            {isCollapsed ? <ChevronRight size={20} /> : (
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                <ChevronLeft size={16} />
                <span>Daralt</span>
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-xl border-t border-black/5 dark:border-white/10 px-2 pb-safe" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
        <div className="flex justify-around items-center h-16">
          {mobileItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[56px] transition-all",
                activeTab === item.id ? "text-emerald-500" : "text-gray-400"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                activeTab === item.id ? "bg-emerald-500/10" : ""
              )}>
                <item.icon size={20} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
