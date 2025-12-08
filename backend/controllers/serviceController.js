const db = require("../db/db");
exports.sendService = async (req, res) => {
  const connection = await db.getConnection(); // get a dedicated connection
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const {
      asset_id,
      sent_date,
      service_provider,
      service_through,
      service_note,
    } = req.body;

    await connection.query(
      `INSERT INTO service_requests
        (asset_id, requested_by, sent_date,
         service_provider, service_through, service_note, service_status)
       VALUES (?, ?, ?, ?, ?, ?, 'sent')`,
      [
        asset_id,
        userId,
        sent_date,
        service_provider,
        service_through,
        service_note,
      ]
    );

    await connection.query(
      `UPDATE asset_details 
       SET working_status = 'under_service'
       WHERE asset_id = ?`,
      [asset_id]
    );

    await connection.commit();
    connection.release();

    res.json({ message: "Asset sent to service successfully" });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Send service error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUnderService = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        sr.service_id,
        sr.asset_id,
        sr.sent_date,
        sr.service_status,
        sr.service_provider,
        sr.service_through,
        sr.service_note,

        ad.serial_no,
        ad.brand,
        ad.model,
        ad.working_status,

        at.type_name,
        lab.lab_name

      FROM service_requests sr
      JOIN asset_details ad ON sr.asset_id = ad.asset_id
      LEFT JOIN asset_types at ON ad.asset_type_id = at.type_id
      LEFT JOIN lab_details lab ON ad.lab_id = lab.lab_id

      WHERE sr.service_status = 'sent'
      ORDER BY sr.sent_date DESC;
      `
    );

    res.json({ services: rows });
  } catch (err) {
    console.error("Fetch service list error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
