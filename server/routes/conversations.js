import express from "express";
import { createConv, getConvOfUser, getConvIncludesTwoUserId, getConvById } from "../controllers/conversations.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router(); // Создаем экземпляр Router

// POST-маршрут для создания новой беседы
router.post("/createConv", verifyToken, createConv);

// GET-маршрут для получения списка бесед пользователя
router.get("/user/:userId", verifyToken, getConvOfUser);

// GET-маршрут для получения беседы, включающей два заданных пользователя
router.get("/between/:firstUserId/:secondUserId", verifyToken, getConvIncludesTwoUserId);

router.get("/:convId", verifyToken, getConvById);

export default router;
