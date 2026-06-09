import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Cpu, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'map', label: 'Harita', icon: MapIcon },
    { id: 'ai', label: 'Yapay Zeka', icon: Cpu },
    { id: 'analytics', label: 'Analizler', icon: BarChart3 },
    { id: 'settings', label: 'Sahalar', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="hidden md:flex h-screen sticky top-0 left-0 z-50 flex-col transition-all duration-500 border-r border-black/5 dark:border-white/5"
        style={{ backgroundColor: 'var(--sidebar-bg)' }}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30 shadow-sm">
            <Leaf className="text-emerald-500 w-6 h-6" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black text-2xl tracking-tighter text-emerald-600 dark:text-emerald-500"
            >
              ATYS
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "sidebar-link w-full group transition-all duration-300",
                activeTab === item.id && "sidebar-link-active"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
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
        </nav>

        <div className="p-4 border-t border-black/5 dark:border-white/5">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="sidebar-link w-full justify-center hover:bg-black/5 dark:hover:bg-white/5"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest"><ChevronLeft size={16} /> <span>Daralt</span></div>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-black/5 dark:border-white/10 px-2 pb-safe">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all",
                activeTab === item.id ? "text-emerald-500" : "text-gray-400"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                activeTab === item.id ? "bg-emerald-500/10" : ""
              )}>
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
