import jwt from 'jsonwebtoken';

// Generates a JWT and sets it as an httpOnly cookie on the response
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie('token', token, {
    httpOnly: true, // JS on the frontend can't access this — protects against XSS token theft
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};

export default generateToken;