const express = require("express");
const { dbGet, dbQuery } = require("../config/sqlite-db");

const router = express.Router();

router.get("/stats", async (req, res) => {
    try {
        const studentCount = await dbGet("SELECT COUNT(*) as count FROM students");
        const employeeCount = await dbGet("SELECT COUNT(*) as count FROM employees");
        const projectCount = await dbGet("SELECT COUNT(*) as count FROM projects");
        
        const recentActivities = await dbQuery("SELECT * FROM activities ORDER BY created_at DESC LIMIT 5");

        res.json({
            students: studentCount.count,
            employees: employeeCount.count,
            projects: projectCount.count,
            recentActivities
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
