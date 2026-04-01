import { useState, useEffect } from "react";
import api from "../api";

export default function TournamentLeaderboard({ tournamentId, isOrganizer, participants }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [rankPoints, setRankPoints] = useState(0);
  const [killPoints, setKillPoints] = useState(0);

  const fetchLeaderboard = async () => {
    const res = await api.get(`/tournaments/${tournamentId}/leaderboard`);
    setLeaderboard(res.data);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [tournamentId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tournaments/${tournamentId}/points`, {
        user_id: selectedUser,
        rank_points: rankPoints,
        kill_points: killPoints
      });
      alert("Points Updated!");
      fetchLeaderboard(); // تحديث الجدول
    } catch (err) {
      alert("Error updating points");
    }
  };

  return (
    <div className="leaderboard-section">
      {/* 1. الفورم كيبان غير للمنظم */}
      {isOrganizer && (
        <form className="admin-points-form card" onSubmit={handleUpdate}>
          <h4>Update Points (Organizer Only)</h4>
          <select onChange={(e) => setSelectedUser(e.target.value)} required>
            <option value="">Select Player/Captain</option>
            {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="number" placeholder="Rank Points" onChange={(e) => setRankPoints(e.target.value)} />
          <input type="number" placeholder="Kill Points" onChange={(e) => setKillPoints(e.target.value)} />
          <button type="submit">Save</button>
        </form>
      )}

      {/* 2. جدول الترتيب كيبان للكل */}
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player/Team</th>
            <th>Rank Pts</th>
            <th>Kill Pts</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((item, index) => (
            <tr key={item.id}>
              <td>#{index + 1}</td>
              <td>{item.user?.name}</td>
              <td>{item.rank_points}</td>
              <td>{item.kill_points}</td>
              <td><strong>{item.total_points}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}