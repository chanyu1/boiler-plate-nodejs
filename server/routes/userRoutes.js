const { auth } = require('../middlewares/auth');

const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app) => {
  app.get('/api/users/auth', auth, (req, res) => {
    return res.status(200).send({
      _id: req.user._id,
      // 0 is general user, otherwise admin user
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      image: req.user.image,
      role: req.user.role,
    });
  });

  app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);
    // Save request user information
    user.save((err, userInfo) => {
      if (err) return res.send({ success: false, err });

      return res.status(200).send({ success: true });
    });
  });

  app.post('/api/users/login', (req, res) => {
    // Find request email in database
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.send({ success: false, err });
      if (!user) {
        return res.send({
          success: false,
          message: 'No such user exists.',
        });
      }
      // Confirm password if there is a request email in the database
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return res.send({ success: false, err });
        if (!isMatch) {
          return res.send({
            success: false,
            message: 'Password is incorrect.',
          });
        }
        // Generate token if password is correct
        user.generateToken((err, user) => {
          if (err) return res.send({ success: false, err });
          // Store token in client cookie
          return res.cookie('x_auth', user.token).status(200).send({
            success: true,
            userId: user._id,
          });
        });
      });
    });
  });

  app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
      if (err) return res.send({ success: false, err });

      return res.status(200).send({ success: true });
    });
  });
};
