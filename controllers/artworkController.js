const multer = require('multer');
const sharp = require('sharp');

const Artwork = require('../models/artworkModel');
const User = require('../models/userModel');

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

  req.file.filename = `${res.locals.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/${req.file.filename}`);

  next();
};

exports.getTopArtworks = async (req, res, next) => {
  req.query.sort = '-likeCount';
  next();
};

exports.getNewArtworks = async (req, res, next) => {
  req.query.sort = '-addedAt';
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
    const page = Number(req.query.page ?? 1);
    const limit = 20;

    const artworks = await Artwork.find({})
      .sort(req.query.sort)
      .skip((page - 1) * limit)
      .limit(limit);

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
      author: res.locals.user.id,
    });

    await User.findByIdAndUpdate(req.locals.user.id, {
      $inc: { experience: 1 },
    });

    res.json(newArtwork);
  } catch (error) {
    next(error);
  }
};
