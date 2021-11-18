import Comment from '../models/commentModel.js';
import Artwork from '../models/artworkModel.js';

import prepareQuery from '../utils/prepareQuery.js';

export async function create(commentData) {
  const newComment = await Comment.create(commentData);

  await Artwork.findByIdAndUpdate(commentData.artwork, {
    $inc: { commentCount: 1 },
  });

  return newComment;
}

export async function get(id) {
  const comment = await Comment.findById(id);

  return comment;
}

export async function getAll(options) {
  const comments = await prepareQuery(Comment.find({}), options);

  return comments;
}

export async function getByArtwork(id, options) {
  const comments = await prepareQuery(Comment.find({ artwork: id }), options);

  return comments;
}

export async function remove(id, authorId) {
  const deletedComment = await Comment.findOneAndDelete({
    _id: id,
    author: authorId,
  });

  if (!deletedComment) throw new Error('No comment to delete');

  await Artwork.findByIdAndUpdate(deletedComment.artwork, {
    $inc: { commentCount: -1 },
  });
}

export default {
  create,
  get,
  getAll,
  getByArtwork,
  remove,
};
