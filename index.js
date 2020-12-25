const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! 안녕하세요~~!");
});

app.post("/register", (req, res) => {
  // 회원가입할 때 필요한 정보들을 client에서 가져오면 DB에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/login", (req, res) => {
  // 요청된 이메일이 DB에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    // 요청된 이메일 유저가 없을 경우.
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "The user could not be found.",
      });
    }
    // 요청된 이메일이 DB에 있다면, 비밀번호가 맞는지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "The password was incorrect.",
        });
      // 비밀번호까지 맞다면 토큰 생성.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 토큰을 쿠키에 저장.
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
