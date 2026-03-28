import { useState } from "react";
import api from "../api";
import "../style/create.css";
export default function CreateTournament() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("");
  const [date, setDate] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tournaments", { title, description, game, date });
      alert("Tournament created! Waiting for admin approval.");
      setTitle(""); setDescription(""); setGame(""); setDate("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error creating tournament");
    }
  };

  return (
    <div className="page">
      <h2>Create Tournament</h2>
      <form onSubmit={handleCreate}>
        <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
        <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
        <input placeholder="Game" value={game} onChange={(e)=>setGame(e.target.value)} required/>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} required/>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}