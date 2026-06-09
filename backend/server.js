// Vercel Deployment Trigger: Gemini 3 Flash Update
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
// node-cron: Vercel serverless ortamında arka plan cron çalışmadığı için kullanılmıyor
const fetch = require('node-fetch'); // Vercel için statik require
require('pg'); // Vercel bundler'ının pg sürücüsünü atlamaması için ZORUNLU
require('pg-hstore'); 
const sequelize = require('./config/database');
const { Sensor, History, Recommendation, Log } = require('./models/index');

dotenv.config();

const app = express();
app.set('trust proxy', 1); // Vercel için proxy güvenliği

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Hız sınırını aştınız.' }
});

app.use(limiter);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// VERİTABANI BAĞLANTISI
// Not: Serverless ortamında (Vercel) her istekte sequelize.sync() çağırmak
// soğuk başlangıç (cold start) sürelerini uzatır ve zaman aşımına (Timeout) neden olarak
// FUNCTION_INVOCATION_FAILED (500) hatası fırlatır. Bu yüzden kaldırıldı.
// Veritabanı zaten yerel (local) ortamda çalıştırıldığında seed edildi.

// SERVERLESS DOSTU SİMÜLASYON FONKSİYONU
// Vercel'de arka planda cron çalışmadığı için, her istekte kontrol ederiz
const runSimulationUpdate = async () => {
  try {
    const lastSensor = await Sensor.findOne({ order: [['lastUpdate', 'DESC']] });
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    if (!lastSensor || lastSensor.lastUpdate < fiveMinutesAgo) {
      console.log('--- Serverless: Veriler Güncelleniyor ---');
      const sensors = await Sensor.findAll();
      for (const sensor of sensors) {
        const newTemp = parseFloat((Math.random() * (35 - 15) + 15).toFixed(1));
        const newMoisture = Math.floor(Math.random() * (80 - 30) + 30);
        const newPh = parseFloat((Math.random() * (7.5 - 5.5) + 5.5).toFixed(1));
        const newStatus = newMoisture < 40 ? 'warning' : 'good';

        await sensor.update({ temp: newTemp, moisture: newMoisture, ph: newPh, status: newStatus, lastUpdate: new Date() });
        await History.create({ sensorId: sensor.id, temp: newTemp, moisture: newMoisture, ph: newPh });
      }
    }
  } catch (err) {
    console.error('Simülasyon veya Veritabanı hatası:', err);
  }
};

// API V1 ROUTES
const router = express.Router();

