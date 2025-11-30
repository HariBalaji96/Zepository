import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./public/AddAsset.module.css";

export default function AddAsset() {
  const [types, setTypes] = useState([]);
  const [labs, setLabs] = useState([]);

  const [asset, setAsset] = useState({
    asset_name: "",
    type_id: "",
    brand: "",
    model: "",
    serial_no: "",
    working_status: "working",
    lab_id: "",
    purchase_date: "",
    funding_agency: "",
    price: "",
  });

  const [hasWarranty, setHasWarranty] = useState(false);
  const [warranty, setWarranty] = useState({
    vendor_name: "",
    vendor_contact: "",
    warranty_startdate: "",
    warranty_enddate: "",
  });

  const [hasLedger, setHasLedger] = useState(false);
  const [ledger, setLedger] = useState({
    ledger_serial_no: "",
    page_no: "",
  });

  useEffect(() => {
    api.get("/assets/types").then((res) => setTypes(res.data.types));
    api.get("/labs").then((res) => setLabs(res.data.labs));
  }, []);

  const handleAssetChange = (e) => {
    setAsset({ ...asset, [e.target.name]: e.target.value });
  };

  const handleWarrantyChange = (e) => {
    setWarranty({ ...warranty, [e.target.name]: e.target.value });
  };

  const handleLedgerChange = (e) => {
    setLedger({ ...ledger, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const finalData = {
        ...asset,
        warranty: hasWarranty ? warranty : null,
        ledger: hasLedger ? ledger : null,
      };

      await api.post("/assets/add", finalData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      alert("Asset added successfully!");
    } catch (err) {
      console.log(err);
      alert("Error adding asset");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>Add New Asset</h1>

        <div className={styles.splitContainer}>
          {/* LEFT BLOCK */}
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>Basic Information</h2>

            <label>Asset Name</label>
            <input name="asset_name" onChange={handleAssetChange} />

            <label>Asset Type</label>
            <select name="type_id" onChange={handleAssetChange}>
              <option value="">Select Type</option>
              {types.map((t) => (
                <option key={t.type_id} value={t.type_id}>
                  {t.type_name}
                </option>
              ))}
            </select>

            <label>Brand</label>
            <input name="brand" onChange={handleAssetChange} />

            <label>Model</label>
            <input name="model" onChange={handleAssetChange} />

            <label>Serial Number</label>
            <input name="serial_no" onChange={handleAssetChange} />

            <label>Status</label>
            <select name="working_status" onChange={handleAssetChange}>
              <option value="working">Working</option>
              <option value="defective">Defective</option>
              <option value="under_service">Under Service</option>
            </select>

            <label>Location (Lab)</label>
            <select name="lab_id" onChange={handleAssetChange}>
              <option value="">Select Lab</option>
              {labs.map((lab) => (
                <option key={lab.lab_id} value={lab.lab_id}>
                  {lab.lab_name}
                </option>
              ))}
            </select>

            {/* Ledger Section */}
            <label className={styles.ledgerCheck}>
              <input
                type="checkbox"
                checked={hasLedger}
                onChange={() => setHasLedger(!hasLedger)}
                className={styles.checkInput}
              />
              <span>Include Ledger Details</span>
            </label>

            {hasLedger && (
              <div className={styles.ledgerBox}>
                <h2 className={styles.blockTitle}>Ledger Details</h2>

                <label>Ledger Serial No</label>
                <input name="ledger_serial_no" onChange={handleLedgerChange} />

                <label>Page No</label>
                <input name="page_no" onChange={handleLedgerChange} />
              </div>
            )}
          </div>

          {/* RIGHT BLOCK */}
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>Additional Details</h2>

            <label>Purchase Date</label>
            <input
              type="date"
              name="purchase_date"
              onChange={handleAssetChange}
            />

            <label>Funding Agency</label>
            <input name="funding_agency" onChange={handleAssetChange} />

            <label>Cost</label>
            <input type="number" name="price" onChange={handleAssetChange} />

            <label className={styles.warrantyCheck}>
              <input
                type="checkbox"
                checked={hasWarranty}
                className={styles.checkInput}
                onChange={() => setHasWarranty(!hasWarranty)}
              />
              Include Warranty Details
            </label>

            {hasWarranty && (
              <div className={styles.warrantyBox}>
                <h2 className={styles.blockTitle}>Warranty Details</h2>

                <label>Vendor Name</label>
                <input name="vendor_name" onChange={handleWarrantyChange} />

                <label>Vendor Contact</label>
                <input name="vendor_contact" onChange={handleWarrantyChange} />

                <label>Warranty Start Date</label>
                <input
                  type="date"
                  name="warranty_startdate"
                  onChange={handleWarrantyChange}
                />

                <label>Warranty End Date</label>
                <input
                  type="date"
                  name="warranty_enddate"
                  onChange={handleWarrantyChange}
                />
              </div>
            )}
          </div>
        </div>

        <button className={styles.submitButton} onClick={handleSubmit}>
          Add Asset
        </button>
      </div>

      <Footer />
    </div>
  );
}
