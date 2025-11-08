import { Router } from "express";
import {
  getConversationsList,
  getMessagesWithUser,
  sendMessage,
} from "./messageController";
import { verifyToken } from "../user/middlewares/validateToken";

const router: Router = Router();

// Todas las rutas requieren autenticación
router.get("/messages/conversations", verifyToken, getConversationsList);
router.get("/messages/:userId", verifyToken, getMessagesWithUser);
router.post("/messages", verifyToken, sendMessage);

export default router;


