import { Link } from "react-router-dom";
import { FaHome, FaTrophy, FaPlus, FaUserShield } from "react-icons/fa";
import logo from "../IMG/logo_app.jpg";
import "../style/sidebar.css";
export default function Sidebar({ user }) {
  return (
    <div className="sidebar">
      
      {/* 🔥 Logo Section */}
      <div className="logoBox">
        <img src={logo} alt="logo" className="logo" />
        <h2>Shadows EA</h2>
      </div>

      {/* 🔗 Links */}
      <Link to="/"><FaHome /> Home</Link>
      <Link to="/tournaments"><FaTrophy /> Tournaments</Link>
      <Link to="/create-tournament"><FaPlus /> Create</Link>
      <Link to="/joined-tournaments">👥 My Games</Link>

      {user?.is_admin && (
        <Link to="/admin"><FaUserShield /> Admin</Link>
      )}
    </div>
  );
}