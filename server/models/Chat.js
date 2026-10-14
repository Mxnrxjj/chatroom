const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        chatKey: {
            type: String,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        chatName: {
            type: String,
            trim: true,
        },
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    {
        timestamps: true,
    }
);

chatSchema.index({ users: 1 });

chatSchema.index(
    { chatKey: 1 },
    {
        unique: true,
        partialFilterExpression: { isGroupChat: false }
    }
);

chatSchema.pre("validate", function () {
    if (!this.isGroupChat && this.users.length === 2) {
        const sortedUsers = this.users
            .map((u) => u.toString())
            .sort();

        this.chatKey = sortedUsers.join("_");
    }
});

chatSchema.pre("save", function () {
    // Prevent duplicate users
    const uniqueUsers = new Set(this.users.map((u) => u.toString()));
    if (uniqueUsers.size !== this.users.length) {
        throw new Error("Duplicate users in chat");
    }

    // 1:1 chat rules
    if (!this.isGroupChat) {
        if (this.users.length !== 2) {
            throw new Error("1:1 chat must have exactly 2 users");
        }

        if (!this.chatKey) {
            throw new Error("chatKey required for 1:1 chat");
        }
    }

    // Group chat rules
    if (this.isGroupChat) {
        this.chatKey = undefined;
    }
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;