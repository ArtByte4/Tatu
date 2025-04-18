import express from "express";
import {
  getAllUsers,
  createUser,
  getOneUser,
  loginUser,
  logOutUser,
  refreshToken,
  verifyToken,
  getOneProfile,
  updatephotoPefil
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers);
router.get("/users/:user_handle", verifyToken, getOneUser);
router.get("/users/profile/:user_handle", getOneProfile);

router.put("/users/profile/:user_handle/photo", updatephotoPefil);

router.post("/users", createUser);
router.post("/users/auth/login", loginUser);
router.post("/users/auth/refresh", refreshToken);
router.post("/users/auth/logout", logOutUser);



export default router;
