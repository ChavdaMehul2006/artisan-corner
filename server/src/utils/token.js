const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_artisan_corner_2026',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_artisan_corner_2026',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const { accessToken, refreshToken } = generateTokens(user);

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  const accessCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000 // 15 minutes
  };

  res.cookie('accessToken', accessToken, accessCookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt
  };

  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: sanitizedUser,
      accessToken // Also provided for authorization header fallback if needed
    }
  });
};

const clearAuthCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const clearOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  };

  res.clearCookie('accessToken', clearOptions);
  res.clearCookie('refreshToken', clearOptions);
};

module.exports = {
  generateTokens,
  sendTokenResponse,
  clearAuthCookies
};
