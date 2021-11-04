const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 12;

const User = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    next();
  }
};

exports.register = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = await User.create({
      name: req.body.name,
      password: hashedPassword,
      joinedAt: new Date(),
    });

    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
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
      .json({ message: 'success', data: comparedUser });
  } catch (error) {
    next(error);
  }
};

exports.restrictToLoggedUsers = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.cookies.jwt, process.env.TOKEN_SECRET);

    const user = await User.findById(decodedToken.id);

    if (!user) return next(new Error('Wrong Token'));

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
