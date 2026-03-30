import logo from "../IMG/logo_app.jpg";
import { Link, useNavigate } from "react-router-dom";
import "../style/header.css";
export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const handleLinkClick = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <header className="header">
      <div className="logoBox">
        <img src={logo} alt="logo" />
        <h2>Shadows EA</h2>
      </div>

      <nav>
        <Link to="/" className="nav-link">Home</Link>
        <span className="nav-link" onClick={() => handleLinkClick("/tournaments")}>Tournaments</span>
        <span className="nav-link" onClick={() => handleLinkClick("/create-tournament")}>Create</span>
        <span className="nav-link" onClick={() => handleLinkClick("/my-tournaments")}>My Tournaments</span>
        <span className="nav-link" onClick={() => handleLinkClick("/joined-tournaments")}>My Games</span>
        {user?.is_admin && <span className="nav-link" onClick={() => handleLinkClick("/admin")}>Admin</span>}
      </nav>

      <div className="auth">
        {!user ? (
          <button onClick={() => navigate("/login")}>Login</button>
        ) : (
          <>
            <span>{user?.name && user.name !== '0' ? user.name : 'Player'}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}