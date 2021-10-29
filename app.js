const express = require('express');

const artworkRouter = require('./routes/artworkRoutes');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/artworks', artworkRouter);

app.use((error, req, res, next) => {
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
