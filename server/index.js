const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// client 에서 application/x-www-form-urlencoded 를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 을 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.json());
// cookie 에다가 token 저장할 시 사용.
app.use(cookieParser());

mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!")); // root 디렉토리에 오면 문구를 띄우도록 한다.

app.get("/api/users/hello", (req, res) => res.send("안녕하세요"));

app.post("/api/users/register", (req, res) => {
  // 회원가입 할때 필요한 정보들을 클라이언트에서 가져오면 그것들을 데이터베이스에 넣어준다.

  const user = new User(req.body); // req.body 에는 json 형식으로 데이터가 있는것임. 이렇게 해줄 수 있는것이 body.parser 가 있기때문엑 가능.

  user.save((err, userInfo) => {
    // userInfo 는 위 user
    if (err) return res.json({ success: false, err }); // err 가 있다면 json 형식으로 전달할 것임. 메세지도 함께
    return res.status(200).json({
      // 성공했다면, 200은 성공의 의미 + json 형식으로 성공 전달.
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      // 비밀 번호까지 맞다면 유저를 위한 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // token save.. where? cookie? localstorage?
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // middleware 를 추가한다. 콜백함수를 하기 전 중간에서 무언가를 해주는 역할. auth.js 에서 온다.

  // 여기까지 미들웨어를 통과했다는 이야기는 Auth 가 true 라는 이야기
  res.status(200).json({
    _id: req.user._id, // req.user 에 user 넣어서 쓸 수 있는것임.
    isAdmin: req.user.role === 0 ? false : true, // 이건 부서에 따라 조건이 달라질 수 있다. 지금은 그냥 0이면 일반유저, 아니면 관리자.
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
