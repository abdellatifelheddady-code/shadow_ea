import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../style/tournaments.css";

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div className="tournaments-page">
        <div className="tournaments-loader">Loading Arena...</div>
      </div>
    );
  }

  return (
    <div className="tournaments-page">
      <div className="tournaments-page-header">
        <h2 className="tournaments-section-title">Explore Tournaments</h2>
        <p>Discover and join active competitions</p>
      </div>

      {tournaments.length === 0 ? (
        <div className="tournaments-no-data">No tournaments available at the moment.</div>
      ) : (
        <div className="tournaments-grid">
          {tournaments.map((t) => (
            <div key={t.id} className="tournament-card">
              <div className="tournament-card-image-container">
                <img
                  src={`http://localhost:8000/storage/${t.image}`}
                  alt={t.title}
                  className="tournament-card-img"
                />
                <span className={`tournament-type-tag ${t.type}`}>{t.type.toUpperCase()}</span>
              </div>

              <div className="tournament-card-body">
                <span className="tournament-game-tag">{t.game}</span>
                <h3>{t.title}</h3>
                <div className="tournament-card-info">
                  <span>{t.date}</span>
                  <span>{t.participants?.length || 0} Players</span>
                </div>
              </div>

              <div className="tournament-card-footer">
                <Link to={`/tournaments/${t.id}`} className="tournament-btn-view-details">
                  View & Join
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
