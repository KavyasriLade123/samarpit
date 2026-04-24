const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const { dbQuery, dbGet } = require("./config/sqlite-db");

const server = new McpServer({
    name: "admin-dashboard-server",
    version: "1.0.0"
});

server.tool("get_admin_dashboard_stats",
    "Get total counts of students, employees, projects, and recent activities.",
    {},
    async () => {
        try {
            const studentCount = await dbGet("SELECT COUNT(*) as count FROM students");
            const employeeCount = await dbGet("SELECT COUNT(*) as count FROM employees");
            const projectCount = await dbGet("SELECT COUNT(*) as count FROM projects");
            const recentActivities = await dbQuery("SELECT * FROM activities ORDER BY created_at DESC LIMIT 5");

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        students: studentCount.count,
                        employees: employeeCount.count,
                        projects: projectCount.count,
                        recentActivities
                    }, null, 2)
                }]
            };
        } catch (err) {
            return {
                content: [{ type: "text", text: `Error fetching stats: ${err.message}` }],
                isError: true
            };
        }
    }
);

server.tool("get_projects",
    "Get recent projects from the admin dashboard.",
    { limit: z.number().optional().describe("Maximum number of projects to retrieve") },
    async ({ limit }) => {
        try {
            const projects = await dbQuery(`
                SELECT p.*, e.name as assignedToName, s.name as relatedStudentName
                FROM projects p
                LEFT JOIN employees e ON p.assignedTo = e.id
                LEFT JOIN students s ON p.relatedStudent = s.id
                ORDER BY p.created_at DESC LIMIT ?
            `, [limit || 10]);

            return {
                content: [{ type: "text", text: JSON.stringify(projects, null, 2) }]
            };
        } catch (err) {
            return {
                content: [{ type: "text", text: `Error fetching projects: ${err.message}` }],
                isError: true
            };
        }
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Admin Dashboard MCP server running on stdio");
}

main().catch(console.error);
