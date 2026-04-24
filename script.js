function showStatusMessage(targetId, message, color) {
    const target = document.getElementById(targetId);
    if (!target) {
        return;
    }
    target.textContent = message;
    target.style.color = color;
}

const API_BASE_URL = 'http://localhost:3000/api';

const admissionForm = document.getElementById("admissionForm");
if (admissionForm) {
    admissionForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            program: document.getElementById('program').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/admissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showStatusMessage("admissionMessage", "Thank you! Your admission form has been submitted successfully.", "#0f8f7a");
                admissionForm.reset();
            } else {
                showStatusMessage("admissionMessage", "Failed to submit form. Please try again.", "red");
            }
        } catch (error) {
            showStatusMessage("admissionMessage", "An error occurred. Please try again.", "red");
            console.error('Error:', error);
        }
    });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = {
            contactName: document.getElementById('contactName').value,
            contactEmail: document.getElementById('contactEmail').value,
            contactMessageText: document.getElementById('contactMessageText').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showStatusMessage("contactMessage", "Thank you for contacting us. We will get back to you shortly.", "#0f8f7a");
                contactForm.reset();
            } else {
                showStatusMessage("contactMessage", "Failed to send message. Please try again.", "red");
            }
        } catch (error) {
            showStatusMessage("contactMessage", "An error occurred. Please try again.", "red");
            console.error('Error:', error);
        }
    });
}

const studentLoginForm = document.getElementById("studentLoginForm");
if (studentLoginForm) {
    studentLoginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById('studentEmail').value;
        const password = document.getElementById('studentPassword').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                showStatusMessage("studentMessage", "Login successful. Redirecting to Student Dashboard...", "#124078");
                setTimeout(function () {
                    window.location.href = "student-dashboard.html";
                }, 800);
            } else {
                showStatusMessage("studentMessage", "Invalid credentials. Please try again.", "red");
            }
        } catch (error) {
            showStatusMessage("studentMessage", "An error occurred during login.", "red");
            console.error('Error:', error);
        }
    });
}

const employeeLoginForm = document.getElementById("employeeLoginForm");
if (employeeLoginForm) {
    employeeLoginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById('employeeEmail') ? document.getElementById('employeeEmail').value : document.querySelector('input[name="employeeEmail"]').value;
        const password = document.getElementById('employeePassword') ? document.getElementById('employeePassword').value : document.querySelector('input[name="employeePassword"]').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/employee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                showStatusMessage("employeeMessage", "Login successful. Redirecting to Employee Dashboard...", "#124078");
                setTimeout(function () {
                    window.location.href = "employee-dashboard.html";
                }, 800);
            } else {
                showStatusMessage("employeeMessage", "Invalid credentials. Please try again.", "red");
            }
        } catch (error) {
            showStatusMessage("employeeMessage", "An error occurred during login.", "red");
            console.error('Error:', error);
        }
    });
}
