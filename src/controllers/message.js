import { Message } from '../models/index.js';
import { io } from '../app.js';
import { getFilePath } from '../utils/index.js';

async function sendMessage (req, res) {
  try {
    const { chat_id, message } = req.body;
    const { userId } = req.user;

    const newMessage = new Message({
      chat: chat_id,
      user: userId,
      type: 'TEXT',
      message
    });

    const savedMessage = await (await newMessage.save()).populate('user');

    io.sockets.in(chat_id).emit('message', savedMessage);
    io.sockets.in(`${chat_id}_notify`).emit('message_notify', savedMessage);

    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(400).send({ message: 'Ha ocurrido un error', error: error.message });
  }
}

async function sendImage (req, res) {
  try {
    const { chat_id } = req.body;
    const { userId } = req.user;

    const imagePath = getFilePath(req.files.image);

    const message = new Message({
      chat: chat_id,
      user: userId,
      message: imagePath,
      type: 'IMAGE'
    });
    const savedMessage = await (await message.save()).populate('user');

    io.sockets.in(chat_id).emit('message', savedMessage);
    io.sockets.in(`${chat_id}_notify`).emit('message_notify', savedMessage);

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function getMessages (req, res) {
  const { chat_id } = req.params;

  try {
    const messages = await Message.find({ chat: chat_id })
      .sort({ createdAt: 1 })
      .populate('user');

    const total = await Message.find({ chat: chat_id }).count();

    res.status(200).json({ total, messages });
  } catch (error) {
    res.status(500).send({ error, messages: 'Error del servido' });
  }
}

async function getTotalMessages (req, res) {
  const { chat_id } = req.params;

  try {
    const response = await Message.find({ chat: chat_id }).count();
    res.status(200).send(JSON.stringify(response));
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
}

async function getLastMessage (req, res) {
  const { chat_id } = req.params;
  try {
    const response = await Message.findOne({ chat: chat_id })
      .sort({
        createdAt: -1
      });

    res.status(200).send(response || {});
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
}

export const MessageController = {
  getTotalMessages,
  getLastMessage,
  getMessages,
  sendMessage,
  sendImage
};
