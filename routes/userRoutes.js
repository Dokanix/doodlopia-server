import express from 'express';

import * as userController from '../controllers/userController.js';
import * as artworkController from '../controllers/artworkController.js';

const router = express.Router();

router.route('/').get(userController.getAllUsers);
router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router
  .route('/me')
  .get(
    userController.restrictToLoggedUsers,
    userController.getMe,
    userController.getUser
  );
router.route('/:id').get(userController.getUser);
router.route('/:id/artworks').get(artworkController.getArtworksByAuthor);

export default router;
