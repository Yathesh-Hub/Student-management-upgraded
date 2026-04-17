// Students Page Functions

let currentPage = 1;
let currentFilters = {
    search: '',
    department: '',
    year: '',
    academicStatus: ''
};
let studentToDelete = null;

// Load all students
async function loadStudents(page = 1) {
    try {
        showLoading(true);

        const params = new URLSearchParams({
            page,
            limit: 10,
            ...currentFilters
        });

        const data = await apiCall(`${API.STUDENTS}?${params}`);

        if (data.success) {
            displayStudentsTable(data.data);
            displayPagination(data.page, data.pages, data.total);
            currentPage = data.page;
        }

        showLoading(false);
    } catch (error) {
        console.error('Error loading students:', error);
        showAlert('Failed to load students', 'error');
        showLoading(false);
    }
}

// Display students in table
function displayStudentsTable(students) {
    const container = document.getElementById('studentsTable');

    if (students.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h3>No Students Found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    students.forEach(student => {
        const statusClass = student.academicStatus === 'Active' ? 'status-active' :
            student.academicStatus === 'Graduated' ? 'status-graduated' : 'status-inactive';

        html += `
            <tr>
                <td><strong>${student.studentId}</strong></td>
                <td>${student.fullName}</td>
                <td>${student.department}</td>
                <td>${student.year}</td>
                <td>${student.mobileNumber}</td>
                <td>${student.email}</td>
                <td><span class="status-badge ${statusClass}">${student.academicStatus}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view" onclick="viewStudent('${student._id}')" title="View">👁️</button>
                        <button class="btn-icon btn-edit" onclick="editStudent('${student._id}')" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" onclick="showDeleteModal('${student._id}')" title="Delete">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// Display pagination
function displayPagination(currentPage, totalPages, totalCount) {
    const container = document.getElementById('pagination');

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `
        <button onclick="loadStudents(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ← Previous
        </button>
    `;

    // Show page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `
                <button onclick="loadStudents(${i})" class="${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<span>...</span>';
        }
    }

    html += `
        <button onclick="loadStudents(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next →
        </button>
        <span style="margin-left: 16px; color: #718096;">Total: ${totalCount} students</span>
    `;

    container.innerHTML = html;
}

// Search students
function searchStudents() {
    const searchInput = document.getElementById('searchInput').value.trim();
    currentFilters.search = searchInput;
    currentPage = 1;
    loadStudents(1);
}

// Apply filters
function applyFilters() {
    currentFilters.department = document.getElementById('filterDepartment').value;
    currentFilters.year = document.getElementById('filterYear').value;
    currentFilters.academicStatus = document.getElementById('filterStatus').value;
    currentPage = 1;
    loadStudents(1);
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterYear').value = '';
    document.getElementById('filterStatus').value = '';
    currentFilters = {
        search: '',
        department: '',
        year: '',
        academicStatus: ''
    };
    currentPage = 1;
    loadStudents(1);
}

// View student profile
async function viewStudent(id) {
    try {
        const data = await apiCall(API.STUDENT_BY_ID(id));

        if (data.success) {
            displayStudentProfile(data.data);
        }
    } catch (error) {
        console.error('Error loading student:', error);
        showAlert('Failed to load student details', 'error');
    }
}

// Display student profile in modal
function displayStudentProfile(student) {
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileContent');

    const dob = new Date(student.dateOfBirth).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const admissionDate = new Date(student.admissionDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    content.innerHTML = `
        <h2 style="margin-bottom: 24px;">Student Profile</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
            <div>
                <h3 style="font-size: 16px; color: #667eea; margin-bottom: 12px;">📋 Basic Details</h3>
                <p><strong>Student ID:</strong> ${student.studentId}</p>
                <p><strong>Full Name:</strong> ${student.fullName}</p>
                <p><strong>Gender:</strong> ${student.gender}</p>
                <p><strong>Date of Birth:</strong> ${dob}</p>
                <p><strong>Age:</strong> ${student.age} years</p>
                ${student.bloodGroup ? `<p><strong>Blood Group:</strong> ${student.bloodGroup}</p>` : ''}
            </div>

            <div>
                <h3 style="font-size: 16px; color: #667eea; margin-bottom: 12px;">🎓 Academic Details</h3>
                <p><strong>Department:</strong> ${student.department}</p>
                <p><strong>Course:</strong> ${student.course}</p>
                <p><strong>Year:</strong> ${student.year}</p>
                ${student.semester ? `<p><strong>Semester:</strong> ${student.semester}</p>` : ''}
                ${student.section ? `<p><strong>Section:</strong> ${student.section}</p>` : ''}
                ${student.rollNumber ? `<p><strong>Roll Number:</strong> ${student.rollNumber}</p>` : ''}
                <p><strong>Admission Date:</strong> ${admissionDate}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${student.academicStatus.toLowerCase()}">${student.academicStatus}</span></p>
            </div>

            <div>
                <h3 style="font-size: 16px; color: #667eea; margin-bottom: 12px;">📞 Contact Details</h3>
                <p><strong>Mobile:</strong> ${student.mobileNumber}</p>
                ${student.alternateMobile ? `<p><strong>Alternate:</strong> ${student.alternateMobile}</p>` : ''}
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Address:</strong> ${student.addressLine1}</p>
                ${student.addressLine2 ? `<p>${student.addressLine2}</p>` : ''}
                <p>${student.city}, ${student.state} - ${student.pincode}</p>
            </div>

            <div>
                <h3 style="font-size: 16px; color: #667eea; margin-bottom: 12px;">👨‍👩‍👧 Parent Details</h3>
                <p><strong>Father:</strong> ${student.fatherName}</p>
                <p><strong>Mother:</strong> ${student.motherName}</p>
                <p><strong>Parent Mobile:</strong> ${student.parentMobile}</p>
                ${student.guardianName ? `<p><strong>Guardian:</strong> ${student.guardianName}</p>` : ''}
                ${student.guardianContact ? `<p><strong>Guardian Contact:</strong> ${student.guardianContact}</p>` : ''}
            </div>
        </div>

        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; justify-content: flex-end;">
            <button onclick="closeModal()" class="btn btn-secondary">Close</button>
            <button onclick="editStudent('${student._id}')" class="btn btn-primary">Edit Student</button>
        </div>
    `;

    modal.classList.add('show');
}

// Edit student
function editStudent(id) {
    window.location.href = `add-student.html?id=${id}`;
}

// Show delete confirmation modal
function showDeleteModal(id) {
    studentToDelete = id;
    const modal = document.getElementById('deleteModal');
    modal.classList.add('show');
}

// Close delete modal
function closeDeleteModal() {
    studentToDelete = null;
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('show');
}

// Confirm delete
async function confirmDelete() {
    if (!studentToDelete) return;

    try {
        const data = await apiCall(API.STUDENT_BY_ID(studentToDelete), {
            method: 'DELETE'
        });

        if (data.success) {
            showAlert('Student deleted successfully', 'success');
            closeDeleteModal();
            loadStudents(currentPage);
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showAlert('Failed to delete student', 'error');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('profileModal');
    modal.classList.remove('show');
}

// Export to CSV
async function exportToCSV() {
    try {
        const token = getAuthToken();
        const response = await fetch(API.EXPORT_CSV, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showAlert('Students exported successfully', 'success');
        } else {
            showAlert('Failed to export students', 'error');
        }
    } catch (error) {
        console.error('Error exporting students:', error);
        showAlert('Failed to export students', 'error');
    }
}

// Load departments for filter
async function loadDepartments() {
    const departments = [
        'Computer Science Engineering',
        'Information Technology',
        'Artificial Intelligence & Data Science',
        'Artificial Intelligence & Machine Learning',
        'Biomedical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Electronics & Communication Engineering'
    ];

    const select = document.getElementById('filterDepartment');
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        select.appendChild(option);
    });
}

// Show/hide loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

// Show alert
function showAlert(message, type = 'error') {
    let alertEl = document.getElementById('alertMessage');
    if (!alertEl) {
        alertEl = document.createElement('div');
        alertEl.id = 'alertMessage';
        alertEl.className = 'alert';
        document.querySelector('.container').insertBefore(alertEl, document.querySelector('.container').firstChild);
    }

    alertEl.textContent = message;
    alertEl.className = `alert ${type}`;
    alertEl.style.display = 'block';

    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 5000);
}

// Close modal when clicking outside
window.onclick = function (event) {
    const profileModal = document.getElementById('profileModal');
    const deleteModal = document.getElementById('deleteModal');

    if (event.target === profileModal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchStudents();
            }
        });
    }
});
