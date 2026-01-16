import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import styles from "./public/Dashboard.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api
      .get("/auth/me", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        console.log("Unauthorized User");
        window.location.href = "/login";
      });

    api
      .get("/assets/stats", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => setStats(res.data.stats))
      .catch((err) => {
        console.log("Stats error:", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={styles.dashboardWrapper}>
      <Header userName={user?.name} />

      <div className={styles.grid}>
        {stats.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardHeader}>{item.type_name}</div>

            <div className={styles.cardBody}>
              <div>
                <p>Working</p> <h1>{item.working || 0}</h1>
              </div>
              <div>
                <p>Defective</p> <h1>{item.defective || 0}</h1>
              </div>
              <div>
                <p>Under Service</p> <h1>{item.under_service || 0}</h1>
              </div>
            </div>

            <div className={styles.cardFooter}>
              Total {item.type_name}:{" "}
              {(parseInt(item.working) || 0) +
                (parseInt(item.defective) || 0) +
                (parseInt(item.under_service) || 0)}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
