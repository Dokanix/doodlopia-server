import express from 'express';

import * as likeController from '../controllers/likeController.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router
  .route('/')
  .get(likeController.getAllLikes)
  .post(userController.restrictToLoggedUsers, likeController.postLike);

router
  .route('/:id')
  .delete(userController.restrictToLoggedUsers, likeController.deleteLike);

export default router;
