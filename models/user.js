const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10; // 10자리인 salt 를 만들어서 비밀번호 암호화 함.
const jwt = require("jsonwebtoken");

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
    default: 0,
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
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
        // Store hash in your password DB.
      });
    });
  } else {
    next();
  }
  // 비밀번호를 암호화 시킨다.
}); // 몽구스에서 가져온 메서드. 유저 정보를 저장하기 전에 무엇을 한다.

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword : 1234567.. , 데이터베이스에 있는 암호화된 비밀번호 / 두 가지를 비교해본다. 따라서 plainPassword 역시 암호화 해야한다.
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  // jwt 를 이용해서 tokken 생성하기
  var token = jwt.sign(user._id.toString(), "secretToken"); // 데이터베이스 상 id , user_id + secretToken = token 이라서 secretToken 도 기억해야한다.

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
