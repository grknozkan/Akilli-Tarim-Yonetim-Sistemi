/**
 * Sensör API Test Senaryoları
 * Test çalıştırma: npx jest tests/sensor.test.js
 */

const request = require('supertest');

// Test ortamı için mock token
const TEST_TOKEN = 'test-jwt-token-mock';

// Express uygulamasını test için import et
// const app = require('../server');

/**
 * Mock Sensor servisi - gerçek DB bağlantısı olmadan test edilebilmesi için
 */
const mockSensors = [
  { id: 1, name: 'Tarla-A Nem Sensörü', type: 'humidity', value: 65.4, unit: '%', active: true },
  { id: 2, name: 'Tarla-A pH Sensörü', type: 'ph', value: 6.8, unit: 'pH', active: true },
  { id: 3, name: 'Tarla-B Sıcaklık', type: 'temperature', value: 24.2, unit: '°C', active: false },
];

// =====================================================
// BİRİM TESTLERİ
// =====================================================

describe('Sensör Veri Doğrulama Testleri', () => {

  describe('Sensör değeri aralık kontrolü', () => {
    test('Nem sensörü değeri 0-100 arasında olmalı', () => {
      const validHumidity = (value) => value >= 0 && value <= 100;
      expect(validHumidity(65.4)).toBe(true);
      expect(validHumidity(101)).toBe(false);
      expect(validHumidity(-1)).toBe(false);
    });

    test('pH sensörü değeri 0-14 arasında olmalı', () => {
      const validPH = (value) => value >= 0 && value <= 14;
      expect(validPH(6.8)).toBe(true);
      expect(validPH(14.1)).toBe(false);
      expect(validPH(-0.1)).toBe(false);
    });

    test('Sıcaklık sensörü -50 ile 100 arasında olmalı', () => {
      const validTemp = (value) => value >= -50 && value <= 100;
      expect(validTemp(24.2)).toBe(true);
      expect(validTemp(-55)).toBe(false);
      expect(validTemp(105)).toBe(false);
    });
  });

  describe('Sensör tipi doğrulama', () => {
    const validTypes = ['humidity', 'temperature', 'ph', 'light', 'co2', 'wind'];

    test('Geçerli sensör tipleri kabul edilmeli', () => {
      validTypes.forEach(type => {
        expect(validTypes.includes(type)).toBe(true);
      });
    });

    test('Geçersiz sensör tipi reddedilmeli', () => {
      expect(validTypes.includes('geçersiz_tip')).toBe(false);
      expect(validTypes.includes('')).toBe(false);
    });
  });

  describe('Sensör verisi filtreleme', () => {
    test('Aktif sensörler doğru filtrelenmeli', () => {
      const activeSensors = mockSensors.filter(s => s.active);
      expect(activeSensors.length).toBe(2);
    });

    test('Tip bazlı filtreleme çalışmalı', () => {
      const humiditySensors = mockSensors.filter(s => s.type === 'humidity');
      expect(humiditySensors.length).toBe(1);
      expect(humiditySensors[0].name).toBe('Tarla-A Nem Sensörü');
    });

    test('ID ile sensör bulunabilmeli', () => {
      const found = mockSensors.find(s => s.id === 2);
      expect(found).toBeDefined();
      expect(found.type).toBe('ph');
    });

    test('Olmayan ID için undefined dönmeli', () => {
      const notFound = mockSensors.find(s => s.id === 999);
      expect(notFound).toBeUndefined();
    });
  });
});

describe('Sulama Hesaplama Testleri', () => {

  /**
   * ET_c = K_c × ET_o
   * Bitki su tüketimi hesaplama formülü
   */
  const calculateWaterNeed = (Kc, ETo) => {
    if (Kc < 0 || ETo < 0) throw new Error('Değerler negatif olamaz.');
    return parseFloat((Kc * ETo).toFixed(2));
  };

  test('Su ihtiyacı doğru hesaplanmalı', () => {
    expect(calculateWaterNeed(1.2, 5.0)).toBe(6.0);
    expect(calculateWaterNeed(0.8, 4.5)).toBe(3.6);
  });

  test('Negatif değerler hata fırlatmalı', () => {
    expect(() => calculateWaterNeed(-1, 5)).toThrow('Değerler negatif olamaz.');
    expect(() => calculateWaterNeed(1, -5)).toThrow('Değerler negatif olamaz.');
  });

  test('Sıfır değerlerde sonuç sıfır olmalı', () => {
    expect(calculateWaterNeed(0, 5)).toBe(0);
    expect(calculateWaterNeed(1.2, 0)).toBe(0);
  });
});

describe('Sensör Geçmiş Veri Testleri', () => {

  const generateHistory = (hours) => {
    return Array.from({ length: hours }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000),
      value: parseFloat((60 + Math.random() * 10).toFixed(2)),
    }));
  };

  test('24 saatlik geçmiş doğru üretilmeli', () => {
    const history = generateHistory(24);
    expect(history.length).toBe(24);
  });

  test('Geçmiş veri timestamp sırası doğru olmalı', () => {
    const history = generateHistory(5);
    expect(history[0].timestamp.getTime()).toBeGreaterThan(history[4].timestamp.getTime());
  });

  test('Tüm değerler sayısal olmalı', () => {
    const history = generateHistory(10);
    history.forEach(item => {
      expect(typeof item.value).toBe('number');
    });
  });
});
