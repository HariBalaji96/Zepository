const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { user_name, password, email, role } = req.body;

    if (!user_name || !password || !email) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    const [user] = await db.query("SELECT * FROM user_details WHERE email=?", [
      email,
    ]);
    if (user.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO user_details (user_name,email,password,role) VALUES (?,?,?,?)",
      [user_name, email, hash, role]
    );

    res.status(201).json({ message: "Signup successfull" });
  } catch (err) {
    console.error("Signup error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [user] = await db.query(
      "SELECT * FROM user_details WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const foundUser = user[0];

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: foundUser.user_id,
        email: foundUser.email,
        name: foundUser.user_name,
        role: foundUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login Successfull",
      token,
      user: {
        id: foundUser.user_id,
        email: foundUser.email,
        name: foundUser.user_name,
        role: foundUser.role,
      },
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error" });
  }
};
