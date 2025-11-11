import { Router } from "express";
import {
  createPostHandler,
  getAllPostsHandler,
  getUserPostsHandler,
  getTattooStylesHandler,
  deletePostHandler,
} from "./postController";
import {
  getCommentsHandler,
  createCommentHandler,
  deleteCommentHandler,
} from "./commentController";
import { verifyToken } from "../user/middlewares/validateToken";

const router: Router = Router();

// Todas las rutas requieren autenticación
router.post("/posts", verifyToken, createPostHandler);
router.get("/posts", verifyToken, getAllPostsHandler);
router.get("/posts/user/:userId", verifyToken, getUserPostsHandler);
router.get("/posts/styles", verifyToken, getTattooStylesHandler);
router.delete("/posts/:postId", verifyToken, deletePostHandler);

// Rutas de comentarios
router.get("/posts/:postId/comments", verifyToken, getCommentsHandler);
router.post("/posts/:postId/comments", verifyToken, createCommentHandler);
router.delete("/comments/:commentId", verifyToken, deleteCommentHandler);

export default router;



