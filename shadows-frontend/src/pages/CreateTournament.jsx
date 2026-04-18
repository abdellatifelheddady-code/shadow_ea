import { useState } from "react";
import api from "../api";
import "../style/create.css";

export default function CreateTournament() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("solo");
  const [systemType, setSystemType] = useState("chat_only"); // <--- State جديدة
  const [teamSize, setTeamSize] = useState("");
  const [image, setImage] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("game", game);
    formData.append("date", date);
    formData.append("type", type);
    formData.append("system_type", systemType); 
    formData.append("image", image);
    if (type === "squad") formData.append("team_size", teamSize);

    try {
      await api.post("/tournaments", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Tournament created! Waiting for admin approval.");
      setTitle(""); setDescription(""); setGame(""); setDate(""); 
      setImage(null); setType("solo"); setSystemType("chat_only");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating tournament");
    }
  };

  return (
    <div className="page create-tournament-page">
      <div className="card form-card">
        <h2>🏆 Host New Tournament</h2>
        <form onSubmit={handleCreate} className="create-form">
          
          <div className="form-group">
            <label>Tournament Title</label>
            <input placeholder="Enter title..." value={title} onChange={(e)=>setTitle(e.target.value)} required/>
          </div>

          <div className="form-group">
            <label>Game</label>
            <input placeholder="e.g. Free Fire, FIFA" value={game} onChange={(e)=>setGame(e.target.value)} required/>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} required/>
          </div>

          <div className="form-group">
            <label>Format:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="solo">Solo (1 vs 1)</option>
              <option value="squad">Squad (Team Play)</option>
            </select>
          </div>

          {type === "squad" && (
            <div className="form-group">
              <label>Team Size</label>
              <input type="number" placeholder="Players per team" value={teamSize} onChange={(e)=>setTeamSize(e.target.value)} required/>
            </div>
          )}

          <div className="form-group">
            <label>Tournament System:</label>
            <select value={systemType} onChange={(e) => setSystemType(e.target.value)}>
              <option value="chat_only">💬 Chat Only (Simple Coordination)</option>
              <option value="points">📊 Points System (Leaderboard & Rankings)</option>
            </select>
            <p className="helper-text">
              {systemType === 'points' 
                ? "You will be able to manually enter scores for each player." 
                : "A live chat will be created for participants to coordinate."}
            </p>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Rules, Prizes, etc..." value={description} onChange={(e)=>setDescription(e.target.value)}/>
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            <div className="file-input-wrapper">
               <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" required />
            </div>
          </div>

          <button type="submit" className="submit-btn">Publish Tournament</button>
        </form>
      </div>
    </div>
  );
}