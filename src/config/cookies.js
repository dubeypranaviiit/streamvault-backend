import envFile from "./env.js";
export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: envFile.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000,
};
export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: envFile.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
