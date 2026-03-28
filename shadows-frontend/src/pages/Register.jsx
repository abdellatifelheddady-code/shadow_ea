import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../style/login.css";

export default function Register() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    await api.post("/register",{name,email,password});
    navigate("/login");
  };

  return (
    <div className="authPage">
      <div className="authBox">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className="authRedirect">
          <span>Already have an account? </span>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}