import express from 'express';

import * as commentController from '../controllers/commentController.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router
  .route('/')
  .get(commentController.getAllComments)
  .post(userController.restrictToLoggedUsers, commentController.postComment);

router
  .route('/:id')
  .delete(
    userController.restrictToLoggedUsers,
    commentController.deleteComment
  );

export default router;
