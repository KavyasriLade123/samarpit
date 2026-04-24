const express = require("express");
const { dbQuery, dbGet, dbRun } = require("../config/sqlite-db");
const generateId = require("../utils/generateId");
const logActivity = require("../utils/logActivity");

const router = express.Router();

router.get("/", async (req, res) => {
    const { search = "", page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const searchPattern = `%${search}%`;

    try {
        const countRow = await dbGet(`
            SELECT COUNT(*) as total FROM students 
            WHERE name LIKE ? OR studentId LIKE ? OR email LIKE ?
        `, [searchPattern, searchPattern, searchPattern]);
        
        const total = countRow.total;

        const data = await dbQuery(`
            SELECT * FROM students 
            WHERE name LIKE ? OR studentId LIKE ? OR email LIKE ?
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `, [searchPattern, searchPattern, searchPattern, Number(limit), offset]);

        res.json({ data, total });
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, course, email, phone, photoUrl } = req.body;
        const studentId = generateId("STU");
        const defaultPhotoUrl = photoUrl || "https://i.pravatar.cc/120?img=12";

        const result = await dbRun(`
            INSERT INTO students (name, studentId, course, email, phone, photoUrl)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, studentId, course, email, phone, defaultPhotoUrl]);

        const student = await dbGet("SELECT * FROM students WHERE id = ?", [result.lastID]);
        
        await logActivity(`New student added: ${student.name}`, "student");
        res.status(201).json(student);
    } catch (err) {
        console.error("Error adding student:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, course, email, phone, photoUrl } = req.body;

        await dbRun(`
            UPDATE students 
            SET name = ?, course = ?, email = ?, phone = ?, photoUrl = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [name, course, email, phone, photoUrl, id]);

        const student = await dbGet("SELECT * FROM students WHERE id = ?", [id]);
        res.json(student);
    } catch (err) {
        console.error("Error updating student:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const student = await dbGet("SELECT * FROM students WHERE id = ?", [id]);
        
        if (student) {
            await dbRun("DELETE FROM students WHERE id = ?", [id]);
            await logActivity(`Student removed: ${student.name}`, "student");
            res.json({ message: "Student deleted" });
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (err) {
        console.error("Error deleting student:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
