
require("dotenv").config();

const connectDB = require("./config/db");

const Chat = require("./models/Chat");
const ChatParticipant = require("./models/ChatParticipant");

async function run() {
    await connectDB();

    const chats = await Chat.find();

    for (const chat of chats) {
        for (const userId of chat.users) {
            const exists = await ChatParticipant.findOne({
                chat: chat._id,
                user: userId,
            });

            if (!exists) {
                await ChatParticipant.create({
                    chat: chat._id,
                    user: userId,
                });

                console.log(
                    `Created participant for ${userId} in chat ${chat._id}`
                );
            }
        }
    }

    console.log("Done!");

    process.exit();
}

run().catch(console.error);