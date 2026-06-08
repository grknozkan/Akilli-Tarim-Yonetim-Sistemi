import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const AIRecommendations = ({ recommendations }) => {
  const [executing, setExecuting] = useState(null);
  const [completed, setCompleted] = useState([]);

  const handleExecute = (id) => {
    setExecuting(id);
    setTimeout(() => {
      setExecuting(null);
      setCompleted([...completed, id]);
    }, 2000);
  };

  return (
    <div className="glass-card w-full h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 shadow-sm">
          <Sparkles className="text-blue-500 w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight">AI Hub</h2>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Zeki Üretim Önerileri</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {recommendations.map((rec, idx) => {
          const isExecuting = executing === rec.id;
          const isDone = completed.includes(rec.id);

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border transition-all duration-500",
                isDone 
                  ? "bg-emerald-500/5 border-emerald-500/10" 
                  : "bg-gray-500/5 border-black/5 dark:border-white/5 hover:border-blue-500/30"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-lg border",
                  rec.priority === 'high' ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                  rec.priority === 'medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  {rec.type}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-30 uppercase">
                  <Clock size={10} />
                  {rec.time}
                </div>
              </div>

              <h3 className="text-sm font-black mb-1.5 tracking-tight">{rec.title}</h3>
              <p className="text-[11px] font-medium opacity-60 mb-5 leading-relaxed">
                {rec.description}
              </p>

              <button
                disabled={isExecuting || isDone}
                onClick={() => handleExecute(rec.id)}
                className={cn(
                  "w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-lg",
                  isDone 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 cursor-default" 
                    : "bg-black text-white dark:bg-white dark:text-black border-transparent hover:scale-[1.02] active:scale-95"
                )}
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    İşleniyor
                  </>
                ) : isDone ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Uygulandı
                  </>
                ) : (
                  <>
                    Aksiyonu Başlat
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AIRecommendations;
