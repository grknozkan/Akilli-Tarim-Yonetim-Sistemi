/**
 * Kimlik Doğrulama (Auth) Test Senaryoları
 * Test çalıştırma: npx jest tests/auth.test.js
 */

const jwt = require('jsonwebtoken');

// Test ortamı için sabit secret
const TEST_SECRET = 'test_jwt_secret_atys_2024';
const TEST_USER = { id: 1, email: 'test@atys.com', role: 'admin' };

// =====================================================
// JWT TOKEN TESTLERİ
// =====================================================

describe('JWT Token Testleri', () => {

  describe('Token üretimi', () => {
    test('Geçerli kullanıcı için token üretilmeli', () => {
      const token = jwt.sign(TEST_USER, TEST_SECRET, { expiresIn: '1h' });
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // header.payload.signature
    });

    test('Token payload doğru bilgileri içermeli', () => {
      const token = jwt.sign(TEST_USER, TEST_SECRET, { expiresIn: '1h' });
      const decoded = jwt.verify(token, TEST_SECRET);
      expect(decoded.id).toBe(TEST_USER.id);
      expect(decoded.email).toBe(TEST_USER.email);
      expect(decoded.role).toBe(TEST_USER.role);
    });

    test('Token expiry bilgisi içermeli', () => {
      const token = jwt.sign(TEST_USER, TEST_SECRET, { expiresIn: '1h' });
      const decoded = jwt.verify(token, TEST_SECRET);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('Token doğrulama', () => {
    test('Geçerli token doğrulanabilmeli', () => {
      const token = jwt.sign(TEST_USER, TEST_SECRET, { expiresIn: '1h' });
      expect(() => jwt.verify(token, TEST_SECRET)).not.toThrow();
    });

    test('Yanlış secret ile token doğrulanamamalı', () => {
      const token = jwt.sign(TEST_USER, TEST_SECRET, { expiresIn: '1h' });
      expect(() => jwt.verify(token, 'yanlis_secret')).toThrow();
    });

    test('Süresi dolmuş token hata fırlatmalı', () => {
      const token = jwt.sign(TEST_USER, TEST_SECRET, { expiresIn: '0s' });
      // Küçük bir gecikme ile test et
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => jwt.verify(token, TEST_SECRET)).toThrow(jwt.TokenExpiredError);
          resolve();
        }, 100);
      });
    });

    test('Bozuk token hata fırlatmalı', () => {
      expect(() => jwt.verify('bozuk.token.verisi', TEST_SECRET)).toThrow();
    });

    test('Boş token hata fırlatmalı', () => {
      expect(() => jwt.verify('', TEST_SECRET)).toThrow();
    });
  });
});

// =====================================================
// ROL YETKİLENDİRME TESTLERİ
// =====================================================

describe('Rol Tabanlı Yetkilendirme Testleri', () => {

  const ROLES = {
    ADMIN: 'admin',
    FARMER: 'farmer',
    VIEWER: 'viewer',
  };

  const hasPermission = (userRole, requiredRoles) => {
    return requiredRoles.includes(userRole);
  };

  test('Admin tüm işlemlere erişebilmeli', () => {
    expect(hasPermission(ROLES.ADMIN, [ROLES.ADMIN])).toBe(true);
    expect(hasPermission(ROLES.ADMIN, [ROLES.ADMIN, ROLES.FARMER])).toBe(true);
  });

  test('Farmer sadece ilgili işlemlere erişebilmeli', () => {
    expect(hasPermission(ROLES.FARMER, [ROLES.ADMIN, ROLES.FARMER])).toBe(true);
    expect(hasPermission(ROLES.FARMER, [ROLES.ADMIN])).toBe(false);
  });

  test('Viewer sadece okuma işlemlerine erişebilmeli', () => {
    expect(hasPermission(ROLES.VIEWER, [ROLES.ADMIN, ROLES.FARMER, ROLES.VIEWER])).toBe(true);
    expect(hasPermission(ROLES.VIEWER, [ROLES.ADMIN, ROLES.FARMER])).toBe(false);
  });

  test('Tanımlanmamış rol erişim sağlayamamalı', () => {
    expect(hasPermission('tanimsiz_rol', [ROLES.ADMIN, ROLES.FARMER])).toBe(false);
  });
});

// =====================================================
// GİRİŞ DOĞRULAMA TESTLERİ
// =====================================================

describe('Giriş Bilgisi Doğrulama Testleri', () => {

  const validateLoginInput = ({ email, password }) => {
    const errors = [];
    if (!email || !email.includes('@')) errors.push('Geçerli bir e-posta adresi giriniz.');
    if (!password || password.length < 6) errors.push('Şifre en az 6 karakter olmalıdır.');
    return errors;
  };

  test('Geçerli giriş bilgileri hata üretmemeli', () => {
    const errors = validateLoginInput({ email: 'kullanici@atys.com', password: 'guclu123' });
    expect(errors).toHaveLength(0);
  });

  test('Geçersiz e-posta hata üretmeli', () => {
    const errors = validateLoginInput({ email: 'gecersizemail', password: 'guclu123' });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('e-posta');
  });

  test('Kısa şifre hata üretmeli', () => {
    const errors = validateLoginInput({ email: 'kullanici@atys.com', password: '123' });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('karakter');
  });

  test('Boş alanlar hata üretmeli', () => {
    const errors = validateLoginInput({ email: '', password: '' });
    expect(errors.length).toBe(2);
  });
});
