// routes/chatRoutes.js
import express from "express";
import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";
import Car from "../models/Car.js";
import  verifyToken  from "../middleware/authoMiddleware.js";

const router = express.Router();

/**
 * 🔹 Start a chat between buyer and seller
 * Buyer sends carId → we connect buyer + seller in one chat
 */
router.post("/start", verifyToken, async (req, res) => {
  try {
    const { carId } = req.body;

    const car = await Car.findById(carId).populate("seller");
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Check if chat already exists between buyer & seller for this car
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, car.seller._id] },
      car: carId,
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, car.seller._id],
        car: carId,
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🔹 Send a message in a chat
 */
router.post("/send", verifyToken, async (req, res) => {
  try {
    const { chatId, text } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Ensure user is part of chat
    if (!chat.participants.map(p => p.toString()).includes(req.user.id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text,
    });

    chat.messages.push(message._id);
    await chat.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🔹 Get all messages in a chat
 */
router.get("/:chatId", verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("messages")
      .populate("participants", "name email");

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Ensure only participants can view
    if (!chat.participants.map(p => p._id.toString()).includes(req.user.id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(chat.messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
