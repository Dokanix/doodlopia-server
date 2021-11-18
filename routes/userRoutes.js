import express from 'express';

import * as userController from '../controllers/userController.js';
import * as artworkController from '../controllers/artworkController.js';
import * as likeController from '../controllers/likeController.js';

const router = express.Router();

router.route('/').get(userController.getAllUsers);
router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/logout').get(userController.logout);
router
  .route('/me')
  .get(
    userController.restrictToLoggedUsers,
    userController.getMe,
    userController.getUser
  );

router
  .route('/me/likes')
  .get(
    userController.restrictToLoggedUsers,
    userController.getMe,
    likeController.getOwnLikes
  );

router.route('/:name').get(userController.getUser);
router.route('/:id/artworks').get(artworkController.getArtworksByAuthor);

export default router;
