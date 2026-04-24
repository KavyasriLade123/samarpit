const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");

const { dbGet, dbRun, initDb } = require("./config/sqlite-db");
const { auth, adminOnly } = require("./middleware/auth");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
    res.json({ message: "Samarpit admin backend running with SQLite" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", auth, adminOnly, studentRoutes);
app.use("/api/employees", auth, adminOnly, employeeRoutes);
app.use("/api/projects", auth, adminOnly, projectRoutes);
app.use("/api/dashboard", auth, adminOnly, dashboardRoutes);

async function ensureDefaultAdmin() {
    try {
        const email = process.env.ADMIN_EMAIL || "admin@samarpit.org";
        const password = process.env.ADMIN_PASSWORD || "Admin@123";

        const existing = await dbGet("SELECT * FROM admins WHERE email = ?", [email]);
        if (existing) return;

        const passwordHash = await bcrypt.hash(password, 10);
        await dbRun("INSERT INTO admins (name, email, passwordHash, role) VALUES (?, ?, ?, ?)", [
            "Samarpit Admin",
            email,
            passwordHash,
            "admin"
        ]);
        console.log(`Default admin created: ${email}`);
    } catch (err) {
        console.error("Failed to ensure default admin:", err);
    }
}

async function bootstrap() {
    await initDb();
    await ensureDefaultAdmin();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap();
