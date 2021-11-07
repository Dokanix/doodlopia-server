import asyncCatch from '../utils/asyncCatch.js';
import User from '../models/userModel.js';
import Artwork from '../models/artworkModel.js';
// const Contest = require('../models/contestModel');

export const getSearchResults = asyncCatch(async (req, res, next) => {
  const users = await User.find({
    name: new RegExp(`${req.query.q}`, 'i'),
  }).limit(5);
  const artworks = await Artwork.find({
    title: new RegExp(`${req.query.q}`, 'i'),
  }).limit(5);

  res.status(200).json({
    users,
    artworks,
  });
});
