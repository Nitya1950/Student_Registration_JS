// Student Registration System JavaScript
// Handles form submission, validation, localStorage, and table updates

// Select DOM elements
const studentForm = document.getElementById('student-form');
const studentsTableBody = document.querySelector('#studentsTable tbody');
const submitBtn = document.getElementById('submitBtn');

let editIndex = null; // Track which record is being edited

// Utility: Validate input fields
function validateInputs(name, id, email, contact) {
    const nameRegex = /^[A-Za-z ]+$/;
    const idRegex = /^\d+$/;
    const contactRegex = /^\d{7,15}$/; // 7-15 digits
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!name || !id || !email || !contact) {
        alert('All fields are required.');
        return false;
    }
    if (!nameRegex.test(name)) {
        alert('Student name must contain only letters and spaces.');
        return false;
    }
    if (!idRegex.test(id)) {
        alert('Student ID must contain only numbers.');
        return false;
    }
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    if (!contactRegex.test(contact)) {
        alert('Contact number must be 7-15 digits.');
        return false;
    }
    return true;
}

// Utility: Get students from localStorage
function getStudents() {
    return JSON.parse(localStorage.getItem('students') || '[]');
}

// Utility: Save students to localStorage
function saveStudents(students) {
    localStorage.setItem('students', JSON.stringify(students));
}

// Render students in the table
function renderStudents() {
    const students = getStudents();
    studentsTableBody.innerHTML = '';
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td>
                <button class="action-btn" onclick="editStudent(${index})">Edit</button>
                <button class="action-btn" onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;
        studentsTableBody.appendChild(row);
    });
}

// Add or update student
studentForm.onsubmit = function(e) {
    e.preventDefault();
    const name = studentForm.studentName.value.trim();
    const id = studentForm.studentId.value.trim();
    const email = studentForm.email.value.trim();
    const contact = studentForm.contactNo.value.trim();

    if (!validateInputs(name, id, email, contact)) return;

    let students = getStudents();
    if (editIndex === null) {
        // Add new student
        students.push({ name, id, email, contact });
    } else {
        // Update existing student
        students[editIndex] = { name, id, email, contact };
        editIndex = null;
        submitBtn.textContent = 'Register Student';
    }
    saveStudents(students);
    renderStudents();
    studentForm.reset();
};

// Edit student handler (exposed globally)
window.editStudent = function(index) {
    const students = getStudents();
    const student = students[index];
    studentForm.studentName.value = student.name;
    studentForm.studentId.value = student.id;
    studentForm.email.value = student.email;
    studentForm.contactNo.value = student.contact;
    editIndex = index;
    submitBtn.textContent = 'Update Student';
};

// Delete student handler
window.deleteStudent = function(index) {
    if (confirm('Are you sure you want to delete this record?')) {
        let students = getStudents();
        students.splice(index, 1);
        saveStudents(students);
        renderStudents();
        // Reset form if editing the deleted row
        if (editIndex === index) {
            studentForm.reset();
            editIndex = null;
            submitBtn.textContent = 'Register Student';
        }
    }
};

// Initial render
renderStudents();
// Dark mode toggle handler for button
const darkModeToggle = document.getElementById('toggle-dark');

// Load initial mode from localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
}

// Toggle dark mode on button click
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    // Save preference
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});
