import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/auth/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log("User not authorized"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // quick redirect
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <p>
          Welcome, {user.name}! Your role: {user.role}
        </p>
      )}

      <button
        onClick={handleLogout}
        style={{
          padding: "8px 12px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Logout
      </button>
    </div>
  );
}
