import { useNavigate } from "react-router-dom";
import "../style/body.css";

export default function Body({ user }) {
  const navigate = useNavigate();

  const handleJoinClub = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/tournaments");
    }
  };

  return (
    <div className="home">
      <div className="overlay">
        <h1 className="mainTitle">WELCOME TO SHADOWS EA CLUB</h1>
        <p className="desc">
          Shadows EA is the leading Moroccan E-sports academy.
        </p>
        <p className="desc">
          Join us to experience the thrill of competitive gaming and connect with a vibrant community of players.
        </p>
        <div className="club-features">
          <div className="feature">
            <h3>🏆 Tournaments</h3>
            <p>Compete in high-stakes tournaments across popular games.</p>
          </div>
          <div className="feature">
            <h3>🎮 Community</h3>
            <p>Connect with fellow gamers and build lasting friendships.</p>
          </div>
          <div className="feature">
            <h3>🌟 Academy</h3>
            <p>Train and improve your skills with professional coaching.</p>
          </div>
        </div>
        <button className="join-club-btn" onClick={handleJoinClub}>
          {user ? "Explore Tournaments" : "Join Our Club"}
        </button>
      </div>
    </div>
  );
}