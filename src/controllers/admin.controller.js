import User from "../models/User.js";

export const listUsers = async (req, res) => {
  try {
    console.log(`request came`);
    const users = await User.find({
      tenantId: req.user.tenantId,
    }).select("_id name email role createdAt");
   console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
