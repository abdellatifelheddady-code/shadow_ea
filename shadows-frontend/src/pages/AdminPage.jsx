import { useEffect, useState } from "react";
import api from "../api";
import "../style/admin.css";

export default function AdminPage() {
  const [tournaments, setTournaments] = useState([]);
  const [tab, setTab] = useState("pending"); // "pending" or "all"
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const endpoint = tab === "pending" ? "/admin/tournaments" : "/admin/all-tournaments";
      const res = await api.get(endpoint);
      setTournaments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]); 

  const handleApprove = async (id) => {
    await api.post(`/admin/tournaments/${id}/approve`);
    alert("Approved!");
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("🚨 Are you sure? This will permanently delete the tournament!")) {
      await api.delete(`/admin/tournaments/${id}`);
      fetchData();
    }
  };

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h2>🛠️ Admin Control Panel</h2>
        <div className="tab-buttons">
          <button className={tab === "pending" ? "active" : ""} onClick={() => setTab("pending")}>
            Pending Requests ⏳
          </button>
          <button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>
            Manage All Tournaments 🎮
          </button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid">
          {tournaments.map(t => (
            <div key={t.id} className="card admin-card">
              <div className="card-body">
                <span className={`status-tag ${t.is_approved ? 'tag-approved' : 'tag-pending'}`}>
                  {t.is_approved ? "Approved" : "Pending"}
                </span>
                <h3>{t.title}</h3>
                <p><strong>Game:</strong> {t.game}</p>
                <p><strong>Players:</strong> {t.participants?.length || 0}</p>
              </div>

              <div className="card-buttons">
                {!t.is_approved && (
                  <button className="btn-approve" onClick={() => handleApprove(t.id)}>Approve</button>
                )}
                <button className="btn-delete" onClick={() => handleDelete(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}