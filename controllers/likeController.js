const Like = require('../models/likeModel');
const Artwork = require('../models/artworkModel');

exports.postLike = async (req, res, next) => {
  try {
    const newLike = await Like.create({
      user: res.locals.user.id,
      artwork: req.body.artwork,
    });

    await Artwork.findByIdAndUpdate(req.body.artwork, {
      $inc: { likeCount: 1 },
    });

    res.json(newLike);
  } catch (error) {
    next(error);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const removedLike = await Like.findOneAndDelete({
      author: res.locals.user.id,
      _id: req.params.id,
    });

    if (!removedLike) return next(new Error('No like to delete'));

    await Artwork.findByIdAndUpdate(removedLike.artwork, {
      $inc: { likeCount: -1 },
    });

    res.status(200).end();
  } catch (error) {
    next(error);
  }
};
