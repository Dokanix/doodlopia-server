const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const artworkRouter = require('./routes/artworkRoutes');
const userRouter = require('./routes/userRoutes');
const likeRouter = require('./routes/likeRoutes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use('/artworks', artworkRouter);
app.use('/users', userRouter);
app.use('/likes', likeRouter);

app.use('/*', (req, res, next) => {
  res.status(404).json({ message: 'Invalid url' });
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode ?? 400;

  switch (error.name) {
    case 'ValidationError':
      error.statusCode = 400;
  }

  return res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
  });
});

module.exports = app;
