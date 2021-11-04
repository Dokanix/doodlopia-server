const Like = require('../models/likeModel');
const Artwork = require('../models/artworkModel');

exports.postLike = async (req, res, next) => {
  try {
    const newLike = await Like.create({
      user: req.user.id,
      artwork: req.body.artwork,
      date: new Date(),
    });

    await Artwork.findByIdAndUpdate(req.body.artwork, { $inc: { likes: 1 } });

    res.json(newLike);
  } catch (error) {
    next(error);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const removedLike = await Like.findOneAndDelete({
      user: req.user.id,
      artwork: req.body.artwork,
    });

    if (!removedLike) return next(new Error("Like doesn't exist"));

    await Artwork.findByIdAndUpdate(req.body.artwork, {
      $inc: { likes: -1 },
    });

    res.status(200).end();
  } catch (error) {
    next(error);
  }
};
