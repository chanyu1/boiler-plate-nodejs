const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, trim: true, unique: 1 },
  name: { type: String, maxlength: 30 },
  password: { type: String, minlength: 5 },
  image: { type: String },
  role: { type: Number, default: 0 },
  token: { type: String },
  tokenExp: { type: Number },
});

// Run before saving
userSchema.pre('save', function (next) {
  var user = this;
  // Run only when password is converted
  if (user.isModified('password')) {
    // Password encryption
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function (callback) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save(function (err, user) {
    if (err) return callback(err);

    callback(null, user);
  });
};

userSchema.statics.findByToken = function (token, callback) {
  var user = this;
  // Decode the token
  jwt.verify(token, 'secretToken', function (err, decoded) {
    if (err) return callback(err);
    // Use ID to find the user and verify that the token meatches
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callback(err);

      callback(null, user);
    });
  });
};

mongoose.model('users', userSchema);
