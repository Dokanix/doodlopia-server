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

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
