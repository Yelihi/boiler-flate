const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
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

app.post("/register", (req, res) => {
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

app.post("/login", (req, res) => {
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
