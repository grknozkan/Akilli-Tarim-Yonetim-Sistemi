import { GoogleGenerativeAI } from "@google/generative-ai";

// API anahtarını .env dosyasından alıyoruz
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Sensör verilerini analiz edip karar üreten ana fonksiyon
 * @param {Object} fieldData - Tarla ve ürün bilgileri (örn: { crop_type: "Mısır" })
 * @param {Object} sensorData - Anlık ölçümler (örn: { moisture: 30, temperature: 32 })
 */
async function generateIrrigationDecision(fieldData, sensorData) {
    try {
        // Gemini 1.5 Flash modeli hızlı analizler için idealdir
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Sisteme katı bir JSON formatı dayatan prompt
        const prompt = `
        Sen profesyonel bir tarım karar destek sistemisin.
        Aşağıdaki sensör verilerini ve ürün tipini analiz ederek sulama yapılıp yapılmaması gerektiğine karar ver.
        
        Gelen Veriler:
        - Ürün Tipi: ${fieldData.crop_type}
        - Toprak Nemi: %${sensorData.moisture}
        - Hava Sıcaklığı: ${sensorData.temperature}°C
        
        Kararını SADECE aşağıdaki JSON formatında döndür. Dışında hiçbir metin, markdown (```json) veya açıklama ekleme:
        {
            "prediction_type": "sulama",
            "decision": true veya false,
            "confidence": 0 ile 100 arasında analizine güven yüzden,
            "amount": eğer sulama gerekiyorsa litre/metrekare cinsinden miktar (gerekmiyorsa 0),
            "reason": "Kararının teknik ve kısa bir mantığı"
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Gelen metni temizleyip JSON objesine çeviriyoruz
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const decisionData = JSON.parse(cleanJsonString);

        return decisionData;

    } catch (error) {
        console.error("Yapay Zeka Karar Algoritması Hatası:", error);
        return null;
    }
}
// Örnek Kullanım Senaryosu
async function runSystemCycle() {
    const field = { crop_type: "Mısır" };
    const currentSensors = { moisture: 25, temperature: 34 }; // Nem düşük, sıcaklık çok yüksek

    console.log("Yapay Zeka Analizi Başlatılıyor...");
    const aiDecision = await generateIrrigationDecision(field, currentSensors);

    if (aiDecision) {
        console.log("Karar Çıktısı:", aiDecision);
        /* 
          Konsol Çıktısı Örneği:
          {
            prediction_type: "sulama",
            decision: true,
            confidence: 95,
            amount: 15,
            reason: "Mısır için %25 nem çok düşük ve 34°C sıcaklıkta buharlaşma yüksek olacağından acil sulama gereklidir."
          }
        */

        // 1. AI Predictions Tablosuna Yazma:
        // ai_predictions.create({ field_id: 1, prediction_type: aiDecision.prediction_type, confidence: aiDecision.confidence })

        // 2. Eğer karar 'true' ise Actions Tablosuna Yazma ve Sistemi Tetikleme:
        if (aiDecision.decision === true) {
             // actions.create({ field_id: 1, action_type: "sulama", amount: aiDecision.amount, executed_by: "system" })
             // console.log("Fiziksel su pompalarına sinyal gönderiliyor...");
        }
    }
}

runSystemCycle();
