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
    console.log(created);
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
  res.status(200).send('Perfect');
}

async function getGroup (req, res) {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (group) {
      res.status(200).json(group);
    } else {
      res.status(400).send({ message: 'No encontrado' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error en el servidor' });
  }
}

export const GroupControllers = {
  createGroup,
  getGroup,
  getAll
};
