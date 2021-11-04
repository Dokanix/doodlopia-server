const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');

const Artwork = require('../models/artworkModel');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Wrong filetype'));
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadArtworkImage = upload.single('photo');

exports.prepareArtworkImage = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/${req.file.filename}`);

  next();
};

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
      path: req.file.filename,
      author: req.user.id,
      addedAt: new Date(),
    });

    res.json(newArtwork);
  } catch (error) {
    next(error);
  }
};
