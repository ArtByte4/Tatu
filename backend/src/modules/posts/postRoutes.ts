import { Router } from "express";
import {
  createPostHandler,
  getAllPostsHandler,
  getUserPostsHandler,
  getTattooStylesHandler,
} from "./postController";
import { verifyToken } from "../user/middlewares/validateToken";

const router: Router = Router();

// Todas las rutas requieren autenticación
router.post("/posts", verifyToken, createPostHandler);
router.get("/posts", verifyToken, getAllPostsHandler);
router.get("/posts/user/:userId", verifyToken, getUserPostsHandler);
router.get("/posts/styles", verifyToken, getTattooStylesHandler);

export default router;



