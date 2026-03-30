import { useEffect, useState, useCallback } from "react";
import api from "../api";
import "../style/admin.css";

export default function AdminPage() {
  const [tournaments, setTournaments] = useState([]);
  const [tab, setTab] = useState("pending"); // "pending" or "all"
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // تعديل الروابط لتطابق api.php الجديد
      const endpoint = tab === "pending" ? "/admin/pending-tournaments" : "/admin/all-tournaments";
      const res = await api.get(endpoint);
      
      // تأكدنا أن البيانات هي array
      setTournaments(Array.isArray(res.data) ? res.data : (res.data.tournaments || []));
    } catch (err) {
      console.error("Fetch error:", err);
      setTournaments([]); // تفادي الـ crash في حالة الخطأ
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  const handleApprove = async (id) => {
    try {
      // تعديل المسار ليطابق api.php
      await api.post(`/admin/tournaments/${id}/approve`);
      alert("✅ Tournament Approved!");
      fetchData();
    } catch (err) {
      alert("Error approving tournament");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("🚨 Are you sure? This will permanently delete the tournament!")) {
      try {
        // تعديل المسار ليطابق api.php
        await api.delete(`/admin/tournaments/${id}`);
        alert("🗑️ Deleted successfully");
        fetchData();
      } catch (err) {
        alert("Error deleting tournament");
      }
    }
  };

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <div className="header-titles">
          <h2>🛠️ Admin Control Panel</h2>
          <p>Manage and moderate game arenas</p>
        </div>
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${tab === "pending" ? "active" : ""}`} 
            onClick={() => setTab("pending")}
          >
            Pending Requests ⏳
          </button>
          <button 
            className={`tab-btn ${tab === "all" ? "active" : ""}`} 
            onClick={() => setTab("all")}
          >
            Manage All 🎮
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loader">Searching for data...</div>
      ) : (
        <div className="admin-grid">
          {tournaments.length === 0 ? (
            <div className="no-data">No tournaments found in this section.</div>
          ) : (
            tournaments.map(t => (
              <div key={t.id} className="admin-card-container">
                <div className="admin-card">
                  <div className="card-left">
                    <div className="card-status">
                      <span className={`status-pill ${t.is_approved ? 'approved' : 'pending'}`}>
                        {t.is_approved ? "Live" : "Waiting"}
                      </span>
                    </div>
                    <div className="card-actions">
                      {!t.is_approved && (
                        <button className="btn-approve-action" onClick={() => handleApprove(t.id)}>
                          Approve
                        </button>
                      )}
                      <button className="btn-delete-action" onClick={() => handleDelete(t.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="card-info">
                      <h3>{t.title}</h3>
                      <p className="card-description">{t.description ? t.description.substring(0, 80) + "..." : "No description"}</p>
                      <div className="info-row">
                        <span>🎮 {t.game}</span>
                        <span>👥 {t.participants?.length || 0} Joined</span>
                        <span>📅 {t.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}