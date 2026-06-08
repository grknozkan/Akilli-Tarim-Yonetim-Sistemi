import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

// Sensörleri ana tarlada toplamak için sabit pozisyon haritası
// Fotoğraftaki ana yeşil tarla: yaklaşık x: %15-%75, y: %20-%88 aralığında
const SENSOR_POSITIONS = {
  1:  { x: 18, y: 35 },
  2:  { x: 28, y: 24 },
  3:  { x: 42, y: 52 },
  4:  { x: 55, y: 62 },
  5:  { x: 63, y: 38 },
  6:  { x: 32, y: 70 },
  7:  { x: 47, y: 40 },
  8:  { x: 52, y: 46 },
  9:  { x: 22, y: 58 },
  10: { x: 60, y: 77 },
};

const SensorMap = ({ sensors }) => {
  const mapImg = "https://p2.piqsels.com/preview/852/98/414/agriculture-cropland-farm-farmland.jpg";

  // Sensöre özel pozisyon ata, yoksa orijinal verisini kullan ama sınırla
  const getPosition = (sensor) => {
    if (SENSOR_POSITIONS[sensor.id]) return SENSOR_POSITIONS[sensor.id];
    return {
      x: Math.min(Math.max(sensor.x, 15), 72),
      y: Math.min(Math.max(sensor.y, 20), 85),
    };
  };

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
        {/* Uydu görüntüsü */}
        <div className="absolute inset-0">
          <img 
            src={mapImg}
            className="w-full h-full object-cover opacity-80 contrast-125 saturate-125"
            alt="Bird's Eye Map"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />
          {/* Teknik Grid Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Sensörler */}
        <div className="absolute inset-0">
          {sensors.map((sensor) => {
            const pos = getPosition(sensor);
            return (
              <motion.div
                key={sensor.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: sensor.id * 0.05 }}
                className="absolute cursor-pointer group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div className="relative">
                  <div className={cn(
                    "absolute -inset-3 rounded-full animate-ping-slow",
                    sensor.moisture > 40 ? 'bg-emerald-500/50' : 'bg-amber-500/50'
                  )} />
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 border-white shadow-2xl flex items-center justify-center transition-all group-hover:scale-110",
                    sensor.moisture > 40 ? 'bg-emerald-500' : 'bg-amber-600'
                  )}>
                     <span className="text-[8px] font-black text-white">S{sensor.id}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SensorMap;
