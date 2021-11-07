import express from 'express';

import * as userController from '../controllers/userController.js';

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

export default router;
