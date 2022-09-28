const mongoose = require('mongoose');
const User = mongoose.model('users');

let auth = (req, res, next) => {
  // Get the token from the client cookie
  let token = req.cookies.x_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.send({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
