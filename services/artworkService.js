import Artwork from '../models/artworkModel.js';
import Comment from '../models/commentModel.js';
import Like from '../models/likeModel.js';
import User from '../models/userModel.js';

import prepareQuery from '../utils/prepareQuery.js';
import likeService from './likeService.js';

export async function create(artworkData) {
  const newArtwork = await Artwork.create(artworkData);

  await User.findByIdAndUpdate(artworkData.author, {
    $inc: { experience: 1 },
  });

  return newArtwork;
}

export async function get(id) {
  const artwork = await Artwork.findById(id);

  return artwork;
}

export async function getAll(options) {
  const artworks = await prepareQuery(Artwork.find({}), options);

  return artworks;
}

export async function getLiked(id) {
  let likes = await likeService.getByUser(id);

  likes = likes.map((object) => object.artwork);

  const artworks = await Artwork.find({
    _id: {
      $in: likes,
    },
  });

  return artworks;
}

export async function getNewerThan(date) {
  const artworks = await Artwork.find({
    addedAt: {
      $gte: date,
    },
  }).sort('-likeCount');

  return artworks;
}

export async function getByAuthor(id, options) {
  const artworks = await Artwork.find({ author: id });

  return artworks;
}

export async function remove(id, authorId) {
  const deletedArtwork = await Artwork.findOneAndDelete({
    _id: id,
    author: { _id: authorId },
  });

  if (!deletedArtwork) throw new Error('No artwork to delete');

  await Comment.deleteMany({ artwork: deletedArtwork.id });
  await Like.deleteMany({ artwork: deletedArtwork.id });
}

export default {
  create,
  get,
  getAll,
  getLiked,
  getNewerThan,
  getByAuthor,
  remove,
};
