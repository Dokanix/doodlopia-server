const express = require('express');

const artworkController = require('../controllers/artworkController');
const userController = require('../controllers/userController');
const commentController = require('../controllers/commentController');

const router = express.Router();

router
  .route('/')
  .get(artworkController.getAllArtworks)
  .post(
    userController.restrictToLoggedUsers,
    artworkController.uploadArtworkImage,
    artworkController.prepareArtworkImage,
    artworkController.postArtwork
  );

router
  .route('/top')
  .get(artworkController.getTopArtworks, artworkController.getAllArtworks);

router
  .route('/new')
  .get(artworkController.getNewArtworks, artworkController.getAllArtworks);

router.route('/:id').get(artworkController.getArtwork);

router.route('/:id/comments', commentController.getAllComments);

module.exports = router;
