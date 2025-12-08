import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./public/Service.module.css";

export default function SendToService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);

  const [form, setForm] = useState({
    sent_date: "",
    service_note: "",
    service_provider: "",
    service_through: "",
  });

  // Format today's date as YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setForm((f) => ({ ...f, sent_date: today }));

    api
      .get(`/assets/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setAsset(res.data.asset))
      .catch(() => alert("Failed to load asset"));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitService = () => {
    api
      .post(
        `/service/send:${id}`,
        { asset_id: id, ...form },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        alert("Service request created successfully!");
        navigate(`/assets/${id}`);
      })
      .catch((err) => {
        console.log(err);
        alert("Error sending service request");
      });
  };

  if (!asset) return <h2>Loading...</h2>;

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <div className={styles.contentWrapper}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className={styles.pageTitle}>
          Send to Service — {asset.brand} {asset.model}
        </h1>

        <div className={styles.formBox}>
          <label>Sent Date</label>
          <input
            type="date"
            name="sent_date"
            value={form.sent_date}
            onChange={handleChange}
          />

          <label>Service Provider</label>
          <input
            type="text"
            name="service_provider"
            placeholder="Eg: Lenovo Care Coimbatore"
            onChange={handleChange}
          />

          <label>Service Through</label>
          <select name="service_through" onChange={handleChange}>
            <option value="">Select</option>
            <option value="department">Department</option>
            <option value="central">Central IT</option>
          </select>

          <label>Service Note</label>
          <textarea
            name="service_note"
            placeholder="Describe issue..."
            onChange={handleChange}
          ></textarea>

          <button className={styles.submitButton} onClick={submitService}>
            Submit Service Request
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
