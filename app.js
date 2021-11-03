const express = require('express');
const cookieParser = require('cookie-parser');

const artworkRouter = require('./routes/artworkRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use('/artworks', artworkRouter);
app.use('/users', userRouter);

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
