import Like from '../models/likeModel.js';
import Artwork from '../models/artworkModel.js';
import asyncCatch from '../utils/asyncCatch.js';
import likeService from '../services/likeService.js';

export const postLike = asyncCatch(async (req, res, next) => {
  const likeData = {
    user: res.locals.user.id,
    artwork: req.body.artwork,
  };

  const newLike = await likeService.create(likeData);

  res.json(newLike);
});

export const getLike = asyncCatch(async (req, res, next) => {
  const like = await likeService.get(req.params.id);

  res.json(like);
});

export const getAllLikes = asyncCatch(async (req, res, next) => {
  const likes = await likeService.getAll();

  res.status(200).json({ likes });
});

export const getLikesByArtwork = asyncCatch(async (req, res, next) => {
  const likes = await likeService.getByArtwork(req.params.id);

  res.status(200).json({ likes });
});

export const deleteLike = asyncCatch(async (req, res, next) => {
  await likeService.remove(res.locals.user.id, req.params.id);

  res.status(200).end();
});

export const deleteLikeByArtwork = asyncCatch(async (req, res, next) => {
  await likeService.removeByArtwork(req.params.id, res.locals.user.id);

  res.status(200).end();
});