router.get('/setup', async (req, res) => {
  const force = req.query.force === 'true';
  try {
    await sequelize.sync({ force });
    const sensorCount = await Sensor.count();
    if (sensorCount === 0 || force) {
      if (force) await Sensor.destroy({ where: {}, truncate: true });
      const sensors = await Sensor.bulkCreate([
        { label: 'Kuzey Mısır A-1', x: 15, y: 25, temp: 24, moisture: 65, ph: 6.2 },
        { label: 'Kuzey Mısır A-2', x: 35, y: 20, temp: 23, moisture: 68, ph: 6.4 },
        { label: 'Güney Buğday B-1', x: 48, y: 55, temp: 28, moisture: 45, ph: 5.8 },
        { label: 'Güney Buğday B-2', x: 65, y: 62, temp: 27, moisture: 42, ph: 5.9 },
        { label: 'Doğu Mısır C-1', x: 82, y: 35, temp: 22, moisture: 72, ph: 6.1 },
        { label: 'Batı Yonca D-1', x: 22, y: 75, temp: 25, moisture: 60, ph: 6.5 },
        { label: 'Merkez Sebze E-1', x: 50, y: 40, temp: 26, moisture: 55, ph: 6.3 },
        { label: 'Merkez Sebze E-2', x: 55, y: 48, temp: 25, moisture: 52, ph: 6.2 },
        { label: 'Kuzeybatı Arpa F-1', x: 12, y: 60, temp: 22, moisture: 58, ph: 6.0 },
        { label: 'Güneydoğu Mısır G-1', x: 88, y: 85, temp: 24, moisture: 70, ph: 6.6 }
      ]);

      // Grafiklerin dolu gözükmesi için geçmiş veri (History) oluştur
      const historyData = [];
      const now = new Date();
      sensors.forEach(s => {
        for (let h = 0; h < 50; h++) {
          historyData.push({
            sensorId: s.id,
            temp: 20 + Math.random() * 10,
            moisture: 40 + Math.random() * 40,
            ph: 6 + Math.random(),
            timestamp: new Date(now.getTime() - h * 1800000)
          });
        }
      });
      await History.bulkCreate(historyData);
    }
    res.json({ success: true, message: 'Database synced and seeded successfully.' });
  } catch (err) {
    console.error('Setup error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/dashboard/summary', async (req, res) => {
  await runSimulationUpdate(); // Verileri tazele
  try {
    const sensors = await Sensor.findAll();
    const activeAlerts = sensors.filter(s => s.moisture < 40).length;
    const avgMoisture = sensors.length > 0
      ? Math.round(sensors.reduce((sum, s) => sum + (s.moisture || 0), 0) / sensors.length)
      : 0;
    res.json({
      success: true,
      data: {
        totalFields: 4,
        activeAlerts,
        avgMoisture: `${avgMoisture}%`,
        overallHealth: activeAlerts === 0 ? '100%' : activeAlerts <= 2 ? '95%' : '80%',
        weather: { temp: '24.2°C', status: 'Güneşli' }
      }
    });
  } catch (err) {
    console.error('API Error (/dashboard/summary):', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/sensors/live', async (req, res) => {
  await runSimulationUpdate(); // Verileri tazele
  try {
    const sensors = await Sensor.findAll();
    res.json({ success: true, data: sensors });
  } catch (err) {
    console.error('API Error (/sensors/live):', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/sensors/history', async (req, res) => {
  const { sensorId } = req.query;
  try {
    const history = await History.findAll({
      where: sensorId ? { sensorId } : {},
      limit: 100, // Daha fazla veri getir
      order: [['timestamp', 'DESC']]
    });
    res.json({ success: true, data: history.reverse() });
  } catch (err) {
    console.error('API Error (/sensors/history):', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Vercel API is alive' });
});

router.get('/ai/recommendations', async (req, res) => {
  try {
    // Statik sahte tavsiyeler (Gelecekte Gemini'ye bağlanabilir)
    const mockRecommendations = [
      { id: 1, type: 'sulama', title: 'Sulama Önerisi', message: 'Kuzey Mısır A-1 parselinde nem %40 altına düştü. 15 dakika sulama başlatın.' },
      { id: 2, type: 'gubre', title: 'Gübre Optimizasyonu', message: 'Güney Buğday B-1 parselinde pH 5.8 (düşük). Kireçleme yapılması önerilir.' },
      { id: 3, type: 'hasat', title: 'Hasat Tahmini', message: 'Doğu Mısır C-1 parselinde sıcaklık eğilimi hasat için uygun görünüyor.' }
    ];
    res.json({ success: true, data: mockRecommendations });
  } catch (err) {
    console.error('API Error (/ai/recommendations):', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/ai/chat', async (req, res) => {
  const { messages } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('Hata: GEMINI_API_KEY tanımlanmamış!');
    return res.status(500).json({ success: false, error: 'Gemini API anahtarı eksik. Lütfen Vercel ayarlarını kontrol edin.' });
  }

  try {
    // Gemini Formatına Dönüştür
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contents })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return res.status(response.status).json({ success: false, error: data.error?.message || 'Gemini servisi hata verdi.' });
    }
    
    // Frontend'in beklediği OpenAI formatına geri dönüştür
    const formattedData = {
      choices: [{
        message: {
          content: data.candidates[0].content.parts[0].text
        }
      }]
    };
    
    res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error('API Error (/ai/chat):', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use('/api/v1', router);

// Sadece dosya doğrudan çalıştırıldığında (node server.js) portu dinle
// Vercel gibi serverless ortamlarda require('./server.js') yapıldığında app.listen ÇALIŞMAMALIDIR!
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[ATYS PostgreSQL] Server ${PORT} portunda çalışıyor...`);
  });
}

// Vercel Serverless Function için app'i dışa aktar
module.exports = app;
