import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./public/Assets.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AssetDetails() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/assets/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setAsset(res.data.asset))
      .catch((err) => console.log("Error:", err));
  }, [id]);

  const formatDate = (str) => {
    if (!str) return "";

    const date = str.includes("T") ? str.split("T")[0] : str; // "2025-11-30"
    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };

  if (!asset) return <h2>Loading...</h2>;

  return (
    <div className={styles.detailsPageWrapper}>
      <Header />

      <div className={styles.detailsContent}>
        <div className={styles.buttonDiv}>
          <button
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            ← Back
          </button>
        </div>

        <h1 className={styles.pageTitle}>
          {asset.brand + " - " + asset.model}
        </h1>

        <div className={styles.splitContainer}>
          {/* LEFT BLOCK */}
          <div className={styles.block}>
            {/* Basic Info */}
            <div className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>Basic Information</h2>
              <button
                className={styles.editButton}
                onClick={() => navigate(`/assets/${id}/edit`)}
              >
                Edit
              </button>
            </div>

            <p>
              <strong>Serial No:</strong> {asset.serial_no}
            </p>
            <p>
              <strong>Status:</strong>

              {asset.working_status === "defective" ? (
                <>
                  <span
                    className={`${styles.status} ${
                      styles[asset.working_status]
                    }`}
                  >
                    {asset.working_status}
                  </span>

                  <button
                    className={styles.editButton}
                    onClick={() => navigate(`/service/send/${id}`)}
                  >
                    Send to Service
                  </button>
                </>
              ) : (
                <span
                  className={`${styles.status} ${styles[asset.working_status]}`}
                >
                  {asset.working_status}
                </span>
              )}
            </p>
            <p>
              <strong>Brand:</strong> {asset.brand}
            </p>
            <p>
              <strong>Model:</strong> {asset.model}
            </p>
            <p>
              <strong>Type:</strong> {asset.type_name}
            </p>
            <p>
              <strong>Location:</strong> {asset.lab_name}
            </p>

            {/* Ledger Info */}
            <div className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>Ledger Information</h2>
              <button
                className={styles.editButton}
                onClick={() => navigate(`/assets/${id}/edit`)}
              >
                {asset.ledger_id ? "Edit" : "Add"}
              </button>
            </div>

            {asset.ledger_id ? (
              <>
                <p>
                  <strong>S.No:</strong> {asset.ledger_serial_no}
                </p>
                <p>
                  <strong>Page No:</strong> {asset.page_no}
                </p>
              </>
            ) : (
              <p>No Ledger Details Available</p>
            )}
          </div>

          {/* RIGHT BLOCK */}
          <div className={styles.block}>
            {/* Additional Info */}
            <div className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>Additional Details</h2>
              <button
                className={styles.editButton}
                onClick={() => navigate(`/assets/${id}/edit`)}
              >
                Edit
              </button>
            </div>

            <p>
              <strong>Purchase Date:</strong> {formatDate(asset.purchase_date)}
            </p>
            <p>
              <strong>Funding Agency:</strong> {asset.funding_agency}
            </p>
            <p>
              <strong>Cost:</strong> {asset.price}
            </p>
            <p>
              <strong>Last Update:</strong> {formatDate(asset.updated_at)}
            </p>

            {/* Warranty Info */}
            <div className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>Warranty Details</h2>
              <button
                className={styles.editButton}
                onClick={() => navigate(`/assets/${id}/edit`)}
              >
                {asset.warranty_id ? "Edit" : "Add"}
              </button>
            </div>

            {asset.warranty_id ? (
              <>
                <p>
                  <strong>Vendor Name:</strong> {asset.vendor_name}
                </p>
                <p>
                  <strong>Vendor Contact:</strong> {asset.vendor_contact}
                </p>
                <p>
                  <strong>Warranty Start Date:</strong>{" "}
                  {formatDate(asset.warranty_startdate)}
                </p>
                <p>
                  <strong>Warranty End Date:</strong>{" "}
                  {formatDate(asset.warranty_enddate)}
                </p>
              </>
            ) : (
              <p>No Warranty Available</p>
            )}
          </div>
        </div>

        {/* SPECIFICATIONS BLOCK */}
        <div className={styles.blockFull}>
          <div className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>Specifications</h2>
            <button
              className={styles.editButton}
              onClick={() => navigate(`/assets/${id}/edit`)}
            >
              {asset.specs && asset.specs.length > 0 ? "Edit" : "Add"}
            </button>
          </div>

          {asset.specs && asset.specs.length > 0 ? (
            <div className={styles.specList}>
              {asset.specs.map((spec, idx) => (
                <p key={idx} className={styles.specItem}>
                  <strong>{spec.spec_key}:</strong> {spec.spec_value}{" "}
                  {spec.unit ? spec.unit : ""}
                </p>
              ))}
            </div>
          ) : (
            <p>No Specifications Available</p>
          )}
        </div>
        {/* SERVICE HISTORY BLOCK */}
        <div className={styles.blockFull}>
          <div className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>Service History</h2>
          </div>

          {asset.services && asset.services.length > 0 ? (
            <div className={styles.serviceList}>
              {asset.services.map((service) => (
                <div key={service.service_id} className={styles.serviceCard}>
                  <div className={styles.serviceHeader}>
                    <span className={styles.serviceProvider}>
                      {service.service_provider}
                    </span>

                    <span
                      className={`${styles.statusTag} ${
                        styles[service.service_status]
                      }`}
                    >
                      {service.service_status}
                    </span>
                  </div>

                  <p>
                    <strong>Sent Date:</strong> {formatDate(service.sent_date)}
                  </p>

                  <p>
                    <strong>Service Through:</strong> {service.service_through}
                  </p>

                  <p>
                    <strong>Warranty Claim:</strong>{" "}
                    {service.warranty_claim === 1 ? "Yes" : "No"}
                  </p>

                  <p>
                    <strong>Initial Note:</strong> {service.service_note || "—"}
                  </p>

                  <p>
                    <strong>Service Status:</strong>{" "}
                    {service.service_status === "completed"
                      ? "Completed"
                      : "Under Service"}
                  </p>

                  {service.service_status === "completed" && (
                    <>
                      <p>
                        <strong>Completion Note:</strong>{" "}
                        {service.after_note || "—"}
                      </p>

                      <p>
                        <strong>Service Cost:</strong> ₹{service.service_cost}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No Service History Available</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
