# ⚡ Veritabanı Sorgu Optimizasyonu ve Performans Testi Raporu

**Görev Sorumlusu:** Neva Yıldız

**Tarih:** 4 Mayıs 2026

**Proje Adı:** Akıllı Tarım Yönetim Sistemi

Bu doküman, sistemdeki veritabanı sorgularının hızlandırılması, ağır yük altında sistem performansının test edilmesi ve tespit edilen darboğazların (bottlenecks) giderilmesi süreçlerini detaylandırmaktadır.

---

## 1. Veritabanı Sorgu Optimizasyonları (Query Optimization)

Flask ve SQLAlchemy (ORM) kullanılarak yapılan veritabanı işlemlerinde tespit edilen yavaşlıklar, sorgu düzeyinde optimize edilmiştir.

### A. "N+1 Sorgu" Probleminin Çözümü
**Sorun:** Tarlalar (`fields`) listelenirken, her bir tarla için o tarlaya ait sensörlerin (`sensors`) ayrı ayrı veritabanından çekilmesi (Lazy Loading), 100 tarla için 101 adet veritabanı sorgusuna neden oluyordu.
**Çözüm:** SQLAlchemy üzerinde `joinedload` (Eager Loading) kullanılarak tüm veriler tek bir SQL `JOIN` sorgusuna indirgendi.

```python
# ❌ Eski Yavaş Sorgu (Lazy Load)
fields = Field.query.all() # 1 sorgu
for field in fields:
    print(field.sensors) # Her döngüde +1 sorgu fırlatır!

# ✅ Yeni Optimize Sorgu (Eager Load)
from sqlalchemy.orm import joinedload
fields = Field.query.options(joinedload(Field.sensors)).all() # Toplam sadece 1 sorgu
```

### B. Ağır Analitik Sorgular İçin "Materialized View" Kullanımı
**Sorun:** Gösterge paneli (Dashboard) açıldığında, yapay zeka modelini beslemek için son 30 günün nem ortalamalarının `sensor_data` tablosundaki milyonlarca satır üzerinden her seferinde yeniden hesaplanması sistemi kilitliyordu.
**Çözüm:** PostgreSQL tarafında günlük ortalamaları önceden hesaplayıp tutan bir `MATERIALIZED VIEW` oluşturuldu ve sistem yükü %85 oranında azaltıldı.

---

## 2. Performans Testleri ve Yük Simülasyonu

Sistemin gerçek koşullardaki sınırlarını görmek için özel test senaryoları koşulmuştur.

* **Test Aracı:** Locust (API Yük Testi) ve `EXPLAIN ANALYZE` (SQL Planlama Testi)
* **Senaryo:** 10.000 adet IoT sensörünün, aynı saniye içerisinde API'ye veri göndermesi (Spike Test).

### Tespit Edilen Darboğazlar ve Uygulanan Yamalar

| 🛑 Tespit Edilen Darboğaz | 🔍 Nedeni | ✅ Uygulanan Çözüm |
| :--- | :--- | :--- |
| **Yavaş Veri Yazma (Insert Rate Limit)** | Sensör verilerinin veritabanına tek tek (satır satır) kaydedilmesi (`db.session.add()`), I/O (Girdi/Çıktı) darboğazı yarattı. | Veriler hafızada toplanıp `db.session.bulk_insert_mappings()` metodu ile toplu halde (Batch Insert) yazılmaya başlandı. Yazma hızı 10 kat arttı. |
| **Büyük Veri Kümelerinde Sayfalama Yavaşlığı** | API üzerinden eski sensör verileri listelenirken `OFFSET` komutunun kullanılması, tablo büyüdükçe sorgu süresini uzattı. | Geleneksel sayfalama (Offset/Limit) yerine, son alınan verinin ID'sini referans alan **Keyset (Cursor) Pagination** sistemine geçildi. |

---

## 3. Test Sonuçları (Metrikler)

Optimizasyon öncesi ve sonrası ölçülen ortalama yanıt süreleri (Response Times):

* **Sensör Verisi Ekleme (POST):** 120 ms ➡️ **15 ms**
* **Kullanıcı/Tarla Dashboard Yüklenmesi (GET):** 850 ms ➡️ **45 ms**
* **Yapay Zeka Geçmiş Veri Okuması:** 2.3 saniye ➡️ **0.2 saniye**

**Sonuç Analizi:** Yapılan indekslemeler, sorgu iyileştirmeleri ve toplu işlem (batching) mimarisi sayesinde sistem, öngörülen en yüksek tarım sezonu yükünü (Peak Load) darboğaz yaşamadan kaldırabilecek seviyeye getirilmiştir.
