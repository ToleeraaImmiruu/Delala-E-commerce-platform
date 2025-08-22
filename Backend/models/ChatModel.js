import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // buyer & seller
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" }, // the car they’re chatting about
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }]
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;   // ✅ ES module export
