import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

export default function TournamentChat({ tournamentId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [isSending, setIsSending] = useState(false); // باش نمنعو تكرار الضغط
  const chatEndRef = useRef(null);

  // استعمال useCallback باش نقدرو نخدمو بـ fetchMessages داخل useEffect وبرا منها بلا مشاكل
  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/tournaments/${tournamentId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); // تحديث كل 4 ثواني
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !image) return;
    if (isSending) return;

    setIsSending(true);
    const formData = new FormData();
    formData.append("content", newMessage || ""); // صيفط نص خاوي يلا كانت غير تصويرة
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await api.post(`/tournaments/${tournamentId}/messages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // ضروري باش الـ Backend يفهم بلي كاين ملف
        },
      });

      setMessages((prev) => [...prev, res.data]); 
      setNewMessage("");
      setImage(null);
      // مسح الـ Input ديال الملف يدوياً
      document.getElementById("chat-file-input").value = ""; 
    } catch (err) {
      console.error("Error sending message:", err);
      alert(err.response?.data?.message || "Error sending message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container card">
      <div className="chat-messages">
        {messages.length === 0 && <p className="empty-chat">No messages yet. Start the conversation!</p>}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.user_id === currentUser?.id ? "own" : "other"}`}>
            <div className="msg-bubble">
              <div className="msg-info">
                <span className="user-name">{msg.user?.name || "Player"}</span>
                <span className="msg-time">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="msg-body">
                {msg.content && <p className="msg-text">{msg.content}</p>}
                {msg.image && (
                  <div className="msg-image-wrapper">
                    <img 
                      src={`http://localhost:8000/storage/${msg.image}`} 
                      alt="result screenshot" 
                      className="chat-img" 
                      onClick={() => window.open(`http://localhost:8000/storage/${msg.image}`, '_blank')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder={image ? "Image attached..." : "Type a message..."} 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
          />
          <label className={`file-label ${image ? "attached" : ""}`} htmlFor="chat-file-input">
            {image ? "✅" : "📷"}
            <input 
              id="chat-file-input"
              type="file" 
              accept="image/*"
              hidden 
              onChange={(e) => setImage(e.target.files[0])} 
            />
          </label>
        </div>
        <button type="submit" className="send-btn" disabled={isSending}>
          {isSending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}