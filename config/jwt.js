// utils/jwt.js
import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY; // 15 minutes
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY; // 7 days

// Generate Access Token
export const generateAccessToken = (userId,role,fullname) => {
  return jwt.sign({ id: userId,role: role, fullname: fullname}, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

// Generate Refresh Token
export const generateRefreshToken = (userId,role) => {

  return jwt.sign({ id: userId,role:role, }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};
