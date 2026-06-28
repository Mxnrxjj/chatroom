const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        avatar: {
            type: String,
            default: function () {
                const bgColors = [
                    "b6e3f4",
                    "c0aede",
                    "ffd5dc",
                    "ffdfbf",
                    "d1d4f9",
                    "c4f0c5",
                ];

                let hash = 0;
                const id = this._id.toString();

                for (let i = 0; i < id.length; i++) {
                    hash = id.charCodeAt(i) + ((hash << 5) - hash);
                }

                const bg = bgColors[Math.abs(hash) % bgColors.length];

                return `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=${bg}`;
            },
        },
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;