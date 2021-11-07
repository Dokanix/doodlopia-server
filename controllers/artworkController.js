import multer from 'multer';
import sharp from 'sharp';

import asyncCatch from '../utils/asyncCatch.js';
import Artwork from '../models/artworkModel.js';
import User from '../models/userModel.js';

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

export const uploadArtworkImage = upload.single('photo');

export const prepareArtworkImage = asyncCatch(async (req, res, next) => {
  if (!req.file) return next(new Error('No file to upload'));

  req.file.filename = `${res.locals.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/${req.file.filename}`);

  next();
});

export function getTopArtworks(req, res, next) {
  req.query.sort = '-likeCount';
  next();
}

export function getNewArtworks(req, res, next) {
  req.query.sort = '-addedAt';
  next();
}

export const getArtwork = asyncCatch(async (req, res, next) => {
  const artwork = await Artwork.findById(req.params.id);

  res.json({ artwork });
});

export const getAllArtworks = asyncCatch(async (req, res, next) => {
  const page = Number(req.query.page ?? 1);
  const limit = 20;

  const artworks = await Artwork.find({})
    .sort(req.query.sort)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ artworks });
});

export const postArtwork = asyncCatch(async (req, res, next) => {
  const newArtwork = await Artwork.create({
    title: req.body.title,
    path: req.file.filename,
    author: res.locals.user.id,
  });

  await User.findByIdAndUpdate(res.locals.user.id, {
    $inc: { experience: 1 },
  });

  res.json(newArtwork);
});
