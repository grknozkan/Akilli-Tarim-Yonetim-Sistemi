import logging
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

# --- 1. SİSTEM KAYIT (LOGGING) AYARLARI ---
# Hataları ve işlemleri terminal ekranında görmek için
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# --- 2. API TANIMLAMASI ---
app = FastAPI(
    title="Akıllı Tarım Yönetim Sistemi API",
    description="Bu API, tarladaki sensör verilerini toplamak, izlemek ve cihazları yönetmek için geliştirilmiştir.",
    version="1.0.0"
)

# --- 3. CORS AYARI (Frontend bağlantısı için) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Tüm kaynaklardan gelen isteklere izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 4. 🛡️ GÜVENLİK KİLİDİ: API KEY KONTROLÜ ---
GIZLI_API_KEY = "UGPNK" # Bu şifreyi ESP32 veya sistemlerine eklemelisin

def guvenlik_kontrolu(x_api_key: str = Header(None)):
    if x_api_key != GIZLI_API_KEY:
        logging.warning("Yetkisiz bir cihaz sisteme erişmeye çalıştı!")
        raise HTTPException(status_code=401, detail="Erişim Reddedildi! Geçersiz veya eksik API Key.")
    return x_api_key

# --- 5. 🛡️ VERİ DOĞRULAMA MODELLERİ (Pydantic) ---
class TarlaVerisi(BaseModel):
    sensor_id: str
    nem: float = Field(..., ge=0, le=100, description="Toprak nem oranı (0-100 arası)")
    sicaklik: float = Field(..., ge=-40, le=80, description="Hava sıcaklığı (Celsius)")

# --- 6. GEÇİCİ VERİ DEPOSU ---
# Gerçek projede buralar bir veritabanına (PostgreSQL, MongoDB vb.) bağlanır.
tarla_durumu = {"sensor_id": "Veri Yok", "nem": 0.0, "sicaklik": 0.0}
pompa_aktif = False

# --- 7. UÇ NOKTALAR (ENDPOINTS) ---

# Ana Sayfa Yönlendirmesi
@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")


# Veri Gönderme (SADECE YETKİLİ CİHAZLAR İÇİN) - ASENKRON & HATA KORUMALI
@app.post("/veri-gonder", tags=["Sensör İşlemleri"], dependencies=[Depends(guvenlik_kontrolu)])
async def veri_al(veri: TarlaVerisi):
    global tarla_durumu

    try:
        # Sensörden gelen veriyi sisteme kaydet
        tarla_durumu = veri.dict()
        logging.info(f"Yeni veri işlendi - Sensör: {tarla_durumu['sensor_id']}, Nem: {tarla_durumu['nem']}")
        return {"durum": "basarili", "mesaj": "Veri sisteme güvenli bir şekilde işlendi."}

    except Exception as e:
        logging.error(f"Veri işlenirken beklenmeyen hata: {e}")
        raise HTTPException(status_code=500, detail="Sunucu içi hata oluştu, lütfen tekrar deneyin.")


# Son Durumu Okuma (MOBİL UYGULAMA İÇİN HERKESE AÇIK)
@app.get("/son-durum", response_model=TarlaVerisi, tags=["İzleme"])
async def durumu_getir():
    """
    Sistemdeki En Güncel Veriyi Getirir.
    """
    return tarla_durumu


# Pompa Kontrolü (SADECE YETKİLİ CİHAZLAR/KİŞİLER İÇİN) - ASENKRON & HATA KORUMALI
@app.post("/pompa-kontrol", tags=["Cihaz Kontrolü"], dependencies=[Depends(guvenlik_kontrolu)])
async def pompa_kontrol(durum: bool):
    global pompa_aktif

    try:
        pompa_aktif = durum
        mesaj = f"Pompa {'AÇILDI' if durum else 'KAPATILDI'}."
        logging.info(f"Cihaz Tetiklendi: {mesaj}")
        return {"durum": "basarili", "mesaj": mesaj}

    except Exception as e:
        logging.error(f"Pompa kontrolünde hata: {e}")
        raise HTTPException(status_code=500, detail="Cihaz komutu işlenemedi.")