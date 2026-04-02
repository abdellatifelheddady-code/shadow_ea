import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

export default function TournamentChat({ tournamentId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);
  const isFirstLoad = useRef(true); // Bach n-hbto l-ltaht ghir f l-bedya

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/tournaments/${tournamentId}/messages`);
      setMessages(res.data);
      
      // Ila kant awel merra k-it-fetchaw les messages, hbat l-ltaht
      if (isFirstLoad.current && res.data.length > 0) {
        chatEndRef.current?.scrollIntoView({ behavior: "auto" });
        isFirstLoad.current = false;
      }
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !image) return;
    if (isSending) return;

    setIsSending(true);
    const formData = new FormData();
    formData.append("content", newMessage || "");
    if (image) formData.append("image", image);

    try {
      const res = await api.post(`/tournaments/${tournamentId}/messages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
      setImage(null);
      document.getElementById("chat-file-input").value = "";
      
      // Fach s-safet message, hbat l-ltaht darori
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h4>⚔️ Arena Communication</h4>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && <p className="empty-chat">No signals yet. Start the broadcast!</p>}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.user_id === currentUser?.id ? "own" : "other"}`}>
            <div className="msg-bubble">
              <div className="msg-info">
                <span className="user-name">{msg.user?.name || "Player"}</span>
                <span className="msg-time">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="msg-body">
                {msg.content && <p className="msg-text">{msg.content}</p>}
                {msg.image && (
                  <div className="msg-image-wrapper">
                    <img 
                      src={`http://localhost:8000/storage/${msg.image}`} 
                      alt="screenshot" 
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
          <label className={`file-btn ${image ? "active" : ""}`} htmlFor="chat-file-input">
            {image ? "✅" : "📷"}
          </label>
          <input 
            id="chat-file-input"
            type="file" 
            accept="image/*" 
            hidden 
            onChange={(e) => setImage(e.target.files[0])} 
          />
          <input 
            type="text" 
            placeholder={image ? "Image ready to send..." : "Type your message..."} 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
          />
        </div>
        <button type="submit" className="send-btn" disabled={isSending}>
          {isSending ? "..." : "SEND"}
        </button>
      </form>
    </div>
  );
}