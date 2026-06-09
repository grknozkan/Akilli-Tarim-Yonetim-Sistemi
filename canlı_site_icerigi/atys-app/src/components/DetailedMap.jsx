import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, Layers, Navigation, Thermometer, Droplets, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

const DetailedMap = ({ sensors }) => {
  const [selectedSensor, setSelectedSensor] = useState(null);

  // USER PROVIDED TOP-DOWN SATELLITE IMAGE
  const mapImg = "https://p2.piqsels.com/preview/852/98/414/agriculture-cropland-farm-farmland.jpg";

  return (
    <div className="flex flex-col h-full gap-4 md:gap-8">
      <div className="flex justify-between items-end px-2 md:px-0">
        <div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter !text-[var(--text-primary)]">Sensör Haritası</h2>
          <p className="text-xs md:text-sm font-medium opacity-50 !text-[var(--text-primary)]">Arazi genelindeki IoT ağınızı yönetin.</p>
        </div>
        <div className="flex gap-2">
          <button className="glass p-2 md:p-3 rounded-2xl bg-gray-500/5 hover:bg-gray-500/10 border border-black/5 dark:border-white/5 transition-all">
            <Layers size={18} className="md:w-5 md:h-5" style={{ color: 'var(--text-primary)' }} />
          </button>
          <button className="glass p-2 md:p-3 rounded-2xl bg-gray-500/5 hover:bg-gray-500/10 border border-black/5 dark:border-white/5 transition-all">
            <Navigation size={18} className="md:w-5 md:h-5" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 glass-card relative overflow-hidden p-0 border-black/10 dark:border-white/10 shadow-2xl !bg-[#1a2e1a] h-[400px] md:h-full">
          {/* USER IMAGE CONTAINER */}
          <div className="absolute inset-0">
            <img 
              src={mapImg}
              className="w-full h-full object-cover opacity-90 contrast-110 saturate-125"
              alt="Bird's Eye Farm Map"
              style={{ filter: 'brightness(0.9) contrast(1.1)' }}
            />
            {/* Very Subtle Technical Grid */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          {/* Sensors Overlay */}
          <div className="absolute inset-0 p-4 md:p-12">
            <div className="relative w-full h-full">
              {sensors.map((sensor) => (
                <motion.div
                  key={sensor.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  className="absolute cursor-pointer"
                  style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
                  onClick={() => setSelectedSensor(sensor)}
                >
                  <div className="relative">
                    <div className={cn(
                      "absolute -inset-4 md:-inset-6 rounded-full animate-ping-slow",
                      sensor.moisture > 40 ? 'bg-emerald-500/50' : 'bg-amber-500/50'
                    )} />
                    <div className={cn(
                      "w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-white shadow-2xl flex flex-col items-center justify-center transition-all",
                      sensor.moisture > 40 ? 'bg-emerald-600' : 'bg-amber-600'
                    )}>
                      <span className="text-[8px] md:text-[10px] font-black text-white leading-none">S{sensor.id}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="absolute top-4 left-4 md:top-6 md:left-6">
            <div className="glass px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 md:gap-3 bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-2xl">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
              SİSTEM ÇEVRİMİÇİ // KUŞBAKIŞI
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1 space-y-6">
          <AnimatePresence mode="wait">
            {selectedSensor ? (
              <motion.div
                key={selectedSensor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card shadow-2xl !bg-[var(--card-bg)]"
              >
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-2xl border shadow-lg flex items-center justify-center",
                    selectedSensor.moisture > 40 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  )}>
                    <MapPin size={24} className="md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg md:text-xl tracking-tight !text-[var(--text-primary)]">{selectedSensor.label}</h3>
                    <p className="text-[8px] md:text-[10px] font-black opacity-30 uppercase tracking-widest mt-0.5 !text-[var(--text-primary)]">ÜNİTE {selectedSensor.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {[
                    { label: 'Nem', value: `%${selectedSensor.moisture}`, icon: Droplets, color: 'text-blue-500' },
                    { label: 'Sıcaklık', value: `${selectedSensor.temp}°C`, icon: Thermometer, color: 'text-amber-500' },
                    { label: 'pH Seviyesi', value: selectedSensor.ph, icon: Heart, color: 'text-emerald-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 md:p-4 rounded-2xl bg-gray-500/5 border border-black/5 dark:border-white/5 group hover:bg-gray-500/10 transition-all">
                      <div className="flex items-center gap-3">
                        <item.icon size={16} className={cn(item.color, "group-hover:scale-110 transition-transform md:w-[18px] md:h-[18px]")} />
                        <span className="text-[10px] md:text-xs font-bold opacity-60 uppercase tracking-wide !text-[var(--text-primary)]">{item.label}</span>
                      </div>
                      <span className="font-black text-base md:text-lg !text-[var(--text-primary)]">{item.value}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 md:mt-8 py-4 md:py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                  Kalibre Et
                </button>
              </motion.div>
            ) : (
              <div className="glass-card min-h-[200px] flex flex-col items-center justify-center text-center p-8 md:p-12 !bg-[var(--card-bg)] shadow-xl">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gray-500/10 flex items-center justify-center mb-4 md:mb-6">
                  <Info size={32} className="opacity-50 md:w-10 md:h-10" style={{ color: 'var(--text-primary)' }} />
                </div>
                <h3 className="font-black text-[10px] md:text-sm uppercase tracking-widest mb-1 md:mb-2 !text-[var(--text-primary)]">Seçim Bekleniyor</h3>
                <p className="text-[10px] font-bold leading-relaxed !text-[var(--text-primary)] opacity-60">Bir sensör noktası seçin.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DetailedMap;
