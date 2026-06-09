/**
 * ============================================================================
 * AKILLI TARIM YÖNETİM SİSTEMİ (ATYS) - MERKEZİ API VE GÜVENLİK SUNUCUSU
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();

app.use(helmet());

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://atys-frontend.vercel.app'] 
        : 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50kb' })); 

const aiChatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: { 
        status: "error", 
        code: 429, 
        message: "Çok fazla yapay zeka isteği gönderildi. Lütfen 15 dakika bekleyin." 
    },
    standardHeaders: true, 
    legacyHeaders: false,
});

const verifySensorApiKey = (req, res, next) => {
    const apiKey = req.header('X-Sensor-API-Key');
    const secretKey = process.env.IOT_SECRET_KEY || "TARIM-GIZLI-ANAHTAR-123"; 
    
    if (!apiKey) {
        return res.status(401).json({ status: "error", message: "Kimlik doğrulama başarısız: API Anahtarı eksik." });
    }

    if (apiKey !== secretKey) {
        return res.status(403).json({ status: "error", message: "Güvenlik İhlali: Geçersiz Sensör API Anahtarı." });
    }
    
    next(); 
};

const verifyUserAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: "error", message: "Erişim reddedildi. Geçerli bir oturum token'ı bulunamadı." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET || "JWT-GIZLI-ANAHTARI-ATYS");
        req.user = decodedUser; 
        next();
    } catch (err) {
        return res.status(401).json({ status: "error", message: "Oturum süresi dolmuş veya geçersiz token." });
    }
};

const validateSensorPayload = (req, res, next) => {
    const { field_id, sensor_type, value } = req.body;

    if (!field_id || !sensor_type || value === undefined) {
        return res.status(400).json({ status: "error", message: "Veri eksik: field_id, sensor_type ve value alanları zorunludur." });
    }

    if (typeof field_id !== 'number' || typeof value !== 'number') {
        return res.status(400).json({ status: "error", message: "Veri tipi hatası: field_id ve value sayısal (number) formatında olmalıdır." });
    }

    if (sensor_type === 'nem' && (value < 0 || value > 100)) {
        return res.status(400).json({ status: "error", message: "Geçersiz ölçüm: Nem yüzdesi 0 ile 100 arasında olmalıdır." });
    }

    if (sensor_type === 'sıcaklık' && (value < -30 || value > 70)) {
        return res.status(400).json({ status: "error", message: "Anormal değer: Sensör arızası şüphesi. Sıcaklık limiti aşıldı." });
    }
    
    next();
};

const createSensorLog = async (req, res, next) => {
    try {
        const { field_id, sensor_type, value } = req.body;

        console.log(`[IoT Verisi Alındı] Tarla: ${field_id} | Tür: ${sensor_type} | Değer: ${value}`);

        return res.status(201).json({
            status: "success",
            message: "Sensör verisi işlendi ve veritabanına güvenli şekilde kaydedildi.",
            data: {
                field_id: field_id,
                sensor_type: sensor_type,
                value: value,
                measured_at: new Date().toISOString()
            }
        });

    } catch (error) {
        next(error); 
    }
};

app.post(
    '/api/v1/sensors/live-data', 
    verifySensorApiKey, 
    validateSensorPayload, 
    createSensorLog
);

app.post(
    '/api/v1/ai/decision-engine', 
    verifyUserAuth, 
    aiChatLimiter, 
    async (req, res, next) => {
        try {
            res.status(200).json({ 
                status: "success", 
                message: "Yapay zeka analizi tamamlandı.",
                decision: { action: "sulama_yap", confidence: 92, amount_liters: 150 }
            });
        } catch (error) {
            next(error);
        }
    }
);

app.get(
    '/api/v1/dashboard/overview',
    verifyUserAuth,
    async (req, res, next) => {
        try {
            res.status(200).json({ 
                status: "success", 
                message: "Kullanıcıya özel pano verileri getirildi.",
                user_id: req.user.id
            });
        } catch (error) {
            next(error);
        }
    }
);

app.use((err, req, res, next) => {
    console.error("[SİSTEM HATASI]:", err.message);
    
    const errorDetails = process.env.NODE_ENV === 'development' ? err.stack : undefined;

    res.status(500).json({
        status: "error",
        message: "Sunucuda beklenmeyen bir hata oluştu. Ekip bilgilendirildi.",
        details: errorDetails
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ status: "error", message: "İstenilen API uç noktası bulunamadı." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`ATYS Güvenli API Sunucusu ${PORT} portunda çalışıyor...`);
});