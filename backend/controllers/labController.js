const db = require("../db/db");

// All Lab Details
exports.labDetails = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        lab.lab_id,
        lab.lab_name,
        faculty.faculty_id,
        faculty.faculty_name,
        faculty.faculty_contact,
        faculty.faculty_email,
        faculty.start_date,
        faculty.end_date
      FROM lab_details lab
      LEFT JOIN faculty_details faculty
        ON lab.lab_incharge_faculty_id = faculty.faculty_id;
    `);

    res.json({ labs: rows });
  } catch (err) {
    console.error("Lab Details Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
