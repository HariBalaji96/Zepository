import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, Link, NavLink } from "react-router-dom";
import styles from "./public/Assets.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [labFilter, setLabFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const uniqueStatuses = [...new Set(assets.map((a) => a.working_status))];
  const uniqueLabs = [...new Set(assets.map((a) => a.lab_name))];
  const uniqueTypes = [...new Set(assets.map((a) => a.type_name))];

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/assets", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setAssets(res.data.assets))
      .catch((err) => {
        console.log("Stats error:", err);
      });
  }, []);

  // Search filter
  const filteredAssets = assets.filter((a) => {
    const s = search.toLowerCase();

    const matchesSearch =
      (a.asset_name?.toLowerCase() || "").includes(s) ||
      (a.serial_no?.toLowerCase() || "").includes(s) ||
      (a.brand?.toLowerCase() || "").includes(s) ||
      (a.model?.toLowerCase() || "").includes(s) ||
      a.asset_id?.toString().includes(s);

    const matchesStatus = statusFilter
      ? a.working_status === statusFilter
      : true;

    const matchesLab = labFilter ? a.lab_name === labFilter : true;

    const matchesType = typeFilter ? a.type_name === typeFilter : true;

    return matchesSearch && matchesStatus && matchesLab && matchesType;
  });

  const openDetails = (id) => {
    navigate(`/assets/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={styles.assetsWrapperOuter}>
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <div className={styles.contentWrapper}>
        <h1 className={styles.assetPageTitle}>Assets List</h1>

        <input
          type="text"
          placeholder="Search assets..."
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link to="/add" className={styles.addButton}>
          Add Asset
        </Link>

        <div className={styles.filterBar}>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Lab Filter */}
          <select
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
          >
            <option value="">All Labs</option>
            {uniqueLabs.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>

          {/* Asset Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.list}>
          {filteredAssets.length === 0 ? (
            <p>No assets found.</p>
          ) : (
            filteredAssets.map((item) => (
              <div
                key={item.asset_id}
                className={styles.row}
                onClick={() => openDetails(item.asset_id)}
              >
                <div className={styles.left}>
                  <h3 className={styles.assetName}>
                    {item.brand + " - " + item.model}
                  </h3>
                  <p className={styles.meta}>
                    Serial: {item.serial_no} • Location: {item.lab_name}
                  </p>
                </div>

                <div className={styles.right}>
                  <span className={styles.typeTag}>{item.type_name}</span>

                  <span
                    className={`${styles.statusTag} ${
                      styles[item.working_status.toLowerCase()]
                    }`}
                  >
                    {item.working_status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
