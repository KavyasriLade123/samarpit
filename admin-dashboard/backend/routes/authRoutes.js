const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { dbGet } = require("../config/sqlite-db");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await dbGet("SELECT * FROM admins WHERE email = ?", [email]);
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "12h" }
        );
        res.json({
            token,
            user: { name: admin.name, email: admin.email, role: admin.role }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
