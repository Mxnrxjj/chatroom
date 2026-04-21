const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    try {
        const { content, room } = req.body;

        if (!content || !room) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const message = await Message.create({
            sender: req.user._id,
            content,
            room,
        });

        res.status(201).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending message' });
    }
};

const getMessages = async (req, res) => {
    try {
        const { room } = req.params;

        const messages = await Message.find({ room })
            .populate('sender', 'username email')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.lozg(error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

module.exports = {
    sendMessage,
    getMessages,
};