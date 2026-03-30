import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../style/login.css"; 

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");  
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", {
        name,
        email,
        phone,
        password,
        password_confirmation: passwordConfirm,
      });
      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="authPage">
      <div className="authBox">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input placeholder="Full Name" onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" onChange={(e) => setPasswordConfirm(e.target.value)} required />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}