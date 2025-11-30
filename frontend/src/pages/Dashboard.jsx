import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import styles from "./public/Dashboard.module.css";

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
      <div className={styles.headerDiv}>
        <h1 className={styles.title}>
          <Link to="/" className={styles.titleLink}>
            Zepositroy
          </Link>
        </h1>
        {user && <p className={styles.greet}>Welcome, {user.name}!</p>}

        <nav className={styles.navBar}>
          <ul>
            <li>
              <Link to="/assets" className={styles.navLink}>
                Assets
              </Link>
            </li>
            <li>
              <Link to="/services" className={styles.navLink}>
                Service Details
              </Link>
            </li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </nav>
      </div>

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

      <div className={styles.footerDiv}>
        <p>&copy; Copyrights by Team 07</p>
      </div>
    </div>
  );
}
