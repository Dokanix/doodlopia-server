const express = require('express');

const artworkController = require('../controllers/artworkController');
const userController = require('../controllers/userController');

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

router.route('/:id').get(artworkController.getArtwork);

module.exports = router;
