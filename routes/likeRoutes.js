const express = require('express');
const likeController = require('../controllers/likeController');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .post(userController.restrictToLoggedUsers, likeController.postLike)
  .delete(userController.restrictToLoggedUsers, likeController.deleteLike);

module.exports = router;
