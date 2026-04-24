const { dbRun } = require("../config/sqlite-db");

async function logActivity(message, type) {
    try {
        await dbRun("INSERT INTO activities (message, type) VALUES (?, ?)", [message, type]);
    } catch (err) {
        console.error("Failed to log activity:", err);
    }
}

module.exports = logActivity;
