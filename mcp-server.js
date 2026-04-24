const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize database connection
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database in MCP server', err.message);
    }
});

// Helper function to query database
function queryDb(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Create MCP server
const server = new McpServer({
    name: 'samarpit-database-server',
    version: '1.0.0'
});

// Tool: get_admissions
server.tool('get_admissions',
    'Get recent admission applications from the Samarpit website',
    {
        limit: z.number().optional().describe('Maximum number of applications to retrieve')
    },
    async ({ limit }) => {
        try {
            const rows = await queryDb('SELECT * FROM admissions ORDER BY created_at DESC LIMIT ?', [limit || 10]);
            return {
                content: [{ type: 'text', text: JSON.stringify(rows, null, 2) }]
            };
        } catch (err) {
            return {
                content: [{ type: 'text', text: `Error fetching admissions: ${err.message}` }],
                isError: true
            };
        }
    }
);

// Tool: get_contacts
server.tool('get_contacts',
    'Get recent contact messages submitted on the Samarpit website',
    {
        limit: z.number().optional().describe('Maximum number of contacts to retrieve')
    },
    async ({ limit }) => {
        try {
            const rows = await queryDb('SELECT * FROM contacts ORDER BY created_at DESC LIMIT ?', [limit || 10]);
            return {
                content: [{ type: 'text', text: JSON.stringify(rows, null, 2) }]
            };
        } catch (err) {
            return {
                content: [{ type: 'text', text: `Error fetching contacts: ${err.message}` }],
                isError: true
            };
        }
    }
);

// Tool: get_students
server.tool('get_students',
    'Get a list of registered students from the Samarpit website',
    {},
    async () => {
        try {
            const rows = await queryDb('SELECT id, name, email, created_at FROM students');
            return {
                content: [{ type: 'text', text: JSON.stringify(rows, null, 2) }]
            };
        } catch (err) {
            return {
                content: [{ type: 'text', text: `Error fetching students: ${err.message}` }],
                isError: true
            };
        }
    }
);

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Samarpit MCP server running on stdio');
}

main().catch(console.error);
