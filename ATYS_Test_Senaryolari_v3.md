# ATYS – Test Senaryoları
**Sorumlu:** Avşin Pelin Bilgiç | **Sprint:** Hafta 4 | **Son Teslim:** 7 Mayıs 2026

---

## 1. IoT Sensör & Veri Toplama

| ID | Test Adı | Ön Koşul | Yapılan İşlem | Beklenen Sonuç |
|---|---|---|---|---|
| TS-IOT-01 | Normal Veri Akışı | ESP32 ve LoRaWAN aktif | ESP32 başlatılır, sensör değerleri (nem, sıcaklık, pH) okunur ve AWS'e gönderilir | Veri ≤ 2 saniyede AWS'e ulaşır, paket kaybı olmaz |
| TS-IOT-02 | Çevrimdışı Sensör Tespiti | 2 ESP32 aktif | Bir ESP32'nin güç kablosu çekilir, 60 saniye beklenir | Sensör arayüzde gri renk ve "Çevrimdışı" etiketiyle gösterilir |
| TS-IOT-03 | Aşırı Değer Anomali | Sistem aktif | Sıcaklık sensörüne 85°C değeri gönderilir (normal: 0–50°C) | Anomali log'a yazılır, kullanıcıya push bildirim gönderilir |
| TS-IOT-04 | İnternet Kesilmesi | Raspberry Pi çalışıyor | Raspberry Pi'nin internet bağlantısı 5 dakika kesilir, sonra açılır | Kesinti süresindeki tüm veriler bağlantı gelince kayıpsız AWS'e aktarılır |
| TS-IOT-05 | Çoklu Sensör Eş Zamanlı | 5 ESP32 aynı gateway'e bağlı | 5 ESP32 aynı anda başlatılır | Her sensörün verisi doğru Device ID ile ayrı ayrı kaydedilir, çakışma olmaz |

---

## 2. Yapay Zeka Karar Sistemi

| ID | Test Adı | Ön Koşul | Yapılan İşlem | Beklenen Sonuç |
|---|---|---|---|---|
| TS-AI-01 | Otomatik Sulama – Düşük Nem | Eşik %30, yağmur tahmini yok | Nem değeri %28 olarak gönderilir, 5 dakika beklenir | Sulama vanası açılır, "Otomatik sulama başladı" bildirimi gönderilir |
| TS-AI-02 | Yaklaşan Yağış – Sulama İptal | Nem %25, hava API mock'u hazır | API 2 saat içinde %80 yağmur olasılığı döndürecek şekilde ayarlanır | Sulama yapılmaz, "Yağış bekleniyor, sulama iptal edildi" bildirimi gönderilir |
| TS-AI-03 | Don Riski Erken Uyarısı | Meteoroloji API entegre | API 36 saat sonrası için -3°C don tahmini döndürür | SMS ve push bildirim yüksek öncelikle gönderilir |
| TS-AI-04 | Hastalık Tespiti – Geçerli Görüntü | Model çalışıyor | 8 MB JPG hastalıklı yaprak görseli yüklenir | 10 saniye içinde 3 hastalık güven skorlarıyla listelenir (örn. %78 Mildiyö) |
| TS-AI-05 | Hastalık Tespiti – Geçersiz Dosya | Model çalışıyor | 12 MB PNG ve ardından PDF yüklenmeye çalışılır | Her ikisi de açık hata mesajıyla reddedilir, sistem çökmez |
| TS-AI-06 | Model Gecikme Testi | Sistem tam yük altında | Sensörden veri gönderilir, kararın üretilme süresi 10 kez ölçülür | Ortalama süre ≤ 3 saniye, hiçbir tekil test 5 saniyeyi geçmez |

---

## 3. Mobil Uygulama (Flutter)

| ID | Test Adı | Ön Koşul | Yapılan İşlem | Beklenen Sonuç |
|---|---|---|---|---|
| TS-MOB-01 | Dashboard Yükleme | Çiftçi hesabı mevcut, sensörler aktif | Uygulamaya giriş yapılır, dashboard açılır | ≤ 2 saniyede yüklenir, son 15 dakikanın nem/sıcaklık/pH verileri grafiksel gösterilir |
| TS-MOB-02 | Acil Durdurma Butonu | Sulama aktif, en az 1 vana açık | "Acil Durdurma" butonuna basılır, onay verilir | ≤ 5 saniyede tüm vanalar kapanır, otomasyon 24 saat askıya alınır, bildirim gönderilir |
| TS-MOB-03 | Offline Mod | Veriler daha önce yüklenmiş | Uçak modu açılır, uygulama kapatılıp açılır, sonra uçak modu kapatılır | Çevrimdışıyken önbellek gösterilir, bağlantı gelince otomatik güncellenir |
| TS-MOB-04 | Push Bildirim | Bildirim izni verilmiş, uygulama arka planda | Don uyarısı tetiklenir | ≤ 10 saniyede bildirim cihaza düşer, tıklandığında uyarı ekranını açar |
| TS-MOB-05 | Manuel Sulama | Çiftçi girişi yapılmış | Tarla seçilir, 30 dakika manuel sulama başlatılır | Sulama başlar, tam 30 dakika sonra otomatik durur, log'a yazılır |

