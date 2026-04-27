📄 Detaylı Sistem Analizi ve Veri Akış Dokümanı

Proje Adı: Terra Nova / Akıllı Tarım Yönetim Sistemi

Hazırlayan: Neva Yıldız (Proje Analisti / Developer)

Tarih: 17 Mart 2026

Öncelik Durumu: 🔴 Yüksek

Bu doküman, "Akıllı Tarım Yönetim Sistemi"nin kapsamını detaylandırmak, mevcut/hedeflenen durum arasındaki farkları ortaya koymak ve yazılım geliştirme ekibine rehberlik edecek veri akış şemasını ve olası sistem darboğazlarını tanımlamak amacıyla hazırlanmıştır.

1. Kapsam ve Sınırlar (Scope)
Kapsam İçi: Toprak nemi, sıcaklık ve hava durumu verilerinin anlık toplanması; bu verilerin PostgreSQL üzerinde yapılandırılmış olarak saklanması; TensorFlow ile eğitilmiş modeller üzerinden sulama/gübreleme tavsiyeleri üretilmesi; çiftçiler için Flask tabanlı web ve mobil arayüz geliştirilmesi.

Kapsam Dışı: Otonom traktörler veya dronlar ile fiziksel hasat yapılması; ürünlerin pazar satış fiyatlarının tahmini; tarım işçisi bordro yönetimi.

2. Detaylı Sistem Analizi
📉 Mevcut Durum (Geleneksel ve Reaktif Tarım)

Veri Toplama: Manuel ölçümler, görsel kontroller ve genel hava durumu raporlarına bağımlılık. Tarlanın farklı bölgelerindeki mikro-klima farklılıkları göz ardı edilmektedir.

Karar Alma Süreci: Çiftçinin geçmiş deneyimlerine dayalı, reaktif (sorun oluştuktan sonra müdahale eden) bir süreç işlemektedir.

Kaynak Kullanımı: Tüm tarlaya standart miktarda su ve gübre uygulanmaktadır. Bu durum, bazı bölgelerde toprağın yıkanmasına (israf), bazı bölgelerde ise yetersiz beslenmeye yol açmaktadır.

📈 Hedeflenen Durum (Proaktif ve Veri Odaklı Tarım)

Hassas Veri Toplama: Sahaya dağıtılmış IoT sensör ağı ile 7/24, bölgesel (bölge bölge) veriler toplanacaktır.

Kestirimci Karar Destek: TensorFlow modelleri geçmiş verileri ve anlık durumu birleştirerek kuraklık veya hastalık riskini önceden tahmin edecek ve optimum müdahale zamanını belirleyecektir.

Otomasyon ve Optimizasyon: Sadece ihtiyaç duyan bölgelere, tam gerektiği kadar su ve gübre verilecek; böylece hem verim artacak hem de çevresel sürdürülebilirlik sağlanacaktır.

3. Veri Yaşam Döngüsü ve Katmanlar Arası Etkileşim
Sistemdeki veri, donanımdan kullanıcı arayüzüne kadar 4 ana aşamadan geçer:

Üretim (IoT Katmanı): Sensörler belirli aralıklarla (örn. her 15 dakikada bir) analog veriyi okur ve dijital sinyale çevirir.

İletim ve Doğrulama (Backend API - Flask): Sensörlerden gelen JSON formatındaki veri paketleri Flask API'sine (REST) iletilir. API, verinin eksik veya hatalı olup olmadığını (validation) kontrol eder.

Depolama ve Analiz (PostgreSQL & TensorFlow): Geçerli veriler PostgreSQL veritabanına kaydedilir. Eş zamanlı olarak TensorFlow modeli bu yeni veriyi alıp önceden eğitilmiş ağırlıklarla (weights) karşılaştırarak bir tahmin (örn: "Önümüzdeki 6 saat içinde 3 numaralı bölgede sulama ihtiyacı: %85") üretir.

Sunum ve Aksiyon (Web/Mobil & Aktüatörler): Üretilen tahmin ve analiz sonuçları kullanıcı arayüzlerine aktarılır. Kullanıcı onay verirse (veya sistem tam otonom moddaysa), Backend üzerinden sahadaki su pompalarına (aktüatörlere) çalışma komutu gönderilir.

4. Olası Darboğazlar (Bottlenecks) ve Çözüm Önerileri
Geliştirme aşamasında ve canlı ortamda karşılaşabileceğimiz potansiyel riskler şunlardır:

Darboğaz 1: Kırsal Alanda İnternet Kesintileri

Risk: Sahadaki sensörlerin veriyi sunucuya iletememesi ve yapay zekanın kör kalması.

Çözüm: Sensörlerin bağlı olduğu ana panoda (Edge Gateway) yerel önbellekleme (local caching) yapılması. İnternet geldiğinde verilerin toplu olarak (batch) gönderilmesi.

Darboğaz 2: Veritabanı Şişmesi (Database Overload)

Risk: Binlerce sensörden saniyede bir veri gelmesi durumunda PostgreSQL'in yavaşlaması.

Çözüm: Sensörlerin veri gönderme frekansının (örn: 15 dakikada bir) optimize edilmesi ve eski verilerin aylık olarak arşivlenmesi (Data Archiving/Aggregation).

Darboğaz 3: Hatalı Sensör Verisinin Yapay Zekayı Yanıltması

Risk: Bozulan bir sensörün sürekli "toprak çok kuru" verisi gönderip sistemi gereksiz sulamaya zorlaması.

Çözüm: Backend katmanına bir "Anomali Tespit Algoritması" eklenmesi. Standart dışı, ani ve mantıksız sıçramalar gösteren sensör verilerinin devre dışı bırakılıp kullanıcıya arıza uyarısı (alert) gönderilmesi.

5. Veri Akış Şeması (Data Flow Diagram)
Aşağıdaki şema, ham verinin sisteme girişinden aksiyona dönüşmesine kadar olan süreci göstermektedir:

```mermaid
graph TD
    A[IoT Sensörleri] -->|Ham Veri| B(Flask Backend API)
    B -->|Filtrelenmiş Veri| C[(PostgreSQL Veritabanı)]
    C -->|Geçmiş Veriler| D{TensorFlow Yapay Zeka}
    B -->|Anlık Veri| D
    D -->|Optimizasyon Kararı| B
    B -->|Dashboard ve Uyarılar| E[Web ve Mobil Arayüz]
    E -.->|Manuel Komutlar| B
    B -->|Tetikleme Komutu| F[Su ve Gübre Pompaları]
    %% Renklendirmeler
    style IoT_Katmanı fill:#f1f8e9,stroke:#8bc34a,stroke-width:2px
    style Backend_Katmanı fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style Veri_Zeka_Katmanı fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style Arayuz_Katmanı fill:#fce4ec,stroke:#e91e63,stroke-width:2px
