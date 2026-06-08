// Vercel Deployment Trigger: Gemini 3 Flash Update
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
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

        await sensor.update({ temp: newTemp, moisture: newMoisture, ph: newPh, lastUpdate: new Date() });
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
    
    // Ortalama nem oranını dinamik olarak hesapla
    const avgMoisture = sensors.length 
      ? Math.round(sensors.reduce((acc, s) => acc + s.moisture, 0) / sensors.length) + '%' 
      : '60%';

    res.json({
      success: true,
      data: {
        totalFields: 4,
        activeAlerts: sensors.filter(s => s.moisture < 40).length,
        avgMoisture: avgMoisture,
        overallHealth: '95%',
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
    const sensors = await Sensor.findAll();
    const recommendations = [];
    let idCounter = 1;

    // Dinamik öneriler oluştur
    sensors.forEach(sensor => {
      const timeString = new Date(sensor.lastUpdate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      
      if (sensor.moisture < 45) {
        recommendations.push({
          id: idCounter++,
          type: 'sulama',
          priority: 'high',
          time: timeString,
          title: `${sensor.label} Sulama Önerisi`,
          message: `${sensor.label} parselinde nem oranı %${sensor.moisture} seviyesine düştü. 15 dakika sulama başlatılması önerilir.`,
          description: `${sensor.label} parselinde nem oranı %${sensor.moisture} seviyesine düştü. 15 dakika sulama başlatılması önerilir.`,
          status: 'pending'
        });
      }
      
      if (sensor.ph < 6.0) {
        recommendations.push({
          id: idCounter++,
          type: 'gubre',
          priority: 'medium',
          time: timeString,
          title: `${sensor.label} Gübre Desteği`,
          message: `${sensor.label} parselinde pH değeri ${sensor.ph} (düşük). Kireçleme veya alkali gübre uygulaması önerilir.`,
          description: `${sensor.label} parselinde pH değeri ${sensor.ph} (düşük). Kireçleme veya alkali gübre uygulaması önerilir.`,
          status: 'pending'
        });
      } else if (sensor.ph > 7.2) {
        recommendations.push({
          id: idCounter++,
          type: 'gubre',
          priority: 'medium',
          time: timeString,
          title: `${sensor.label} Toprak Dengeleme`,
          message: `${sensor.label} parselinde pH değeri ${sensor.ph} (yüksek). Kükürt veya asidik gübre uygulaması önerilir.`,
          description: `${sensor.label} parselinde pH değeri ${sensor.ph} (yüksek). Kükürt veya asidik gübre uygulaması önerilir.`,
          status: 'pending'
        });
      }

      if (sensor.temp > 28.0) {
        recommendations.push({
          id: idCounter++,
          type: 'hasat',
          priority: 'low',
          time: timeString,
          title: `${sensor.label} Hasat Hazırlığı`,
          message: `${sensor.label} parselinde sıcaklık ${sensor.temp}°C ile yüksek seviyede. Hasat olgunluğunu ve ürün kalitesini kontrol edin.`,
          description: `${sensor.label} parselinde sıcaklık ${sensor.temp}°C ile yüksek seviyede. Hasat olgunluğunu ve ürün kalitesini kontrol edin.`,
          status: 'pending'
        });
      }
    });

    // Eğer dinamik öneri çıkmadıysa varsayılan önerileri sun
    if (recommendations.length === 0) {
      recommendations.push(
        {
          id: idCounter++,
          type: 'sulama',
          priority: 'low',
          time: '09:00',
          title: 'Genel Sulama Takvimi',
          message: 'Tüm parsellerdeki nem seviyeleri stabil. Rutin sulama planına devam edebilirsiniz.',
          description: 'Tüm parsellerdeki nem seviyeleri stabil. Rutin sulama planına devam edebilirsiniz.',
          status: 'pending'
        },
        {
          id: idCounter++,
          type: 'gubre',
          priority: 'low',
          time: '10:30',
          title: 'Periyodik Toprak Analizi',
          message: 'Toprak pH ve mineral dengesi ideal düzeyde seyrediyor.',
          description: 'Toprak pH ve mineral dengesi ideal düzeyde seyrediyor.',
          status: 'pending'
        }
      );
    }

    res.json({ success: true, data: recommendations });
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

// YENİ ENDPOINTLER - SENSÖR CRUD VE SİSTEM LOGLARI

// 1. Tek Sensör Detayı ve Geçmiş Verileri
router.get('/sensors/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id);
    if (!sensor) {
      return res.status(404).json({ success: false, error: 'Sensör bulunamadı.' });
    }
    const history = await History.findAll({
      where: { sensorId: sensor.id },
      limit: 20,
      order: [['timestamp', 'DESC']]
    });
    res.json({ success: true, data: { sensor, history: history.reverse() } });
  } catch (err) {
    console.error('API Error (GET /sensors/:id):', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Yeni Sensör Ekleme
router.post('/sensors', async (req, res) => {
  const { label, x, y, temp, moisture, ph } = req.body;
  if (!label) {
    return res.status(400).json({ success: false, error: 'Sensör etiketi (label) alanı zorunludur.' });
  }
  try {
    const newSensor = await Sensor.create({
      label,
      x: x !== undefined ? parseFloat(x) : 50.0,
      y: y !== undefined ? parseFloat(y) : 50.0,
      temp: temp !== undefined ? parseFloat(temp) : 25.0,
      moisture: moisture !== undefined ? parseInt(moisture) : 60,
      status: 'good',
      ph: ph !== undefined ? parseFloat(ph) : 6.2,
      lastUpdate: new Date()
    });

    // Geçmiş verisi ve Log kaydı oluştur
    await History.create({
      sensorId: newSensor.id,
      temp: newSensor.temp,
      moisture: newSensor.moisture,
      ph: newSensor.ph
    });

    await Log.create({
      actionId: newSensor.id,
      status: `Yeni sensör oluşturuldu: ${newSensor.label}`,
      timestamp: new Date()
    });

    res.status(201).json({ success: true, data: newSensor });
  } catch (err) {
    console.error('API Error (POST /sensors):', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Sensör Bilgilerini Güncelleme
router.put('/sensors/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id);
    if (!sensor) {
      return res.status(404).json({ success: false, error: 'Sensör bulunamadı.' });
    }

    const { label, x, y, temp, moisture, ph, status } = req.body;
    
    await sensor.update({
      label: label !== undefined ? label : sensor.label,
      x: x !== undefined ? parseFloat(x) : sensor.x,
      y: y !== undefined ? parseFloat(y) : sensor.y,
      temp: temp !== undefined ? parseFloat(temp) : sensor.temp,
      moisture: moisture !== undefined ? parseInt(moisture) : sensor.moisture,
      ph: ph !== undefined ? parseFloat(ph) : sensor.ph,
      status: status !== undefined ? status : sensor.status,
      lastUpdate: new Date()
    });

    // Değerler güncellendiyse geçmişe kaydet
    if (temp !== undefined || moisture !== undefined || ph !== undefined) {
      await History.create({
        sensorId: sensor.id,
        temp: sensor.temp,
        moisture: sensor.moisture,
        ph: sensor.ph
      });
    }

    await Log.create({
      actionId: sensor.id,
      status: `Sensör güncellendi: ${sensor.label}`,
      timestamp: new Date()
    });

    res.json({ success: true, data: sensor });
  } catch (err) {
    console.error('API Error (PUT /sensors/:id):', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Sensör Silme
router.delete('/sensors/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id);
    if (!sensor) {
      return res.status(404).json({ success: false, error: 'Sensör bulunamadı.' });
    }

    const label = sensor.label;

    // İlişkili geçmiş verilerini sil
    await History.destroy({ where: { sensorId: sensor.id } });
    await sensor.destroy();

    await Log.create({
      actionId: req.params.id,
      status: `Sensör silindi: ${label}`,
      timestamp: new Date()
    });

    res.json({ success: true, message: 'Sensör ve geçmiş verileri başarıyla silindi.' });
  } catch (err) {
    console.error('API Error (DELETE /sensors/:id):', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Sistem Loglarını Getirme
router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.findAll({
      limit: 50,
      order: [['timestamp', 'DESC']]
    });
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error('API Error (GET /logs):', err);
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
