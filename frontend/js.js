const API = "/api";

function getUserId() {
    return localStorage.getItem("userId");
}

function senddata() {
    const sid    = document.getElementById("id").value.trim();
    const name   = document.getElementById("sname").value.trim();
    const dept   = document.getElementById("dept").value;
    const userId = getUserId();
    const resultEl = document.getElementById("addResult");

    if (!sid || !name) { resultEl.innerText = "Please fill in all fields."; return; }

    fetch(`${API}/addStudent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid, name, dept, userId })
    })
    .then(res => res.json())
    .then(data => {
        resultEl.innerText = data.message;
        if (data.message === "Student data saved Successfully!") {
            document.getElementById("id").value = "";
            document.getElementById("sname").value = "";
        }
    })
    .catch(() => { resultEl.innerText = "Server error. Is the backend running?"; });
}

function searchStudent() {
    const sid    = document.getElementById("searchId").value.trim();
    const userId = getUserId();
    const result = document.getElementById("result");

    if (!sid) { result.innerText = "Enter a Student ID."; return; }

    fetch(`${API}/searchStudent/${sid}?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                result.innerText = data.message;
            } else {
                result.innerHTML = `ID: ${data.sid}<br>Name: ${data.name}<br>Dept: ${data.dept}`;
            }
        })
        .catch(() => { result.innerText = "Server error. Is the backend running?"; });
}

function allStudent() {
    const userId = getUserId();

    fetch(`${API}/allStudent?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
            const all = document.getElementById("all");
            if (data.length === 0) {
                all.innerHTML = `<div class="empty-state"><p>No students found.</p></div>`;
                return;
            }
            all.innerHTML = data.map(s => `
                <div style="padding:0.75rem 0; border-bottom:1px solid #eee;">
                    <strong style="color:#333">${s.name}</strong>
                    <span style="color:#777; margin-left:0.5rem">${s.sid}</span>
                    <span style="color:rebeccapurple; margin-left:0.5rem">${s.dept}</span>
                </div>`).join("");
        })
        .catch(() => {
            document.getElementById("all").innerHTML = `<div class="empty-state"><p>Server error. Is the backend running?</p></div>`;
        });
}

function delStudent() {
    const sid    = document.getElementById("delId").value.trim();
    const userId = getUserId();
    const del    = document.getElementById("del");

    if (!sid) { del.innerText = "Enter a Student ID."; return; }

    fetch(`${API}/delStudent/${sid}?userId=${userId}`, { method: "DELETE" })
        .then(res => res.json())
        .then(data => { del.innerText = data.message; })
        .catch(() => { del.innerText = "Server error. Is the backend running?"; });
}

function updateStudent() {
    const sid    = document.getElementById("upId").value.trim();
    const name   = document.getElementById("upName").value.trim();
    const dept   = document.getElementById("upDept").value;
    const userId = getUserId();
    const up     = document.getElementById("up");

    if (!sid || !name) { up.innerText = "Please fill in all fields."; return; }

    fetch(`${API}/updateStudent/${sid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dept, userId })
    })
    .then(res => res.json())
    .then(data => { up.innerText = data.message; })
    .catch(() => { up.innerText = "Server error. Is the backend running?"; });
}
