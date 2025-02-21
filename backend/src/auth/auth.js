import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = 86400;  // 24 hours

const createToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION
  });
}

const auth = {
  createToken
}

export default auth;