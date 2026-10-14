const express = require("express");
const router = express.Router();

const {
    createOrGetChat,
    getMyChats,
    markChatAsRead,
    enableChatSecurity,
    changeChatPin,
    disableChatSecurity,
    verifyChatPin,
    lockChat,
    unlockChat,
    deleteChat
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrGetChat);
router.get("/", protect, getMyChats);
router.put("/:chatId/read", protect, markChatAsRead);

router.put("/chat-security", protect, enableChatSecurity);
router.put("/chat-security/pin", protect, changeChatPin);
router.put("/chat-security/disable", protect, disableChatSecurity);
router.post("/chat-security/verify", protect, verifyChatPin);

router.put("/:chatId/lock", protect, lockChat);
router.put("/:chatId/unlock", protect, unlockChat);

router.delete("/:chatId", protect, deleteChat);

module.exports = router;