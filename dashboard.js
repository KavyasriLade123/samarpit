function renderTable(headers, rows) {
    const th = headers.map((h) => `<th>${h}</th>`).join("");
    const tr = rows
        .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
        .join("");
    return `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

function renderSummaryCards(items) {
    return `<div class="summary-grid">${items
        .map((item) => `<article class="summary-card"><h4>${item.label}</h4><p>${item.value}</p></article>`)
        .join("")}</div>`;
}

function renderBarChart(rows) {
    return `<div class="chart-bars">${rows
        .map(
            (r) => `
            <div class="chart-row">
                <span>${r.label}</span>
                <div class="progress-track"><div class="progress-fill" style="width:${r.value}%"></div></div>
                <strong>${r.value}%</strong>
            </div>
        `
        )
        .join("")}</div>`;
}

function attachLayoutEvents(config) {
    const notifBtn = document.getElementById("notifBtn");
    const notifDropdown = document.getElementById("notifDropdown");
    const darkToggle = document.getElementById("darkToggle");
    const logoutBtn = document.getElementById("logoutBtn");

    notifBtn.addEventListener("click", function () {
        notifDropdown.classList.toggle("open");
    });

    document.addEventListener("click", function (event) {
        if (!notifBtn.contains(event.target) && !notifDropdown.contains(event.target)) {
            notifDropdown.classList.remove("open");
        }
    });

    darkToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });

    logoutBtn.addEventListener("click", function () {
        window.location.href = config.logoutUrl;
    });

    document.querySelectorAll(".menu button").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".menu button").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const section = btn.dataset.section;
            document.querySelectorAll(".dash-section").forEach((el) => el.classList.add("hidden"));
            document.getElementById(section).classList.remove("hidden");
        });
    });
}

function initEmployeeDashboard() {
    const data = {
        name: "Ananya Sharma",
        role: "Senior Trainer",
        notifications: [
            "New payslip for March is available.",
            "Project 'Campus Communication Lab' deadline is in 2 days.",
            "Attendance report has been updated."
        ],
        summary: [
            { label: "Attendance (Present/Absent)", value: "22 / 2" },
            { label: "Projects Assigned", value: "5" },
            { label: "Upcoming Deadlines", value: "3" },
            { label: "Latest Payslip", value: "March 2026" }
        ],
        attendance: [
            ["2026-04-01", '<span class="pill present">Present</span>'],
            ["2026-04-02", '<span class="pill present">Present</span>'],
            ["2026-04-03", '<span class="pill leave">Leave</span>'],
            ["2026-04-04", '<span class="pill present">Present</span>'],
            ["2026-04-05", '<span class="pill absent">Absent</span>']
        ],
        payslips: [
            ["March 2026", "55,000", "22,000", "6,500", '<button class="icon-btn">Download</button>'],
            ["Feb 2026", "54,000", "21,000", "6,100", '<button class="icon-btn">Download</button>']
        ],
        projectsCurrent: [
            { name: "Communication Mastery Batch", desc: "Managing trainer sessions for 80 learners.", progress: 72, status: "In Progress" },
            { name: "Counselor Skill Program", desc: "Mentoring counselor communication standards.", progress: 100, status: "Completed" }
        ],
        projectsUpcoming: [
            ["Young Minds Outreach", "2026-05-02", "2026-06-10"],
            ["Parent Leadership Bootcamp", "2026-05-14", "2026-07-01"]
        ]
    };

    document.getElementById("welcomeMessage").textContent = `Welcome back, ${data.name}`;
    document.getElementById("profileName").textContent = data.name;
    document.getElementById("profileRole").textContent = data.role;
    document.getElementById("notifCount").textContent = String(data.notifications.length);
    document.getElementById("notifList").innerHTML = data.notifications
        .map((n) => `<div class="notif-item">${n}</div>`)
        .join("");

    document.getElementById("summaryCards").innerHTML = renderSummaryCards(data.summary);
    document.getElementById("attendanceTable").innerHTML = renderTable(["Date", "Status"], data.attendance);
    document.getElementById("payslipTable").innerHTML = renderTable(
        ["Month", "Basic", "HRA", "Deductions", "Action"],
        data.payslips
    );
    document.getElementById("attendanceChart").innerHTML = renderBarChart([
        { label: "Week 1", value: 100 },
        { label: "Week 2", value: 85 },
        { label: "Week 3", value: 90 },
        { label: "Week 4", value: 95 }
    ]);

    document.getElementById("projectCards").innerHTML = data.projectsCurrent
        .map(
            (p) => `
        <article class="summary-card">
            <h4>${p.name}</h4>
            <p style="font-size:0.9rem;font-weight:500;margin:0.35rem 0;">${p.desc}</p>
            <div class="progress-track"><div class="progress-fill" style="width:${p.progress}%"></div></div>
            <p style="font-size:0.85rem;margin-top:0.4rem;">
                <span class="pill ${p.status === "Completed" ? "completed" : "in-progress"}">${p.status}</span>
            </p>
        </article>
    `
        )
        .join("");

    document.getElementById("upcomingProjects").innerHTML = renderTable(
        ["Project", "Start Date", "Deadline"],
        data.projectsUpcoming
    );

    attachLayoutEvents({ logoutUrl: "employee-portal.html" });
}

function initStudentDashboard() {
    const data = {
        name: "Rahul Verma",
        className: "B.Com - Final Year",
        notifications: [
            "Assignment: Business Communication due tomorrow.",
            "New result uploaded for Soft Skills Lab.",
            "Project review scheduled on Friday."
        ],
        summary: [
            { label: "Attendance Percentage", value: "91%" },
            { label: "Upcoming Assignments", value: "4" },
            { label: "Latest Grade", value: "A" },
            { label: "Active Projects", value: "2" }
        ],
        attendance: [
            ["2026-04-01", '<span class="pill present">Present</span>'],
            ["2026-04-02", '<span class="pill present">Present</span>'],
            ["2026-04-03", '<span class="pill absent">Absent</span>'],
            ["2026-04-04", '<span class="pill present">Present</span>'],
            ["2026-04-05", '<span class="pill leave">Leave</span>']
        ],
        results: [
            ["English Communication", "92", "A+"],
            ["Professional Etiquette", "85", "A"],
            ["Public Speaking", "88", "A"],
            ["Personality Development", "90", "A+"]
        ],
        assignments: [
            ["Presentation Skills Report", "Communication", "2026-04-28", '<span class="pill pending">Pending</span>', '<button class="icon-btn">Submit</button>'],
            ["Case Study Reflection", "Soft Skills", "2026-04-30", '<span class="pill submitted">Submitted</span>', '<button class="icon-btn">View</button>']
        ],
        projectsCurrent: [
            { name: "Interview Readiness Project", desc: "Mock interview and feedback documentation.", progress: 68, status: "In Progress" },
            { name: "Group Discussion Lab", desc: "Peer group leadership and presentation.", progress: 80, status: "In Progress" }
        ],
        projectsUpcoming: [
            ["Community Communication Drive", "2026-05-04", "2026-05-29"],
            ["Career Portfolio Design", "2026-05-12", "2026-06-06"]
        ]
    };

    document.getElementById("welcomeMessage").textContent = `Welcome back, ${data.name}`;
    document.getElementById("profileName").textContent = data.name;
    document.getElementById("profileRole").textContent = data.className;
    document.getElementById("notifCount").textContent = String(data.notifications.length);
    document.getElementById("notifList").innerHTML = data.notifications
        .map((n) => `<div class="notif-item">${n}</div>`)
        .join("");

    document.getElementById("summaryCards").innerHTML = renderSummaryCards(data.summary);
    document.getElementById("attendanceTable").innerHTML = renderTable(["Date", "Status"], data.attendance);
    document.getElementById("resultsTable").innerHTML = renderTable(["Subject", "Marks", "Grade"], data.results);
    document.getElementById("assignmentTable").innerHTML = renderTable(
        ["Assignment", "Subject", "Deadline", "Status", "Action"],
        data.assignments
    );
    document.getElementById("attendanceChart").innerHTML = renderBarChart([
        { label: "English", value: 92 },
        { label: "Public Speak", value: 88 },
        { label: "Etiquette", value: 85 },
        { label: "Personality", value: 90 }
    ]);

    document.getElementById("projectCards").innerHTML = data.projectsCurrent
        .map(
            (p) => `
        <article class="summary-card">
            <h4>${p.name}</h4>
            <p style="font-size:0.9rem;font-weight:500;margin:0.35rem 0;">${p.desc}</p>
            <div class="progress-track"><div class="progress-fill" style="width:${p.progress}%"></div></div>
            <p style="font-size:0.85rem;margin-top:0.4rem;">
                <span class="pill in-progress">${p.status}</span>
            </p>
        </article>
    `
        )
        .join("");

    document.getElementById("upcomingProjects").innerHTML = renderTable(
        ["Project", "Start Date", "Deadline"],
        data.projectsUpcoming
    );

    attachLayoutEvents({ logoutUrl: "student-portal.html" });
}