---

## 4. Web Yönetim Paneli

| ID | Test Adı | Ön Koşul | Yapılan İşlem | Beklenen Sonuç |
|---|---|---|---|---|
| TS-WEB-01 | Dashboard Yükleme | Yönetici girişi yapılmış, sensörler aktif | Dashboard sayfası açılır | ≤ 3 saniyede yüklenir, metrikler + harita + sensör tablosu eksiksiz görünür |
| TS-WEB-02 | Arızalı Sensör – Harita | Harita yüklenmiş, 1 sensör aktif | Sensörün güç bağlantısı kesilir, harita yenilenir | Arızalı sensörün işaretçisi kırmızıya döner, tıklanınca detay paneli açılır |
| TS-WEB-03 | Arama Çubuğu | 5+ sensör kayıtlı | "ESP32-007" aranır, ardından "XYZ999" aranır | Geçerli ID ilgili sayfaya yönlendirir, geçersiz ID "Sonuç bulunamadı" gösterir |
| TS-WEB-04 | Haftalık Grafik | 7+ günlük veri mevcut | Grafik incelenir, tarih filtresi "Son 30 gün" yapılır | Grafik doğru veriyi gösterir, filtre değişince dinamik olarak güncellenir |
| TS-WEB-05 | Hasat Raporu Dışa Aktarma | Ocak–Mart 2025 verisi mevcut | Tarih aralığı seçilir, Excel ve PDF olarak indirilir | Her iki format da açılabilir ve seçilen dönemin verilerini içerir |

---

## 5. Veritabanı

| ID | Test Adı | Ön Koşul | Yapılan İşlem | Beklenen Sonuç |
|---|---|---|---|---|
| TS-DB-01 | Sensör Verisi Kayıt Doğruluğu | ESP32 ve InfluxDB aktif | ESP32'den nem: %42, sıcaklık: 23.5°C gönderilir, InfluxDB sorgulanır | Değerler doğru Device ID ve UTC zaman damgasıyla kayıtlıdır |
| TS-DB-02 | Kullanıcı Kaydı ve Rol Atama | PostgreSQL aktif | Yeni çiftçi kullanıcısı oluşturulur, aynı e-postayla tekrar kayıt denenir | Kullanıcı `farmer` rolü ve hashlenmiş şifreyle eklenir, ikinci kayıt reddedilir |
| TS-DB-03 | Sulama Log Kaydı | irrigation_logs tablosu hazır | Otomatik sulama ve ardından acil durdurma tetiklenir | Her iki olay da tarih, gerekçe ve vana bilgisiyle log'a yazılır |
| TS-DB-04 | Yabancı Anahtar Kısıtı | Foreign key tanımlı | Var olmayan tarla ID'siyle sensör eklenmek istenir; sensörü olan tarla silinmeye çalışılır | Her iki işlem de veritabanı tarafından reddedilir |
| TS-DB-05 | Büyük Veri Sorgusu | InfluxDB'de 100.000 kayıt mevcut | Son 30 günlük ortalama nem sorgusu 5 kez çalıştırılır | Ortalama sorgu süresi ≤ 2 saniye |

---

## 6. Uçtan Uca Entegrasyon

| ID | Test Adı | Kapsam | Yapılan İşlem | Beklenen Sonuç |
|---|---|---|---|---|
| TS-E2E-01 | Tam Sulama Döngüsü | IoT → YZ → API → Mobil → Web → DB | Nem %25'e düşürülür, tüm zincir izlenir | Nem düşüşünden bildirime kadar ≤ 5 saniye, her adım log'a yazılır |
| TS-E2E-02 | Acil Durdurma Tam Akışı | Mobil → API → IoT → Web → DB | Sulama aktifken mobil'den acil durdurma yapılır, tüm sistem izlenir | ≤ 5 saniyede tüm vanalar kapanır, web güncellenir, log'a yazılır |

---

*Terra Nova ATYS · Hafta 4 · 7 Mayıs 2026*
