import cloudinary from "../lib/cloudinary.js";
import message from "../models/message.model.js";
import user from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const fetchUserForSideBar = async (req, res) => {
    try {
        const loggedInUsersId = req.user._id;
        const filteredUsers = await user.find({ _id: { $ne: loggedInUsersId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in the fetch users controller ->", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const userMessages = await message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(userMessages)
    } catch (error) {
        console.error("Error in the getMessages controller ->", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sentMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const myId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new message({
            senderId: myId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in the sentMessages controller ->", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}