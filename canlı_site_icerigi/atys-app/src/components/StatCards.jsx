import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Droplets, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';

const StatCards = ({ stats }) => {
  const getIcon = (id) => {
    switch(id) {
      case 1: return Activity;
      case 2: return Droplets;
      case 3: return AlertTriangle;
      default: return Activity;
    }
  };

  const getColorClasses = (color) => {
    switch(color) {
      case 'emerald': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'blue': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'amber': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, idx) => {
        const Icon = getIcon(stat.id);
        const isPositive = stat.trend.startsWith('+');
        
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card"
          >
            <div className="flex justify-between items-start">
              <div className={cn("p-3 rounded-2xl border", getColorClasses(stat.color))}>
                <Icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter",
                isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">
                {stat.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter">
                  {stat.value}
                </span>
                <span className="text-[10px] opacity-40 font-bold uppercase">Anlık</span>
              </div>
            </div>

            <div className="mt-6 w-full bg-gray-500/10 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                className={cn(
                  "h-full rounded-full",
                  stat.color === 'emerald' ? 'bg-emerald-500' : 
                  stat.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
                )}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatCards;
