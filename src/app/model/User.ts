import mongoose, { Schema, Document } from "mongoose";
const validator = require("validator");

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiration: Date;
  messages: Message[];
}

const allRoles = {
  user: [],
  admin: ["getUsers", "manageUsers", "manageProducts", "manageOrders"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

const messageSchema: Schema<Message> = new Schema(
  {
    content: {
      type: String,
      default: "This",
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

const userSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
      validate: {
        validator: (value: string) =>
          value.match(/\d/) && value.match(/[a-zA-Z]/),
        message: "Password must contain at least one letter and one number",
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    verifyCode: {
      type: String,
      required: [true, "Verify Code is required"],
      length: 255,
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      required: false,
    },
    isAcceptingMessage: {
      type: Boolean,
      default: false,
      required: false,
    },
    verifyCodeExpiration: {
      type: Date,
      required: false,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  Message,
};
