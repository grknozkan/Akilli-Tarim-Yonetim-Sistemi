# 🚜 Akıllı Tarım Yönetim Sistemi (ATYS) - Proje Final Raporu

**Tarih:** Mayıs 2026

**Proje Durumu:** ✅ Tamamlandı 

**Ekip:** Gürkan Özkan (SM), Neva Yıldız, Ümitcan Çınar, Mehmet Kerem Küçük, Avşin Pelin Bilgiç

---

## 1. Proje Genel Bakış ve Kapsam
Bu proje; modern tarım tekniklerini teknolojiyle birleştirerek verimliliği artırmayı hedefleyen, uçtan uca bir yönetim sistemidir. Sistem; sensör verilerinin toplanması, bulut mimarisi üzerinden işlenmesi, yapay zeka ile analiz edilmesi ve kullanıcıya interaktif arayüzlerle sunulması aşamalarını kapsar.

## 2. Proje Ekibi ve Sorumluluk Matrisi

| İsim | Rol | Ana Sorumluluk Alanları |
| :--- | :--- | :--- |
| **Gürkan Özkan** | Scrum Master | Sistem Mimarisi, API Entegrasyon Testleri, Ekip Yönetimi. |
| **Neva Yıldız** | Developer | Veritabanı Tasarımı, DB Optimizasyonu, Veri Akış Şemaları. |
| **Ümitcan Çınar** | Developer | UI/UX Tasarımı, Kullanıcı Hikayeleri, Arayüz Test Senaryoları. |
| **Mehmet Kerem Küçük** | Developer | Geliştirme Ortamı Kurulumu, API Tasarımı ve Altyapı. |
| **Avşin Pelin Bilgiç** | Developer | Kullanıcı Deneyimi (User Journey), Akış Diyagramları, Güvenlik Testleri. |

---

## 3. Haftalık Gelişim Süreci (Yol Haritası Özeti)

### 📍 Faz 1: Analiz ve Altyapı (1. - 2. Hafta)
* **Organizasyon:** GitHub reposu ve branch kuralları belirlendi. Ekibe iş akışı ve araç (Scrum/İletişim) eğitimleri verildi.
* **Gereksinim Analizi:** Fonksiyonel ve fonksiyonel olmayan gereksinimler belirlendi. Sistemin 5 katmanlı yapısı (ESP32, LoRaWAN, AWS, Flutter vb.) Gürkan Özkan tarafından tasarlandı.
* **Analiz ve Modelleme:** Neva Yıldız ve Avşin Pelin Bilgiç tarafından veri akış şemaları, flowchartlar ve kullanıcı yolculukları (User Journey) oluşturularak projenin teknik rotası çizildi.
* **API Başlangıcı:** Mehmet Kerem Küçük tarafından API sistemi tasarlandı ve geliştirme ortamı (IDE) hazırlandı.

### 📍 Faz 2: Tasarım ve Mimari (3. Hafta)
* **Veritabanı Katmanı:** Neva Yıldız, projenin kalbi olan ilişkisel veritabanı şemasını oluşturdu ve dokümante etti.
* **Arayüz Tasarımı:** Ümitcan Çınar, web tabanlı saha izleme panelinin wireframe tasarımlarını hazırladı. İnteraktif harita ve yapay zeka asistan paneli gibi kritik bileşenler kurgulandı.

### 📍 Faz 3: Geliştirme, Optimizasyon ve Test (5. Hafta)
* **Veritabanı Performansı:** Neva Yıldız, mevcut yapıyı optimize ederek veritabanı entegrasyonunu tamamladı ve test ortamında doğruladı.
* **Güvenlik:** Avşin Pelin Bilgiç, JWT ve SQL Injection gibi tehditlere karşı 32 maddelik kapsamlı bir güvenlik test senaryosu hazırladı.
* **Kullanıcı Deneyimi Doğrulama:** Ümitcan Çınar, arayüzün doğruluğunu ölçmek için 13 maddelik UI test planı geliştirdi.
* **API Entegrasyonu:** Gürkan Özkan, API uç noktalarını (Lavyer12 vb.) test ederek başarılı entegrasyonu raporladı ve geliştiriciler için örnek Python scriptleri hazırladı.

---

## 4. Teknik Başarılar ve Kazanımlar

### 🛠️ Sistem Mimarisi ve Güvenlik
* **Hibrit Teknoloji Yığını:** LoRaWAN ve AWS entegrasyonu ile geniş alanlarda düşük güç tüketimli veri iletimi planlanmıştır.
* **Güvenlik Odaklılık:** OWASP ZAP ve SQLmap gibi araçlarla test edilen, güvenliği önceliklendiren bir yapı kurulmuştur.

### 📊 Veritabanı ve API Performansı
* **Yüksek Ölçeklenebilirlik:** Optimize edilmiş PostgreSQL yapısı sayesinde binlerce sensörden gelen verinin eş zamanlı işlenmesi sağlanmıştır.
* **API Standartları:** `200 OK` yanıt süreleri optimize edilmiş, hata kodları dokümante edilmiş profesyonel bir API altyapısı oluşturulmuştur.

### 🎨 Kullanıcı Deneyimi (UI/UX)
* **Veri Görselleştirme:** Saha verileri, interaktif haritalar ve grafiklerle çiftçiler için anlaşılır bir yönetim paneline dönüştürülmüştür.

---

## 5. Sonuç
Akıllı Tarım Yönetim Sistemi (ATYS), ilk haftasından son haftasına kadar planlı bir Scrum süreciyle yönetilmiştir. Analizden teste kadar her aşama dokümante edilerek sürdürülebilir bir proje ortaya konmuştur. Bu sistem, sadece bugünkü ihtiyaçları değil, gelecekteki yapay zeka geliştirmelerini de destekleyecek modüler bir yapıya sahiptir.
