const mongoose = require("mongoose");

const chatParticipantSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            enum: ["member", "admin", "owner"],
            default: "member",
        },

        lastSeenMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },

        lastSeenAt: Date,

        muted: {
            type: Boolean,
            default: false,
        },

        pinned: {
            type: Boolean,
            default: false,
        },

        archived: {
            type: Boolean,
            default: false,
        },
        unreadCount: {
            type: Number,
            default: 0,
        },

        nickname: String,

        chatLock: {
            enabled: {
                type: Boolean,
                default: false,
            },

            lockedAt: {
                type: Date,
                default: null,
            },
        },
        hidden: {
            type: Boolean,
            default: false,
        },

        lockedAt: Date,
    },
    {
        timestamps: true,
    });

chatParticipantSchema.index(
    {
        chat: 1,
        user: 1,
    },
    {
        unique: true,
    });

module.exports = mongoose.model(
    "ChatParticipant",
    chatParticipantSchema
);