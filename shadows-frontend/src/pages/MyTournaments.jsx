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
      // هذا المسار يجب أن يعيد فقط بطولات المستخدم الحالي
      const res = await api.get("/my-tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.error("Error fetching my tournaments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="page">Loading your tournaments...</div>;

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
              
              {/* عرض الحالة بناءً على is_approved من الـ Database */}
              <div className={`status-box ${t.is_approved ? 'status-approved' : 'status-pending'}`}>
                {t.is_approved ? "✅ Approved" : "⏳ Pending"}
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