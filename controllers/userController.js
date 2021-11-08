import asyncCatch from '../utils/asyncCatch.js';
import userService from '../services/userService.js';

export const register = asyncCatch(async (req, res, next) => {
  console.log(req.body);

  const userData = {
    name: req.body.name,
    password: req.body.password,
  };

  const newUser = await userService.register(userData);

  res.status(201).json(newUser);
});

export const login = asyncCatch(async (req, res, next) => {
  const userData = {
    name: req.body.name,
    password: req.body.password,
  };

  const { token, user } = await userService.login(userData);

  res
    .cookie('jwt', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
      httpOnly: true,
      secure: req.secure,
    })
    .status(200)
    .json(user);
});

export const logout = asyncCatch(async (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 1 }).status(200).end();
});

export function getMe(req, res, next) {
  req.params.id = res.locals.user.id;

  next();
}

export const getUser = asyncCatch(async (req, res, next) => {
  const user = await userService.get(req.params.id);

  res.status(200).json(user);
});

export const getAllUsers = asyncCatch(async (req, res, next) => {
  const users = await userService.getAll();

  res.status(200).json({ users });
});

export const restrictToLoggedUsers = asyncCatch(async (req, res, next) => {
  const user = await userService.restrict(req.cookies.jwt);

  res.locals.user = user;

  next();
});
