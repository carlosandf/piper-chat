import { Chat, Message } from '../models/index.js';
import boom from '@hapi/boom';

async function create (req, res) {
  try {
    const { member_one, member_two } = req.body;

    const foundOne = await Chat.findOne({
      member_one,
      member_two
    });
    const foundTwo = await Chat.findOne({
      member_one: member_two,
      member_two: member_one
    });

    if (foundOne || foundTwo) {
      return res.status(200).json({ message: 'Ya tienes un chat con este usuario' });
    }

    const chat = new Chat({
      member_one,
      member_two
    });

    const chatSaved = await chat.save();
    res.status(201).json(chatSaved);
  } catch (error) {
    res.status(400).json({ message: 'Ha ocurrido un error' });
  }
}

async function getAll (req, res) {
  const { userId } = req.user;

  try {
    const response = Chat.find({
      $or: [
        { member_one: userId },
        { member_two: userId }
      ]
    }).populate(['member_one', 'member_two']);

    const arrayChats = [];

    for await (const chat of response) {
      const message = await Message.findOne({ chat: chat._id })
        .sort({ createdAt: -1 });

      arrayChats.push({
        ...chat._doc,
        last_message_date: message?.createdAt || null
      });
    }

    if (!arrayChats) throw boom.notFound();

    res.status(200).json(arrayChats);
  } catch (error) {
    error.isBoom // preguntar si el error es enviado por Boom
      ? res.status(error.output.statusCode).json({ error, message: error.message })
      : res.status(400).json({ error: error.message });
  }
}

async function deleteChat (req, res) {
  const { id } = req.params;

  try {
    const deleted = await Chat.findByIdAndDelete(id);

    if (!deleted) throw boom.badRequest('Error al intentar eliminar');
    res.status(200).json({ message: 'Chat eliminado' });
  } catch (error) {
    error.isBoom // preguntar si el error es enviado por Boom
      ? res.status(error.output.statusCode).json({ error: error.output.payload })
      : res.status(400).json({ error: error.message });
  }
}

async function getChat (req, res) {
  const { id } = req.params;

  try {
    const currentChat = await Chat.findById(id).populate([
      'member_one',
      'member_two'
    ]);

    res.status(200).json(currentChat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const ChatController = {
  create,
  getAll,
  deleteChat,
  getChat
};
