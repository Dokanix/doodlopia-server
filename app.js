import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import artworkRouter from './routes/artworkRoutes.js';
import userRouter from './routes/userRoutes.js';
import likeRouter from './routes/likeRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import searchRouter from './routes/searchRoutes.js';

const app = express();

app.use(express.static('public'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use('/artworks', artworkRouter);
app.use('/users', userRouter);
app.use('/likes', likeRouter);
app.use('/comments', commentRouter);
app.use('/search', searchRouter);

app.use('/*', (req, res, next) => {
  res.status(404).json({ message: 'Invalid url' });
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode ?? 400;

  switch (error.name) {
    case 'ValidationError':
      error.statusCode = 400;
  }

  console.log(error);

  return res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
  });
});

export default app;
