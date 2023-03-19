import { jwtServices } from '../utils/index.js';

function asureAuth (req, res, next) {
  const { headers } = req;
  if (!headers.authorization) { // verificar que exista la propiedad 'authorization' en los headers
    return res // responder con un 401 en caso de que no exista 'authorization'
      .status(401)
      .send({
        message: 'No autorizado'
      });
  }

  // separarar 'Bearer' del token -> 'Bearer <token>' -> ['Bearer', '<token>'].at(1) -> '<tokrn>'
  const token = headers.authorization.split(' ').at(1);

  try {
    const hasExpired = jwtServices.hasExpiredToken(token); // verificar si el token ha expirado

    if (hasExpired) { // si expiró, enviamos el error al catch y finaliza la ejecución
      const error = { message: 'Ivalid Token' };
      throw error;
    }

    const decodedToken = jwtServices.decoded(token); // decodificar el token
    req.user = decodedToken; // agrgar la propiedad 'user' al objeto 'request' y pasarle el valor del token decodificado

    next(); // pasamos al siguinte endpoint
  } catch (error) { // capturar error
    res.status(400).send(error);
  }
}

export const mdAuth = {
  asureAuth
};
