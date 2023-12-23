import express from "express";
import { createMessage, getMessages, getLatestMessage } from "../controllers/messages.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router(); // Создаем экземпляр Router

// POST-маршрут для добавления нового сообщения
router.post("/createMessage", verifyToken, createMessage);

// GET-маршрут для получения сообщений в рамках беседы
router.get("/getMessages/:conversationId", verifyToken, getMessages);

router.get("/getMessage/:conversationId", verifyToken, getLatestMessage);

export default router;
