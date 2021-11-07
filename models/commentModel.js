import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'A comment must have a text'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A comment must have an author'],
  },
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: [true, 'A comment must have an artwork'],
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
