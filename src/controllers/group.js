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

export const GroupControllers = {
  createGroup
};
