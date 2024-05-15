import { Message } from '../models/index.js';
import { io } from '../utils/socketServer.js';
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
    res.status(500).send({ error: error.message, messages: 'Error del servido' });
  }
}

async function getTotalMessages (req, res) {
  const { chat_id } = req.params;

  try {
    const response = await Message.find({ chat: chat_id }).count();
    res.status(200).send(JSON.stringify(response));
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
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

async function updateReadMessages (req, res) {
  try {
    const { chat_id } = req.params;
    const { userId } = req.user;

    const read = true;
    const lastMessage = await Message.findOne({ chat: chat_id })
      .sort({
        createdAt: -1
      });

    if (lastMessage?.user.toJSON() === userId) {
      return res.status(300).send({ message: 'redirect' });
    }

    io.sockets.in(`${chat_id}_read_notify`).emit('read_notify', { read, chat_id });

    const unreadMessages = await Message.find({
      chat: chat_id,
      read: false,
      user: { $ne: userId }
    });

    for await (const item of unreadMessages) {
      await Message.findByIdAndUpdate(item.id, { read });
    }

    res.status(200).send({ read, message: 'Mensajes leidos' });
  } catch (error) {
    res.status(500).send({
      error: 'Error en el servidor',
      message: error.message
    });
  }
}

async function getUnreadMessages (req, res) {
  try {
    const { chat_id } = req.params;
    const { userId } = req.user;

    const unreadMessages = await Message.find({
      chat: chat_id,
      read: false,
      user: { $ne: userId }
    }).count();
    res.status(200).send({ totalUnread: unreadMessages });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
}

export const MessageController = {
  getUnreadMessages,
  updateReadMessages,
  getTotalMessages,
  getLastMessage,
  getMessages,
  sendMessage,
  sendImage
};
