import Comment from '../models/commentModel.js';
import Artwork from '../models/artworkModel.js';
import asyncCatch from '../utils/asyncCatch.js';

export const postComment = asyncCatch(async (req, res, next) => {
  const newComment = await Comment.create({
    author: res.locals.user.id,
    artwork: req.body.artwork,
    text: req.body.text,
  });

  await Artwork.findByIdAndUpdate(req.body.artwork, {
    $inc: { commentCount: 1 },
  });

  res.json(newComment);
});

export const getCommentsByArtwork = asyncCatch(async (req, res, next) => {
  const comments = await Comment.find({ artwork: req.params.id }).sort(
    '-addedAt'
  );

  res.status(200).json({ comments });
});

export const getAllComments = asyncCatch(async (req, res, next) => {
  const comments = await Comment.find({}).sort('-addedAt');

  res.status(200).json({ comments });
});

export const deleteComment = asyncCatch(async (req, res, next) => {
  const deletedComment = await Comment.findOneAndDelete({
    author: res.locals.user.id,
    _id: req.params.id,
  });

  if (!deletedComment) return next(Error('No comment to delete'));

  await Artwork.findByIdAndUpdate(deletedComment.artwork, {
    $inc: { commentCount: -1 },
  });

  res.status(200).end();
});
