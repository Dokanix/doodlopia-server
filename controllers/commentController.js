const Comment = require('../models/commentModel');
const Artwork = require('../models/artworkModel');

exports.postComment = async (req, res, next) => {
  try {
    const newComment = await Comment.create({
      author: res.locals.user.id,
      artwork: req.body.artwork,
      text: req.body.text,
    });

    await Artwork.findByIdAndUpdate(req.body.artwork, {
      $inc: { commentCount: 1 },
    });

    res.json(newComment);
  } catch (error) {
    next(error);
  }
};

exports.getCommentsByArtwork = async (req, res, next) => {};

exports.getAllComments = async (req, res, next) => {
  try {
    const filterObject = {};
    if (req.query.artwork) {
      filterObject.artwork = req.query.artwork;
    }

    const comments = await Comment.find(filterObject).sort('-addedAt');

    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const deletedComment = await Comment.findOneAndDelete({
      author: res.locals.user.id,
      _id: req.params.id,
    });

    if (!deletedComment) return next(Error('No comment to delete'));

    await Artwork.findByIdAndUpdate(deletedComment.artwork, {
      $inc: { commentCount: -1 },
    });

    res.status(200).end();
  } catch (error) {
    next(error);
  }
};

exports.likeComment;
