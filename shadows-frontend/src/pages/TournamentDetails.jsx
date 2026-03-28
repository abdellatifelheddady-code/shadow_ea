import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../style/tournaments.css"; // غانستعملو نفس الستايل مع إضافات

export default function TournamentDetails() {
  const { id } = useParams(); // كيجيب الـ ID من الـ URL
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/tournaments/${id}`)
      .then(res => {
        setTournament(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="page"><h2>Loading...</h2></div>;
  if (!tournament) return <div className="page"><h2>Tournament not found!</h2></div>;

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      
      <div className="details-container">
        <div className="details-header">
          <h1>{tournament.title}</h1>
          <span className="game-badge">{tournament.game}</span>
        </div>

        <div className="details-main">
          <div className="description-section">
            <h3>Description</h3>
            <p>{tournament.description}</p>
            <div className="info-row">
              <span>📅 Date: {tournament.date}</span>
              <span>👥 Participants: {tournament.participants?.length || 0}</span>
            </div>
          </div>

          <div className="participants-section">
            <h3>Registered Players</h3>
            <div className="players-list">
              {tournament.participants && tournament.participants.length > 0 ? (
                tournament.participants.map((player, index) => (
                  <div key={player.id} className="player-card">
                    <span className="player-rank">#{index + 1}</span>
                    <span className="player-name">{player.name}</span>
                  </div>
                ))
              ) : (
                <p>No players joined yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}