const express = require("express");
const router = express.Router();

const { createOrGetChat, getMyChats, markChatAsRead } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrGetChat);
router.get("/", protect, getMyChats);
router.put("/:chatId/read", protect, markChatAsRead);

module.exports = router;