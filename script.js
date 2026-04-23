function showStatusMessage(targetId, message, color) {
    const target = document.getElementById(targetId);
    if (!target) {
        return;
    }
    target.textContent = message;
    target.style.color = color;
}

const admissionForm = document.getElementById("admissionForm");
if (admissionForm) {
    admissionForm.addEventListener("submit", function (event) {
        event.preventDefault();
        showStatusMessage(
            "admissionMessage",
            "Thank you! Your admission form has been submitted successfully.",
            "#0f8f7a"
        );
        admissionForm.reset();
    });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        showStatusMessage(
            "contactMessage",
            "Thank you for contacting us. We will get back to you shortly.",
            "#0f8f7a"
        );
        contactForm.reset();
    });
}

const studentLoginForm = document.getElementById("studentLoginForm");
if (studentLoginForm) {
    studentLoginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        showStatusMessage(
            "studentMessage",
            "Login feature connected. Backend authentication will be enabled in the next phase.",
            "#124078"
        );
    });
}

const employeeLoginForm = document.getElementById("employeeLoginForm");
if (employeeLoginForm) {
    employeeLoginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        showStatusMessage(
            "employeeMessage",
            "Employee login is configured. Secure role-based authentication can be enabled in the next phase.",
            "#124078"
        );
    });
}
