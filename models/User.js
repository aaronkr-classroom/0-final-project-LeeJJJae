"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const randToken = require("rand-token");
const Subscriber = require("./subscriber");

const userSchema = new Schema(
  {
    apiToken: { type: String },
    name: {
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
    },
    profileImg: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// passport-local-mongoose 플러그인 추가
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

// 가상 속성 추가: fullName
userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

// pre("save") 훅 설정
userSchema.pre("save", function (next) {
  let user = this;

  // API 토큰 생성
  if (!user.apiToken) {
    user.apiToken = randToken.generate(16);
  }

  // 구독자 연결
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({ email: user.email })
      .then((subscriber) => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
