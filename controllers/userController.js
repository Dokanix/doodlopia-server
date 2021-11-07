import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 12;

import User from '../models/userModel.js';
import asyncCatch from '../utils/asyncCatch.js';

export async function getMe(req, res, next) {
  req.params.id = res.locals.user.id;
  next();
}

export const getAllUsers = asyncCatch(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({ users });
});

export const getUser = asyncCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json(user);
});

export const register = asyncCatch(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const newUser = await User.create({
    name: req.body.name,
    password: hashedPassword,
  });

  newUser.password = undefined;

  res.status(201).json(newUser);
});

export const login = asyncCatch(async (req, res, next) => {
  const comparedUser = await User.findOne({ name: req.body.name }).select(
    '+password'
  );

  if (!comparedUser) return next(new Error('Wrong Login or Password'));

  const passwordsMatch = await bcrypt.compare(
    req.body.password,
    comparedUser.password
  );

  if (!passwordsMatch) next(new Error('Wrong Login or Password'));

  comparedUser.password = undefined;

  const token = jwt.sign(
    { id: comparedUser._id, name: comparedUser.name },
    process.env.TOKEN_SECRET
  );

  res
    .cookie('jwt', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
      httpOnly: true,
      secure: req.secure,
    })
    .status(200)
    .json(comparedUser);
});

export const restrictToLoggedUsers = asyncCatch(async (req, res, next) => {
  const decodedToken = jwt.verify(req.cookies.jwt, process.env.TOKEN_SECRET);

  const user = await User.findById(decodedToken.id);

  if (!user) return next(new Error('Wrong Token'));

  res.locals.user = user;
  next();
});
