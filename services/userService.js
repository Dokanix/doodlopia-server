import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const saltRounds = 12;

export async function register(userData) {
  userData.password = await bcrypt.hash(userData.password, saltRounds);

  const newUser = await User.create(userData);

  newUser.password = undefined;

  return newUser;
}

export async function login(userData) {
  const comparedUser = await User.findOne({ name: userData.name }).select(
    '+password'
  );

  if (!comparedUser) throw new Error('Wrong Login or Password');

  const passwordsMatch = await bcrypt.compare(
    userData.password,
    comparedUser.password
  );

  if (!passwordsMatch) throw new Error('Wrong Login or Password');

  const token = jwt.sign(
    { id: comparedUser._id, name: comparedUser.name },
    process.env.TOKEN_SECRET
  );

  comparedUser.password = undefined;

  return {
    token,
    user: comparedUser,
  };
}

export async function get(id) {
  const user = await User.findById(id);

  return user;
}

export async function getAll() {
  const users = await User.find({});

  return users;
}

export async function restrict(cookie) {
  const decodedToken = jwt.verify(cookie, process.env.TOKEN_SECRET);

  const user = await User.findById(decodedToken.id);

  if (!user) throw new Error('Wrong Token');

  return user;
}

export default {
  register,
  login,
  get,
  getAll,
  restrict,
};
