/**
 * Merkezi Hata Yönetimi Middleware
 * Tüm route'lardan fırlatılan hataları yakalar ve standart formatta döner
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Sunucu hatası oluştu.';

  // Sequelize doğrulama hatası
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(', ');
  }

  // Sequelize benzersiz kısıtlama ihlali
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Bu kayıt zaten mevcut.';
  }

  // JWT hataları
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Geçersiz token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token süresi dolmuş. Lütfen tekrar giriş yapın.';
  }

  console.error(`[HATA] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 - Bulunamadı middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Sayfa bulunamadı: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
