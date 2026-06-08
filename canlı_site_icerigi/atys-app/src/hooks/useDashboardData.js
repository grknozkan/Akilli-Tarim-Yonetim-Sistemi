import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://ak-ll-tar-m-ys.vercel.app/api/v1';

export const useDashboardData = () => {
  const [data, setData] = useState({
    sensors: [],
    stats: [
      { id: 1, color: 'emerald', trend: '+0%', title: 'Sistem Sağlığı', value: '0%' },
      { id: 2, color: 'blue', trend: '0%', title: 'Ortalama Nem', value: '0%' },
      { id: 3, color: 'amber', trend: '0', title: 'Aktif Uyarılar', value: '0' }
    ],
    user: { name: 'Ümitcan', role: 'Admin' },
    weather: { temp: 24, condition: 'Güneşli' },
    sensorHistory: [],
    aiRecommendations: [],
    loading: true,
    error: null
  });

  const fetchDashboardData = async () => {
    try {
      // Fetching all necessary data
      const [sensorsRes, summaryRes, historyRes, aiRes] = await Promise.all([
        fetch(`${API_BASE_URL}/sensors/live`),
        fetch(`${API_BASE_URL}/dashboard/summary`),
        fetch(`${API_BASE_URL}/sensors/history`), // Tüm geçmişi getir
        fetch(`${API_BASE_URL}/ai/recommendations`)
      ]);

      const sensorsData = await sensorsRes.json();
      const summaryData = await summaryRes.json();
      const historyData = await historyRes.json();
      const aiData = await aiRes.json();

      if (sensorsData.success && summaryData.success) {
        // Grafikler için veriyi formatla (Son 15 veriyi al)
        const formattedHistory = (historyData.data || []).slice(-15).map(h => ({
          time: new Date(h.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          nem: h.moisture,
          sicaklik: h.temp
        }));

        setData(prev => ({
          ...prev,
          sensors: sensorsData.data,
          stats: [
            { id: 1, color: 'emerald', trend: '+1.2%', title: 'Sistem Sağlığı', value: summaryData.data.overallHealth || '95%' },
            { id: 2, color: 'blue', trend: '-0.5%', title: 'Ortalama Nem', value: summaryData.data.avgMoisture || '68%' },
            { id: 3, color: 'amber', trend: '+2', title: 'Aktif Uyarılar', value: summaryData.data.activeAlerts?.toString() || '0' }
          ],
          weather: summaryData.data.weather || { temp: 24, condition: 'Güneşli' },
          sensorHistory: formattedHistory.length > 0 ? formattedHistory : [
            { time: '08:00', nem: 60, sicaklik: 22 }, 
            { time: '12:00', nem: 55, sicaklik: 26 }, 
            { time: '16:00', nem: 58, sicaklik: 24 }
          ],
          aiRecommendations: aiData.data || [],
          analytics: {
            weeklyGrowth: [
              { day: 'Pzt', growth: 65, water: 40 },
              { day: 'Sal', growth: 70, water: 45 },
              { day: 'Çar', growth: 68, water: 38 },
              { day: 'Per', growth: 75, water: 50 },
              { day: 'Cum', growth: 82, water: 55 },
              { day: 'Cmt', growth: 80, water: 48 },
              { day: 'Paz', growth: 85, water: 52 }
            ],
            cropDistribution: [
              { name: 'Mısır', value: 45 },
              { name: 'Buğday', value: 30 },
              { name: 'Yonca', value: 15 },
              { name: 'Sebze', value: 10 }
            ]
          },
          loading: false,
          error: null
        }));
      }
    } catch (err) {
      console.error('API Fetch Hatası:', err);
      setData(prev => ({ ...prev, loading: false, error: 'API bağlantısı kurulamadı.' }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Her 30 saniyede bir verileri tazele
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return data;
};
