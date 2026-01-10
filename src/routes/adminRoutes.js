import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import { listUsers } from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/users",
  protect,
  (req,res,next)=>{
  console.log(`req came`);
  next();
  },
  authorizeRoles("admin"),
  listUsers
);

export default router;
