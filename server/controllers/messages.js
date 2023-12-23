import Message from "../models/Message.js";

//add

export const createMessage = async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
};

//get

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
};


export const getLatestMessage = async (req, res) => {
    try {
        const latestMessage = await Message.findOne({
            conversationId: req.params.conversationId,
        }).sort({ createdAt: -1 }).limit(1);

        res.status(200).json(latestMessage);
    } catch (err) {
        res.status(500).json(err);
    }
};
