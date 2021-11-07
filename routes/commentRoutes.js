const express = require('express');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

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

module.exports = router;
