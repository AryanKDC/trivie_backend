import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import getConfigs from "../../config.js";

const configs = getConfigs();

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role_id: {
      type: String,
      default: "editor",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Generate JWT Token
userSchema.methods.jwtToken = function () {
  return jwt.sign({ id: this._id }, configs.jwt.accessSecret, {
    expiresIn: configs.jwt.accessOptions.expiresIn,
  });
};

// Match Password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
