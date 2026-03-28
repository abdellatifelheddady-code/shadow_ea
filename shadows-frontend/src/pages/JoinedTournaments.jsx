import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../style/mygames.css"; // الستايل الجديد

export default function JoinedTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/joined-tournaments")
      .then((res) => {
        setTournaments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page"><div className="loader">Loading your arena...</div></div>;

  return (
    <div className="page">
      <div className="header-section">
        <h2 className="title">🎮 My Arena</h2>
        <p className="subtitle">The tournaments you are participating in</p>
      </div>

      {tournaments.length === 0 ? (
        <div className="empty-state">
          <p>You haven't joined any tournaments yet.</p>
          <Link to="/tournaments" className="btn-explore">Explore Tournaments</Link>
        </div>
      ) : (
        <div className="games-grid">
          {tournaments.map((t) => (
            <div className="game-card" key={t.id}>
              <div className="game-card-overlay"></div>
              <div className="game-card-content">
                <span className="game-tag">{t.game}</span>
                <h3>{t.title}</h3>
                <div className="game-meta">
                  <span>📅 {t.date}</span>
                </div>
                <Link to={`/tournaments/${t.id}`} className="btn-play">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}