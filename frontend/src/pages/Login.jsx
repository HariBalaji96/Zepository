import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import styles from "./public/Login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardDiv}>
        <div>
          <h1 className={styles.title}>Zepository</h1>
        </div>

        <div className={styles.formDiv}>
          <h2 className={styles.subtitle}>SIGN IN</h2>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className={styles.input}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className={styles.input}
            />

            <button className={styles.button}>Login</button>
          </form>

          <div className={styles.signupLink}>
            <p>
              <Link to="/signup">Click here</Link> to create new account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
