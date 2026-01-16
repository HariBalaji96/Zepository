import { NavLink, useNavigate, Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header({ userName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.headerDiv}>
      <h1 className={styles.title}>
        <Link to="/" className={styles.titleLink}>
          Zepository
        </Link>
      </h1>

      {/* 👇 SHOW ONLY IF USERNAME EXISTS */}
      {userName && (
        <p className={styles.welcomeText}>
          Welcome, <strong>{userName}</strong>
        </p>
      )}

      <nav className={styles.navBar}>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/assets"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Assets
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Service Details
            </NavLink>
          </li>

          <li className={styles.logout} onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </nav>
    </div>
  );
}
