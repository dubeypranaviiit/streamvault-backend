import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../config/cookies.js";

import envFile from "../config/env.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
   console.log(name,email,password);
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(409).json({ message: "User already exists" });
  const tenant = await Tenant.create({
    name: `${name}'s Workspace`,
  });
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "editor",          
    tenantId: tenant._id,    
  });
  const accessToken = generateAccessToken(user, envFile.JWT_SECRET);
  const refreshToken = generateRefreshToken(
    user,
    envFile.JWT_REFRESH_SECRET
  );

  user.refreshToken = refreshToken;
  await user.save();
  res
    .cookie("access_token", accessToken, accessTokenCookieOptions)
    .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
    .status(201)
    .json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  }catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const login = async (req, res) => {
  try{
  const { email, password } = req.body;
   console.log(email,password);
  if (!email || !password)
    return res.status(400).json({ message: "Missing credentials" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user, envFile.JWT_SECRET);
  const refreshToken = generateRefreshToken(
    user,
    envFile.JWT_REFRESH_SECRET
  );

  user.refreshToken = refreshToken;
  await user.save();

  res
  .status(200)
  .cookie("access_token", accessToken, accessTokenCookieOptions)
  .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
  .json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    },
  });
   } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }
    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }
    const decoded = jwt.verify(
      refreshToken,
      envFile.JWT_REFRESH_SECRET
    );
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = generateAccessToken(
      user,
      envFile.JWT_SECRET
    );
    res
      .cookie("access_token", newAccessToken, accessTokenCookieOptions)
      .status(200)
      .json({ message: "Access token refreshed" });

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

