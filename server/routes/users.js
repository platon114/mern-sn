import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    updateUserData,
    getRandomUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
/* READ */
router.get("/:id/random/:count", verifyToken, getRandomUsers);

/* UPDATE */
router.patch("/:id", verifyToken, updateUserData);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);


export default router;