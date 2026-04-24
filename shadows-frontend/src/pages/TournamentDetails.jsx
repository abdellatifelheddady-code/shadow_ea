import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import TournamentChat from "../components/TournamentChat";
import TournamentLeaderboard from "../components/TournamentLeaderboard";
import "../style/tournamentsDetails.css";

export default function TournamentDetails() {
  const { id } = useParams();

  // --- States الأساسية ---
  const [tournament, setTournament] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");

  // --- States التقييم (Rating) ---
  const [ratingStars, setRatingStars] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [hasRated, setHasRated] = useState(false);

  // --- States الـ Squad ---
  const [teamName, setTeamName] = useState("");
  const [teammateEmail, setTeammateEmail] = useState("");
  const [teammates, setTeammates] = useState([]);
  const [error, setError] = useState("");

  const initData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tournaments/${id}`);
      setTournament(res.data.tournament);
      setIsJoined(res.data.is_joined);

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

  // التحقق واش المستخدم هو المنظم
  const isOrganizer = currentUser && tournament && currentUser.id === tournament.user_id;

  // --- 1. دالة قفل/فتح التسجيل ---
  const toggleRegistration = async () => {
    try {
      const res = await api.post(`/tournaments/${id}/toggle-registration`);
      setTournament({ ...tournament, is_registration_open: res.data.is_registration_open });
      alert(`Registration is now ${res.data.is_registration_open ? 'OPEN' : 'CLOSED'}`);
    } catch (err) {
      alert("Error updating registration status");
    }
  };

  // --- 2. دالة إنهاء البطولة ---
  const finishTournament = async () => {
    if (!window.confirm("Are you sure? This will finalize results and open ratings.")) return;
    try {
      await api.post(`/tournaments/${id}/finish`);
      alert("Tournament Finished! Players can now rate your organization.");
      initData(); 
    } catch (err) {
      alert("Error finishing tournament");
    }
  };

  // --- 3. دالة إرسال التقييم ---
  const submitRating = async () => {
    if (ratingStars === 0) return alert("Please select a star rating!");
    try {
      await api.post(`/tournaments/${id}/rate`, {
        stars: ratingStars,
        comment: ratingComment
      });
      setHasRated(true);
      alert("Thank you for your feedback!");
      initData();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting rating");
    }
  };

  const handleJoin = async () => {
    if (!currentUser) return alert("Please login first");
    setError("");
    try {
      const payload = tournament.type === "squad" ? { team_name: teamName, teammates: teammates } : {};
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
    if (currentUser && teammateEmail === currentUser.email) { setError("You are the captain!"); return; }
    if (teammates.includes(teammateEmail)) { setError("Already added."); return; }
    if (teammates.length < (tournament?.team_size - 1)) {
      setTeammates([...teammates, teammateEmail]);
      setTeammateEmail("");
    } else {
      setError(`Max ${tournament?.team_size} players!`);
    }
  };

  const renderParticipants = () => {
    const participants = tournament?.participants || [];
    if (participants.length === 0) return <p className="empty-msg">No units deployed yet.</p>;
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
              <span className="team-icon">🛡️</span>
              <span className="team-title">{tName}</span>
              <span className="count-badge">{members.length}</span>
            </div>
            <div className="team-sidebar-members">
              {members.map((m) => (
                <div key={m.id} className="member-row-minimal">
                  <span className="member-name">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading || !tournament) {
  return (
    <div style={{
      backgroundColor: '#0a0a0b', // نفس لون الخلفية ديال السيت
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#3b82f6',
      fontFamily: 'sans-serif'
    }}>
      <div className="spinner" style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(59, 130, 246, 0.1)',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '15px'
      }}></div>
      <div style={{ letterSpacing: '2px', fontWeight: 'bold' }}>SYNCING DATA...</div>
      
      {/* هاد الـ style غير باش يخدم الـ animation ديال الـ spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

  return (
    <div className="page tournament-detail">
      <div className="container">
        {/* Banner Section with Badge */}
        <div className="tournament-banner-card">
          <img 
            src={tournament.image ? `http://localhost:8000/storage/${tournament.image}` : "/default-bg.jpg"} 
            alt={tournament.title} 
            className="banner-image"
          />
          <div className="banner-info">
            <div className={`status-tag ${tournament.status}`}>{tournament.status.toUpperCase()}</div>
            <div className="title-area">
                <h1>{tournament.title}</h1>
                {tournament.creator?.organizer_badge && (
                    <span className={`org-badge ${tournament.creator.organizer_badge.replace(/\s+/g, '-').toLowerCase()}`}>
                        🛡️ {tournament.creator.organizer_badge}
                    </span>
                )}
            </div>
            <p className="organizer-name">Directed by: {tournament.creator?.name}</p>
          </div>
        </div>

        <div className="content-grid">
          <div className="main-info">
            <div className="card description-card">
              <h3>Mission Briefing</h3>
              <p>{tournament.description}</p>
            </div>

            {/* Action Control Panel */}
            <div className="action-section card">
              
              {/* أدوات التحكم للمنظم */}
              {isOrganizer && tournament.status !== 'finished' && (
                <div className="organizer-panel">
                  <h4>Control Console</h4>
                  <div className="btn-group">
                    <button 
                        className={`btn-action ${tournament.is_registration_open ? 'btn-close-reg' : 'btn-open-reg'}`}
                        onClick={toggleRegistration}
                    >
                        {tournament.is_registration_open ? "⛔ LOCK REGISTRATION" : "🔓 UNLOCK REGISTRATION"}
                    </button>
                    
                    <button className="btn-action btn-finish-tour" onClick={finishTournament}>
                        🏁 FINISH TOURNAMENT
                    </button>
                  </div>
                </div>
              )}

              {/* واجهة التقييم بعد النهاية */}
              {tournament.status === 'finished' && isJoined && !isOrganizer && !hasRated && (
                <div className="rating-card">
                   <h4>⭐ RATE YOUR EXPERIENCE</h4>
                   <div className="stars-input">
                     {[1, 2, 3, 4, 5].map(s => (
                       <span key={s} onClick={() => setRatingStars(s)} className={s <= ratingStars ? "star active" : "star"}>★</span>
                     ))}
                   </div>
                   <textarea 
                     placeholder="Drop a comment about the organization..." 
                     value={ratingComment} 
                     onChange={(e) => setRatingComment(e.target.value)}
                   />
                   <button className="btn-submit-rate" onClick={submitRating}>SUBMIT REVIEW</button>
                </div>
              )}

              {/* منطق زر الانضمام */}
              {tournament.status !== 'finished' && !isJoined && !isOrganizer && (
                tournament.is_registration_open ? (
                  <button className="btn-join-glow" onClick={() => tournament.type === "solo" ? handleJoin() : setShowModal(true)}>
                    {tournament.type === "solo" ? "JOIN OPERATION" : "REGISTER SQUAD"}
                  </button>
                ) : (
                  <div className="lock-message">🚫 ACCESS DENIED: REGISTRATION LOCKED</div>
                )
              )}

              {isJoined && tournament.status !== 'finished' && !isOrganizer && (
                <div className="registered-msg">✅ YOU ARE DEPLOYED IN THIS MISSION</div>
              )}

              {tournament.status === 'finished' && <div className="end-msg">🏁 MISSION COMPLETED</div>}
            </div>

            {/* Interactive Tabs */}
            {(isJoined || isOrganizer) && (
              <div className="interactive-tabs">
                <div className="tabs-header">
                  <button className={activeTab === "chat" ? "tab active" : "tab"} onClick={() => setActiveTab("chat")}>COMMUNICATIONS</button>
                  {tournament.system_type === "points" && (
                    <button className={activeTab === "leaderboard" ? "tab active" : "tab"} onClick={() => setActiveTab("leaderboard")}>INTEL / RANKINGS</button>
                  )}
                </div>
                <div className="tab-body card">
                  {activeTab === "chat" ? (
                    <TournamentChat tournamentId={id} currentUser={currentUser} />
                  ) : (
                    <TournamentLeaderboard tournamentId={id} isOrganizer={isOrganizer} participants={tournament.participants || []} />
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="sidebar">
            <div className="card participants-card">
              <h3>Active Units</h3>
              {renderParticipants()}
            </div>
          </aside>
        </div>
      </div>

      {/* Squad Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Assemble Your Squad</h2>
            {error && <p className="error-text">{error}</p>}
            <input type="text" placeholder="Squad Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            <div className="invite-row">
              <input type="email" placeholder="Teammate Email" value={teammateEmail} onChange={(e) => setTeammateEmail(e.target.value)} />
              <button onClick={addTeammate}>ADD</button>
            </div>
            <div className="squad-list">
              {teammates.map(email => <span key={email} className="chip">{email} <b onClick={() => setTeammates(teammates.filter(e => e !== email))}>×</b></span>)}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>ABORT</button>
              <button className="btn-confirm" onClick={handleJoin} disabled={!teamName || teammates.length < (tournament.team_size - 1)}>CONFIRM DEPLOYMENT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}