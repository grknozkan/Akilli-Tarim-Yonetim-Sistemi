const jwt = require('jsonwebtoken');

/**
 * JWT Kimlik Doğrulama Middleware
 * Korumalı route'lara erişim için token doğrulaması yapar
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Erişim reddedildi. Token bulunamadı.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Geçersiz veya süresi dolmuş token.',
    });
  }
};

/**
 * Rol tabanlı yetkilendirme middleware
 * @param {...string} roles - İzin verilen roller
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır.',
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
