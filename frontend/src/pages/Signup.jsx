import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import styles from "./public/Signup.module.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user_name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.role) {
      setError("Please select a role");
      return;
    }

    try {
      await api.post("/auth/signup", form);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardDiv}>
        <h2 className={styles.title}>SIGNUP</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.formDiv}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="user_name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select Role</option>
              <option value="lab-assist">Lab Assistant</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className={styles.button}>
              Signup
            </button>
          </form>
        </div>

        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
