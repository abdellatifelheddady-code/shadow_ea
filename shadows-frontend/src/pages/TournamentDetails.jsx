import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import TournamentChat from "../components/TournamentChat";
import TournamentLeaderboard from "../components/TournamentLeaderboard";
import "../style/tournamentsDetails.css";

export default function TournamentDetails() {
  const { id } = useParams();

  // States الأساسية
  const [tournament, setTournament] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // التبديل بين الشات والترتيب
  const [activeTab, setActiveTab] = useState("chat");

  // States ديال الـ Squad
  const [teamName, setTeamName] = useState("");
  const [teammateEmail, setTeammateEmail] = useState("");
  const [teammates, setTeammates] = useState([]);
  const [error, setError] = useState("");

  const initData = useCallback(async () => {
    try {
      setLoading(true);
      // 1. جلب بيانات البطولة
      const res = await api.get(`/tournaments/${id}`);
      setTournament(res.data.tournament);
      setIsJoined(res.data.is_joined);

      // 2. جلب بيانات المستخدم الحالي
      try {
        const userRes = await api.get("/user");
        setCurrentUser(userRes.data);
      } catch (e) {
        console.log("User not logged in.");
      }
    } catch (err) {
      console.error("Error loading tournament:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    initData();
  }, [initData]);

  // --- التحقق من الصلاحيات ---
  const isOrganizer = currentUser && tournament && currentUser.id === tournament.user_id;

  // --- دالة قفل/فتح التسجيل (الميزة الجديدة) ---
  const toggleRegistration = async () => {
    try {
      const res = await api.post(`/tournaments/${id}/toggle-registration`);
      setTournament({ ...tournament, is_registration_open: res.data.is_registration_open });
      alert(`Registration is now ${res.data.is_registration_open ? 'OPEN' : 'CLOSED'}`);
    } catch (err) {
      alert("Error updating registration status");
    }
  };

  const handleJoin = async () => {
    if (!currentUser) {
      alert("Please login first");
      return;
    }
    setError("");
    try {
      const payload = tournament.type === "squad" 
        ? { team_name: teamName, teammates: teammates } 
        : {};
      
      await api.post(`/tournaments/${id}/register`, payload);
      alert("Registration Successful!");
      setShowModal(false);
      initData(); 
    } catch (err) {
      setError(err.response?.data?.message || "Error during registration");
    }
  };

  const addTeammate = () => {
    setError("");
    if (!teammateEmail) return;
    if (currentUser && teammateEmail === currentUser.email) {
      setError("You are the captain!"); return;
    }
    if (teammates.includes(teammateEmail)) {
      setError("Already added."); return;
    }
    if (teammates.length < (tournament?.team_size - 1)) {
      setTeammates([...teammates, teammateEmail]);
      setTeammateEmail("");
    } else {
      setError(`Max ${tournament?.team_size} players!`);
    }
  };

  const renderParticipants = () => {
    const participants = tournament?.participants || [];
    if (participants.length === 0) return <p className="empty-msg">No players registered yet.</p>;

    const groupedTeams = {};
    participants.forEach((player) => {
      const tName = player.team_name || "Solo Players";
      if (!groupedTeams[tName]) groupedTeams[tName] = [];
      groupedTeams[tName].push(player);
    });

    return (
      <div className="teams-sidebar-wrapper">
        {Object.entries(groupedTeams).map(([tName, members], index) => (
          <div key={index} className="team-sidebar-card">
            <div className="team-sidebar-header">
              <span className="team-icon">🏆</span>
              <span className="team-title">{tName}</span>
              <span className="count-badge">{members.length}</span>
            </div>
            <div className="team-sidebar-members">
              {members.map((m) => (
                <div key={m.id} className="member-row-minimal">
                  <div className="member-dot"></div>
                  <span className="member-name">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading || !tournament) return <div className="loader">Entering Arena...</div>;

  return (
    <div className="page tournament-detail">
      <div className="container">
        {/* Banner Section */}
        <div className="tournament-banner-card">
          <img 
            src={tournament.image ? `http://localhost:8000/storage/${tournament.image}` : "/default-bg.jpg"} 
            alt={tournament.title} 
            className="banner-image"
          />
          <div className="banner-info">
            <div className={`status-badge ${tournament.type}`}>{tournament.type}</div>
            <h1>{tournament.title}</h1>
            <div className="meta-info">
              <span>📅 {tournament.date}</span>
              <span>🎮 {tournament.game}</span>
              <span className="system-tag">⚙️ {tournament.system_type === 'points' ? 'Leaderboard Active' : 'Chat Only'}</span>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="main-info">
            <div className="card description-card">
              <h3>Rules & Description</h3>
              <p>{tournament.description || "No description provided."}</p>
            </div>

            {/* --- Action Section (Join / Toggle / Status) --- */}
            <div className="action-section card" style={{ padding: '20px', textAlign: 'center' }}>
              
              {/* واجهة المنظم للتحكم في حالة التسجيل */}
              {isOrganizer && (
                <div className="organizer-controls" style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                  <p style={{ color: '#aaa', marginBottom: '10px' }}>Admin Actions:</p>
                  <button 
                    className={`btn-toggle-reg ${tournament.is_registration_open ? 'btn-danger' : 'btn-success'}`}
                    onClick={toggleRegistration}
                  >
                    {tournament.is_registration_open ? "⛔ Close Registration" : "🔓 Open Registration"}
                  </button>
                </div>
              )}

              {/* منطق زر الانضمام للاعبين */}
              {!isJoined && !isOrganizer ? (
                tournament.is_registration_open ? (
                  <button 
                    className="btn-primary-glow" 
                    onClick={() => tournament.type === "solo" ? handleJoin() : setShowModal(true)}
                  >
                    {tournament.type === "solo" ? "JOIN AS SOLO" : "REGISTER YOUR TEAM"}
                  </button>
                ) : (
                  <div className="closed-status-box">
                    <span style={{ fontSize: '1.2rem', color: '#ff4d4d' }}>🚫 Registration is currently CLOSED</span>
                  </div>
                )
              ) : (
                !isOrganizer && <div className="status-badge-large">✅ You are registered</div>
              )}

              {isOrganizer && <div className="status-badge-large">🛠️ Organizer View</div>}
            </div>

            {/* --- Tabs (Leaderboard & Chat) --- */}
            {(isJoined || isOrganizer) && (
              <div className="tournament-interactive-area">
                <div className="tabs-menu">
                  <button 
                    className={`tab-btn ${activeTab === "chat" ? "active" : ""}`} 
                    onClick={() => setActiveTab("chat")}
                  >
                    💬 Chat
                  </button>
                  
                  {tournament.system_type === "points" && (
                    <button 
                      className={`tab-btn ${activeTab === "leaderboard" ? "active" : ""}`} 
                      onClick={() => setActiveTab("leaderboard")}
                    >
                      📊 Leaderboard
                    </button>
                  )}
                </div>

                <div className="tab-content">
                  {activeTab === "chat" ? (
                    <div className="card chat-card">
                      <TournamentChat tournamentId={id} currentUser={currentUser} />
                    </div>
                  ) : (
                    <TournamentLeaderboard 
                      tournamentId={id} 
                      isOrganizer={isOrganizer} 
                      participants={tournament.participants || []} 
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar-participants">
            <div className="card participants-card">
              <h3>Registered Units</h3>
              <div className="participants-scroll">
                {renderParticipants()}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal - Team Registration */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <h2>🏆 Team Registration</h2>
            {error && <div className="alert-error">{error}</div>}
            <div className="input-group">
              <label>Team Name</label>
              <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name..." />
            </div>
            <div className="input-group">
              <label>Invite Teammates (Email)</label>
              <div className="row-add">
                <input type="email" value={teammateEmail} onChange={(e) => setTeammateEmail(e.target.value)} placeholder="email@example.com" />
                <button type="button" onClick={addTeammate}>Add</button>
              </div>
            </div>
            <div className="invited-list">
              {teammates.map(email => (
                <div key={email} className="email-chip">
                  {email} <span onClick={() => setTeammates(teammates.filter(e => e !== email))}>×</span>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button 
                className="btn-confirm" 
                onClick={handleJoin} 
                disabled={!teamName || teammates.length < (tournament.team_size - 1)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}