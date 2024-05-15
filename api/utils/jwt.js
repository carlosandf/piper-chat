import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../constants.js';

// crear access token
function createAccessToken (user) {
  const expToken = new Date(); // definir fecha de expiración
  expToken.setHours(expToken.getHours() + 24); // setear horas de duración del token

  // payload para jwt
  const payload = {
    tokenType: 'access',
    userId: user._id,
    iat: Date.now(),
    exp: expToken.getTime()
  };

  return jwt.sign(payload, SECRET_KEY);
}

// crear refresh token
function createRefreshToken (user) {
  const expToken = new Date(); // definir fecha de expiración
  expToken.setMonth(expToken.getMonth() + 1); // setear duración del token

  // payload para jwt
  const payload = {
    tokenType: 'refresh',
    userId: user._id,
    iat: Date.now(),
    exp: expToken.getTime()
  };

  return jwt.sign(payload, SECRET_KEY);
}

// decoded tocken
function decoded (token) {
  return jwt.decode(token, SECRET_KEY, true);
}

// verificar si el token ha expirado
function hasExpiredToken (token) {
  const { exp } = decoded(token); // traer la propiedad 'exp' del token decodificado
  const currentTime = new Date().getTime(); // obtener el tiempo actual

  if (exp <= currentTime) return true; // si 'exp' es menor o igual a el tiempo actual, el token expiró, y devuelve 'true'

  return false; // devuelve false si la anteriór condición no se cumple
}

export const jwtServices = {
  createRefreshToken,
  createAccessToken,
  hasExpiredToken,
  decoded
};
