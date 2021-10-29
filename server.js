const app = require('./app.js');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URL)
  .then((con) => {
    console.log('DB connected!');
  })
  .catch((err) => {
    console.log('DB failed to connect!');
  });

const PORT = process.env.PORT || 3000;

/*
MODELS:
  USER:
    NAME: STRING
    DATE: DATE
    PASSWORD (HASHED): STRING

  ARTWORKS:
    TITLE: STRING
    LINK: STRING
    AUTHOR: ID
    UPVOTES: INT
    CONTEST: ID

  CONTEST:
    TYPE (MONTHLY|WEEKLY|DAILY)
    NAME: STRING
    DATESTART: DATE
    DATEEND: DATE

  LIKE:
    USER: ID
    ARTWORK: ID
    DATE: DATE

ROUTES:
  USER:
    REGISTER (EMAIL, LOGIN, PASSWORD) -> DATE
    LOGIN (LOGIN, PASSWORD) <- TOKEN
    ADMIN:
      DELETE

  ARTWORKS:
    GET <- SORT=DATE|LIKES USER 
    POST

*/

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
