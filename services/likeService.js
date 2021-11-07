import Artwork from '../models/artworkModel.js';
import Comment from '../models/commentModel.js';
import Like from '../models/likeModel.js';
import User from '../models/userModel.js';

import prepareQuery from '../utils/prepareQuery.js';

export async function create(likeData) {
  const newLike = await Like.create(likeData);

  await Artwork.findByIdAndUpdate(likeData.artwork, {
    $inc: { likeCount: 1 },
  });

  return newLike;
}

export async function get(id) {
  const like = await Like.findById(id);

  return like;
}

export async function getAll() {
  const likes = await Like.find({});

  return likes;
}

export async function getByArtwork(id) {
  const likes = await Like.find({ artwork: id });

  return likes;
}

export async function remove(id, userId) {
  const deletedLike = await Like.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!deletedLike) throw new Error('No like to delete');

  await Artwork.findByIdAndUpdate(removedLike.artwork, {
    $inc: { likeCount: -1 },
  });
}

export async function removeByArtwork(id, userId) {
  const deletedLike = await Like.findOneAndDelete({
    artwork: id,
    user: userId,
  });

  if (!deletedLike) throw new Error('No like to delete');

  await Artwork.findByIdAndUpdate(removedLike.artwork, {
    $inc: { likeCount: -1 },
  });
}

export default {
  create,
  get,
  getAll,
  getByArtwork,
  remove,
  removeByArtwork,
};
