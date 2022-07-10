const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10; // 10자리인 salt 를 만들어서 비밀번호 암호화 함.

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

const User = mongoose.model("User", userSchema);

module.exports = { User };
