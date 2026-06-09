import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const SensorMap = ({ sensors }) => {
  // USER PROVIDED TOP-DOWN SATELLITE IMAGE
  const mapImg = "https://p2.piqsels.com/preview/852/98/414/agriculture-cropland-farm-farmland.jpg";

  return (
    <div className="glass-card relative overflow-hidden h-[300px] flex flex-col p-0 !bg-[#1a2e1a]">
      <div className="flex justify-between items-center p-6 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <h2 className="text-lg font-black text-white drop-shadow-md tracking-tight uppercase">Kuşbakışı Arazi</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-black text-white uppercase drop-shadow-md">Aktif</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* TOP-DOWN Bird's Eye satellite background */}
        <div className="absolute inset-0">
          <img 
            src={mapImg}
            className="w-full h-full object-cover opacity-80 contrast-125 saturate-125"
            alt="Bird's Eye Map"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />
          {/* Technical Grid Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Sensors Overlay */}
        <div className="absolute inset-0">
          {sensors.map((sensor) => (
            <motion.div
              key={sensor.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute cursor-pointer group"
              style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
            >
              <div className="relative">
                <div className={cn(
                  "absolute -inset-3 rounded-full animate-ping-slow",
                  sensor.moisture > 40 ? 'bg-emerald-500/50' : 'bg-amber-500/50'
                )} />
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 border-white shadow-2xl flex items-center justify-center transition-all",
                  sensor.moisture > 40 ? 'bg-emerald-500' : 'bg-amber-600'
                )}>
                   <span className="text-[8px] font-black text-white">S{sensor.id}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SensorMap;
