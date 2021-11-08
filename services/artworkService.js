import Artwork from '../models/artworkModel.js';
import Comment from '../models/commentModel.js';
import Like from '../models/likeModel.js';
import User from '../models/userModel.js';

import prepareQuery from '../utils/prepareQuery.js';

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
  const artworks = await prepareQuery(
    Artwork.find({}).populate('author'),
    options
  );

  return artworks;
}

export async function getByAuthor(id, options) {
  const artworks = await prepareQuery(Artwork.find({ author: id }, options));

  return artworks;
}

export async function remove(id, authorId) {
  const deletedArtwork = await Artwork.findOneAndDelete({
    _id: id,
    author: authorId,
  });

  if (!deletedArtwork) throw new Error('No artwork to delete');

  await Comment.delete({ artwork: deletedArtwork.id });
  await Like.delete({ artwork: deletedArtwork.id });
}

export default {
  create,
  get,
  getAll,
  getByAuthor,
  remove,
};
