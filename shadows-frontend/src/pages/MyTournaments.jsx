import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../style/mytournament.css";

export default function MyTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching my tournaments...");
      const res = await api.get("/my-tournaments");
      console.log("Response:", res.data);
      setTournaments(res.data);
    } catch (err) {
      console.error("Error fetching my tournaments:", err);
      console.error("Error details:", err.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // if (loading) return <div className="page">Loading your tournaments...</div>;
  if (loading) return (
  <div className="page loading-state">
    <div className="spinner"></div>
    <p>Loading your tournaments...</p>
  </div>
);

  return (
    <div className="page">
      <h2 className="section-title">🏆 My Tournaments</h2>
      
      {tournaments.length === 0 ? (
        <div className="no-tournaments">
          <p>You haven't created any tournaments yet.</p>
          <Link to="/create-tournament" className="btn-explore">Create Tournament</Link>
        </div>
      ) : (
        <div className="my-tournaments-grid">
          {tournaments.map((t) => (
            <div className="my-card" key={t.id}>
              <div className="card-header">
                <h3>{t.title}</h3>
                <span className="game-name">🎮 {t.game}</span>
              </div>
              
              <p className="card-description">{t.description ? t.description.substring(0, 60) + "..." : "No description"}</p>
              
              {/* عرض الحالة بناءً على is_approved من الـ Database */}
              <div className={`status-box ${t.is_approved ? 'status-approved' : 'status-pending'}`}>
                {t.is_approved ? "✅ Approved" : "⏳ Pending"}
              </div>

              <div className="participants-count">
                👥 {t.participants?.length || 0} Participants
              </div>

              <div className="my-card-actions">
                 <Link to={`/tournaments/${t.id}`} className="btn-manage btn-view">
                  Details
                 </Link>
                 <span className="date-tag">📅 {t.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}