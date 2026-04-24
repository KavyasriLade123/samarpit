const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files from current directory
app.use(express.static(__dirname));

// API: Submit Admission
app.post('/api/admissions', (req, res) => {
    const { fullName, email, phone, program, message } = req.body;
    
    if (!fullName || !email || !phone || !program) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `INSERT INTO admissions (fullName, email, phone, program, message) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [fullName, email, phone, program, message], function(err) {
        if (err) {
            console.error('Error inserting admission:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'Admission submitted successfully', id: this.lastID });
    });
});

// API: Submit Contact
app.post('/api/contacts', (req, res) => {
    const { contactName, contactEmail, contactMessageText } = req.body;
    
    if (!contactName || !contactEmail || !contactMessageText) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `INSERT INTO contacts (contactName, contactEmail, contactMessageText) VALUES (?, ?, ?)`;
    db.run(query, [contactName, contactEmail, contactMessageText], function(err) {
        if (err) {
            console.error('Error inserting contact:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'Contact submitted successfully', id: this.lastID });
    });
});

// API: Student Login
app.post('/api/auth/student', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = `SELECT * FROM students WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (row) {
            res.status(200).json({ message: 'Login successful', user: { id: row.id, name: row.name, email: row.email } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// API: Employee Login
app.post('/api/auth/employee', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = `SELECT * FROM employees WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (row) {
            res.status(200).json({ message: 'Login successful', user: { id: row.id, name: row.name, email: row.email } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Fallback to index.html for unknown routes (SPA like behavior)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
