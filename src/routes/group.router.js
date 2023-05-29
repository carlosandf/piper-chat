import { Router } from 'express';
import multipart from 'connect-multiparty';
import { GroupControllers } from '../controllers/index.js';
import { mdAuth } from '../middlewares/index.js';

const mdUpload = multipart({ uploadDir: './src/uploads/group/' });

const router = Router();

router.post('/groups', [mdAuth.asureAuth, mdUpload], GroupControllers.createGroup);
router.get('/groups', [mdAuth.asureAuth], GroupControllers.getAll);
router.get('/groups/:id', [mdAuth.asureAuth], GroupControllers.getGroup);
router.patch('/groups/:id', [mdAuth.asureAuth, mdUpload], GroupControllers.updateGroup);
router.patch('/groups/exit/:id', [mdAuth.asureAuth], GroupControllers.exitGroup);
router.patch(
  '/groups/add_participants/:id',
  [mdAuth.asureAuth],
  GroupControllers.addParticipants
);

export const groupRoutes = router;
