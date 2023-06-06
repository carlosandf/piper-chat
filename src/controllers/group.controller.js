import { Group, GroupMessage, User } from '../models/index.js';
import { getFilePath } from '../utils/image.js';

async function createGroup (req, res) {
  const { userId } = req.user;
  const { name, participants } = req.body;

  try {
    const group = new Group({
      name,
      participants: [...JSON.parse(participants), userId],
      admin: userId
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
      const groupsResponse = Group.find({ participants: userId })
        .populate(['admin', 'participants']);

      const groupsArray = [];

      for await (const group of groupsResponse) {
        const message = await GroupMessage.findOne({ group: group._id })
          .sort({ createdAt: -1 });

        groupsArray.push({
          ...group._doc,
          last_message_date: message?.createdAt || null
        });
      }

      res.status(200).json(groupsArray);
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
    const { userId } = req.user;

    const { _doc } = await Group.findById(id);

    const updateParticipants = _doc?.participants.filter(
      (participant) => participant.toString() !== userId
    );

    const newData = {
      ..._doc,
      admin: updateParticipants[0],
      participants: updateParticipants
    };

    const updated = await Group.findByIdAndUpdate(id, newData);
    if (updated) {
      res.status(200).json({ newData });
    } else {
      res.status(400).send({ message: 'Ha ocurrido un error' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error en el servidor', error: error.message });
  }
}

async function addParticipants (req, res) {
  try {
    const { id } = req.params;
    const { users_id } = req.body;

    const { _doc } = await Group.findById(id);
    const users = await User.find({ _id: users_id });

    const newParticipants = [..._doc.participants];
    users.forEach((user) => {
      if (!_doc.participants.includes(user._id)) {
        newParticipants.push(user._id);
      }
    });

    const newData = {
      ..._doc,
      participants: newParticipants
    };

    const update = await Group.findByIdAndUpdate(id, newData);

    if (update) {
      return res.status(200).send({
        message: 'Todo salió bien'
      });
    }

    res.status(400).send({
      message: 'Ocurrió un error al añadir nuevos miembros'
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error en el servidor',
      error: error.message
    });
  }
}

async function removeParticipant (req, res) {
  const { group_id, user_id } = req.body;

  const group = await Group.findById(group_id);

  const newParticipants = group.participants.filter(
    participant => participant.toString() !== user_id
  );
  const newData = {
    ...group.$getPopulatedDocs_doc,
    participants: newParticipants
  };

  const update = await Group.findByIdAndUpdate(group_id, newData);

  if (update) {
    return res.status(200).send({
      message: 'Todo salió bien'
    });
  }

  res.status(400).send({
    message: 'Ocurrió un error al añadir nuevos miembros'
  });
}

async function getAnotherUsers (req, res) {
  const { group_id } = req.params;

  try {
    const group = await Group.findById(group_id);
    const participantsIds = group.participants.toString().split(',');

    const response = await User.find({ _id: { $nin: participantsIds } });

    if (!response) {
      return res.status(400).send({
        message: 'Ha pcorrido un error'
      });
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({
      message: 'Error en el servidor',
      error: error.message
    });
  }
}

export const GroupControllers = {
  removeParticipant,
  getAnotherUsers,
  addParticipants,
  createGroup,
  updateGroup,
  exitGroup,
  getGroup,
  getAll
};
