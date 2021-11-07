import asyncCatch from '../utils/asyncCatch.js';
import User from '../models/userModel.js';
import Artwork from '../models/artworkModel.js';
// const Contest = require('../models/contestModel');

export const getSearchResults = asyncCatch(async (req, res, next) => {
  const users = await User.find({ name: /req.params/i });
});
