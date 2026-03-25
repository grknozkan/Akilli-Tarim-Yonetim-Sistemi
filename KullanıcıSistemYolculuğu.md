TERRA NOVA: UÇTAN UCA KULLANICI YOLCULUĞU RAPORU
Hazırlayan: Avşin Pelin Bilgiç
Proje: Akıllı Tarım Yönetim Sistemi (ATYS)
👤 Persona (Kullanıcı Profili)
Sistemimizin ana kullanıcısı; orta veya büyük ölçekli tarım arazisine sahip, üretim verimliliğini artırmak ve maliyetleri azaltmak isteyen çiftçi veya tarım işletmesi yöneticisidir.
________________________________________
🌱 1. Başlangıç – Sisteme Katılım (Onboarding)
Kullanıcı, ATYS platformuna web paneli veya mobil uygulama üzerinden kayıt olur.
Kayıt sürecinde:
•	Tarla bilgileri (konum, büyüklük, ürün türü) 
•	Kullanılan ekipmanlar 
•	Sulama altyapısı 
gibi temel bilgiler sisteme girilir.
Ardından sistem:
•	IoT sensörlerini (toprak nemi, pH, sıcaklık vb.) tanımlar 
•	Sensörleri veri akışına dahil eder 
👉 Bu aşamada kullanıcı henüz pasiftir, sistem veri toplamaya başlar.
________________________________________
📡 2. Veri Toplama ve İzleme
Sahadaki sensörler sürekli olarak veri üretir:
•	Toprak nemi 
•	Hava sıcaklığı 
•	pH ve NPK değerleri 
•	Meteorolojik veriler 
Bu veriler:
•	Ön işleme tabi tutulur 
•	PostgreSQL veritabanında saklanır 
Kullanıcı:
•	Web paneli üzerinden grafiklerle verileri izler 
•	Mobil uygulamadan anlık durumu kontrol eder 
👉 Kullanıcı artık sistemi gözlemleyen aktif bir izleyici haline gelir.
________________________________________
🧠 3. Yapay Zeka Analizi ve Karar Üretimi
Toplanan veriler, TensorFlow tabanlı modeller tarafından analiz edilir.
Sistem:
•	Geçmiş veriler + anlık verileri birleştirir 
•	En uygun: 
o	Sulama zamanı 
o	Gübreleme miktarı 
o	İlaçlama ihtiyacını hesaplar 
Ayrıca:
•	Don riski 
•	Kuraklık eğilimi
gibi durumları önceden tahmin eder. 
👉 Bu aşamada sistem, kullanıcı yerine düşünmeye başlar (karar destek rolü).
________________________________________
🚨 4. Bildirim ve Uyarı Deneyimi
Kritik bir durum oluştuğunda:
•	Mobil uygulamaya anlık bildirim (push notification) gönderilir 
•	Web panelinde uyarı gösterilir 
Örnek:
•	“Toprak nemi kritik seviyenin altında” 
•	“Don riski tespit edildi” 
Kullanıcı:
•	Uyarıyı inceleyebilir 
•	Önerilen aksiyonu kabul edebilir veya değiştirebilir 
👉 Kullanıcı artık sistemle etkileşim halindedir.
________________________________________
⚙️ 5. Otonom Müdahale ve Kontrol
Belirli senaryolarda sistem:
•	Sulama sistemini otomatik açar 
•	Gübreleme sürecini başlatır 
•	Havalandırma sistemlerini devreye sokar 
Ancak kullanıcı isterse:
•	Web panelinden manuel override yapabilir 
•	Otomatik kararı iptal edebilir 
👉 Bu aşama “insan + yapay zeka iş birliği” noktasıdır.
________________________________________
📊 6. Performans Takibi ve Optimizasyon
Zamanla sistem:
•	Ürün verimini analiz eder 
•	Su ve gübre kullanımını raporlar 
•	Geçmiş kararların başarısını değerlendirir 
Kullanıcı:
•	Dashboard üzerinden: 
o	Verim artışı 
o	Kaynak tasarrufu 
o	Sistem performansı
verilerini izler 
👉 Kullanıcı artık veri odaklı kararlar alabilen bir operatöre dönüşür.
________________________________________
🔄 7. Süreklilik ve Ölçekleme
Sistem:
•	Yeni sensörler eklenmesine izin verir 
•	Farklı tarlalara genişleyebilir 
•	Binlerce sensörü yönetebilir 
Kullanıcı:
•	Yeni alanları sisteme entegre eder 
•	Tek panelden tüm operasyonu yönetir 
👉 Bu aşama sistemin uzun vadeli değerini gösterir.
________________________________________
🎯 Özet Akış (Kısa User Journey)
1.	Kayıt olur → tarla bilgilerini girer 
2.	Sensörler veri toplamaya başlar 
3.	Kullanıcı verileri izler 
4.	Yapay zeka analiz yapar 
5.	Sistem öneri/uyarı verir 
6.	Otomatik veya manuel müdahale yapılır 
7.	Performans raporları incelenir 
8.	Sistem büyütülür ve optimize edilir
![alt text](mermaid-diagram.png)