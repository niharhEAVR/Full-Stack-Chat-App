import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { fetchUserForSideBar, getMessages, sentMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, fetchUserForSideBar)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sentMessages)

export default router;