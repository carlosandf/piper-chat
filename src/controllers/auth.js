import { User } from '../models/index.js';
import { jwtServices } from '../utils/index.js';
import bcrypt from 'bcryptjs';

// registro de usuarios
async function register (req, res) {
  try {
    const { email, password } = req.body; // obtener credenciales del usuario
    const newUser = new User({
      email: email.toLowerCase(), // guardar el email en lower case
      password
    });

    const savedUser = await newUser.save(); // obtener el usuario guardado
    res.status(201).json(savedUser); // reponder con la información del usuario guardado
  } catch (error) {
    // captura de errores y respuesta
    res.status(400).json({
      message: 'Error al registrar usuario',
      error
    });
  }
}

// inicio de sesión
async function login (req, res) {
  try {
    const { email, password } = req.body; // obtener credenciales del usuario
    const emailLowerCase = email.toLowerCase(); // pasar el email a lower case
    const user = await User.findOne({ email: emailLowerCase }); // obtener el usuario que coincida

    const isCorrectPassword =
    user === null // si es true, isCorrectPasswor será false
      ? false
      // si user no el null, verificar que la cotraseña coninsida con la registrada
      // si la cintraseña es correcta, isCorrectPassword será true
      // de lo contrario, será false
      : bcrypt.compare(password, user.password);

    if (!(user && isCorrectPassword)) { // devolver el error solo si user o isCorrectPasword o ambos son false
      return res.status(401).json({
        error: 'Ivalid user or password'
      });
    }

    // si la anterior condición no se cumple, se ejecuta lo siguiente
    res.status(200).json({
      access: jwtServices.createAccessToken(user), // devuelve el access token
      refresh: jwtServices.createRefreshToken(user) // devuelve el regresh token
    });
  } catch (error) { // capturar el error en caso de que exista
    res.status(500).json({ // responder con el error
      message: 'Error en el servidor',
      error
    });
  }
}

// controlador de refresh access token
async function refreshAccessToken (req, res) {
  try {
    const { refreshToken } = req.body; // obtener el refreshToken

    if (!refreshToken) { // si no existe devolver la alerta
      return res.status(400).json({ message: 'Token required' });
    }

    // devuelve true o false si el refresh token ha expirado o no
    const hasExpired = jwtServices.hasExpiredToken(refreshToken);

    if (hasExpired) { // si expiró, devolver la alerta
      return res.status(400).json({ message: 'Token Expired' });
    }

    const { userId } = jwtServices.decoded(refreshToken); // obtener el userId del token decodificado

    const user = await User.findById(userId); // obtener el usuario cuyo id sea igual a userId
    if (user === null) return res.status(404).json({ message: 'Not Found' }); // si user es null, retornar un 404

    // si user no es null, verificar que la propiedad '_id' exista
    if (user._id) {
      return res.status(200).json({
        accessToken: jwtServices.createAccessToken(user) // crear nuevo access token y enviarlo en la respuesta
      });
    }
  } catch (error) { // en caso de error, capturarlo y devolverlo con un status 500
    res.status(500).json({ message: 'Error del servidor' });
  }
}

export const AuthController = {
  refreshAccessToken,
  register,
  login
};
