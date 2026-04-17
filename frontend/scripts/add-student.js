// Add/Edit Student Functions

let isEditMode = false;
let studentId = null;

// Initialize form
function initializeForm() {
    const urlParams = new URLSearchParams(window.location.search);
    studentId = urlParams.get('id');

    if (studentId) {
        isEditMode = true;
        document.getElementById('formTitle').textContent = 'Edit Student';
        document.getElementById('submitBtn').textContent = 'Update Student';
        loadStudentData(studentId);
    }

    document.getElementById('studentForm')
        .addEventListener('submit', handleSubmit);

    // Course Logic
    setupCourseLogic();
    updateYearSemester();

    // Guardian Logic
    setupGuardianLogic();
}

// ─────────────────────────────────────────────
// COURSE BASED YEAR / SEMESTER
// ─────────────────────────────────────────────

function setupCourseLogic() {
    const course = document.getElementById("course");

    if (course) {
        course.addEventListener("change", updateYearSemester);
    }
}

function updateYearSemester() {
    const course = document.getElementById("course").value;
    const year = document.getElementById("year");
    const semester = document.getElementById("semester");

    let maxYear = 4;
    let maxSemester = 8;

    // 4 Years
    if (course === "B.E" || course === "B.Tech") {
        maxYear = 4;
        maxSemester = 8;
    }

    // 3 Years
    else if (course === "B.Sc" || course === "BCA") {
        maxYear = 3;
        maxSemester = 6;
    }

    // 2 Years
    else if (course === "MCA" || course === "Diploma" || course === "M.Tech" || course === "M.Sc") {
        maxYear = 2;
        maxSemester = 4;
    }

    // Update Year
    year.innerHTML = `<option value="">Select Year</option>`;

    for (let i = 1; i <= maxYear; i++) {
        year.innerHTML += `<option value="${i}${suffix(i)} Year">${i}${suffix(i)} Year</option>`;
    }

    // Update Semester
    semester.innerHTML = `<option value="">Select Semester</option>`;

    for (let i = 1; i <= maxSemester; i++) {
        semester.innerHTML += `<option value="${i}">${i}</option>`;
    }
}

function suffix(num) {
    if (num === 1) return "st";
    if (num === 2) return "nd";
    if (num === 3) return "rd";
    return "th";
}
// Parent entered -> Guardian not required

function setupGuardianLogic() {
    const father = document.getElementById("fatherName");
    const mother = document.getElementById("motherName");
    const parentMobile = document.getElementById("parentMobile");

    father.addEventListener("input", toggleGuardianFields);
    mother.addEventListener("input", toggleGuardianFields);
    parentMobile.addEventListener("input", toggleGuardianFields);

    toggleGuardianFields();
}

function toggleGuardianFields() {
    const father = document.getElementById("fatherName").value.trim();
    const mother = document.getElementById("motherName").value.trim();
    const parentMobile = document.getElementById("parentMobile").value.trim();

    const guardianName = document.getElementById("guardianName");
    const guardianRelation = document.getElementById("guardianRelation");
    const guardianContact = document.getElementById("guardianContact");

    const hasParentDetails = father && mother && parentMobile;

    if (hasParentDetails) {
        guardianName.value = "";
        guardianRelation.value = "";
        guardianContact.value = "";

        guardianName.disabled = true;
        guardianRelation.disabled = true;
        guardianContact.disabled = true;
    } else {
        guardianName.disabled = false;
        guardianRelation.disabled = false;
        guardianContact.disabled = false;
    }
}
// ─────────────────────────────────────────────
// LOAD STUDENT DATA
// ─────────────────────────────────────────────

async function loadStudentData(id) {
    try {
        const data = await apiCall(API.STUDENT_BY_ID(id));

        if (data.success) {
            populateForm(data.data);
        }

    } catch (error) {
        showAlert("Failed to load student", "error");
    }
}

// Populate Form
function populateForm(student) {
    const fields = [
        "studentId", "fullName", "gender", "dateOfBirth", "department", "course", 
        "year", "semester", "section", "rollNumber", "admissionDate", "academicStatus",
        "mobileNumber", "alternateMobile", "email", "addressLine1", "addressLine2", 
        "city", "district", "state", "pincode", "fatherName", "motherName", 
        "parentMobile", "guardianName", "guardianRelation", "guardianContact", 
        "occupation", "aadhaarNumber", "nationality", "emergencyContactName", "emergencyContactNumber"
    ];

    fields.forEach(field => {
        const el = document.getElementById(field);
        if (el && student[field]) {
            if (el.type === 'date') {
                el.value = student[field].split('T')[0];
            } else {
                el.value = student[field];
            }
        }
    });

    updateYearSemester();

    setTimeout(() => {
        if (student.year) document.getElementById("year").value = student.year;
        if (student.semester) document.getElementById("semester").value = student.semester;
    }, 50);
}

// ─────────────────────────────────────────────
// SUBMIT
// ─────────────────────────────────────────────

async function handleSubmit(e) {
    e.preventDefault();

    const formData = getFormData();

    try {
        const btn = document.getElementById("submitBtn");

        btn.disabled = true;
        btn.textContent = isEditMode ? "Updating..." : "Adding...";

        let data;

        if (isEditMode) {
            data = await apiCall(API.STUDENT_BY_ID(studentId), {
                method: "PUT",
                body: JSON.stringify(formData)
            });
        } else {
            data = await apiCall(API.STUDENTS, {
                method: "POST",
                body: JSON.stringify(formData)
            });
        }

        if (data.success) {
            showAlert("Saved Successfully!", "success");

            setTimeout(() => {
                window.location.href = "students.html";
            }, 1000);
        }

    } catch (error) {
        showAlert(error.message || "Failed to save student", "error");
    } finally {
        const btn = document.getElementById("submitBtn");
        if (btn) {
            btn.disabled = false;
            btn.textContent = isEditMode ? "Update Student" : "Add Student";
        }
    }
}

// ─────────────────────────────────────────────
// GET FORM DATA
// ─────────────────────────────────────────────

function getFormData() {
    const fields = [
        "studentId", "fullName", "gender", "dateOfBirth", "department", "course", 
        "year", "semester", "section", "rollNumber", "admissionDate", "academicStatus",
        "mobileNumber", "alternateMobile", "email", "addressLine1", "addressLine2", 
        "city", "district", "state", "pincode", "fatherName", "motherName", 
        "parentMobile", "guardianName", "guardianRelation", "guardianContact", 
        "occupation", "aadhaarNumber", "nationality", "emergencyContactName", "emergencyContactNumber"
    ];
    
    const data = {};
    fields.forEach(field => {
        const el = document.getElementById(field);
        if (el) {
            data[field] = el.value.trim();
        }
    });
    return data;
}

// ─────────────────────────────────────────────
// ALERT
// ─────────────────────────────────────────────

function showAlert(msg, type = "error") {
    const alert = document.getElementById("alertMessage");

    alert.innerText = msg;
    alert.className = "alert " + type;
    alert.style.display = "block";

    setTimeout(() => {
        alert.style.display = "none";
    }, 5000);
}