import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>Admin: {user?.is_admin ? "Yes" : "No"}</p>
      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>

    </div>
  );
}