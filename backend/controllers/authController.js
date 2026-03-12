const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const Head = require("../models/Head");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

/* -------------------- LOGIN -------------------- */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Student.findOne({ email });
    let role = "student";

    if (!user) {
      user = await Mentor.findOne({ email });
      role = "mentor";
    }

    if (!user) {
      user = await Head.findOne({ email });
      role = "head";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = { loginUser };

