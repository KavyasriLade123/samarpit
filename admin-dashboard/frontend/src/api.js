const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
    const token = localStorage.getItem("admin_token");
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }
    return data;
}

export const api = {
    login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    getStats: () => request("/dashboard/stats"),
    getStudents: (params) => request(`/students?${new URLSearchParams(params)}`),
    createStudent: (payload) => request("/students", { method: "POST", body: JSON.stringify(payload) }),
    updateStudent: (id, payload) =>
        request(`/students/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    deleteStudent: (id) => request(`/students/${id}`, { method: "DELETE" }),
    getEmployees: (params) => request(`/employees?${new URLSearchParams(params)}`),
    createEmployee: (payload) => request("/employees", { method: "POST", body: JSON.stringify(payload) }),
    updateEmployee: (id, payload) =>
        request(`/employees/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    deleteEmployee: (id) => request(`/employees/${id}`, { method: "DELETE" }),
    getProjects: (params) => request(`/projects?${new URLSearchParams(params)}`),
    createProject: (payload) => request("/projects", { method: "POST", body: JSON.stringify(payload) }),
    updateProject: (id, payload) =>
        request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" })
};
