import express from 'express';

import * as artworkController from '../controllers/artworkController.js';
import * as userController from '../controllers/userController.js';
import * as commentController from '../controllers/commentController.js';
import * as likeController from '../controllers/likeController.js';

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

router.route('/:id/comments').get(commentController.getCommentsByArtwork);

router.route('/:id/likes').get(likeController.getLikesByArtwork);

export default router;
