import catchAsync from "../utils/catchAsync.js";
import User from "../database/models/user_model.js";
import { verify } from "../utils/auth_utils.js";
import getConfigs from "../config.js";

const configs = getConfigs();

export const SignIn = catchAsync(async (req, res, next) => {
  const origin = req.get("Origin");
  const { user_name, password } = req.body;

  if (!user_name)
    return res.status(400).json({
      result: [],
      status: false,
      message: "UserNameRequired",
    });

  if (!password)
    return res.status(400).json({
      result: [],
      status: false,
      message: "PassowrdRequired",
    });

  const user = await User.findOne({ user_name: user_name }).select(
    "-otp -verify_otp -otp_expiry_date"
  );
  // .populate('role_id'); // Commented out as Role model is not yet defined

  if (!user) {
    return res.status(401).json({
      result: [],
      status: false,
      message: "User not found with this User Name.",
    });
  }
  if (user.status === false) {
    return res.status(401).json({
      result: [],
      status: false,
      message: "You are Blocked By Admin",
    });
  }
  const passwordHash = user.password;
  const passwordMatch = await verify(password, passwordHash);

  if (!passwordMatch) {
    return res
      .status(401)
      .json({ result: [], status: false, message: "PasswordInValid" });
  }

  const token = user.jwtToken();
  const options = {
    expires: new Date(
      Date.now() + configs.cookie.cookie_expire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "Lax",
  };

  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");

  return res.status(200).cookie("token", token, options).json({
    token,
    result: user,
    status: true,
    message: "Login successfully.",
  });
});
