const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const userExists = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (userExists) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // response
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Send token
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            avatar: user.avatar,
            bio: user.bio || "",
            chatSecurity: {
                enabled: user.chatSecurity.enabled,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const search = req.query.search;

        if (!search) {
            return res.json([]);
        }

        const users = await User.find({
            _id: { $ne: req.user._id },
            username: { $regex: `${search}`, $options: "i" },
        })
            .select("_id username avatar")
            .limit(10);

        res.json(users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { username, bio, avatar } = req.body;

        if (!username) {
            return res.status(400).json({
                message: "Username is required",
            });
        }

        const existingUser = await User.findOne({
            username,
            _id: { $ne: req.user._id },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.username = username;
        user.bio = bio || "";
        user.avatar = avatar || user.avatar;

        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Current password is incorrect",
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({
            message: "Password changed successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    updateProfile,
    changePassword,
};