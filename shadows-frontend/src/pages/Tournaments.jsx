import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../style/tournaments.css";

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب الـ User من الـ LocalStorage للتأكد من حالة الانضمام
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      // Laravel دابا كيرجع غير المقبولين (Approved)
      const res = await api.get("/tournaments");
      setTournaments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      await api.post(`/tournaments/${id}/join`);
      alert("✅ Succès ! Vous avez rejoint le tournoi.");
      fetchTournaments(); // تحديث القائمة
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  if (loading) return <div className="page"><div className="loader">Loading tournaments...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="section-title">🎮 Explore Tournaments</h2>
        <p>Discover and join active competitions</p>
      </div>

      {tournaments.length === 0 ? (
        <div className="no-data">No tournaments available at the moment.</div>
      ) : (
        <div className="grid"> {/* الترتيب الأفقي Grid */}
          {tournaments.map((t) => {
            const isJoined = t.participants?.some(p => p.id === userId);

            return (
              <div key={t.id} className="card">
                <div className="card-body">
                  <span className="game-tag">{t.game}</span>
                  <h3>{t.title}</h3>
                  <p className="description">{t.description?.substring(0, 90)}...</p>
                  <div className="card-info">
                    <span>📅 {t.date}</span>
                    <span>👥 {t.participants?.length || 0} Joueurs</span>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="card-buttons">
                    <Link to={`/tournaments/${t.id}`} className="btn-details">
                      Details
                    </Link>
                    {!isJoined ? (
                      <button className="btn-join" onClick={() => handleJoin(t.id)}>
                        Join
                      </button>
                    ) : (
                      <span className="joined-status">✅ Joined</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}