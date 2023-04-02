import { User } from '../models/index.js';
import boom from '@hapi/boom';
import { getFilePath } from '../utils/image.js';

// funciones del controlador

// GET MY USER
async function getMe (req, res) {
  try {
    if (!req.user) { // si req.user no existe, el usuario no está logeado
      throw boom.unauthorized('Inicia sesión o regitrate para continuar');
    }

    const { userId } = req.user; // obtener el ID del usuario
    const myUser = await User.findById(userId); // obtener los datos del usuario

    if (!myUser) throw boom.notFound(); // si myUser es null, lanzar un error y devolver un "Not Found"

    res.status(200).json(myUser); // si myUser no es falsy devolver los datos del usuario
  } catch (error) {
    error.isBoom // preguntar si el error es enviado por Boom
      ? res.status(error.output.statusCode).json({ error })
      : res.status(500).json({ message: 'Server Error', error });
  }
}

// GET ALL USERS
async function getUsers (req, res) {
  try {
    if (!req.user) { // si req.user no existe, el usuario no está logeado
      throw boom.unauthorized('Inicia sesión o regitrate para continuar');
    }

    const { userId } = req.user; // obtener el ID del usuario
    const users = await User.find({ _id: { $ne: userId } }); // obtener todos los usuarios a excepcion del nuestro

    if (!users) throw boom.badRequest(); // si users es falsy, devolver un error

    res.status(200).json(users); // de lo contrario, devolvemos los datos
  } catch (error) {
    error.isBoom // preguntar si el error es enviado por Boom
      ? res.status(error.output.statusCode).json({ error })
      : res.status(500).json({ message: 'Server Error', error });
  }
}

// GET ONE USER
async function getOneUser (req, res) {
  try {
    if (!req.user) { // si req.user no existe, el usuario no está logeado
      throw boom.unauthorized('Inicia sesión o regitrate para continuar');
    }

    const { id } = req.params; // obtener el id del usuario a buscar
    const user = await User.findById(id); // obtener datos del usuario buscado

    if (!user) throw boom.notFound(); // si no existe el usuario, devolver "Not Found"

    res.status(200).json(user); // devolver los datos del usuario
  } catch (error) {
    error.isBoom // preguntar si el error es enviado por Boom
      ? res.status(error.output.statusCode).json({ error })
      : res.status(400).json({ message: 'Bad request', error });
  }
}

// UPDATE MY USER
async function updateMyUser (req, res) {
  try {
    if (!req.user) { // si req.user no existe, el usuario no está logeado
      throw boom.unauthorized('Inicia sesión o regitrate para continuar');
    }

    const { userId } = req.user; // obtener el ID del usuario
    const userData = req.body; // obtener los nuevos datos del usuario y guardarlos en una variable objeto

    /*
      verificar si existe la propiedad "files" y a su vez "avatar"
      Estas propiedade son generadas por el middleware de multiparty
    */
    if (req.files.avatar) {
      // utilizar la función getFilePath para obterner la futa de la imagen del avatar
      const imagePath = getFilePath(req.files.avatar);
      userData.avatar = imagePath; // crear la propiedad avatar, en "userData" y asignarle la ruta de la imagen como valor
      console.log(imagePath);
    }
    // buscar y acualizar el usuario en la base de datos
    const myUserUpdated = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!myUserUpdated) throw boom.badRequest(); // si "myUserUpdated" es falsy, devolver el error

    res.status(200).json(myUserUpdated); // devolver el usuario actualizado
  } catch (error) {
    error.isBoom // preguntar si el error es enviado por Boom
      ? res.status(error.output.statusCode).json({ error, message: error.message })
      : res.status(400).json({ message: 'Bad request', error });
  }
}

export const UserController = {
  getMe,
  getUsers,
  getOneUser,
  updateMyUser
};
