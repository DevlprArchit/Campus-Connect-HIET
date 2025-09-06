// LOGIN FUNCTION
function login() {
  const id = document.getElementById("loginId").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const role = document.getElementById("loginRole").value;

  if (!id || !password) {
    alert("Please fill all fields.");
    return;
  }

  if (role === "student") {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    let user = students.find(s => s.regNo === id && s.password === password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify({ ...user, role: "student" }));
      window.location.href = "student_dashboard.html";
    } else {
      alert("Invalid Student ID or Password.");
    }
  }

  else if (role === "teacher") {
    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
    let user = teachers.find(t => t.empId === id && t.password === password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify({ ...user, role: "teacher" }));
      window.location.href = "teacher_dashboard.html";
    } else {
      alert("Invalid Teacher ID or Password.");
    }
  }

  else if (role === "admin") {
    if (id === "admin@hiet.edu" && password === "admin123") {
      localStorage.setItem("currentUser", JSON.stringify({ email: id, role: "admin" }));
      window.location.href = "admin_dashboard.html";
    } else {
      alert("Invalid Admin credentials.");
    }
  }
}
