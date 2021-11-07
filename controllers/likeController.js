import Like from '../models/likeModel.js';
import Artwork from '../models/artworkModel.js';
import asyncCatch from '../utils/asyncCatch.js';

export const getLikesByArtwork = asyncCatch(async (req, res, next) => {
  const likes = await Like.find({ artwork: req.params.id });

  res.status(200).json({ likes });
});

export const getLikesByUser = asyncCatch(async (req, res, next) => {
  const likes = await Like.find({ user: req.params.id });

  res.status(200).json({ likes });
});

export const getAllLikes = asyncCatch(async (req, res, next) => {
  const likes = await Like.find({});

  res.status(200).json({ likes });
});

export const postLike = asyncCatch(async (req, res, next) => {
  const newLike = await Like.create({
    user: res.locals.user.id,
    artwork: req.body.artwork,
  });

  await Artwork.findByIdAndUpdate(req.body.artwork, {
    $inc: { likeCount: 1 },
  });

  res.json(newLike);
});

export const deleteLike = asyncCatch(async (req, res, next) => {
  const removedLike = await Like.findOneAndDelete({
    author: res.locals.user.id,
    _id: req.params.id,
  });

  if (!removedLike) return next(new Error('No like to delete'));

  await Artwork.findByIdAndUpdate(removedLike.artwork, {
    $inc: { likeCount: -1 },
  });

  res.status(200).end();
});
