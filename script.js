/**
 * TerraNova - Akıllı Tarım Yönetim Paneli
 * JavaScript Dosyası (Çakışma Önleyici Güncelleme)
 */

// --- 1. MODAL VE KULLANICI KARŞILAMA SİSTEMİ ---
function kullaniciyiKarsila() {
    const modal = document.getElementById("welcome-modal");
    const input = document.getElementById("modal-input");
    const submitBtn = document.getElementById("modal-submit");
    const editBtn = document.getElementById("edit-name");

    let isim = localStorage.getItem("kullaniciAdi");

    if (!isim) {
        if (modal) modal.style.display = "flex";

        if (submitBtn) {
            submitBtn.onclick = function() {
                const yeniIsim = input.value.trim();
                if (yeniIsim) {
                    localStorage.setItem("kullaniciAdi", yeniIsim);
                    modal.style.display = "none";
                    arayuzuGuncelle(yeniIsim);
                } else {
                    alert("Lütfen bir isim giriniz.");
                }
            };
        }
    } else {
        if (modal) modal.style.display = "none";
        arayuzuGuncelle(isim);
    }

    // --- İSMİ DÜZENLE TUŞU (KESİN ÇÖZÜM) ---
    if (editBtn) {
        editBtn.onclick = (e) => {
            // Tıklamanın diğer butonlara (Uyarılar gibi) sıçramasını engeller
            e.preventDefault();
            e.stopPropagation();

            localStorage.removeItem("kullaniciAdi");
            location.reload(); // Sayfayı yenileyerek modalın gelmesini sağlar
        };
    }
}

function arayuzuGuncelle(isim) {
    const pageTitle = document.getElementById("page-title");
    const nameDisplay = document.getElementById("user-name");

    if (pageTitle) pageTitle.innerText = `Hoş Geldin, ${isim}`;
    if (nameDisplay) nameDisplay.innerText = isim;
}

// --- 2. API VE BAĞLANTI AYARLARI ---
const API_URL = "https://api-w5sp.onrender.com/son-durum";
const POMPA_URL = "https://api-w5sp.onrender.com/pompa-kontrol";

