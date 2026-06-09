import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Loader2, Leaf, Droplets, Sun, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

const DetailedAIHub = ({ theme }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Merhaba Ümitcan! Ben ATYS Akıllı Tarım Asistanın. Tarlan, mahsul durumun veya sulama planın hakkında bana istediğin her şeyi sorabilirsin. Gemini 3 Flash destekli analizlerimle yanındayım.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://ak-ll-tar-m-ys.vercel.app/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            userMessage
          ]
        })
      });

      const result = await response.json();
      if (result.success && result.data.choices && result.data.choices.length > 0) {
        const botContent = result.data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: botContent }]);
      } else {
        const errorMsg = result.error || 'AI şu an yanıt veremiyor.';
        setMessages(prev => [...prev, { role: 'assistant', content: `Hata: ${errorMsg}` }]);
      }
    } catch (error) {
      console.error('AI API Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, şu an sunucu ile bağlantı kuramıyorum.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { title: 'Sulama Önerisi', icon: Droplets, query: 'Bu hafta için ideal sulama planı nedir?' },
    { title: 'Hastalık Analizi', icon: AlertTriangle, query: 'Mısır yapraklarındaki sararma ne anlama gelir?' },
    { title: 'Hasat Tahmini', icon: Leaf, query: 'Mevcut verilere göre hasat ne zaman yapılmalı?' },
    { title: 'Hava Durumu Etkisi', icon: Sun, query: 'Sıcak hava dalgası ürünlerimi nasıl etkiler?' },
  ];

  const isDarkMode = theme === 'dark';

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      <div className="px-2 md:px-0">
        <h2 className="text-2xl md:text-4xl font-black tracking-tighter flex items-center gap-2 !text-[var(--text-primary)]">
          AI Merkezi <Sparkles className="text-blue-500 w-5 h-5 md:w-8 md:h-8" />
        </h2>
        <p className="text-xs md:text-sm font-bold opacity-50 !text-[var(--text-primary)]">Gemini 3 Flash ile güçlendirilmiş tarım zekası.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 glass-card flex flex-col p-0 overflow-hidden shadow-2xl border-black/5 dark:border-white/10 min-h-[500px] md:min-h-0" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth bg-gray-500/[0.03]" ref={scrollRef}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
                    msg.role === 'assistant' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  )}>
                    {msg.role === 'assistant' ? <Bot size={16} className="md:w-5 md:h-5" /> : <User size={16} className="md:w-5 md:h-5" />}
                  </div>
                  <div className={cn(
                    "px-4 py-3 md:px-5 md:py-4 rounded-2xl md:rounded-3xl text-sm leading-relaxed shadow-sm border",
                    msg.role === 'assistant' 
                      ? "bg-white dark:bg-white/5 border-black/5 dark:border-white/10 !text-[var(--text-primary)]" 
                      : "bg-black text-white dark:bg-white dark:text-black font-semibold border-transparent shadow-lg"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex gap-3 md:gap-4 max-w-[80%]">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center animate-pulse border border-blue-500/20">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-3 md:px-5 md:py-4 rounded-2xl md:rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center gap-2 md:gap-3 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-50 !text-[var(--text-primary)]">Yazıyor...</span>
                </div>
              </div>
            )}
          </div>

          {/* THE INPUT BAR AREA */}
          <div 
            className="p-4 md:p-6 border-t border-black/10 dark:border-white/10" 
            style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff' }}
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tarlan hakkında sor..."
                className="w-full border border-black/10 dark:border-white/10 rounded-2xl px-4 py-4 md:px-6 md:py-5 pr-14 md:pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm font-bold shadow-inner"
                style={{ 
                  backgroundColor: isDarkMode ? '#000000' : '#f5f5f7',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 p-3 bg-blue-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg md:right-3 md:p-3.5"
              >
                <Send size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions Panel */}
        <div className="lg:col-span-1 space-y-4 pb-4 md:pb-0">
          <div className="glass-card shadow-sm !bg-[var(--card-bg)]">
            <h3 className="font-black text-[10px] mb-4 opacity-40 uppercase tracking-widest pl-1 !text-[var(--text-primary)]">Hızlı Sorular</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s.query)}
                  className="w-full p-3 md:p-4 rounded-2xl bg-gray-500/5 hover:bg-blue-500/10 border border-black/5 dark:border-white/5 hover:border-blue-500/30 transition-all text-left group"
                >
                  <s.icon className="text-blue-500 mb-2 transition-transform group-hover:scale-110 w-5 h-5 md:w-6 md:h-6" />
                  <p className="text-[10px] md:text-sm font-black tracking-tight !text-[var(--text-primary)]">{s.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAIHub;
