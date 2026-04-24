import React, { useEffect, useMemo, useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import Pagination from "../components/Pagination";
import EntityTable from "../components/EntityTable";
import IDCard from "../components/IDCard";

const menuItems = ["Dashboard", "Students", "Employees", "Projects", "ID Cards", "Previews"];
const tableLimit = 6;

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [active, setActive] = useState("Dashboard");
    const [dark, setDark] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [stats, setStats] = useState(null);

    const [studentState, setStudentState] = useState({ data: [], total: 0, page: 1, search: "" });
    const [employeeState, setEmployeeState] = useState({ data: [], total: 0, page: 1, search: "" });
    const [projectState, setProjectState] = useState({
        data: [],
        total: 0,
        page: 1,
        filters: { employee: "", student: "", status: "" }
    });

    const [studentForm, setStudentForm] = useState({ name: "", course: "", email: "", phone: "" });
    const [employeeForm, setEmployeeForm] = useState({
        name: "",
        department: "",
        email: "",
        phone: ""
    });
    const [projectForm, setProjectForm] = useState({
        title: "",
        description: "",
        assignedTo: "",
        relatedStudent: "",
        deadline: "",
        status: "Pending",
        progress: 0
    });
    const [editId, setEditId] = useState({ student: null, employee: null, project: null });

    const notifications = useMemo(() => stats?.recentActivities || [], [stats]);

    const fetchDashboard = async () => setStats(await api.getStats());
    const fetchStudents = async () => {
        const res = await api.getStudents({
            page: studentState.page,
            limit: tableLimit,
            search: studentState.search
        });
        setStudentState((prev) => ({ ...prev, data: res.data, total: res.total }));
    };
    const fetchEmployees = async () => {
        const res = await api.getEmployees({
            page: employeeState.page,
            limit: tableLimit,
            search: employeeState.search
        });
        setEmployeeState((prev) => ({ ...prev, data: res.data, total: res.total }));
    };
    const fetchProjects = async () => {
        const res = await api.getProjects({
            page: projectState.page,
            limit: tableLimit,
            ...projectState.filters
        });
        setProjectState((prev) => ({ ...prev, data: res.data, total: res.total }));
    };

    useEffect(() => {
        fetchDashboard();
    }, []);
    useEffect(() => {
        fetchStudents();
    }, [studentState.page, studentState.search]);
    useEffect(() => {
        fetchEmployees();
    }, [employeeState.page, employeeState.search]);
    useEffect(() => {
        fetchProjects();
    }, [projectState.page, projectState.filters]);

    const submitStudent = async (e) => {
        e.preventDefault();
        if (editId.student) await api.updateStudent(editId.student, studentForm);
        else await api.createStudent(studentForm);
        setStudentForm({ name: "", course: "", email: "", phone: "" });
        setEditId((p) => ({ ...p, student: null }));
        fetchStudents();
        fetchDashboard();
    };
    const submitEmployee = async (e) => {
        e.preventDefault();
        if (editId.employee) await api.updateEmployee(editId.employee, employeeForm);
        else await api.createEmployee(employeeForm);
        setEmployeeForm({ name: "", department: "", email: "", phone: "" });
        setEditId((p) => ({ ...p, employee: null }));
        fetchEmployees();
        fetchDashboard();
    };
    const submitProject = async (e) => {
        e.preventDefault();
        const payload = { ...projectForm, progress: Number(projectForm.progress) };
        if (!payload.relatedStudent) payload.relatedStudent = null;
        if (editId.project) await api.updateProject(editId.project, payload);
        else await api.createProject(payload);
        setProjectForm({
            title: "",
            description: "",
            assignedTo: "",
            relatedStudent: "",
            deadline: "",
            status: "Pending",
            progress: 0
        });
        setEditId((p) => ({ ...p, project: null }));
        fetchProjects();
        fetchDashboard();
    };

    const statCards = [
        { label: "Total Students", value: stats?.totalStudents ?? 0 },
        { label: "Total Employees", value: stats?.totalEmployees ?? 0 },
        { label: "Active Projects", value: stats?.activeProjects ?? 0 },
        { label: "Pending Tasks", value: stats?.pendingTasks ?? 0 }
    ];

    return (
        <div className={dark ? "dark" : ""}>
            <div className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
                <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
                    <aside className="bg-slate-900 p-4 text-slate-100">
                        <h2 className="text-xl font-bold">Admin Panel</h2>
                        <p className="mt-1 text-xs text-slate-300">{user?.email}</p>
                        <nav className="mt-5 grid gap-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item}
                                    className={`rounded px-3 py-2 text-left text-sm ${
                                        active === item ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"
                                    }`}
                                    onClick={() => setActive(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="p-4">
                        <header className="rounded-xl border bg-white p-3 shadow dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h1 className="text-lg font-bold">Samarpit Admin Dashboard</h1>
                                    <p className="text-sm text-slate-500">Manage students, employees and projects</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="relative rounded border p-2"
                                        onClick={() => setShowNotifications((v) => !v)}
                                    >
                                        <Bell size={16} />
                                        <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1 text-[10px] text-white">
                                            {notifications.length}
                                        </span>
                                    </button>
                                    <button className="rounded border p-2" onClick={() => setDark((v) => !v)}>
                                        {dark ? <Sun size={16} /> : <Moon size={16} />}
                                    </button>
                                    <button className="rounded bg-rose-600 px-3 py-2 text-sm text-white" onClick={logout}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                            {showNotifications && (
                                <div className="mt-3 rounded border p-2 text-sm">
                                    {notifications.length === 0
                                        ? "No notifications"
                                        : notifications.map((n) => (
                                              <p key={n._id} className="border-b py-1 last:border-b-0">
                                                  {n.message}
                                              </p>
                                          ))}
                                </div>
                            )}
                        </header>

                        {active === "Dashboard" && (
                            <section className="mt-4 space-y-4">
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                    {statCards.map((s) => (
                                        <article
                                            key={s.label}
                                            className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900"
                                        >
                                            <p className="text-sm text-slate-500">{s.label}</p>
                                            <h3 className="mt-1 text-2xl font-bold">{s.value}</h3>
                                        </article>
                                    ))}
                                </div>
                                <article className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="font-semibold">Recent Activities</h3>
                                    <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                        {notifications.map((n) => (
                                            <p key={n._id}>• {n.message}</p>
                                        ))}
                                    </div>
                                </article>
                            </section>
                        )}

                        {active === "Students" && (
                            <section className="mt-4 space-y-4">
                                <article className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="mb-2 font-semibold">Add / Edit Student</h3>
                                    <form className="grid gap-2 md:grid-cols-2" onSubmit={submitStudent}>
                                        <input className="rounded border p-2" placeholder="Name" value={studentForm.name} onChange={(e) => setStudentForm((p) => ({ ...p, name: e.target.value }))} required />
                                        <input className="rounded border p-2" placeholder="Course/Class" value={studentForm.course} onChange={(e) => setStudentForm((p) => ({ ...p, course: e.target.value }))} required />
                                        <input className="rounded border p-2" placeholder="Email" value={studentForm.email} onChange={(e) => setStudentForm((p) => ({ ...p, email: e.target.value }))} required />
                                        <input className="rounded border p-2" placeholder="Phone" value={studentForm.phone} onChange={(e) => setStudentForm((p) => ({ ...p, phone: e.target.value }))} required />
                                        <button className="rounded bg-blue-600 px-3 py-2 text-white md:col-span-2">{editId.student ? "Update Student" : "Add Student"}</button>
                                    </form>
                                </article>
                                <article className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
                                    <div className="mb-3 flex flex-wrap justify-between gap-2">
                                        <h3 className="font-semibold">Students</h3>
                                        <input
                                            className="rounded border px-2 py-1 text-sm"
                                            placeholder="Search"
                                            value={studentState.search}
                                            onChange={(e) => setStudentState((p) => ({ ...p, page: 1, search: e.target.value }))}
                                        />
                                    </div>
                                    <EntityTable
                                        columns={[
                                            { key: "name", label: "Name" },
                                            { key: "studentId", label: "Student ID" },
                                            { key: "course", label: "Course" },
                                            { key: "email", label: "Email" },
                                            { key: "phone", label: "Phone" }
                                        ]}
                                        rows={studentState.data}
                                        onEdit={(row) => {
                                            setEditId((p) => ({ ...p, student: row._id }));
                                            setStudentForm({
                                                name: row.name,
                                                course: row.course,
                                                email: row.email,
                                                phone: row.phone
                                            });
                                        }}
                                        onDelete={async (row) => {
                                            await api.deleteStudent(row._id);
                                            fetchStudents();
                                            fetchDashboard();
                                        }}
                                    />
                                    <Pagination page={studentState.page} total={studentState.total} limit={tableLimit} onChange={(next) => setStudentState((p) => ({ ...p, page: next }))} />
                                </article>
                            </section>
                        )}

                        {active === "Employees" && (
                            <section className="mt-4 space-y-4">
                                <article className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="mb-2 font-semibold">Add / Edit Employee</h3>
                                    <form className="grid gap-2 md:grid-cols-2" onSubmit={submitEmployee}>
                                        <input className="rounded border p-2" placeholder="Name" value={employeeForm.name} onChange={(e) => setEmployeeForm((p) => ({ ...p, name: e.target.value }))} required />
                                        <input className="rounded border p-2" placeholder="Role/Department" value={employeeForm.department} onChange={(e) => setEmployeeForm((p) => ({ ...p, department: e.target.value }))} required />
                                        <input className="rounded border p-2" placeholder="Email" value={employeeForm.email} onChange={(e) => setEmployeeForm((p) => ({ ...p, email: e.target.value }))} required />
                                        <input className="rounded border p-2" placeholder="Phone" value={employeeForm.phone} onChange={(e) => setEmployeeForm((p) => ({ ...p, phone: e.target.value }))} required />
                                        <button className="rounded bg-blue-600 px-3 py-2 text-white md:col-span-2">{editId.employee ? "Update Employee" : "Add Employee"}</button>
                                    </form>
                                </article>
                                <article className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
                                    <div className="mb-3 flex flex-wrap justify-between gap-2">
                                        <h3 className="font-semibold">Employees</h3>
                                        <input
                                            className="rounded border px-2 py-1 text-sm"
                                            placeholder="Search"
                                            value={employeeState.search}
                                            onChange={(e) => setEmployeeState((p) => ({ ...p, page: 1, search: e.target.value }))}
                                        />
                                    </div>
                                    <EntityTable
                                        columns={[
                                            { key: "name", label: "Name" },
                                            { key: "employeeId", label: "Employee ID" },
                                            { key: "department", label: "Department" },
                                            { key: "email", label: "Email" },
                                            { key: "phone", label: "Phone" }
                                        ]}
                                        rows={employeeState.data}
                                        onEdit={(row) => {
                                            setEditId((p) => ({ ...p, employee: row._id }));
                                            setEmployeeForm({
                                                name: row.name,
                                                department: row.department,
                                                email: row.email,
                                                phone: row.phone
                                            });
                                        }}
                                        onDelete={async (row) => {
                                            await api.deleteEmployee(row._id);
                                            fetchEmployees();
                                            fetchDashboard();
                                        }}
                                    />
                                    <Pagination page={employeeState.page} total={employeeState.total} limit={tableLimit} onChange={(next) => setEmployeeState((p) => ({ ...p, page: next }))} />
                                </article>
                            </section>
                        )}

                        {active === "Projects" && (
                            <section className="mt-4 space-y-4">
                                <article className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="mb-2 font-semibold">Create / Edit Task or Project</h3>
                                    <form className="grid gap-2 md:grid-cols-2" onSubmit={submitProject}>
                                        <input className="rounded border p-2" placeholder="Title" value={projectForm.title} onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))} required />
                                        <input className="rounded border p-2" placeholder="Deadline" type="date" value={projectForm.deadline} onChange={(e) => setProjectForm((p) => ({ ...p, deadline: e.target.value }))} required />
                                        <textarea className="rounded border p-2 md:col-span-2" placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))} required />
                                        <select className="rounded border p-2" value={projectForm.assignedTo} onChange={(e) => setProjectForm((p) => ({ ...p, assignedTo: e.target.value }))} required>
                                            <option value="">Assign To Employee</option>
                                            {employeeState.data.map((emp) => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select className="rounded border p-2" value={projectForm.relatedStudent} onChange={(e) => setProjectForm((p) => ({ ...p, relatedStudent: e.target.value }))}>
                                            <option value="">Related Student (optional)</option>
                                            {studentState.data.map((stu) => (
                                                <option key={stu._id} value={stu._id}>
                                                    {stu.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select className="rounded border p-2" value={projectForm.status} onChange={(e) => setProjectForm((p) => ({ ...p, status: e.target.value }))}>
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                        </select>
                                        <input className="rounded border p-2" type="number" min={0} max={100} value={projectForm.progress} onChange={(e) => setProjectForm((p) => ({ ...p, progress: e.target.value }))} />
                                        <button className="rounded bg-blue-600 px-3 py-2 text-white md:col-span-2">{editId.project ? "Update Project" : "Create Project"}</button>
                                    </form>
                                </article>

                                <article className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
                                    <div className="mb-3 grid gap-2 md:grid-cols-3">
                                        <select className="rounded border px-2 py-1" value={projectState.filters.employee} onChange={(e) => setProjectState((p) => ({ ...p, page: 1, filters: { ...p.filters, employee: e.target.value } }))}>
                                            <option value="">Filter by Employee</option>
                                            {employeeState.data.map((emp) => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select className="rounded border px-2 py-1" value={projectState.filters.student} onChange={(e) => setProjectState((p) => ({ ...p, page: 1, filters: { ...p.filters, student: e.target.value } }))}>
                                            <option value="">Filter by Student</option>
                                            {studentState.data.map((stu) => (
                                                <option key={stu._id} value={stu._id}>
                                                    {stu.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select className="rounded border px-2 py-1" value={projectState.filters.status} onChange={(e) => setProjectState((p) => ({ ...p, page: 1, filters: { ...p.filters, status: e.target.value } }))}>
                                            <option value="">Filter by Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <EntityTable
                                        columns={[
                                            { key: "title", label: "Title" },
                                            { key: "status", label: "Status" },
                                            {
                                                key: "assignedTo",
                                                label: "Assigned To",
                                                render: (v) => v?.name || "-"
                                            },
                                            {
                                                key: "relatedStudent",
                                                label: "Student",
                                                render: (v) => v?.name || "-"
                                            },
                                            { key: "deadline", label: "Deadline", render: (v) => new Date(v).toLocaleDateString() },
                                            {
                                                key: "progress",
                                                label: "Progress",
                                                render: (v) => (
                                                    <div className="w-32">
                                                        <div className="h-2 rounded bg-slate-200">
                                                            <div className="h-2 rounded bg-blue-600" style={{ width: `${v}%` }} />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        ]}
                                        rows={projectState.data}
                                        onEdit={(row) => {
                                            setEditId((p) => ({ ...p, project: row._id }));
                                            setProjectForm({
                                                title: row.title,
                                                description: row.description,
                                                assignedTo: row.assignedTo?._id || "",
                                                relatedStudent: row.relatedStudent?._id || "",
                                                deadline: row.deadline?.slice(0, 10),
                                                status: row.status,
                                                progress: row.progress
                                            });
                                        }}
                                        onDelete={async (row) => {
                                            await api.deleteProject(row._id);
                                            fetchProjects();
                                            fetchDashboard();
                                        }}
                                    />
                                    <Pagination page={projectState.page} total={projectState.total} limit={tableLimit} onChange={(next) => setProjectState((p) => ({ ...p, page: next }))} />
                                </article>
                            </section>
                        )}

                        {active === "ID Cards" && (
                            <section className="mt-4 grid gap-4 md:grid-cols-2">
                                {studentState.data.slice(0, 2).map((s, idx) => (
                                    <IDCard key={s._id} id={`student-card-${idx}`} type="Student" person={s} />
                                ))}
                                {employeeState.data.slice(0, 2).map((e, idx) => (
                                    <IDCard key={e._id} id={`employee-card-${idx}`} type="Employee" person={e} />
                                ))}
                            </section>
                        )}

                        {active === "Previews" && (
                            <section className="mt-4 grid gap-4 md:grid-cols-2">
                                <article className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="font-semibold">Student Dashboard Preview</h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Students can access attendance, results, assignments, and projects.
                                    </p>
                                </article>
                                <article className="rounded-xl border bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="font-semibold">Employee Dashboard Preview</h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Employees can monitor attendance, projects, payslips, and deadlines.
                                    </p>
                                </article>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
