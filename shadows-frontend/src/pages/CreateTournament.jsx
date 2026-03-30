import { useState } from "react";
import api from "../api";
import "../style/create.css";

export default function CreateTournament() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("solo");
  const [teamSize, setTeamSize] = useState("");
  const [image, setImage] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // ضروري لإرسال الملفات (Images)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("game", game);
    formData.append("date", date);
    formData.append("type", type);
    formData.append("image", image);
    if (type === "squad") formData.append("team_size", teamSize);

    try {
      await api.post("/tournaments", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Tournament created! Waiting for admin approval.");
      // مسح الفورم
      setTitle(""); setDescription(""); setGame(""); setDate(""); setImage(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating tournament");
    }
  };

  return (
    <div className="page">
      <h2>Create New Tournament</h2>
      <form onSubmit={handleCreate} className="create-form">
        <input placeholder="Tournament Title" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
        <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
        <input placeholder="Game (e.g. Valorant, Free Fire)" value={game} onChange={(e)=>setGame(e.target.value)} required/>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} required/>
        
        <div className="form-group">
          <label>Tournament Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="solo">Solo</option>
            <option value="squad">Squad</option>
          </select>
        </div>

        {type === "squad" && (
          <input type="number" placeholder="Team Size (e.g. 4)" value={teamSize} onChange={(e)=>setTeamSize(e.target.value)} required/>
        )}

        <div className="form-group">
          <label>Cover Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" required />
        </div>

        <button type="submit">Submit Tournament</button>
      </form>
    </div>
  );
}