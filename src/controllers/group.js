import { Group } from '../models/index.js';
import { getFilePath } from '../utils/image.js';

async function createGroup (req, res) {
  const { userId } = req.user;
  const { name, participants } = req.body;

  try {
    const group = new Group({
      name,
      participants: [...JSON.parse(participants), userId],
      creator: userId
    });
    if (req.files.image) {
      const imagePath = getFilePath(req.files.image);
      group.image = imagePath;
    }
    const created = await group.save();
    res.status(200).send(created);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function getAll (req, res) {
  const { userId } = req.user;
  try {
    if (userId) {
      const groups = await Group.find({ participants: userId })
        .populate(['creator', 'participants'])
        .exec();

      res.status(200).json(groups);
    }
  } catch (error) {
    res.status(500).send({ message: 'Error en el servidor', error: error.message });
  }
}

async function getGroup (req, res) {
  const { id } = req.params;

  try {
    const group = await Group.findById(id).populate(['participants']);
    if (group) {
      res.status(200).json(group);
    } else {
      res.status(400).send({ message: 'No encontrado' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error en el servidor' });
  }
}

async function updateGroup (req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const update = {};

    if (req.files && req.files.image) {
      const imagePath = getFilePath(req.files.image);
      update.image = imagePath;
    }
    if (name) update.name = name;

    const updatedGroup = await Group.findByIdAndUpdate(id, { ...update });

    if (updatedGroup) {
      res.status(200).json(updatedGroup);
    } else {
      res.status(400).send({ message: 'Ha ocurrido un error' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error en el servidor', error: error.message });
  }
}

async function exitGroup (req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { userId } = req.user;

    const group = await Group.findById(id);

    const upDatePrticipans = group.participants.filter(
      (participant) => participants.toString !== userId
    );

    if (group) {
      res.status(200).json(group);
    } else {
      res.status(400).send({ message: 'Ha ocurrido un error' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error en el servidor', error: error.message });
  }
}

export const GroupControllers = {
  createGroup,
  updateGroup,
  exitGroup,
  getGroup,
  getAll
};
