
import express from "express";
import {
  loginUser,
  logOutUser,
  refreshToken
} from "./authController.js";

const router = express.Router();



router.post("/users/auth/login", loginUser);
router.post("/users/auth/refresh", refreshToken);
router.post("/users/auth/logout", logOutUser);


export default router;
