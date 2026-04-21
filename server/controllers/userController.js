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
        console.log(error);
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
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { username: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};

        const users = await User.find(keyword)
            .find({ _id: { $ne: req.user._id } })
            .select("-password");

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUsers,
};