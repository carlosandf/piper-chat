import { GroupMessage } from '../models/index.js';
import { getFilePath } from '../utils/index.js';
import { io } from '../app.js';

async function sendText (req, res) {
  const { group_id, message } = req.body;
  const { userId } = req.user;

  try {
    const groupMessage = new GroupMessage({
      group: group_id,
      user: userId,
      message,
      type: 'TEXT'
    });
    const savedMessage = await (await groupMessage.save()).populate(['user']);
    if (savedMessage) {
      io.sockets.in(group_id).emit('message', savedMessage);
      io.sockets.in(`${group_id}_notify`).emit('message', savedMessage);
      return res.status(201).send({ message: 'created' });
    } else {
      res.status(400).send({
        message: 'Ha ocurrido un error inesperado'
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Error en el servidor',
      error: error.message
    });
  }
}

async function sendImage (req, res) {
  try {
    const { group_id } = req.body;
    const { userId } = req.user;

    const imagePath = getFilePath(req?.files?.image);

    const groupMessage = new GroupMessage({
      group: group_id,
      user: userId,
      message: imagePath,
      type: 'IMAGE'
    });

    const savedMessage = await (await groupMessage.save()).populate(['user']);

    if (savedMessage) {
      io.sockets.in(group_id).emit('message', savedMessage);
      io.sockets.in(`${group_id}_notify`).emit('message', savedMessage);

      return res.status(201).send({ message: 'created' });
    } else {
      res.status(400).send({
        message: 'Ha ocurrido un error inesperado'
      });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getAllMessages (req, res) {
  const { group_id } = req.params;
  try {
    const messages = await GroupMessage.find({ group: group_id })
      .sort({ createdAt: 1 })
      .populate('user');

    const total = await GroupMessage.find({ group: group_id }).count();

    if (!messages) {
      return res.satatus(400).send({ message: 'Ha ocurrido un error' });
    }
    res.status(200).json({ total, messages });
  } catch (error) {
    res.status(500).send({
      message: 'Error en el servidor',
      error: error.message
    });
  }
}

async function getTotalMessages (req, res) {
  const { group_id } = req.params;

  try {
    const total = await GroupMessage.find({ group: group_id }).count();
    res.status(200).send(JSON.stringify(total));
  } catch (error) {
    res.status(500).send({
      message: 'Server error',
      error: error.message
    });
  }
}

async function getLastMessage (req, res) {
  const { group_id } = req.params;
  try {
    const response = await GroupMessage.findOne({ group: group_id })
      .sort({ createdAt: -1 })
      .populate('user');

    res.status(200).send(response || {});
  } catch (error) {
    res.status(500).send({
      message: 'Server error',
      error: error.message
    });
  }
}

export const GroupMessageControllers = {
  sendText,
  sendImage,
  getAllMessages,
  getTotalMessages,
  getLastMessage
};
