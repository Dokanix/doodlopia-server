const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An user must have a name'],
    unique: true,
    trim: true,
  },
  experience: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: [true, 'An user must have a password'],
    select: false,
  },
  joinedAt: {
    type: Date,
  },
});

userSchema.virtual('level').get(function () {
  const levelThresholds = [
    1, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9,
  ];

  let level = 1;
  let remaining = this.experience;
  for (const threshold of levelThresholds) {
    if (remaining < threshold) {
      return level;
    }

    level++;
    remaining -= threshold;
  }

  return level;
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);

module.exports = User;
