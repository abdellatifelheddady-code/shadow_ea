import { useState, useEffect } from "react";
import api from "../api";

export default function TournamentLeaderboard({ tournamentId, isOrganizer, participants }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [rankPoints, setRankPoints] = useState(0);
  const [killPoints, setKillPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get(`/tournaments/${tournamentId}/leaderboard`);
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [tournamentId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post(`/tournaments/${tournamentId}/points`, {
        user_id: selectedUser,
        rank_points: parseInt(rankPoints) || 0,
        kill_points: parseInt(killPoints) || 0
      });
      alert("Points Added Successfully!");
      setRankPoints(0);
      setKillPoints(0);
      fetchLeaderboard(); // تحديث الجدول مباشرة
    } catch (err) {
      alert(err.response?.data?.message || "Error updating points");
    } finally {
      setIsSubmitting(false);
    }
  };

  // تصفية المشاركين باش يبان كل فريق مرة وحدة (عن طريق الكابتن)
  const uniqueTeams = participants.reduce((acc, current) => {
    const teamKey = current.team_name && current.team_name !== "Solo Player" 
      ? current.team_name 
      : current.name;
    
    if (!acc.find(item => (item.team_name === current.team_name && current.team_name !== "Solo Player") || item.name === current.name)) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <div className="leaderboard-section">
      {isOrganizer && (
        <form className="admin-points-form card" onSubmit={handleUpdate}>
          <h4>Add Match Points (Accumulative)</h4>
          <p className="helper-text">Select team to add points to their total score.</p>
          
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
            <option value="">-- Choose Team/Player --</option>
            {uniqueTeams.map(p => (
              <option key={p.id} value={p.id}>
                {p.team_name && p.team_name !== "Solo Player" ? `Team: ${p.team_name}` : `Player: ${p.name}`}
              </option>
            ))}
          </select>

          <div className="input-row" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input 
              type="number" 
              placeholder="Rank Pts" 
              value={rankPoints} 
              onChange={(e) => setRankPoints(e.target.value)} 
              required 
            />
            <input 
              type="number" 
              placeholder="Kill Pts" 
              value={killPoints} 
              onChange={(e) => setKillPoints(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-save">
            {isSubmitting ? "Saving..." : "➕ Add Points"}
          </button>
        </form>
      )}

      <div className="table-wrapper card">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team / Player</th>
              <th>Rank Pts</th>
              <th>Kill Pts</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((item, index) => {
                const participant = participants.find(p => p.id === item.user_id);
                const displayName = (participant?.team_name && participant.team_name !== "Solo Player") 
                  ? participant.team_name 
                  : item.user?.name;

                return (
                  <tr key={item.id}>
                    <td>
                      <span className={`rank-badge rank-${index + 1}`}>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </span>
                    </td>
                    <td className="team-name-cell">{displayName}</td>
                    <td>{item.rank_points}</td>
                    <td>{item.kill_points}</td>
                    <td className="total-pts"><strong>{item.total_points}</strong></td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="5">No points recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}