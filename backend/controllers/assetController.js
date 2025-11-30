const db = require("../db/db");

// STATS FOR DASHBOARD
exports.stats = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
    at.type_name,
    SUM(CASE WHEN LOWER(ad.working_status) = 'working' THEN 1 ELSE 0 END) AS working,
    SUM(CASE WHEN LOWER(ad.working_status) = 'defective' THEN 1 ELSE 0 END) AS defective,
    SUM(CASE WHEN LOWER(ad.working_status) = 'under_service' THEN 1 ELSE 0 END) AS under_service
    FROM asset_types at
    LEFT JOIN asset_details ad 
    ON ad.asset_type_id = at.type_id
    AND COALESCE(ad.is_deleted, 0) != 1
    GROUP BY at.type_name;
    `);

    res.json({ stats: rows });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL ASSETS
exports.getAllAssets = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        ad.asset_id,
        ad.serial_no,
		    at.type_name,
        ad.brand,
        ad.model,
        ad.working_status,
        ld.lab_name
      FROM asset_details ad
      LEFT JOIN asset_types at
        ON ad.asset_type_id = at.type_id
      LEFT JOIN lab_details ld ON ad.lab_id = ld.lab_id  
      WHERE COALESCE(ad.is_deleted, 0) != 1 AND ad.working_status != "obsolete"
      ORDER BY ad.asset_id DESC;
    `
    );

    return res.json({ assets: rows });
  } catch (err) {
    console.error("Error fetching assets:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ASSET BY ID
exports.getAssetById = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(
      `
      SELECT 
    ad.asset_id,
    ad.serial_no,
    at.type_name,
    ad.brand,
    ad.model,
    ad.working_status,
    
    lab.lab_name,
    
    ad.purchase_date,
    ad.funding_agency,  
    ad.price,
    ad.updated_at,
    
    ud.user_name,
    
    wd.warranty_id,
    wd.warranty_startdate,
    wd.warranty_enddate,
    wd.vendor_name,
    wd.vendor_contact,
    
    ledger.ledger_id,
    ledger.page_no, 
    ledger.serial_no AS ledger_serial_no

    FROM asset_details ad

    LEFT JOIN asset_types at 
    ON ad.asset_type_id = at.type_id

    LEFT JOIN lab_details lab 
    ON ad.lab_id = lab.lab_id

    LEFT JOIN warranty_details wd 
    ON ad.asset_id = wd.asset_id 

    LEFT JOIN user_details ud 
    ON ud.user_id = ad.created_by

    LEFT JOIN ledger_details ledger 
    ON ad.asset_id = ledger.asset_id

    WHERE ad.asset_id = ?
    AND COALESCE(ad.is_deleted, 0) != 1 LIMIT 1;
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Asset not found" });
    }

    return res.json({ asset: rows[0] });
  } catch (err) {
    console.error("Error fetching asset details:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
