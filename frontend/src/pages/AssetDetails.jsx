import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import styles from "./public/Assets.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AssetDetails() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    api
      .get(`/assets/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setAsset(res.data.asset))
      .catch((err) => {
        console.log("Stats error:", err);
      });
  }, [id]);

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

        <div className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>Basic Information:</h2>
          <button className={styles.editButton}>Edit</button>
        </div>

        <p><strong>Serial No:</strong> {asset.serial_no}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`${styles.status} ${styles[asset.working_status]}`}>
            {asset.working_status}
          </span>
        </p>
        <p><strong>Brand:</strong> {asset.brand}</p>
        <p><strong>Model:</strong> {asset.model}</p>
        <p><strong>Type:</strong> {asset.type_name}</p>
        <p><strong>Location:</strong> {asset.lab_name}</p>

        <div className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>Ledger Information:</h2>
          <button className={styles.editButton}>Edit</button>
        </div>

        {asset.ledger_id ? (
          <>
            <p><strong>S.No:</strong> {asset.ledger_serial_no}</p>
            <p><strong>Page No:</strong> {asset.page_no}</p>
          </>
        ) : (
          <p>Ledger Details not Available</p>
        )}
      </div>

      {/* RIGHT BLOCK */}
      <div className={styles.block}>

        <div className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>Additional Details:</h2>
          <button className={styles.editButton}>Edit</button>
        </div>

        <p><strong>Purchase Date:</strong> {asset.purchase_date}</p>
        <p><strong>Funding Agency:</strong> {asset.funding_agency}</p>
        <p><strong>Cost:</strong> {asset.price}</p>
        <p><strong>Last Update:</strong> {asset.updated_at}</p>

        <div className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>Warranty Details:</h2>
          <button className={styles.editButton}>Edit</button>
        </div>

        {asset.warranty_id ? (
          <>
            <p><strong>Vendor Name:</strong> {asset.vendor_name}</p>
            <p><strong>Vendor Contact:</strong> {asset.vendor_contact}</p>
            <p><strong>Warranty Start Date:</strong> {asset.warranty_startdate}</p>
            <p><strong>Warranty End Date:</strong> {asset.warranty_enddate}</p>
          </>
        ) : (
          <p>No Warranty Available</p>
        )}
      </div>
    </div>
  </div>

  <Footer />
</div>

  );
}
