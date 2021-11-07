import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A like must have an user'],
  },
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: [true, 'A like must have an artwork'],
  },
  date: {
    type: Date,
    default: Date.now(),
    required: [true, 'A like must have a date'],
  },
});

likeSchema.index({ user: 1, artwork: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;
