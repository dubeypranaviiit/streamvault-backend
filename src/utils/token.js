import jwt from "jsonwebtoken";
export const generateAccessToken = (user, secret) => {
  return jwt.sign(
    { id: user._id, role: user.role,
       tenantId: user.tenantId, 
       name: user.name, email: user.email
     },
    secret,
    { expiresIn: "15m" }
  );
};
export const generateRefreshToken = (user, refreshSecret) => {
  return jwt.sign(
    { id: user._id },
    refreshSecret,
    { expiresIn: "7d" }
  );
};
