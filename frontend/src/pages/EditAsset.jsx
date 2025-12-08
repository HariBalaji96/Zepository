import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./public/EditAsset.module.css";

export default function EditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [types, setTypes] = useState([]);
  const [labs, setLabs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(null);

  // Editable states
  const [basic, setBasic] = useState({});
  const [ledger, setLedger] = useState(null);
  const [warranty, setWarranty] = useState(null);
  const [specs, setSpecs] = useState([]);

  // Format MySQL DATETIME → yyyy-mm-dd
  const formatDate = (str) => {
    if (!str) return "";
    return str.split("T")[0];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      api.get(`/assets/${id}`, {
        headers: { Authorization: "Bearer " + token },
      }),
      api.get("/assets/types", {
        headers: { Authorization: "Bearer " + token },
      }),
      api.get("/labs", { headers: { Authorization: "Bearer " + token } }),
    ])
      .then(([assetRes, typesRes, labsRes]) => {
        const a = assetRes.data.asset;

        setAsset(a);
        setTypes(typesRes.data.types || typesRes.data.asset || []);
        setLabs(labsRes.data.labs || labsRes.data.stats || []);

        setBasic({
          asset_type_id: a.asset_type_id,
          brand: a.brand,
          model: a.model,
          serial_no: a.serial_no,
          working_status: a.working_status,
          lab_id: a.lab_id,
          purchase_date: formatDate(a.purchase_date),
          funding_agency: a.funding_agency,
          price: a.price,
        });

        setLedger(
          a.ledger_id
            ? {
                ledger_id: a.ledger_id,
                ledger_serial_no: a.ledger_serial_no,
                page_no: a.page_no,
              }
            : null
        );

        setWarranty(
          a.warranty_id
            ? {
                warranty_id: a.warranty_id,
                vendor_name: a.vendor_name,
                vendor_contact: a.vendor_contact,
                warranty_startdate: formatDate(a.warranty_startdate),
                warranty_enddate: formatDate(a.warranty_enddate),
              }
            : null
        );

        setSpecs(
          a.specs && a.specs.length > 0
            ? a.specs.map((s) => ({
                spec_key: s.spec_key,
                spec_value: s.spec_value,
                unit: s.unit,
              }))
            : []
        );

        setLoading(false);
      })
      .catch((err) => {
        console.error("Load error:", err);
      });
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!asset) return <h2>Asset not found</h2>;

  const tokenHeader = {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  };

  const saveBasic = async () => {
    setSavingSection("basic");
    try {
      await api.put(`/assets/${id}`, { basic: basic }, tokenHeader);
      alert("Basic details updated");
      navigate(`/assets/${id}`);
    } catch (err) {
      alert("Error updating basic details");
      console.error(err);
    } finally {
      setSavingSection(null);
    }
  };

  const saveLedger = async () => {
    setSavingSection("ledger");
    try {
      await api.put(`/assets/${id}`, { ledger: ledger }, tokenHeader);
      alert("Ledger updated");
      navigate(`/assets/${id}`);
    } catch (err) {
      alert("Error updating ledger");
    } finally {
      setSavingSection(null);
    }
  };

  const saveWarranty = async () => {
    setSavingSection("warranty");
    try {
      await api.put(`/assets/${id}`, { warranty: warranty }, tokenHeader);
      alert("Warranty updated");
      navigate(`/assets/${id}`);
    } catch (err) {
      alert("Error updating warranty");
    } finally {
      setSavingSection(null);
    }
  };

  const saveSpecs = async () => {
    setSavingSection("specs");
    try {
      await api.put(`/assets/${id}`, { specs: specs }, tokenHeader);
      alert("Specifications updated");
      navigate(`/assets/${id}`);
    } catch (err) {
      alert("Error updating specifications");
    } finally {
      setSavingSection(null);
    }
  };

  const addSpecRow = () => {
    setSpecs([...specs, { spec_key: "", spec_value: "", unit: "" }]);
  };

  const updateSpec = (index, field, value) => {
    const arr = [...specs];
    arr[index][field] = value;
    setSpecs(arr);
  };

  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <div className={styles.contentWrapper}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className={styles.pageTitle}>
          Edit Asset — {asset.brand} {asset.model}
        </h1>

        {/* BASIC + LEDGER */}
        <div className={styles.splitContainer}>
          {/* BASIC */}
          <div className={styles.block}>
            <div className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>Basic Information</h2>
              <button className={styles.saveButton} onClick={saveBasic}>
                Save
              </button>
            </div>

            <label>Asset Type</label>
            <select
              value={basic.asset_type_id}
              onChange={(e) =>
                setBasic({ ...basic, asset_type_id: e.target.value })
              }
            >
              <option value="">Select Type</option>
              {types.map((t) => (
                <option key={t.type_id} value={t.type_id}>
                  {t.type_name}
                </option>
              ))}
            </select>

            <label>Brand</label>
            <input
              value={basic.brand}
              onChange={(e) => setBasic({ ...basic, brand: e.target.value })}
            />

            <label>Model</label>
            <input
              value={basic.model}
              onChange={(e) => setBasic({ ...basic, model: e.target.value })}
            />

            <label>Serial Number</label>
            <input
              value={basic.serial_no}
              onChange={(e) =>
                setBasic({ ...basic, serial_no: e.target.value })
              }
            />

            <label>Status</label>
            <select
              value={basic.working_status}
              onChange={(e) =>
                setBasic({ ...basic, working_status: e.target.value })
              }
            >
              <option value="working">Working</option>
              <option value="defective">Defective</option>
            </select>

            <label>Location (Lab)</label>
            <select
              value={basic.lab_id}
              onChange={(e) => setBasic({ ...basic, lab_id: e.target.value })}
            >
              <option value="">Select Lab</option>
              {labs.map((l) => (
                <option key={l.lab_id} value={l.lab_id}>
                  {l.lab_name}
                </option>
              ))}
            </select>
          </div>

          {/* LEDGER */}
          <div className={styles.block}>
            <div className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>Ledger Details</h2>
              <button className={styles.saveButton} onClick={saveLedger}>
                {ledger ? "Save" : "Add"}
              </button>
            </div>

            <label>Ledger Serial No</label>
            <input
              value={ledger?.ledger_serial_no || ""}
              onChange={(e) =>
                setLedger({
                  ...(ledger || {}),
                  ledger_serial_no: e.target.value,
                })
              }
            />

            <label>Page No</label>
            <input
              value={ledger?.page_no || ""}
              onChange={(e) =>
                setLedger({ ...(ledger || {}), page_no: e.target.value })
              }
            />
          </div>
        </div>

        {/* ADDITIONAL + WARRANTY */}
        <div className={styles.blockFullRow}>
          {/* Additional */}
          <div className={styles.blockSmall}>
            <div className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>Additional Details</h2>
              <button className={styles.saveButton} onClick={saveBasic}>
                Save
              </button>
            </div>

            <label>Purchase Date</label>
            <input
              type="date"
              value={basic.purchase_date}
              onChange={(e) =>
                setBasic({ ...basic, purchase_date: e.target.value })
              }
            />

            <label>Funding Agency</label>
            <input
              value={basic.funding_agency}
              onChange={(e) =>
                setBasic({ ...basic, funding_agency: e.target.value })
              }
            />

            <label>Price</label>
            <input
              type="number"
              value={basic.price}
              onChange={(e) => setBasic({ ...basic, price: e.target.value })}
            />
          </div>

          {/* Warranty */}
          <div className={styles.blockSmall}>
            <div className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>Warranty Details</h2>
              <button className={styles.saveButton} onClick={saveWarranty}>
                {warranty ? "Save" : "Add"}
              </button>
            </div>

            <label>Vendor Name</label>
            <input
              value={warranty?.vendor_name || ""}
              onChange={(e) =>
                setWarranty({
                  ...(warranty || {}),
                  vendor_name: e.target.value,
                })
              }
            />

            <label>Vendor Contact</label>
            <input
              value={warranty?.vendor_contact || ""}
              onChange={(e) =>
                setWarranty({
                  ...(warranty || {}),
                  vendor_contact: e.target.value,
                })
              }
            />

            <label>Warranty Start</label>
            <input
              type="date"
              value={warranty?.warranty_startdate || ""}
              onChange={(e) =>
                setWarranty({
                  ...(warranty || {}),
                  warranty_startdate: e.target.value,
                })
              }
            />

            <label>Warranty End</label>
            <input
              type="date"
              value={warranty?.warranty_enddate || ""}
              onChange={(e) =>
                setWarranty({
                  ...(warranty || {}),
                  warranty_enddate: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* SPECS */}
        <div className={styles.blockFull}>
          <div className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>Specifications</h2>
            <div>
              <button className={styles.addSpecBtn} onClick={addSpecRow}>
                + Add
              </button>
              <button className={styles.saveButton} onClick={saveSpecs}>
                Save
              </button>
            </div>
          </div>

          {specs.length === 0 && <p>No specifications added</p>}

          {specs.map((s, idx) => (
            <div key={idx} className={styles.specRow}>
              <input
                placeholder="Key"
                value={s.spec_key}
                onChange={(e) => updateSpec(idx, "spec_key", e.target.value)}
              />
              <input
                placeholder="Value"
                value={s.spec_value}
                onChange={(e) => updateSpec(idx, "spec_value", e.target.value)}
              />
              <input
                placeholder="Unit"
                value={s.unit}
                onChange={(e) => updateSpec(idx, "unit", e.target.value)}
              />

              <button
                className={styles.removeBtn}
                onClick={() => removeSpec(idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
