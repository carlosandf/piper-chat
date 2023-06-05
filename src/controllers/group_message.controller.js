import { GroupMessage, Group } from '../models/index.js';
import { getFilePath } from '../utils/index.js';
import { io } from '../app.js';

async function sendText (req, res) {
  res.status(200).send('oki');
}

export const GroupMessageControllers = {
  sendText
};