async function pompaSinyaliGonder(durum) {
    try {
        const response = await fetch(`${POMPA_URL}?durum=${durum}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        const durumYazisi = document.getElementById("pompa-durum");
        if (durumYazisi) {
            durumYazisi.innerText = durum ? "Açık" : "Kapalı";
            durumYazisi.style.color = durum ? "#27ae60" : "#e74c3c";
        }
    } catch (error) {
        console.error("Hata:", error);
    }
}

// --- 3. MENÜ GEÇİŞ MANTIĞI (SPA) ---
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
const pageTitleElem = document.getElementById('page-title');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');

        // Sadece geçerli bir hedefi olan linkleri işle
        if (!targetId) return;

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        sections.forEach(s => s.style.display = 'none');
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.style.display = 'block';

        const menuName = link.querySelector('span').innerText;
        if (pageTitleElem) pageTitleElem.innerText = menuName;
    });
});

// --- 4. VERİ ÇEKME ---
async function verileriGetir() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if(data) {
            if(document.getElementById("nem-degeri")) document.getElementById("nem-degeri").innerText = `%${data.nem}`;
            if(document.getElementById("sicaklik-degeri")) document.getElementById("sicaklik-degeri").innerText = `${data.sicaklik}°C`;
            if(document.getElementById("nem-bar")) document.getElementById("nem-bar").style.width = `${data.nem}%`;
            if(document.getElementById("table-nem")) document.getElementById("table-nem").innerText = `%${data.nem}`;
            if(document.getElementById("table-sicaklik")) document.getElementById("table-sicaklik").innerText = `${data.sicaklik}°C`;
            if(document.getElementById("table-time")) document.getElementById("table-time").innerText = new Date().toLocaleTimeString();
            if(window.tarimGrafik) updateChart(data.nem);
        }
    } catch (error) { console.error("Hata:", error); }
}

// --- 5. GRAFİK ---
let ctx = document.getElementById('analizGrafik');
if (ctx) {
    window.tarimGrafik = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Toprak Nemi (%)',
                data: [],
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
    });
}

function updateChart(nemDegeri) {
    const now = new Date().toLocaleTimeString();
    if (window.tarimGrafik.data.labels.length > 10) {
        window.tarimGrafik.data.labels.shift();
        window.tarimGrafik.data.datasets[0].data.shift();
    }
    window.tarimGrafik.data.labels.push(now);
    window.tarimGrafik.data.datasets[0].data.push(nemDegeri);
    window.tarimGrafik.update();
}

// --- 6. BAĞLANTI TESTİ ---
const btnReset = document.getElementById('btn-reset');
const apiUrlInput = document.getElementById('api-url-input');

if (btnReset) {
    btnReset.addEventListener('click', async () => {
        btnReset.innerText = "Bağlanılıyor...";
        btnReset.disabled = true;
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                btnReset.innerText = "Bağlantı Başarılı! ✅";
                btnReset.style.backgroundColor = "#27ae60";
                if (apiUrlInput) {
                    apiUrlInput.value = "AKTİF: " + API_URL;
                    apiUrlInput.style.color = "#27ae60";
                }
            } else { throw new Error(); }
        } catch (error) {
            btnReset.innerText = "Bağlantı Hatası! ❌";
            btnReset.style.backgroundColor = "#e74c3c";
            if (apiUrlInput) {
                apiUrlInput.value = "HATA: Sunucuya ulaşılamıyor.";
                apiUrlInput.style.color = "#e74c3c";
            }
        }
        setTimeout(() => {
            btnReset.innerText = "Bağlantıyı Test Et";
            btnReset.style.backgroundColor = "";
            btnReset.disabled = false;
        }, 3000);
    });
}

// --- 7. BAŞLATMA VE KRİTİK UYARILAR ---
document.addEventListener("DOMContentLoaded", () => {
    kullaniciyiKarsila();

    // Pompa Butonları
    const btnAc = document.getElementById("btn-pompa-ac");
    const btnKapat = document.getElementById("btn-pompa-kapat");
    if(btnAc) btnAc.onclick = () => pompaSinyaliGonder(true);
    if(btnKapat) btnKapat.onclick = () => pompaSinyaliGonder(false);

    // Kritik Uyarılar Modal Kontrolü
    const warningBtn = document.querySelector(".btn-warning");
    const warningModal = document.getElementById("warning-modal");
    const closeWarningBtn = document.getElementById("close-warning-btn");

    if (warningBtn && warningModal) {
        warningBtn.onclick = (e) => {
            e.stopPropagation();
            warningModal.style.display = "flex";
        };
    }

    if (closeWarningBtn) {
        closeWarningBtn.onclick = () => {
            warningModal.style.display = "none";
        };
    }

    verileriGetir();
    setInterval(verileriGetir, 5000);
});

// Geri Bildirim Modal Kontrolü
const feedbackBtn = document.getElementById("open-feedback-btn");
const feedbackModal = document.getElementById("feedback-modal");
const closeFeedbackBtn = document.getElementById("close-feedback-btn");

if (feedbackBtn && feedbackModal) {
    feedbackBtn.onclick = () => {
        feedbackModal.style.display = "flex";
    };
}

if (closeFeedbackBtn) {
    closeFeedbackBtn.onclick = () => {
        feedbackModal.style.display = "none";
    };
}

// Form Gönderildiğinde Modalı Kapat
const feedbackForm = document.getElementById("feedback-form");
if (feedbackForm) {
    feedbackForm.onsubmit = () => {
        setTimeout(() => {
            feedbackModal.style.display = "none";
            alert("Geri bildiriminiz için teşekkürler!");
        }, 500);
    };
}