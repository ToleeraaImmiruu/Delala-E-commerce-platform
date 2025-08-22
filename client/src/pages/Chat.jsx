import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = ({ carId }) => {
  const [chat, setChat] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // chat window toggle

  const token = localStorage.getItem("token");

  // Start or get chat
  const startChat = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chats/start",
        { carId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChat(res.data);
      fetchMessages(res.data._id);
      setIsOpen(true);
    } catch (err) {
      console.error("Failed to start chat:", err);
      alert("Failed to start chat");
    }
    setLoading(false);
  };

  // Fetch messages
  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chats/${chatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chat) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chats/send",
        { chatId: chat._id, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    if (carId && isOpen) {
      startChat();
    }
  }, [carId]);

  return (
    <>
      {/* Floating circular chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#4caf50",
          color: "#fff",
          border: "none",
          fontSize: "28px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
        title="Chat with seller"
      >
        💬
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            maxHeight: "400px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          {loading && <p>Loading chat...</p>}

          {chat && (
            <>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Chat about car
              </div>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "4px",
                  borderBottom: "1px solid #ccc",
                  marginBottom: "8px",
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    style={{
                      alignSelf:
                        msg.sender === token ? "flex-end" : "flex-start",
                      backgroundColor:
                        msg.sender === token ? "#dcf8c6" : "#f1f0f0",
                      padding: "6px 10px",
                      borderRadius: "12px",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatPage;
