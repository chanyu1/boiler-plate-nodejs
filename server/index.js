const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const keys = require('./config/keys');
require('./models/User');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.Router());
app.use(cookieParser());

require('./routes/userRoutes')(app);

const mongoose = require('mongoose');
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log(err));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Your app listening on port ${PORT}!`));
