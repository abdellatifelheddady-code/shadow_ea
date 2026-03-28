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
        <Link to="/">Home</Link>
        <span onClick={() => handleLinkClick("/tournaments")} style={{ cursor: "pointer" }}>Tournaments</span>
        <span onClick={() => handleLinkClick("/create-tournament")} style={{ cursor: "pointer" }}>Create</span>
        <span onClick={() => handleLinkClick("/my-tournaments")} style={{ cursor: "pointer" }}>My Tournaments</span>
        <span onClick={() => handleLinkClick("/joined-tournaments")} style={{ cursor: "pointer" }}>My Games</span>
        {user?.is_admin && <span onClick={() => handleLinkClick("/admin")} style={{ cursor: "pointer" }}>Admin</span>}
      </nav>

      <div className="auth">
        {!user ? (
          <button onClick={() => navigate("/login")}>Login</button>
        ) : (
          <>
            <span>{user?.name && user.name !== '0' ? user.name : 'User'}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}