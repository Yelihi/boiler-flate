const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/User");

// client 에서 application/x-www-form-urlencoded 를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 을 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.json());

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
