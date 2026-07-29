const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const { registerUser, loginUser, getUsers, updateProfile, changePassword } = require("../controllers/userController");

router.get("/me", protect, (req, res) => {
    res.json(req.user);
})

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getUsers);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;