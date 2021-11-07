import asyncCatch from '../utils/asyncCatch.js';
import commentService from '../services/commentService.js';

export const postComment = asyncCatch(async (req, res, next) => {
  const commentData = {
    author: res.locals.user.id,
    artwork: req.body.artwork,
    text: req.body.text,
  };

  const newComment = await commentService.create(commentData);

  res.json(newComment);
});

export const getComment = asyncCatch(async (req, res, next) => {
  const comment = await commentService.get(req.params.id);

  res.status(200).json(comment);
});

export const getAllComments = asyncCatch(async (req, res, next) => {
  const comments = await commentService.getAll(res.locals.options);

  res.status(200).json({ comments });
});

export const getCommentsByArtwork = asyncCatch(async (req, res, next) => {
  const comments = await commentService.getByArtwork(
    req.params.id,
    res.locals.options
  );

  res.status(200).json({ comments });
});

export const deleteComment = asyncCatch(async (req, res, next) => {
  await commentService.remove(req.params.id, res.locals.user.id);

  res.status(200).end();
});
