import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./public/ServiceList.module.css";
import { useNavigate } from "react-router-dom";

export default function UnderService() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // MODAL DATA
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/service/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setList(res.data.services))
      .catch((err) => console.log("Error loading services:", err));
  }, []);

  const formatDate = (str) => {
    if (!str) return "";

    const date = str.includes("T") ? str.split("T")[0] : str; // "2025-11-30"
    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };

  const filtered = list.filter((item) => {
    const s = search.toLowerCase();

    return (
      item.brand.toLowerCase().includes(s) ||
      item.model.toLowerCase().includes(s) ||
      item.serial_no.toLowerCase().includes(s) ||
      item.service_provider.toLowerCase().includes(s) ||
      item.service_status.toLowerCase().includes(s) ||
      item.asset_id.toString().includes(s)
    );
  });

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>Assets Under Service</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search assets..."
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* List Container */}
        <div className={styles.list}>
          {filtered.length === 0 ? (
            <p>No assets under service.</p>
          ) : (
            filtered.map((item) => (
              <div key={item.service_id} className={styles.row}>
                <div
                  className={styles.left}
                  onClick={() => navigate(`/service/${item.service_id}`)}
                >
                  <h3 className={styles.assetName}>
                    {item.brand} - {item.model}
                  </h3>
                  <p className={styles.meta}>
                    Serial: {item.serial_no} | Lab: {item.lab_name}
                  </p>
                </div>

                <div className={styles.right}>
                  <span className={styles.provider}>
                    {item.service_provider}
                  </span>
                  <span
                    className={`${styles.statusTag} ${
                      styles[item.service_status]
                    }`}
                  >
                    {item.service_status}
                  </span>

                  {/* View Details Button */}
                  <button
                    className={styles.viewButton}
                    onClick={() => setSelected(item)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />

      {/* MODAL OVERLAY + WINDOW */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2 className={styles.modalTitle}>Service Details</h2>

            <p>
              <strong>Asset:</strong> {selected.brand} - {selected.model}
            </p>
            <p>
              <strong>Serial No:</strong> {selected.serial_no}
            </p>
            <p>
              <strong>Service Provider:</strong> {selected.service_provider}
            </p>
            <p>
              <strong>Service Through:</strong> {selected.service_through}
            </p>
            <p>
              <strong>Sent Date:</strong> {formatDate(selected.sent_date)}
            </p>

            <h3>Service Note:</h3>
            <p className={styles.noteBox}>
              {selected.service_note || "No notes available"}
            </p>

            <button
              className={styles.closeBtn}
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
