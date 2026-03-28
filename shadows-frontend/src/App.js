import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import Body from "./components/Body";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tournaments from "./pages/Tournaments";
import CreateTournament from "./pages/CreateTournament";
import JoinedTournaments from "./pages/JoinedTournaments";
import AdminTournaments from "./pages/AdminPage";
import MyTournaments from "./pages/MyTournaments";
import TournamentDetails from "./pages/TournamentDetails"
const getStoredUser = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    return stored && typeof stored === "object" ? stored : null;
  } catch {
    return null;
  }
};

export default function App() {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <Router>
      <Header user={user} setUser={setUser} />

      <Routes>
<Route path="/tournaments/:id" element={<ProtectedRoute><TournamentDetails /></ProtectedRoute>} />
        {/* Public */}
        <Route path="/" element={<Body user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/tournaments" element={
          <ProtectedRoute><Tournaments /></ProtectedRoute>
        } />

        <Route path="/create-tournament" element={
          <ProtectedRoute><CreateTournament /></ProtectedRoute>
        } />

        <Route path="/joined-tournaments" element={
          <ProtectedRoute><JoinedTournaments /></ProtectedRoute>
        } />

        <Route path="/my-tournaments" element={
          <ProtectedRoute><MyTournaments /></ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <AdminRoute><AdminTournaments /></AdminRoute>
        } />

      </Routes>
    </Router>
  );
}