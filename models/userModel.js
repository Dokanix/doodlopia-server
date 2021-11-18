import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An user must have a name'],
      unique: true,
      match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
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
      default: Date.now(),
    },
    avatar: {
      type: String,
      default: 'default.png',
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

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

export default User;
