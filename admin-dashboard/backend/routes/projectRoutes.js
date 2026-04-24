const express = require("express");
const { dbQuery, dbGet, dbRun } = require("../config/sqlite-db");
const logActivity = require("../utils/logActivity");

const router = express.Router();

router.get("/", async (req, res) => {
    const { search = "", status = "", page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const searchPattern = `%${search}%`;
    const statusPattern = status ? status : "%";

    try {
        const countRow = await dbGet(`
            SELECT COUNT(*) as total FROM projects 
            WHERE title LIKE ? AND status LIKE ?
        `, [searchPattern, statusPattern]);
        
        const total = countRow.total;

        const data = await dbQuery(`
            SELECT p.*, e.name as assignedToName, s.name as relatedStudentName
            FROM projects p
            LEFT JOIN employees e ON p.assignedTo = e.id
            LEFT JOIN students s ON p.relatedStudent = s.id
            WHERE p.title LIKE ? AND p.status LIKE ?
            ORDER BY p.created_at DESC 
            LIMIT ? OFFSET ?
        `, [searchPattern, statusPattern, Number(limit), offset]);

        // Map to resemble mongoose populated objects
        const formattedData = data.map(row => ({
            ...row,
            assignedTo: row.assignedTo ? { _id: row.assignedTo, name: row.assignedToName } : null,
            relatedStudent: row.relatedStudent ? { _id: row.relatedStudent, name: row.relatedStudentName } : null
        }));

        res.json({ data: formattedData, total });
    } catch (err) {
        console.error("Error fetching projects:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, assignedTo, relatedStudent, deadline, status, progress } = req.body;

        const result = await dbRun(`
            INSERT INTO projects (title, description, assignedTo, relatedStudent, deadline, status, progress)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [title, description, assignedTo, relatedStudent || null, deadline, status || "Pending", progress || 0]);

        const project = await dbGet("SELECT * FROM projects WHERE id = ?", [result.lastID]);
        
        await logActivity(`New project created: ${project.title}`, "project");
        res.status(201).json(project);
    } catch (err) {
        console.error("Error adding project:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assignedTo, relatedStudent, deadline, status, progress } = req.body;

        await dbRun(`
            UPDATE projects 
            SET title = ?, description = ?, assignedTo = ?, relatedStudent = ?, deadline = ?, status = ?, progress = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [title, description, assignedTo, relatedStudent || null, deadline, status, progress, id]);

        const project = await dbGet("SELECT * FROM projects WHERE id = ?", [id]);
        
        if (progress === 100 && status !== "Completed") {
            await logActivity(`Project reached 100%: ${project.title}`, "project");
        }
        res.json(project);
    } catch (err) {
        console.error("Error updating project:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const project = await dbGet("SELECT * FROM projects WHERE id = ?", [id]);
        
        if (project) {
            await dbRun("DELETE FROM projects WHERE id = ?", [id]);
            await logActivity(`Project deleted: ${project.title}`, "project");
            res.json({ message: "Project deleted" });
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (err) {
        console.error("Error deleting project:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
