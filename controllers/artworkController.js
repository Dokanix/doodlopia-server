const jwt = require('jsonwebtoken');

const Artwork = require('../models/artworkModel');
const User = require('../models/userModel');

exports.getArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    res.json({
      status: 'success',
      data: artwork,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllArtworks = async (req, res, next) => {
  try {
    const artworks = await Artwork.find({});

    res.json({
      status: 'success',
      results: artworks.length,
      data: artworks,
    });
  } catch (error) {
    next(error);
  }
};

exports.postArtwork = async (req, res, next) => {
  try {
    const newArtwork = await Artwork.create({
      title: req.body.title,
      path: req.body.path,
      author: req.user.id,
    });

    res.json(newArtwork);
  } catch (error) {
    next(error);
  }
};
