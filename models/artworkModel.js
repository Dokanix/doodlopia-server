const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Art must have a title'],
  },
  path: {
    type: String,
    required: [true, 'Art must have an image'],
    unique: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {
    type: Number,
    default: 0,
  },
  addedAt: {
    type: Date,
  },
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
  },
});

artworkSchema.plugin(uniqueValidator);

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;
