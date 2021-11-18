import Artwork from '../models/artworkModel.js';
import Like from '../models/likeModel.js';

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

export async function getByUser(id) {
  const likes = await Like.find({ user: id });

  return likes;
}

export async function remove(id, userId) {
  const removedLike = await Like.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!removedLike) throw new Error('No like to delete');

  await Artwork.findByIdAndUpdate(removedLike.artwork, {
    $inc: { likeCount: -1 },
  });
}

export async function removeByArtwork(id, userId) {
  const removedLike = await Like.findOneAndDelete({
    artwork: id,
    user: userId,
  });

  if (!removedLike) throw new Error('No like to delete');

  await Artwork.findByIdAndUpdate(removedLike.artwork, {
    $inc: { likeCount: -1 },
  });
}

export default {
  create,
  get,
  getAll,
  getByArtwork,
  getByUser,
  remove,
  removeByArtwork,
};
