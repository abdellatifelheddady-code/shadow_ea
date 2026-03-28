import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom"; // زدنا Link هنا
import "../style/login.css";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      alert("Incorrect email or password!");
    }
  };

  return (
    <div className="authPage">
      <div className="authBox"> {/* كادر جامع للفورم والرابط */}
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Login</button>
        </form>

        {/* هادا هو السطر لي خاصك تزيد */}
        <div className="authRedirect">
          <span>Don't have an account? </span>
          <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}