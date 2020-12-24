const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    defalut: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  // 비밀번호가 변경될 때만 실행.
  if (user.isModified("password")) {
    // 비밀번호를 암호화시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
    // 비밀번호 외의 것이 변경될 때 실행.
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  // plainPassword(123456)와 암호화된 비밀번호를 비교.
  // 복호화가 불가하기 때문에, plainPassword를 암호화 후 비교.
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err), callback(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
