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
            SELECT COUNT(*) as total FROM employees 
            WHERE name LIKE ? OR employeeId LIKE ? OR department LIKE ?
        `, [searchPattern, searchPattern, searchPattern]);
        
        const total = countRow.total;

        const data = await dbQuery(`
            SELECT * FROM employees 
            WHERE name LIKE ? OR employeeId LIKE ? OR department LIKE ?
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `, [searchPattern, searchPattern, searchPattern, Number(limit), offset]);

        res.json({ data, total });
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, department, email, phone, photoUrl } = req.body;
        const employeeId = generateId("EMP");
        const defaultPhotoUrl = photoUrl || "https://i.pravatar.cc/120?img=48";

        const result = await dbRun(`
            INSERT INTO employees (name, employeeId, department, email, phone, photoUrl)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, employeeId, department, email, phone, defaultPhotoUrl]);

        const employee = await dbGet("SELECT * FROM employees WHERE id = ?", [result.lastID]);
        
        await logActivity(`New employee added: ${employee.name}`, "employee");
        res.status(201).json(employee);
    } catch (err) {
        console.error("Error adding employee:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, email, phone, photoUrl } = req.body;

        await dbRun(`
            UPDATE employees 
            SET name = ?, department = ?, email = ?, phone = ?, photoUrl = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [name, department, email, phone, photoUrl, id]);

        const employee = await dbGet("SELECT * FROM employees WHERE id = ?", [id]);
        res.json(employee);
    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await dbGet("SELECT * FROM employees WHERE id = ?", [id]);
        
        if (employee) {
            await dbRun("DELETE FROM employees WHERE id = ?", [id]);
            await logActivity(`Employee removed: ${employee.name}`, "employee");
            res.json({ message: "Employee deleted" });
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
