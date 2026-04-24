import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../style/mygames.css";

export default function JoinedTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching joined tournaments..."); // تأكد أن الدالة كتحرك
    api.get("/joined-tournaments")
      .then((res) => {
        console.log("Data received from API:", res.data); // هاد السطر مهم بزاف
        setTournaments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err.response);
        setLoading(false);
      });
  }, []);

if (loading) return (
  <div className="page loading-screen">
    <div className="loader-wrapper">
      <div className="game-spinner"></div>
      <p className="loading-text">FETCHING YOUR GAMES...</p>
    </div>
  </div>
);
  return (
    <div className="page">
      <div className="header-section">
        <h2 className="title">My Arena</h2>
        <p className="subtitle">Here are the tournaments you're currently registered in.</p>
      </div>

      <div className="info-row">
        <span>Total joined tournaments: <strong>{tournaments.length}</strong></span>
      </div>

      {tournaments.length === 0 ? (
        <div className="empty-state">
          <p>No joined tournaments found in database for this user.</p>
          <Link to="/tournaments" className="btn-explore">Discover Competitions</Link>
        </div>
      ) : (
        <div className="games-grid">
          {tournaments.map((t) => (
            <div key={t.id} className="game-card">
              <div className="game-card-overlay" />
              <div className="game-card-content">
                <span className="game-tag">{t.type?.toUpperCase() || "SOLO"}</span>
                <h3>{t.title}</h3>
                <p>{t.game}</p>
                <p className="meta">📅 {t.date || "TBA"} • 👥 {t.participants?.length || 0} players</p>
                <p className="meta">Status: {t.is_approved ? "Live" : "Pending"}</p>
                <Link to={`/tournaments/${t.id}`} className="btn-play">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}