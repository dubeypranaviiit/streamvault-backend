import envFile from "./env.js";
export const accessTokenCookieOptions = {
  httpOnly: true,
  secure:true,
  sameSite: "none",
  maxAge: 15 * 60 * 1000,
};
export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure:true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
