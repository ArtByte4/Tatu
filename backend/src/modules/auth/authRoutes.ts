
import {Router} from "express";
import {
  loginUser,
  logOutUser,
  refreshToken
} from "./authController";

const router: Router = Router();



router.post("/users/auth/login", loginUser);
router.post("/users/auth/refresh", refreshToken);
router.post("/users/auth/logout", logOutUser);


export default router;
