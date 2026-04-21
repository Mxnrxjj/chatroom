const express = require("express");
const router = express.Router();

const { createOrGetChat, getMyChats } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrGetChat);
router.get("/", protect, getMyChats);

module.exports = router;