import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./public/ServiceList.module.css";
import { useNavigate } from "react-router-dom";

export default function UnderService() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // view modal
  const [completeModal, setCompleteModal] = useState(false); // complete modal
  const [claimWarranty, setClaimWarranty] = useState("no");
  const [serviceCost, setServiceCost] = useState("");
  const [completionNote, setCompletionNote] = useState("");

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
    const date = str.includes("T") ? str.split("T")[0] : str;
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

  const finishService = () => {
    api
      .put(
        `/service/complete/${selected.service_id}`,
        {
          service_cost: claimWarranty === "yes" ? 0 : serviceCost,
          service_note: completionNote,
          claim_warranty: claimWarranty === "yes" ? 1 : 0, // optional (for future use)
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        alert("Service marked as completed");
        setCompleteModal(false);
        setSelected(null);
        setServiceCost("");
        setCompletionNote("");
        setClaimWarranty("no");

        setList((prev) =>
          prev.filter((s) => s.service_id !== selected.service_id)
        );
      })
      .catch(() => alert("Error completing service"));
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>Assets Under Service</h1>

        <input
          type="text"
          placeholder="Search assets..."
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.list}>
          {filtered.length === 0 ? (
            <p>No assets under service.</p>
          ) : (
            filtered.map((item) => (
              <div key={item.service_id} className={styles.row}>
                <div
                  className={styles.left}
                  onClick={() => navigate(`/assets/${item.asset_id}`)}
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

      {/* VIEW DETAILS MODAL */}
      {selected && !completeModal && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Service Details</h2>

            <p>
              <strong>Asset:</strong> {selected.brand} - {selected.model}
            </p>
            <p>
              <strong>Serial:</strong> {selected.serial_no}
            </p>
            <p>
              <strong>Provider:</strong> {selected.service_provider}
            </p>
            <p>
              <strong>Through:</strong> {selected.service_through}
            </p>
            <p>
              <strong>Sent Date:</strong> {formatDate(selected.sent_date)}
            </p>

            <h3>Service Note</h3>
            <p className={styles.noteBox}>
              {selected.service_note || "No notes available"}
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.completeBtn}
                onClick={() => setCompleteModal(true)}
              >
                Complete Service
              </button>

              <button
                className={styles.closeBtn}
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE SERVICE MODAL */}
      {/* COMPLETE SERVICE MODAL */}
      {completeModal && (
        <div className={styles.overlay} onClick={() => setCompleteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Complete Service</h2>

            {/* Claim Warranty */}
            <label>Claim in Warranty?</label>

            {selected.is_warranty_valid === 1 ? (
              <select
                className={styles.input}
                value={claimWarranty}
                onChange={(e) => setClaimWarranty(e.target.value)}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            ) : (
              <input
                className={styles.input}
                value="Not eligible (No valid warranty)"
                disabled
              />
            )}

            {/* Service Cost */}
            <label>Service Cost</label>
            <input
              type="number"
              className={styles.input}
              value={claimWarranty === "yes" ? 0 : serviceCost}
              disabled={claimWarranty === "yes"}
              onChange={(e) => setServiceCost(e.target.value)}
            />

            {/* Completion Note */}
            <label>Completion Note</label>
            <textarea
              className={styles.textarea}
              value={completionNote}
              onChange={(e) => setCompletionNote(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button className={styles.completeBtn} onClick={finishService}>
                Finish Service
              </button>
              <button
                className={styles.closeBtn}
                onClick={() => setCompleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
