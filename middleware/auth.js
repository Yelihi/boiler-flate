const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리를 하는 곳

  // 클라이언트 쿠키에서 토큰을 가져온다.

  let token = req.cookies["x_auth"];

  // 토큰을 복호화 한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token; // 토큰 넣어주고 (app.get 에서 req.user 나 req.token 을 쳤을 때 지금 저장한 값이 들어갈 수 있어서 해줌.)
    req.user = user; // 유저 넣어주고
    next(); // middleware 에서 다음으로 넘어갈 수 있게.
  });

  // 유저가 있으면 인증 완료. 유저가 없으면 인증 안됨.
};

module.exports = { auth };
