import multer from 'multer';
import sharp from 'sharp';

import asyncCatch from '../utils/asyncCatch.js';
import artworkService from '../services/artworkService.js';

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

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
    .toFile(`public/img/artworks/${req.file.filename}`);

  next();
});

export function getTopArtworks(req, res, next) {
  res.locals.options.sort = '-likeCount';
  req.query.sort = '-likeCount';
  next();
}

export function getNewArtworks(req, res, next) {
  res.locals.options.sort = '-addedAt';
  req.query.sort = '-addedAt';
  next();
}

export const postArtwork = asyncCatch(async (req, res) => {
  const artworkData = {
    title: req.body.title,
    path: req.file.filename,
    author: res.locals.user.id,
  };

  const newArtwork = await artworkService.create(artworkData);

  res.json(newArtwork);
});

export const getArtwork = asyncCatch(async (req, res) => {
  const artwork = await artworkService.get(req.params.id);

  res.json(artwork);
});

export const getAllArtworks = asyncCatch(async (req, res) => {
  const artworks = await artworkService.getAll(res.locals.options);

  res.json({ artworks });
});

export const getLikedArtworks = asyncCatch(async (req, res) => {
  const artworks = await artworkService.getLiked(res.locals.user.id);

  res.json({ artworks });
});

export const getHotArtworks = asyncCatch(async (req, res) => {
  const date = new Date(Date.now() - 7 * MILLISECONDS_IN_A_DAY).toISOString();

  const artworks = await artworkService.getNewerThan(date);

  res.json({ artworks });
});

export const getArtworksByAuthor = asyncCatch(async (req, res) => {
  const artworks = await artworkService.getByAuthor(
    req.params.id,
    res.locals.options
  );

  res.json({ artworks });
});

export const deleteArtwork = asyncCatch(async (req, res) => {
  await artworkService.remove(req.params.id, res.locals.user.id);

  res.status(200).end();
});
