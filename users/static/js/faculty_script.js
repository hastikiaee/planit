
// Dark Mode
const darkmode = document.getElementById('darkmode');
darkmode.addEventListener('change', () => {
	document.body.classList.toggle('dark');
});

// Scroll and Fixed Nav
const nav = document.getElementById("nav");
const spacer = document.getElementById("spacer");
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
    const headerBottom = header.getBoundingClientRect().bottom;

    if (headerBottom <= 0) {
      if (!nav.classList.contains("fixed")) {
        nav.classList.add("fixed");
        spacer.style.display = "block";
      }
    } else {
      if (nav.classList.contains("fixed")) {
        nav.classList.remove("fixed");
        spacer.style.display = "none";
      }
    }
});

// Scroll and Fixed Sidebar
const sidebar = document.getElementById("sidebar");
const originalTop = sidebar.offsetTop;
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if ((scrollY + 70) >= originalTop) {
    sidebar.classList.add("fixed");
  } else {
    sidebar.classList.remove("fixed");
  }
});

// Switch Between Tabs
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    if (tabName === 'schedule') {
        showSection('side_schedule');
    } else if (tabName === 'examination') {
        showSection('side_examination');
    } else if (tabName === 'confliction') {
        showSection('side_confliction');
    } else if (tabName === 'communication') {
        showSection('side_messages');
    }

    const navButtons = document.querySelectorAll("#nav button");
    navButtons.forEach(btn => btn.classList.remove("active-tab"));

    const clickedButton = Array.from(navButtons).find(btn =>
        btn.getAttribute("onclick")?.includes(`switchTab('${tabName}')`)
    );

    if (clickedButton) {
        clickedButton.classList.add("active-tab");
    }
}

// Slidebar
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}
function tabSwitch(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
  
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));
  
    const activeTab = document.getElementById(tabName);
    if (activeTab) {
      activeTab.classList.add('active');
    }
  
    const activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
}
function showSection(id) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => section.classList.remove("active"));
  
    const target = document.getElementById(id);
    if (target) {
      target.classList.add("active");
    }
  
    let tabName = null;
  
    if (
      id === 'side_courses' || id === 'side_professors' || id === 'side_availability' ||
      id === 'side_schedule_chart' || id === 'side_schedule'
    ) {
      tabSwitch('schedule');
      tabName = 'schedule';
    } else if (id === 'side_examination_chart' || id === 'side_examination') {
      tabSwitch('examination');
      tabName = 'examination';
    } else if (id === 'side_confliction') {
      tabSwitch('confliction');
      tabName = 'confliction';
    } else if (
      id === 'side_changes' || id === 'side_messages' || id === 'side_supports'
    ) {
      tabSwitch('communication');
      tabName = 'communication';
    }
  
    const navButtons = document.querySelectorAll("#nav button");
    navButtons.forEach(btn => btn.classList.remove("active-tab"));
  
    const targetButton = Array.from(navButtons).find(btn =>
      btn.getAttribute("onclick")?.includes(`switchTab('${tabName}')`)
    );
    if (targetButton) {
      targetButton.classList.add("active-tab");
    }
  
    const sidebarButtons = document.querySelectorAll(".sidebar-button");
    sidebarButtons.forEach(btn => btn.classList.remove("active-tab"));
  
    const clickedSidebarButton = document.querySelector(`[onclick*="${id}"]`);
    if (clickedSidebarButton) {
      clickedSidebarButton.classList.add("active-tab");
    }

    document.getElementById("sidebar").classList.remove("active");
}

// Courses Management
function addCourse() {
    let courseLength = document.getElementById("course_length").value.trim();
    let courseDays = document.getElementById("course_days").value.trim();
    let courseMajor = document.getElementById("course_major").value.trim();
    let courseType = document.getElementById("course_type").value.trim();
    let courseName = document.getElementById("course_name").value.trim();

    if (
        courseLength === "" ||
        courseDays === "" ||
        courseMajor === "" ||
        courseType === "" ||
        courseName === ""
    ) {
        alert("لطفاً تمامی فیلدها را پر کنید!");
        return;
    }

    document.getElementById("empty-courses-table").style.display = "none";

    let tableBody = document.querySelector("#courses-table tbody");
    let rows = tableBody.querySelectorAll("tr");
    for (let row of rows) {
        let existingMajor = row.children[3].textContent.trim();
        let existingName = row.children[5].textContent.trim();

        if (existingMajor === courseMajor && existingName === courseName) {
            alert("درسی با همین نام و رشته قبلاً اضافه شده است!");
            return;
        }
    }

    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>
            <input type="checkbox" class="course-checkbox" onclick="courseSelection(this)">
            <button onclick="courseEditRow(this)" title="اصلاح اطلاعات درس">
                <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
            </button>
            <button onclick="deleteRow(this)" title="حذف سطر">
                <img src="../static/media/icons/delete.png" alt="حذف" width="20">
            </button>
        </td>
        <td>${courseLength}</td>
        <td>${courseDays}</td>
        <td>${courseMajor}</td>
        <td>${courseType}</td>
        <td>${courseName}</td>
    `;

    tableBody.appendChild(newRow);

    document.getElementById("course_length").value = "";
    document.getElementById("course_days").value = "";
    document.getElementById("course_major").value = "";
    document.getElementById("course_type").value = "";
    document.getElementById("course_name").value = "";

    document.getElementById("course_major").value = professorMajor;
}
function saveCourses() {
    const tableRows = document.querySelectorAll("#courses-table tbody tr");

    let updatedRows = [];
    let newRows = [];    

    tableRows.forEach(row => {
        const id = row.getAttribute("data-id");

        const current = {
            courseLength: row.cells[1].innerText.trim(),
            courseDays: row.cells[2].innerText.trim(),
            courseMajor: row.cells[3].innerText.trim(),
            courseType: row.cells[4].innerText.trim(),
            courseName: row.cells[5].innerText.trim()
        };

        if (id) {
            const original = {
                courseLength: row.getAttribute("data-original-length"),
                courseDays: row.getAttribute("data-original-days"),
                courseMajor: row.getAttribute("data-original-major"),
                courseType: row.getAttribute("data-original-type"),
                courseName: row.getAttribute("data-original-name")
            };

            let changed = false;
            for (let key in current) {
                if (current[key] !== original[key]) {
                    changed = true;
                    break;
                }
            }

            if (changed) {
                updatedRows.push({ id, ...current });
            }

        } else {
            newRows.push(current);
        }
    });

    if (newRows.length > 0) {
        fetch("/add_courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courses: newRows })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("✅ دروس جدید ذخیره شدند.");
            } else {
                console.error("❌ خطا در ذخیره دروس جدید");
            }
        });
    }

    updatedRows.forEach(course => {
        const url = `/update_courses/${course.id}`;
        fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(course)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log(`✅ درس با ID ${course.id} بروزرسانی شد.`);
            } else {
                console.error(`❌ خطا در بروزرسانی درس ${course.id}`);
            }
        });
    });

    if (newRows.length === 0 && updatedRows.length === 0) {
        alert("هیچ درسی تغییر نکرده یا اضافه نشده است.");
    } else {
        alert("✅ درخواست‌ها ارسال شدند.");
        loadCourses();
    }
}
function loadCourses() {
  fetch('/load_courses', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ professor_name: professorName })
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#courses-table tbody');
        tableBody.innerHTML = ''; 

        if(data.length !== 0){
            document.getElementById("empty-courses-table").style.display = "none";
        }

        data.forEach(course => {
            const row = document.createElement('tr');
            row.setAttribute("data-id", course.courseId);
            row.setAttribute("data-original-length", course.courseLength);
            row.setAttribute("data-original-days", course.courseDays);
            row.setAttribute("data-original-major", course.courseMajor);
            row.setAttribute("data-original-type", course.courseType);
            row.setAttribute("data-original-name", course.courseName);

            row.innerHTML = `
                <td>
                    <input type="checkbox" class="course-checkbox" onclick="courseSelection(this)">
                    <button onclick="courseEditRow(this)" title="اصلاح اطلاعات درس">
                        <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                    </button>
                    <button onclick="deleteCourse(this)" title="حذف سطر">
                    <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                    </button>
                </td>
                <td>${course.courseLength}</td>
                <td>${course.courseDays}</td>
                <td>${course.courseMajor}</td>
                <td>${course.courseType}</td>
                <td>${course.courseName}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('خطا در دریافت دروس', error));
}
function deleteCourse(btn) {
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_course/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            row.remove();
        } else {
            alert("خطا در حذف درس");
        }
    })
    .catch(err => {
        console.error("خطا در ارتباط با سرور:", err);
    });
}

// Import Courses CSV 
function parseCoursesCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const tableBody = document.querySelector("#courses-table tbody");
    const existingCourses = new Set();
    const duplicateCourses = [];

    document.getElementById("empty-courses-table").style.display = "none";

    Array.from(tableBody.querySelectorAll("tr")).forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 3) {
            const existingName = cells[5].textContent.trim();
            const existingMajor = cells[3].textContent.trim();
            existingCourses.add(`${existingName}-${existingMajor}`);
        }
    });

    for (let i = 0; i < lines.length; i++) { 
        const columns = lines[i].split(',');

        if (columns.length < 5) continue;

        const courseName = columns[0].trim();
        const courseType = columns[1].trim();
        const courseMajor = columns[2].trim();
        const courseDays = columns[3].trim();
        const courseLength = columns[4].trim();
        
        const courseKey = `${courseName}-${courseMajor}`;
        
        if (existingCourses.has(courseKey)) {
            duplicateCourses.push(`${courseName} برای رشته ${courseMajor}`);
            continue;
        }

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>
                <button onclick="deleteRow(this)" title="حذف سطر">
                    <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                </button>
            </td>
            <td>${courseLength}</td>
            <td>${courseDays}</td>
            <td>${courseMajor}</td>
            <td>${courseType}</td>
            <td>${courseName}</td>
        `;
        tableBody.appendChild(newRow);
        existingCourses.add(courseKey);
    }

    if (duplicateCourses.length > 0) {
        alert(`دروس تکراری اضافه نشدند:\n\n${duplicateCourses.join('\n')}`);
    }
}
document.getElementById("importCoursesCSV").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                parseCoursesCSV(csvData); 
            };
            reader.readAsText(file);
        }
    };
    input.click(); 
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM کامل لود شد");

    const addBtn = document.getElementById("add-professor-btn");

    if (!addBtn) {
        console.error("دکمه اضافه کردن استاد پیدا نشد!");
        return;
    }

    addBtn.addEventListener("click", addProfessor);

    // اطمینان از وجود tbody در جدول
    const table = document.getElementById("professors-table");
    if (table && !table.querySelector("tbody")) {
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
    }
});

function addProfessor() {
    const majorInput = document.getElementById("professor_major");
    const emailInput = document.getElementById("professor_email");
    const numberInput = document.getElementById("professor_number");
    const nameInput = document.getElementById("professor_namee");

    if (!majorInput || !emailInput || !numberInput || !nameInput) {
        alert("یک یا چند فیلد پیدا نشد. لطفاً HTML را بررسی کنید.");
        return;
    }

    const professorMajor = majorInput.value.trim();
    const professorEmail = emailInput.value.trim();
    const professorNumber = numberInput.value.trim();
    const professorName = nameInput.value.trim();

    if (!professorMajor || !professorEmail || !professorNumber || !professorName) {
        alert("لطفاً تمامی فیلدها را پر کنید!");
        return;
    }

    const tableBody = document.querySelector("#professors-table tbody");
    if (!tableBody) {
        console.error("tbody جدول پیدا نشد!");
        return;
    }

    // ایجاد ردیف جدید
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>
            <button onclick="professorEditRow(this)" title="اصلاح اطلاعات استاد">
                <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
            </button>
            <button onclick="deleteProfessor(this)" title="حذف سطر">
                <img src="../static/media/icons/delete.png" alt="حذف" width="20">
            </button>
        </td>
        <td>${professorMajor}</td>
        <td>${professorEmail}</td>
        <td>${professorNumber}</td>
        <td>${professorName}</td>
    `;
    tableBody.appendChild(newRow);

    // پاک کردن فیلدها بعد از ثبت
    majorInput.value = "";
    emailInput.value = "";
    numberInput.value = "";
    nameInput.value = "";

    // مخفی کردن ردیف "هیچ استادی ثبت نشده"
    const emptyRow = document.getElementById("empty-professors-table");
    if (emptyRow) emptyRow.style.display = "none";

    console.log("استاد با موفقیت اضافه شد!");
}

function getCSRFToken() {
    const tokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
    return tokenInput ? tokenInput.value : '';
}

// ذخیره اساتید
function saveProfessors() {
    const csrftoken = getCSRFToken();
    const tableRows = document.querySelectorAll("#professors-table tbody tr");
    let updatedRows = [];
    let newRows = [];

    tableRows.forEach(row => {
        const id = row.getAttribute("data-id");
        const cells = row.cells;

        const current = {
            name: cells[4] ? cells[4].innerText.trim() : "",
            number: cells[3] ? cells[3].innerText.trim() : "",
            email: cells[2] ? cells[2].innerText.trim() : "",
            major: cells[1] ? cells[1].innerText.trim() : ""
        };

        if (id) {
            const original = {
                name: row.getAttribute("data-original-name") || "",
                number: row.getAttribute("data-original-number") || "",
                email: row.getAttribute("data-original-email") || "",
                major: row.getAttribute("data-original-major") || ""
            };

            const changed = Object.keys(current).some(key => current[key] !== original[key]);
            if (changed) updatedRows.push({ id, ...current });
        } else {
            newRows.push(current);
        }
    });

    // ارسال داده‌های جدید
    if (newRows.length > 0) {
        fetch("/add_professors", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify(newRows)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) console.log("✅ اساتید جدید ذخیره شدند.");
            else console.error("❌ خطا در ذخیره اساتید جدید");
        })
        .catch(err => console.error("خطا در ارسال داده‌های جدید:", err));
    }

    // ارسال داده‌های بروزرسانی
    updatedRows.forEach(professor => {
        fetch(`/update_professors/${professor.id}`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify(professor)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) console.log(`✅ استاد ${professor.id} بروزرسانی شد.`);
            else console.error(`❌ خطا در بروزرسانی استاد ${professor.id}`);
        })
        .catch(err => console.error(`خطا در آپدیت استاد ${professor.id}:`, err));
    });

    if (newRows.length === 0 && updatedRows.length === 0) {
        alert("هیچ تغییری انجام نشده است.");
    } else {
        alert("✅ ذخیره‌سازی در حال انجام است.");
        loadProfessors();
    }
}

// حذف استاد
function deleteProfessor(btn) {
    const csrftoken = getCSRFToken();
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_professor/${id}`, {
        method: "DELETE",
        headers: { "X-CSRFToken": csrftoken }
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) row.remove();
        else alert("خطا در حذف استاد");
    })
    .catch(err => console.error("خطا در ارتباط با سرور:", err));
}

// بارگذاری استادان
function loadProfessors() {
    fetch("/load_professors")
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#professors-table tbody');
        tableBody.innerHTML = '';

        if (data.length > 0) {
            const emptyRow = document.getElementById("empty-professors-table");
            if (emptyRow) emptyRow.style.display = "none";
        }

        data.forEach(professor => {
            const row = document.createElement('tr');
            row.setAttribute("data-id", professor.id);
            row.setAttribute("data-original-name", professor.name);
            row.setAttribute("data-original-number", professor.number);
            row.setAttribute("data-original-email", professor.email);
            row.setAttribute("data-original-major", professor.major);

            row.innerHTML = `
                <td>
                    <button onclick="professorEditRow(this)" title="اصلاح اطلاعات استاد">
                        <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                    </button>
                    <button onclick="deleteProfessor(this)" title="حذف سطر">
                        <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                    </button>
                </td>
                <td>${professor.major}</td>
                <td>${professor.email}</td>
                <td>${professor.number}</td>
                <td>${professor.name}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('خطا در دریافت اساتید', error));
}

// Import Professors CSV 
function parseProfessorsCSV(csvData) {
    const lines = csvData.split("\n");
    const tableBody = document.querySelector("#professors-table tbody");
    const existingEmails = new Set();
    const existingNumbers = new Set();

    document.getElementById("empty-professors-table").style.display = "none";

    document.querySelectorAll("#professors-table tbody tr").forEach(row => {
        const number = row.children[3].textContent.trim();
        const email = row.children[2].textContent.trim();
        existingNumbers.add(number);
        existingEmails.add(email);
    });

    const duplicateProfessors = [];

    lines.forEach(line => {
        const columns = line.split(",").map(col => col.replaceAll('"', '').trim());

        const [professorName, professorNumber, professorEmail, professorMajor] = columns;

        if (professorMajor && professorEmail && professorNumber && professorName) {
            const isDuplicateNumber = existingNumbers.has(professorNumber);
            const isDuplicateEmail = existingEmails.has(professorEmail);

            if (!isDuplicateNumber && !isDuplicateEmail) {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>
                        <button onclick="professorEditRow(this)" title="اصلاح اطلاعات استاد">
                            <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                        </button>
                        <button onclick="deleteRow(this)" title="حذف سطر">
                            <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                        </button>
                    </td>
                    <td>${professorMajor}</td>
                    <td>${professorEmail}</td>
                    <td>${professorNumber}</td>
                    <td>${professorName}</td>
                `;
                tableBody.appendChild(newRow);

                existingNumbers.add(professorNumber);
                existingEmails.add(professorEmail);
            } else {
                duplicateProfessors.push(`${professorName} با شماره استادی ${professorNumber}`);
            }
        }
    });

    if (duplicateProfessors.length > 0) {
        alert("اساتید تکراری اضافه نشدند:\n\n" + duplicateProfessors.join("\n"));
    }
}
document.getElementById("importProfessorsCSV").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                parseProfessorsCSV(csvData);
            };
            reader.readAsText(file);
        }
    };
    input.click();
});

// Availability Management
function getProfessors() {
    fetch("/get_professors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ professor_name: professorName })
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector("#availability-table tbody");
        tbody.innerHTML = "";

        document.getElementById("empty-availability-table").style.display = "none";

        data.forEach(prof => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", prof.id);

            row.innerHTML = `
                <td>
                    <button onclick="duplicateRow(this)" title="افزودن زمان آزاد جدید">
                        <img src="../static/media/icons/add.png" alt="اضافه" width="20">
                    </button>
                    <button onclick="deleteAvailability(this)" title="حذف سطر">
                        <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                    </button>
                </td>
                <td><select class="end-time">${generateTimeOptions()}</select></td>
                <td><select class="start-time">${generateTimeOptions()}</select></td>
                <td>
                    <select class="day-select">
                        <option value="شنبه">شنبه</option>
                        <option value="یکشنبه">یکشنبه</option>
                        <option value="دوشنبه">دوشنبه</option>
                        <option value="سه‌شنبه">سه‌شنبه</option>
                        <option value="چهارشنبه">چهارشنبه</option>
                        <option value="پنج‌شنبه">پنج‌شنبه</option>
                    </select>
                </td>
                <td class="pronumber">${prof.number}</td>
                <td class="profname">${prof.name}</td>
            `;

            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("خطا در دریافت اساتید:", error);
        alert("مشکلی در دریافت اطلاعات اساتید رخ داده است.");
    });
}
function generateTimeOptions(selectedValue = null) {
    let options = '';
    for (let h = 8; h <= 18; h += 0.5) {
        const hour = Math.floor(h);
        const min = h % 1 === 0 ? "00" : "30";
        const time = `${hour.toString().padStart(2, '0')}:${min}`;
        const selected = (h === selectedValue) ? 'selected' : '';
        options += `<option value="${h}" ${selected}>${time}</option>`;
    }
    return options;
}
function saveAvailability() {
    const rows = document.querySelectorAll("#availability-table tbody tr");
    const newRows = [];
    const updatedRows = [];

    if (!professorName) {
        alert("نام استاد واردکننده اطلاعات مشخص نیست.");
        return;
    }

    for (const row of rows) {
        const id = row.getAttribute("data-id");
        const professorElem = row.querySelector(".profname");
        const pronumberElem = row.querySelector(".pronumber");
        const dayElem = row.querySelector(".day-select");
        const startElem = row.querySelector(".start-time");
        const endElem = row.querySelector(".end-time");

        if (!professorElem || !pronumberElem || !dayElem || !startElem || !endElem) {
            alert("برخی از فیلدهای ردیف‌ها ناقص هستند.");
            return;
        }

        const professor = professorElem.textContent.trim();
        const pronumber = pronumberElem.textContent.trim();
        const day = dayElem.value;
        const start = parseFloat(startElem.value);
        const end = parseFloat(endElem.value);

        if (isNaN(start) || isNaN(end) || end <= start) {
            alert(`مقادیر زمان در ردیف مربوط به ${professor} معتبر نیست.`);
            return;
        }

        const item = { professor, pronumber, day, start, end, submit: professorName };

        if (id) {
            const original = {
                professor: row.getAttribute("data-original-professor"),
                pronumber: row.getAttribute("data-original-pronumber"),
                day: row.getAttribute("data-original-day"),
                start: parseFloat(row.getAttribute("data-original-start")),
                end: parseFloat(row.getAttribute("data-original-end")),
            };

            let changed = false;
            for (let key of ["professor", "pronumber", "day", "start", "end"]) {
                if (item[key] !== original[key]) {
                    changed = true;
                    break;
                }
            }

            if (changed) {
                updatedRows.push({ id, ...item });
            }
        } else {
            newRows.push(item);
        }
    }

    if (newRows.length > 0) {
        fetch("/add_availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: newRows })
        });
    }

    updatedRows.forEach(item => {
        fetch(`/update_availability/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });
    });

    alert("✅ زمان‌ها در حال ذخیره‌سازی هستند.");
    loadAvailability();
}
function loadAvailability() {
    fetch("/load_availability", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            professor_name: professorName,
            user_type: 'faculty' 
        })
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector("#availability-table tbody");
        tbody.innerHTML = "";

        if(data.length !== 0){
            document.getElementById("empty-availability-table").style.display = "none";
        }

        data.forEach(item => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", item.id);
            row.setAttribute("data-original-professor", item.professor);
            row.setAttribute("data-original-pronumber", item.pronumber);
            row.setAttribute("data-original-day", item.day);
            row.setAttribute("data-original-start", item.start);
            row.setAttribute("data-original-end", item.end);

            if (item.submit !== professorName) {
                row.classList.add("external-row");
            }

            row.innerHTML = `
                <td>
                    <button onclick="duplicateRow(this)" title="افزودن زمان آزاد جدید">
                        <img src="../static/media/icons/add.png" alt="اضافه" width="20">
                    </button>
                    <button onclick="deleteAvailability(this)" title="حذف سطر">
                        <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                    </button>
                </td>
                <td><select class="end-time">${generateTimeOptions(item.end)}</select></td>
                <td><select class="start-time">${generateTimeOptions(item.start)}</select></td>
                <td>
                    <select class="day-select">
                        <option value="شنبه" ${item.day === "شنبه" ? "selected" : ""}>شنبه</option>
                        <option value="یکشنبه" ${item.day === "یکشنبه" ? "selected" : ""}>یکشنبه</option>
                        <option value="دوشنبه" ${item.day === "دوشنبه" ? "selected" : ""}>دوشنبه</option>
                        <option value="سه‌شنبه" ${item.day === "سه‌شنبه" ? "selected" : ""}>سه‌شنبه</option>
                        <option value="چهارشنبه" ${item.day === "چهارشنبه" ? "selected" : ""}>چهارشنبه</option>
                        <option value="پنج‌شنبه" ${item.day === "پنج‌شنبه" ? "selected" : ""}>پنج‌شنبه</option>
                    </select>
                </td>
                <td class="pronumber">${item.pronumber}</td>
                <td class="profname">${item.professor}</td>
            `;

            tbody.appendChild(row);
            row.setAttribute("data-id", item.id);
        });
    })
    .catch(error => {
        console.error("خطا در دریافت اطلاعات:", error);
    });
}
async function searchProfessors() {
    const query = document.getElementById('professor-search-input').value.trim();

    if (query.length < 2) {
      document.getElementById('professor-suggestions').innerHTML = '';
      return;
    }

    try {
      const response = await fetch('/search_professors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const professors = await response.json();

      const suggestionsList = document.getElementById('professor-suggestions');
      suggestionsList.innerHTML = '';

      if (professors.length === 0) {
        suggestionsList.innerHTML = '<li>استادی یافت نشد</li>';
        return;
      }

      professors.forEach(prof => {
        const li = document.createElement('li');
        li.classList.add('suggestion-item');

        const span = document.createElement('span');
        span.textContent = `${prof.name} (${prof.number})`;

        const btn = document.createElement('button');
        btn.textContent = 'اضافه کردن استاد';
        btn.classList.add('professor-add-btn');
        btn.onclick = async (e) => {
            e.stopPropagation();
            suggestionsList.innerHTML = '';
            document.getElementById('professor-search-input').value = '';
            
            try {
                const res = await fetch('/load_professor_availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ professor: prof.name })
                });
            
                const availability = await res.json();
            
                if (availability.length > 0) {
                availability.forEach(item => addProfessorAvailabilityRow(item));
                } else {
                addProfessorToTable(prof);
                }
            } catch (err) {
                console.error('خطا در لود زمان‌های آزاد استاد:', err);
                addProfessorToTable(prof);
            }
            };
        li.appendChild(span);
        li.appendChild(btn);
        suggestionsList.appendChild(li);
      });

    } catch (error) {
      console.error('خطا در جستجوی اساتید:', error);
    }
}
function addProfessorToTable(prof) {
    const tbody = document.querySelector('#availability-table tbody');

    document.getElementById("empty-availability-table").style.display = "none";
  
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <button onclick="duplicateRow(this)" title="افزودن زمان آزاد جدید">
          <img src="../static/media/icons/add.png" alt="اضافه" width="20">
        </button>
        <button onclick="deleteRow(this)" title="حذف سطر">
          <img src="../static/media/icons/delete.png" alt="حذف" width="20">
        </button>
      </td>
      <td>
        <select class="end-time">
          ${generateTimeOptions()}
        </select>
      </td>
      <td>
        <select class="start-time">
          ${generateTimeOptions()}
        </select>
      </td>
      <td>
        <select class="day-select">
          <option value="شنبه">شنبه</option>
          <option value="یکشنبه">یکشنبه</option>
          <option value="دوشنبه">دوشنبه</option>
          <option value="سه‌شنبه">سه‌شنبه</option>
          <option value="چهارشنبه">چهارشنبه</option>
          <option value="پنج‌شنبه">پنج‌شنبه</option>
        </select>
      </td>
      <td class="pronumber">${prof.number}</td>
      <td class="profname">${prof.name}</td>
    `;
  
    tbody.appendChild(row);
}
function addProfessorAvailabilityRow(item) {
    const tbody = document.querySelector('#availability-table tbody');
    const row = document.createElement('tr');

    document.getElementById("empty-availability-table").style.display = "none";

    row.classList.add("external-row");
  
    row.innerHTML = `
      <td>
        <button onclick="duplicateRow(this)" title="افزودن زمان آزاد جدید">
          <img src="../static/media/icons/add.png" alt="اضافه" width="20">
        </button>
        <button onclick="deleteRow(this)" title="حذف سطر">
          <img src="../static/media/icons/delete.png" alt="حذف" width="20">
        </button>
      </td>
      <td><select class="end-time">${generateTimeOptions(item.end)}</select></td>
      <td><select class="start-time">${generateTimeOptions(item.start)}</select></td>
      <td>
        <select class="day-select">
          <option value="شنبه" ${item.day === "شنبه" ? "selected" : ""}>شنبه</option>
          <option value="یکشنبه" ${item.day === "یکشنبه" ? "selected" : ""}>یکشنبه</option>
          <option value="دوشنبه" ${item.day === "دوشنبه" ? "selected" : ""}>دوشنبه</option>
          <option value="سه‌شنبه" ${item.day === "سه‌شنبه" ? "selected" : ""}>سه‌شنبه</option>
          <option value="چهارشنبه" ${item.day === "چهارشنبه" ? "selected" : ""}>چهارشنبه</option>
          <option value="پنج‌شنبه" ${item.day === "پنج‌شنبه" ? "selected" : ""}>پنج‌شنبه</option>
        </select>
      </td>
      <td class="pronumber">${item.pronumber}</td>
      <td class="profname">${item.professor}</td>
    `;
  
    tbody.appendChild(row);
}
function deleteAvailability(btn) {
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_availability/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            row.remove();
        } else {
            alert("خطا در حذف زمان آزاد");
        }
    })
    .catch(err => {
        console.error("خطا در ارتباط با سرور:", err);
    });
}

// Conflicts Management
async function addConflict() {
    let conflictType = document.getElementById("conflict_type").value.trim();
    let conflictDays = document.getElementById("conflict_days").value.trim();
    let conflictSubjectTwo = document.getElementById("conflict_subject_two").value.trim();
    let conflictSubjectOne = document.getElementById("conflict_subject_one").value.trim();
  
    if (conflictSubjectOne.trim() === "" || conflictSubjectTwo.trim() === "") {
      alert("لطفاً همه فیلدها را پر کنید!");
      return;
    }

    document.getElementById("empty-conflicts-table").style.display = "none";

    let table = document.getElementById("conflicts-table").getElementsByTagName("tbody")[0];
    let rows = table.getElementsByTagName("tr");

    for (let row of rows) {
        let existingSubjectOne = row.cells[6].textContent.trim();
        let existingSubjectTwo = row.cells[5].textContent.trim();
        let existingDays = row.cells[4].textContent.trim();
        let existingType = row.cells[3].textContent.trim();

        if (
            (existingType === conflictType && existingDays === conflictDays && existingSubjectOne === conflictSubjectOne && existingSubjectTwo === conflictSubjectTwo) || (existingType === conflictType && existingDays === conflictDays && existingSubjectOne === conflictSubjectTwo && existingSubjectTwo === conflictSubjectOne)
        ) {
            alert("این تداخل قبلاً ثبت شده است.");
            return;
        }
    }
  
    let status = "درحال بررسی";
    try {
      const res = await fetch('/check_conflict_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_one: conflictSubjectOne,
          subject_two: conflictSubjectTwo,
          days: conflictDays,
          type: conflictType
        })
      });
  
      const result = await res.json();
      status = result.status || "درحال بررسی";
    } catch (error) {
      console.warn("خطا در بررسی وضعیت تداخل:", error);
    }
  
    let newRow = table.insertRow();
  
    let cellActions = newRow.insertCell(0);
    let cellStatus = newRow.insertCell(1);
    let cellQuantity = newRow.insertCell(2);
    let cellType = newRow.insertCell(3);
    let cellDays = newRow.insertCell(4);
    let cellSubjectTwo = newRow.insertCell(5);
    let cellSubjectOne = newRow.insertCell(6);
  
    cellStatus.innerText = status;
    cellQuantity.innerText = 1;
    cellType.innerText = conflictType;
    cellDays.innerText = conflictDays;
    cellSubjectTwo.innerText = conflictSubjectTwo;
    cellSubjectOne.innerText = conflictSubjectOne;
  
    let deleteButton = document.createElement("button");
    let unsolveButton = document.createElement("button");
    let solveButton = document.createElement("button");
    
    solveButton.innerHTML = '<img src="../static/media/icons/checkbox.png" alt="رفع شده" title="رفع شده" width="27">';
    unsolveButton.innerHTML = '<img src="../static/media/icons/cross.png" alt="رفع نشده" title="رفع نشده" width="24">';
    deleteButton.innerHTML = '<img src="../static/media/icons/delete.png" alt="حذف" width="20">';
    deleteButton.onclick = function () {
      newRow.remove();
    };
    unsolveButton.onclick = function () {
        let row = solveButton.closest("tr");
        let cells = row.querySelectorAll("td");
        cells[1].innerText = "درحال بررسی";
      };
    solveButton.onclick = function () {
      let row = solveButton.closest("tr");
      let cells = row.querySelectorAll("td");
      cells[1].innerText = "رفع شده";
    };
    cellActions.appendChild(solveButton);
    cellActions.appendChild(unsolveButton);
    cellActions.appendChild(deleteButton);
  
    document.getElementById("conflict_subject_one").value = "";
    document.getElementById("conflict_subject_two").value = "";
    document.getElementById("conflict_days").value = "";
    document.getElementById("conflict_type").value = "";
}
function saveConflicts() {
    const rows = document.querySelectorAll('#conflicts-table tbody tr');
    const newConflicts = [];
    const updatedConflicts = [];

    document.getElementById("empty-conflicts-table").style.display = "none";

    rows.forEach(row => {
        const id = row.getAttribute("data-id");
        const subjectOne = row.cells[6].innerText.trim();
        const subjectTwo = row.cells[5].innerText.trim();
        const days = row.cells[4].innerText.trim();
        const type = row.cells[3].innerText.trim();
        const solve = row.cells[1].innerText.trim();

        const conflict = {
            conflictSubjectOne: subjectOne,
            conflictSubjectTwo: subjectTwo,
            conflictDays: days,
            conflictType: type,
            conflictSolve: solve,
            conflictReporter: professorName
        };

        if (id) {
            const original = {
                conflictSubjectOne: row.getAttribute("data-original-subject-one"),
                conflictSubjectTwo: row.getAttribute("data-original-subject-two"),
                conflictDays: row.getAttribute("data-original-days"),
                conflictType: row.getAttribute("data-original-type"),
                conflictSolve: row.getAttribute("data-original-solve")
            };

            let changed = false;
            for (let key in original) {
                if (conflict[key] !== original[key]) {
                    changed = true;
                    break;
                }
            }

            if (changed) {
                conflict.id = id;
                updatedConflicts.push(conflict);
            }

        } else {
            newConflicts.push(conflict);
        }
    });

    if (newConflicts.length > 0) {
        fetch("/add_conflicts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conflicts: newConflicts })
        });
    }

    updatedConflicts.forEach(conflict => {
        fetch(`/update_conflicts/${conflict.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(conflict)
        });
    });

    alert("✅ در حال ذخیره‌سازی تغییرات...");
}
function loadConflicts() {
  fetch('/load_conflicts')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.querySelector('#conflicts-table tbody');
          tableBody.innerHTML = ''; 

          if(data.length !== 0){
            document.getElementById("empty-conflicts-table").style.display = "none";
          }

          data.forEach(conflict => {
              const row = document.createElement('tr');
              row.setAttribute("data-id", conflict.conflictId);
              row.setAttribute("data-original-subject-one", conflict.conflictSubjectOne);
              row.setAttribute("data-original-subject-two", conflict.conflictSubjectTwo);
              row.setAttribute("data-original-days", conflict.conflictDays);
              row.setAttribute("data-original-type", conflict.conflictType);
              row.setAttribute("data-original-solve", conflict.conflictSolve);

              row.innerHTML = `
                  <td>
                      <button onclick="solveConflict(this)" title="تداخل رفع شده">
                          <img src="../static/media/icons/checkbox.png" alt="رفع شده" width="27">
                      </button>
                      <button onclick="unsolveConflict(this)" title="تداخل رفع نشده">
                          <img src="../static/media/icons/cross.png" alt="رفع نشده" width="24">
                      </button>
                      <button onclick="deleteConflict(this)" title="حذف سطر">
                          <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                      </button>
                  </td>
                  <td>${conflict.conflictSolve}</td>
                  <td>${conflict.conflictQuantity}</td>
                  <td>${conflict.conflictType}</td>
                  <td>${conflict.conflictDays}</td>
                  <td>${conflict.conflictSubjectTwo}</td>
                  <td>${conflict.conflictSubjectOne}</td>
              `;

              tableBody.appendChild(row);
          });
      })
      .catch(error => console.error('خطا در دریافت تداخلات', error));
}
function deleteConflict(btn) {
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_conflict/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            row.remove();
        } else {
            alert("❌ خطا در حذف تداخل");
        }
    })
    .catch(err => {
        console.error("خطا در ارتباط با سرور:", err);
    });
}
function sortConflicts() {
    const table = document.getElementById("conflicts-table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const sortBy = document.getElementById("sort-conflicts-select").value;

    const daysOrder = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

    rows.sort((a, b) => {
        if (sortBy === "day") {
            const dayA = a.cells[4].textContent.trim();
            const dayB = b.cells[4].textContent.trim();
            return daysOrder.indexOf(dayA) - daysOrder.indexOf(dayB);
        }

        if (sortBy === "type") {
            const typeA = a.cells[3].textContent.trim();
            const typeB = b.cells[3].textContent.trim();
            return typeA.localeCompare(typeB, "fa");
        }

        if (sortBy === "quantity") {
            const qtyA = parseInt(a.cells[2].textContent.trim());
            const qtyB = parseInt(b.cells[2].textContent.trim());
            return qtyB - qtyA;
        }

        if (sortBy === "quantityAndType") {
            const typeA = a.cells[3].textContent.trim();
            const typeB = b.cells[3].textContent.trim();
            const qtyA = parseInt(a.cells[2].textContent.trim());
            const qtyB = parseInt(b.cells[2].textContent.trim());

            if (typeA !== typeB) {
                return (typeA === "درس") ? -1 : 1;
            }

            return qtyB - qtyA;
        }

        return 0;
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}
document.getElementById('sort-conflicts-select').addEventListener('change', (event) => {
    const sortBy = event.target.value;
    sortConflicts(sortBy);
});
function sortSolve() {
    const tbody = document.querySelector("#solve-table tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const sortBy = document.getElementById("sort-solve-select").value;

    const daysOrder = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

    let colIndex;
    switch (sortBy) {
        case "type":
            colIndex = 5; 
            break;
        case "day":
            colIndex = 3; 
            break;
        default:
            return;
    }

    rows.sort((a, b) => {
        const valA = a.cells[colIndex]?.textContent.trim() || "";
        const valB = b.cells[colIndex]?.textContent.trim() || "";

        if (sortBy === "day") {
            const indexA = daysOrder.indexOf(valA);
            const indexB = daysOrder.indexOf(valB);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        }

        return valA.localeCompare(valB, "fa");
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}
document.getElementById('sort-solve-select').addEventListener('change', (event) => {
    const sortBy = event.target.value;
    sortSolve(sortBy);
});

// Recently Changes Management
function addChange() {
    const input = document.getElementById('new-change-text');
    const message = input.value.trim();

    if (message === "") {
        alert("لطفاً یک پیام وارد کنید.");
        return;
    }

    const timeStamp = new Date();
    const formattedTime = timeStamp.getHours().toString().padStart(2, "0") + ":" + timeStamp.getMinutes().toString().padStart(2, "0");
    const formattedDate = timeStamp.getFullYear() + "-" + (timeStamp.getMonth() + 1).toString().padStart(2, "0") + "-" + timeStamp.getDate().toString().padStart(2, "0");

    fetch("/add_change", {
        method: "POST",
        body: JSON.stringify({
            message: message,
            sender: professorName,   
            getter: "students",
            type: "recently changes",
            time: formattedTime,
            date: formattedDate
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const messageBox = document.createElement('div');
            messageBox.className = 'message-box';
            messageBox.innerHTML = `<p>${message}</p>`;
            document.getElementById('change-messages').appendChild(messageBox);
            input.value = "";
        } else {
            alert("خطا در ذخیره تغییر: " + data.error);
        }
    })
    .catch(err => {
        console.error("خطا در ارسال تغییر:", err);
        alert("ارسال تغییر با مشکل مواجه شد.");
    });
}
function loadChanges() {
    fetch("/load_changes")
        .then(res => res.json())
        .then(changes => {
            const container = document.getElementById('change-messages');
            container.innerHTML = "";

            changes.forEach(msg => {
                let messageDiv = document.createElement("div");
                messageDiv.classList.add("change-box");
    
                let messageContent = document.createElement("span");
                messageContent.textContent = msg.message;
    
                let messageInfo = document.createElement("div");
                messageInfo.classList.add("change-info");
                messageInfo.textContent = `👤 ${msg.sender}  | 🕒 ${msg.time}  | 📅 ${msg.date}`;
    
                let deleteBtn = null;
                if (msg.sender === professorName) {
                    deleteBtn = document.createElement("button");
                    deleteBtn.innerHTML = `<img src="../static/media/icons/delete.png" alt="حذف" width="16" height="16">`;
                    deleteBtn.classList.add("delete-btn");
                    
                    deleteBtn.onclick = function () {
                        fetch(`/delete_message/${msg.id}`, {
                            method: "DELETE"
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                container.removeChild(messageDiv);
                            } else {
                                alert("❌ خطا در حذف پیام: " + data.error);
                            }
                        })
                        .catch(error => {
                            console.error("⚠️ خطا در حذف پیام:", error);
                        });
                    };
                }
    
                messageDiv.appendChild(messageContent);
                if (deleteBtn) messageDiv.appendChild(deleteBtn);
                messageDiv.appendChild(messageInfo);
    
                container.appendChild(messageDiv);
            });
        });
}

// Messages Management
let currentReceiver = null;
function loadFacultyContacts() {
    fetch("/load_faculty_contacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            professor_name: professorName,
            user_type: 'professor'
        })
    })
    .then(res => res.json())
    .then(contacts => {
        const container = document.getElementById("contacts-list"); 
        container.innerHTML = "";

        contacts.forEach(contact => {
            const box = document.createElement("div");
            box.classList.add("message-box");
            const contactKey = `seen_${contact.name}`;
            const isSeen = localStorage.getItem(contactKey) === contact.last_message;

            box.innerHTML = `
                <div class="message-title">
                    ${contact.name}
                    ${!isSeen ? `<span class="unread-badge">${getUnreadText(contact.name)}</span>` : ""}
                </div>
                <p>${contact.last_message}</p>
            `;

            box.addEventListener("click", () => {
                document.getElementById("side_private").style.display = "block";
                document.querySelector(".chat-header").innerText = `چت با ${contact.name}`;
                openPrivateChat(contact.name);
            
                const badge = box.querySelector(".unread-badge");
                if (badge) badge.remove();
            });

            container.appendChild(box);
        });
    })
    .catch(error => {
        console.error("خطا در بارگذاری مخاطبین:", error);
    });
}
function getUnreadText(name) {
    return "پیام جدید"; 
}
async function messageProfessor() {
    const query = document.getElementById('professor-search-message').value;

    if (query.length < 2) {
        document.getElementById('professor-suggestions-message').innerHTML = '';
        return;
    }

    try {
        const response = await fetch('/search_professors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const professors = await response.json();

        const suggestionsList = document.getElementById('professor-suggestions-message');
        suggestionsList.innerHTML = '';

        if (professors.length === 0) {
            suggestionsList.innerHTML = '<li>استادی یافت نشد</li>';
            return;
        }

        professors.forEach(prof => {
            const li = document.createElement('li');
            li.classList.add('suggestion-item');

            const span = document.createElement('span');
            span.textContent = `${prof.name} (${prof.number})`;

            const btn = document.createElement('button');
            btn.textContent = 'پیام دادن به استاد';
            btn.classList.add('professor-add-btn');

            btn.onclick = (e) => {
                e.stopPropagation();
                suggestionsList.innerHTML = '';
                document.getElementById('professor-search-message').value = '';

                const container = document.querySelector(".add-message-box");

                const exists = Array.from(container.querySelectorAll(".message-title"))
                    .some(el => el.textContent.includes(prof.name));
                if (!exists) {
                    const box = document.createElement("div");
                    box.addEventListener("click", () => {
                        document.getElementById("side_private").style.display = "block";
                        document.querySelector(".chat-header").innerText = `چت با ${prof.name}`;
                        openPrivateChat(prof.name);
                    });
                    container.appendChild(box);
                }

                document.getElementById("side_private").style.display = "block";
                document.querySelector(".chat-header").innerText = `چت با ${prof.name}`;
                openPrivateChat(prof.name);
            };

            li.appendChild(span);
            li.appendChild(btn);
            suggestionsList.appendChild(li);
        });

    } catch (error) {
        console.error('خطا در جستجوی اساتید:', error);
    }
}
function openPrivateChat(receiverName) {
    document.getElementById("side_private").style.display = "block";
  
    document.querySelector(".chat-header").innerText = `چت با ${receiverName}`;
    document.getElementById("messageInputPrivate").dataset.receiver = receiverName;

    currentReceiver = receiverName;
  
    getPrivateMessages(receiverName); 
}
function sendPrivateMessage() {
    let messageInput = document.getElementById("messageInputPrivate");
    let chatBox = document.getElementById("private");
    let messageText = messageInput.value.trim();

    if (messageText === "") return;

    let receiverName = currentReceiver;

    if (!receiverName) {
        alert("گیرنده مشخص نیست!");
        return;
    }

    let timeStamp = new Date();
    let formattedTime = timeStamp.getHours().toString().padStart(2, "0") + ":" + timeStamp.getMinutes().toString().padStart(2, "0");
    let formattedDate = timeStamp.getFullYear() + "-" + (timeStamp.getMonth() + 1).toString().padStart(2, "0") + "-" + timeStamp.getDate().toString().padStart(2, "0");

    let sender = professorName || "کاربر ناشناس";

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user-message");

    let messageContent = document.createElement("span");
    messageContent.textContent = messageText;

    let messageInfo = document.createElement("div");
    messageInfo.classList.add("message-info");
    messageInfo.textContent = `👤 ${sender}  | 🕒 ${formattedTime}  | 📅 ${formattedDate}`;

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<img src="../static/media/icons/delete.png" alt="حذف" width="16" height="16">`;
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = function () {
        chatBox.removeChild(messageDiv);
    };

    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(deleteBtn);
    messageDiv.appendChild(messageInfo);

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    fetch("/send_private_message", {
        method: "POST",
        body: JSON.stringify({
            message: messageText,
            sender: sender,
            getter: receiverName
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert("خطا در ذخیره پیام‌ها");
            } else {
                deleteBtn.onclick = function () {
                    fetch(`/delete_message/${data.messageId}`, {
                        method: "DELETE"
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            chatBox.removeChild(messageDiv);
                        } else {
                            alert("❌ خطا در حذف پیام: " + data.error);
                        }
                    })
                    .catch(error => {
                        console.error("⚠️ خطا در حذف پیام:", error);
                    });
                };
            }
        });

    messageInput.value = "";
    loadFacultyContacts();
}
function getPrivateMessages(receiverName) {
    fetch("/get_private_messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sender: professorName,
            getter: receiverName
        })  
    })
    .then(response => response.json())
    .then(messages => {
        let chatBox = document.getElementById("private");
        chatBox.innerHTML = "";

        messages.forEach(msg => {
            let messageDiv = document.createElement("div");
            messageDiv.classList.add("message", "user-message");

            let messageContent = document.createElement("span");
            messageContent.textContent = msg.message;

            let messageInfo = document.createElement("div");
            messageInfo.classList.add("message-info");
            messageInfo.textContent = `👤 ${msg.sender}  | 🕒 ${msg.time}  | 📅 ${msg.date}`;

            if (msg.sender !== professorName) {
                messageDiv.classList.add("contact-message");
            }

            let deleteBtn = null;
            if (msg.sender === professorName) {
                deleteBtn = document.createElement("button");
                deleteBtn.innerHTML = `<img src="../static/media/icons/delete.png" alt="حذف" width="16" height="16">`;
                deleteBtn.classList.add("delete-btn");

                deleteBtn.onclick = function () {
                    fetch(`/delete_message/${msg.id}`, {
                        method: "DELETE"
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            chatBox.removeChild(messageDiv);
                        } else {
                            alert("❌ خطا در حذف پیام: " + data.error);
                        }
                    })
                    .catch(error => {
                        console.error("⚠️ خطا در حذف پیام:", error);
                    });
                };
            }

            messageDiv.appendChild(messageContent);
            if (deleteBtn) messageDiv.appendChild(deleteBtn);
            messageDiv.appendChild(messageInfo);

            chatBox.appendChild(messageDiv);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        console.error("⚠️ خطا در دریافت پیام‌ها:", error);
    });
}

// Supports Management
function searchStudent() {
    const input = document.getElementById('student-search-input').value.trim();
    const suggestionBox = document.getElementById('student-suggestions');
    suggestionBox.innerHTML = '';

    if (input.length === 0) return;

    fetch(`/search_student?name=${encodeURIComponent(input)}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(student => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <span class="student-name">${student.name} (${student.number})</span>
                    <button class="support-add-btn" onclick="assignSupport(${student.id})">افزودن به پشتیبان</button>
                `;
                suggestionBox.appendChild(li);
            });
        })
        .catch(error => {
            console.error("خطا در دریافت اطلاعات دانشجو:", error);
        });
}
function assignSupport(studentId) {
    fetch(`/assign_support/${studentId}`, { method: "POST" })
        .then(response => response.json())
        .then(data => {
            if (data.success){
                document.getElementById("empty-supports-table").style.display = "none";
                loadSupports();
                alert("✅ دانشجو به عنوان پشتیبان ذخیره شد.");
            }    
            else alert("❌ خطا در ذخیره نقش پشتیبان.");
        })
        .catch(error => alert("خطای ارتباط با سرور."));
}
function loadSupports() {
    fetch('/load_supports')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#supports-table tbody');
            tableBody.innerHTML = ''; 

            if(data.length !== 0){
                document.getElementById("empty-supports-table").style.display = "none";
            }
  
            data.forEach(support => {
                const row = document.createElement('tr');
  
                row.innerHTML = `
                    <td>
                        <button onclick="removeSupport(this, '${support.supportNumber}')" title="حذف دانشجوی پشتیبان">
                          <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                        </button>
                    </td>
                    <td>${support.supportEmail}</td>
                    <td>${support.supportYear}</td>
                    <td>${support.supportMajor}</td>
                    <td>${support.supportNumber}</td>
                    <td>${support.supportName}</td>
                `;
  
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('خطا در دریافت دانشجویان پشتیبان', error));
}

// Schedule Management
function courseSelection(checkbox) {
    const row = checkbox.closest("tr");
    const name = row.cells[5].textContent.trim();   
    const major = row.cells[3].textContent.trim();  

    const chartTableBody = document.querySelector("#schedule-chart-table tbody");

    if (checkbox.checked) {
        const newRow = document.createElement("tr");
        newRow.setAttribute("data-course-name", name);

        newRow.innerHTML = `
            <td>
              <button onclick="deleteRow(this)"  title="حذف سطر">
                <img src="../static/media/icons/delete.png" alt="حذف" width="20">
              </button>
            </td>
            <td>
                <select class="year-select">
                    <option value="ورودی اول">ورودی اول</option>
                    <option value="ورودی دوم">ورودی دوم</option>
                    <option value="ورودی سوم">ورودی سوم</option>
                    <option value="ورودی چهارم">ورودی چهارم</option>
                </select>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td><select class="professor-select"><option>در حال بارگذاری...</option></select></td>
            <td>${major}</td>
            <td>${name}</td>
        `;

        chartTableBody.appendChild(newRow);
        fetch("/get_schedule_professors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ professor_name: professorName }) 
        })
        .then(res => res.json())
        .then(data => {
            const select = newRow.querySelector(".professor-select");
            select.innerHTML = "";
            data.forEach(prof => {
                const option = document.createElement("option");
                option.value = prof.number;
                option.textContent = prof.name;
                select.appendChild(option);
            });
        });
    } else {
        const toRemove = chartTableBody.querySelector(`tr[data-course-name="${name}"]`);
        if (toRemove) toRemove.remove();
    }
}
function addCourseToSchedule(courseName, courseMajor) {
    fetch("/get_schedule_professors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(professors => {
        const tbody = document.querySelector("#schedule-chart-table tbody");
        const row = document.createElement("tr");

        const professorOptions = professors.map(p => `<option value="${p.name}">${p.name}</option>`).join("");

        row.innerHTML = `
            <td>
                <button onclick="deleteRow(this)" title="حذف سطر">
                    <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                </button>
            </td>
            <td><select class="end-time">${generateTimeOptions()}</select></td>
            <td><select class="start-time">${generateTimeOptions()}</select></td>
            <td>
                <select class="day-select">
                    <option value="شنبه">شنبه</option>
                    <option value="یکشنبه">یکشنبه</option>
                    <option value="دوشنبه">دوشنبه</option>
                    <option value="سه‌شنبه">سه‌شنبه</option>
                    <option value="چهارشنبه">چهارشنبه</option>
                    <option value="پنج‌شنبه">پنج‌شنبه</option>
                </select>
            </td>
            <td>
                <select class="prof-name">
                    ${professorOptions}
                </select>
            </td>
            <td class="course-major">${courseMajor}</td>
            <td class="course-name">${courseName}</td>
        `;

        tbody.appendChild(row);
    });
}
function saveSchedule() {
    const rows = document.querySelectorAll("#schedule-chart-table tbody tr");
    const newRows = [];
    const updatedRows = [];

    rows.forEach(row => {
        const id = row.getAttribute("data-id");

        console.log(id);

        const getValue = (selector, cellIndex) => {
            const select = row.querySelector(selector);
            return select ? select.value.trim() : row.cells[cellIndex]?.textContent.trim();
        };

        const data = {
            professor: getValue(".professor-select", 5),
            subject: row.cells[7]?.textContent.trim() || "",
            major: row.cells[6]?.textContent.trim() || "",
            year: getValue(".year-select", 1),
        };

        const day = row.cells[4]?.textContent?.trim() || null;
        let start = row.cells[3]?.textContent?.trim();
        let end = row.cells[2]?.textContent?.trim();

        start = start !== "" && !isNaN(start) ? parseFloat(start) : null;
        end = end !== "" && !isNaN(end) ? parseFloat(end) : null;

        if (day && start !== null && end !== null) {
            data.day = day;
            data.start = start;
            data.end = end;
        }

        if (!data.professor || !data.subject || !data.major || !data.year) return;

        if (id) {
            const original = {
                professor: row.getAttribute("data-original-professor"),
                subject: row.getAttribute("data-original-subject"),
                major: row.getAttribute("data-original-major"),
                year: row.getAttribute("data-original-year"),
                day: row.getAttribute("data-original-day"),
                start: parseFloat(row.getAttribute("data-original-start")),
                end: parseFloat(row.getAttribute("data-original-end"))
            };

            let changed = false;
            for (let key in data) {
                console.log(data[key]);
                console.log(original[key]);
                if (data[key] != original[key]) {
                    changed = true;
                    break;
                }
            }

            if (changed) {
                updatedRows.push({ id, ...data });
            }
        } else {
            newRows.push(data);
        }
    });

    if (newRows.length > 0) {
        fetch("/add_schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schedule: newRows, professor_name: professorName })
        });
    }

    updatedRows.forEach(item => {
        fetch(`/update_schedule/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });
    });

    alert("✅ ذخیره‌سازی اطلاعات چارت انجام شد.");
}
function loadSchedule() {
    fetch("/load_schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ professor_name: professorName })  
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#schedule-chart-table tbody');
        tableBody.innerHTML = ''; 

        data.forEach(schedule => {
            const row = document.createElement('tr');
            row.setAttribute("data-id", schedule.scheduleId);
            row.setAttribute("data-original-professor", schedule.scheduleProfessor);
            row.setAttribute("data-original-subject", schedule.scheduleSubject);
            row.setAttribute("data-original-major", schedule.scheduleMajor);
            row.setAttribute("data-original-year", schedule.scheduleYear);
            row.setAttribute("data-original-day", schedule.scheduleDay || "");
            row.setAttribute("data-original-start", schedule.scheduleStart || "");
            row.setAttribute("data-original-end", schedule.scheduleEnd || "");

            row.innerHTML = `
                <td>
                    <button onclick="scheduleEditRow(this)" title="اصلاح اطلاعات چارت درس">
                        <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                    </button>
                    <button onclick="deleteSchedule(this)" title="حذف سطر">
                    <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                    </button>
                </td>
                <td>${schedule.scheduleYear}</td>
                <td>${schedule.scheduleEnd}</td>
                <td>${schedule.scheduleStart}</td>
                <td>${schedule.scheduleDay}</td>
                <td>${schedule.scheduleProfessor}</td>
                <td>${schedule.scheduleMajor}</td>
                <td>${schedule.scheduleSubject}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('خطا در دریافت چارت دروس', error));
}
function sortSchedule(sortBy) {
    const tbody = document.querySelector("#schedule-chart-table tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    let colIndex;
    switch (sortBy) {
        case "day":       colIndex = 4; break;
        case "professor": colIndex = 5; break;
        case "subject":   colIndex = 7; break;
        case "entry":     colIndex = 1; break;
        default: return;
    }

    const daysOrder = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
    const entriesOrder = ["ورودی اول", "ورودی دوم", "ورودی سوم", "ورودی چهارم"];

    rows.sort((a, b) => {
        const valA = a.cells[colIndex]?.textContent.trim() || "";
        const valB = b.cells[colIndex]?.textContent.trim() || "";

        if (sortBy === "day") {
            const indexA = daysOrder.indexOf(valA);
            const indexB = daysOrder.indexOf(valB);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        }

        if (sortBy === "entry") {
            const indexA = entriesOrder.indexOf(valA);
            const indexB = entriesOrder.indexOf(valB);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        }

        return valA.localeCompare(valB, "fa");
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}
function deleteSchedule(btn) {
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_schedule/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            row.remove();
        } else {
            alert("❌ خطا در حذف سطر چارت");
        }
    })
    .catch(err => {
        console.error("خطا در ارتباط با سرور:", err);
    });
}
document.getElementById('sort-schedule-select').addEventListener('change', (event) => {
    const sortBy = event.target.value; 
    sortSchedule(sortBy);
});

// Examination Management
function updateWeekday(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const weekday = selectedOption.dataset.weekday;
    const row = selectElement.closest("tr");
    const weekdaySpan = row.querySelector(".weekday-span");
    if (weekdaySpan) {
        weekdaySpan.textContent = weekday;
    }
}
function jalaliToGregorian(jy, jm, jd) {
    let gy;
    if (jy > 979) {
      gy = 1600;
      jy -= 979;
    } else {
      gy = 621;
    }
  
    let days =
      365 * jy +
      Math.floor(jy / 33) * 8 +
      Math.floor(((jy % 33) + 3) / 4) +
      78 +
      jd +
      (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  
    gy += 400 * Math.floor(days / 146097);
    days %= 146097;
  
    if (days > 36524) {
      gy += 100 * Math.floor(--days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
  
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
  
    if (days > 365) {
      gy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
  
    let gd = days + 1;
    let sal_a = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
    let gm;
    for (gm = 1; gm < 13 && gd > sal_a[gm]; gm++) {
      gd -= sal_a[gm];
    }
  
    return { gy, gm, gd };
}
function gregorianToJalali(gy, gm, gd) {
    let g_d_m = [0,31, (gy%4 === 0 && gy%100 !== 0) || gy%400 === 0 ? 29 : 28,31,30,31,30,31,31,30,31,30,31];
    let jy;
    if (gy > 1600) {
      jy = 979;
      gy -= 1600;
    } else {
      jy = 0;
      gy -= 621;
    }
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = 365*gy + Math.floor((gy2+3)/4) - Math.floor((gy2+99)/100) + Math.floor((gy2+399)/400) - 80 + gd;
    for (let i=0; i < gm; ++i) days += g_d_m[i];
    let jy2 = Math.floor(days / 12053);
    days %= 12053;
    jy += 33*jy2 + 4*Math.floor(days/1461);
    days %= 1461;
    if (days > 365) {
      jy += Math.floor((days-1)/365);
      days = (days-1)%365;
    }
    let jm, jd;
    if (days < 186) {
      jm = 1 + Math.floor(days/31);
      jd = 1 + (days % 31);
    } else {
      jm = 7 + Math.floor((days - 186)/30);
      jd = 1 + ((days - 186) % 30);
    }
    return { jy, jm, jd };
}
function getWeekdayFromJalali(jalaliDate) {
    const parts = jalaliDate.split('/');
    if (parts.length !== 3) return "---";
  
    const jy = parseInt(parts[0], 10);
    const jm = parseInt(parts[1], 10);
    const jd = parseInt(parts[2], 10);
  
    const gDate = jalaliToGregorian(jy, jm, jd);
    const date = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
  
    return date.toLocaleDateString('fa-IR', { weekday: 'long' });
}
function timeStringToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours * 60 + minutes;
}
function saveExamination() {
    const tableRows = document.querySelectorAll("#examination-chart-table tbody tr");
    const newExams = [];
    const updatedExams = [];

    tableRows.forEach(row => {
        const id = row.getAttribute("data-id");

        const examData = {
            subject: row.cells[8].innerText.trim(),
            type: row.cells[7].innerText.trim(),
            professor: row.cells[6].innerText.trim(),
            major: row.cells[5].innerText.trim(),
            year: row.cells[4].innerText.trim(),
            date: row.cells[2].innerText.trim(),
            time: row.cells[3].innerText.trim()
        };

        if (id) {
            const original = {
                subject: row.getAttribute("data-original-subject"),
                type: row.getAttribute("data-original-type"),
                professor: row.getAttribute("data-original-professor"),
                major: row.getAttribute("data-original-major"),
                year: row.getAttribute("data-original-year"),
                date: row.getAttribute("data-original-date"),
                time: row.getAttribute("data-original-time")
            };

            let changed = false;
            for (let key in examData) {
                if (examData[key] !== original[key]) {
                    changed = true;
                    break;
                }
            }

            if (changed) {
                updatedExams.push({ id, ...examData });
            }
        } else {
            newExams.push(examData);
        }
    });

    if (newExams.length > 0) {
        fetch("/add_examination", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ examination: newExams, professor_name: professorName })
        });
    }

    updatedExams.forEach(exam => {
        fetch(`/update_examination/${exam.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exam)
        });
    });

    alert("✅ اطلاعات در حال ذخیره‌سازی هستند.");
}
function loadExamination() {
    fetch("/load_examination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professor_name: professorName }),
    })
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.querySelector("#examination-chart-table tbody");
        tableBody.innerHTML = "";
  
        data.forEach((examination) => {
          const weekday = getWeekdayFromJalali(examination.examinationDate);
          const row = document.createElement("tr");
          row.setAttribute("data-id", examination.examinationId);
          row.setAttribute("data-original-subject", examination.examinationSubject);
          row.setAttribute("data-original-type", examination.examinationType);
          row.setAttribute("data-original-professor", examination.examinationProfessor);
          row.setAttribute("data-original-major", examination.examinationMajor);
          row.setAttribute("data-original-year", examination.examinationYear);
          row.setAttribute("data-original-date", examination.examinationDate);
          row.setAttribute("data-original-time", examination.examinationTime);

          row.innerHTML = `
            <td>
              <button onclick="examinationEditRow(this)" title="اصلاح اطلاعات چارت امتحان">
                <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
              </button>
              <button onclick="deleteExamination(this)" title="حذف سطر">
                <img src="../static/media/icons/delete.png" alt="حذف" width="20" />
              </button>
            </td>
            <td>${weekday}</td>
            <td>${examination.examinationDate}</td>
            <td>${examination.examinationTime}</td>
            <td>${examination.examinationYear}</td>
            <td>${examination.examinationMajor}</td>
            <td>${examination.examinationProfessor}</td>
            <td>${examination.examinationType}</td>
            <td>${examination.examinationSubject}</td>
          `;
  
          tableBody.appendChild(row);
        });
      })
      .catch((error) => console.error("خطا در دریافت چارت امتحانات", error));
}
function sortExamination(sortBy) {
    const tableBody = document.querySelector("#examination-chart-table tbody");
    const rows = Array.from(tableBody.querySelectorAll("tr"));
  
    const sortColumnMap = {
      "subject": 8,
      "professor": 6,
      "entry": 4,
      "exam_time": 3,
      "exam_date": 2,
    };
  
    const colIndex = sortColumnMap[sortBy];
  
    rows.sort((a, b) => {
      let valA = a.cells[colIndex]?.textContent.trim() || "";
      let valB = b.cells[colIndex]?.textContent.trim() || "";
  
      if (sortBy === "exam_date") {
        valA = new Date(valA);
        valB = new Date(valB);
        return valA - valB;
      }
  
      if (sortBy === "exam_time") {
        valA = timeStringToMinutes(valA);
        valB = timeStringToMinutes(valB);
        return valA - valB;
      }
  
      return valA.localeCompare(valB, 'fa');
    });
  
    tableBody.innerHTML = "";
  
    rows.forEach(row => tableBody.appendChild(row));
} 
document.getElementById('sort-examination-select').addEventListener('change', (event) => {
    const sortBy = event.target.value;
    sortExamination(sortBy);
});
function deleteExamination(btn) {
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_examination/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            row.remove();
        } else {
            alert("خطا در حذف سطر چارت");
        }
    })
    .catch(err => {
        console.error("خطا در ارتباط با سرور:", err);
    });
}

// Generate and Show Schedule
function generateSchedule() {
  fetch("/generate_schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professor_name: professorName })
  })

  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert("✅ موفقیت: " + data.message); 
          showSchedule(); 
          loadSchedule();
      } else {
          alert("❌ خطا: " + data.message);  
      }
  })
  .catch(error => alert("⚠️ مشکلی پیش آمد: " + error));
}
function renderScheduleTable() {
    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"];
    const groups = ["ورودی اول", "ورودی دوم", "ورودی سوم", "ورودی چهارم"];
    const pad = n => n.toString().padStart(2, "0");
  
    const tbody = document.getElementById("schedule-body");
    tbody.innerHTML = ""; 
  
    days.forEach((day, dayIndex) => {
      groups.forEach((group, groupIndex) => {
        const tr = document.createElement("tr");
  
        if (groupIndex === 0) {
          const dayCell = document.createElement("td");
          dayCell.rowSpan = 4;
          dayCell.textContent = day;
          tr.appendChild(dayCell);
        }
  
        const groupCell = document.createElement("td");
        groupCell.textContent = group;
        tr.appendChild(groupCell);
  
        for (let i = 8; i < 18; i += 0.5) {
          const startHour = Math.floor(i);
          const startMin = i % 1 === 0 ? "00" : "30";
          const endHour = startMin === "00" ? startHour : startHour + 1;
          const endMin = startMin === "00" ? "30" : "00";
          const timeId = `day${dayIndex}-group${groupIndex}-${pad(startHour)}:${startMin}-${pad(endHour)}:${endMin}`;
  
          const td = document.createElement("td");
          td.className = "time-block";
          td.id = timeId;
          tr.appendChild(td);
        }
  
        tbody.appendChild(tr);
      });
    });
}
function showSchedule() {  
    const selectedMajor = document.getElementById("major-select").value;

    fetch("/show_schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            professor_name: professorName,
            user_type: "faculty",
            selected_major: selectedMajor
        })  
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#schedule-table tbody');
    
        if (data.length === 0) {
            tableBody.innerHTML = '';
            document.getElementById("empty-schedule-table").style.display = "block";
            return;
        }
    
        const validData = data.filter(item => item.day && item.start && item.end);
    
        if (validData.length === 0) {
            tableBody.innerHTML = '';
            document.getElementById("empty-schedule-table").style.display = "block";
            return;
        }
    
        document.getElementById("empty-schedule-table").style.display = "none";
    
        renderScheduleTable(); 
    
        document.querySelectorAll(".time-block").forEach(cell => {
            cell.innerHTML = "";
            cell.style.backgroundColor = "#fff";
            cell.removeAttribute("colspan");
            cell.dataset.subject = "";
            cell.dataset.professor = "";
            cell.dataset.merged = "false";
            cell.style.display = "table-cell";
        });
    
        const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"];
        const groupColors = {
            "ورودی اول": "#AFF8DB",
            "ورودی دوم": "#FFFF9F",
            "ورودی سوم": "#CBEAFF",
            "ورودی چهارم": "#FFC1C1"
        };
        const pad = n => n.toString().padStart(2, "0");
    
        validData.forEach((item, index) => {
            const dayIndex = days.indexOf(item.day.trim());
            const groupIndex = item.group_index;
    
            if (dayIndex === -1 || groupIndex === -1) return;
    
            const start = parseFloat(item.start);
            const end = parseFloat(item.end);
    
            if (isNaN(start) || isNaN(end)) return;
    
            const totalBlocks = Math.round((end - start) * 2);
            let firstCell = null;
    
            for (let i = 0; i < totalBlocks; i++) {
                const timeSlot = start + (i * 0.5);
                const blockStartHour = Math.floor(timeSlot);
                const blockStartMin = (timeSlot % 1 === 0) ? "00" : "30";
                const blockEndHour = (blockStartMin === "00") ? blockStartHour : blockStartHour + 1;
                const blockEndMin = (blockStartMin === "00") ? "30" : "00";
    
                const cellId = `day${dayIndex}-group${groupIndex}-${pad(blockStartHour)}:${blockStartMin}-${pad(blockEndHour)}:${blockEndMin}`;
                const cell = document.getElementById(cellId);
    
                if (!cell) continue;
    
                if (i === 0) {
                    cell.innerHTML = `<strong>${item.subject}</strong><br><small>${item.professor}</small>`;
                    cell.style.backgroundColor = groupColors[item.year] || "#EEE";
                    cell.dataset.subject = item.subject;
                    cell.dataset.professor = item.professor;
                    cell.dataset.merged = "true";
                    firstCell = cell;
                } else {
                    cell.style.display = "none";
                }
            }
    
            if (firstCell) {
                firstCell.setAttribute("colspan", totalBlocks);
            }

            if (selectedMajor === professorMajor) {
                scheduleDragAndDrop();
            }
        });
    })
    
    .catch(error => {
        console.error("❌ خطا در ارتباط با سرور:", error);
    });
}

// Generate and Show Examination
function generateExamination() {
    const startDate = document.getElementById("start_date").value.trim();
    const endDate = document.getElementById("end_date").value.trim();

    if (!startDate || !endDate) {
        alert("لطفاً هر دو تاریخ شروع و پایان را وارد کنید.");
        return;
    }

    fetch("/generate_examination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
        professor_name: professorName,
        user_type: "professor",
        start_date: startDate,
        end_date: endDate
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
        alert("✅ موفقیت: " + data.message);
        showExamination(startDate, endDate); 
        loadExamination();
        } else {
        alert("❌ خطا: " + data.message);
        }
    })
    .catch(error => alert("⚠️ مشکلی پیش آمد: " + error));
}
function showExamination() {
    fetch("/show_examination", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            professor_name: professorName,
            user_type: "faculty"
         })  
    })
    .then(response => response.json())
    .then(data => {
        const exams = data.exams || [];
        const startDate = data.min_date;
        const endDate = data.max_date;

        const tbody = document.querySelector(".examination-table tbody");
        tbody.innerHTML = "";

        if (!startDate || !endDate || exams.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="8" style="text-align:center; color: black;">!هنوز چارت امتحانات ساخته نشده است</td>`;
            tbody.appendChild(row);
            return;
        }

        const colors = {
            "ورودی اول": "#AFF8DB",
            "ورودی دوم": "#FFFF9F",
            "ورودی سوم": "#CBEAFF",
            "ورودی چهارم": "#FFC1C1"
        };

        const examDays = getExamDates(startDate, endDate);

        examDays.forEach(({ day, date }) => {
            const dailyExams = exams.filter(e => e.date === date);

            let morningExams = dailyExams.filter(e => e.time === "09:00-11:00");
            let afternoonExams = dailyExams.filter(e => e.time === "13:30-15:30");

            if (morningExams.length > 2) morningExams = morningExams.slice(0, 2);
            if (afternoonExams.length > 2) afternoonExams = afternoonExams.slice(0, 2);

            morningExams = morningExams.concat(Array(2 - morningExams.length).fill(null));
            afternoonExams = afternoonExams.concat(Array(2 - afternoonExams.length).fill(null));

            for (let i = 0; i < 4; i++) {
                const row = document.createElement("tr");

                if (i === 0) {
                    row.innerHTML += `<td rowspan="4">${day}</td>`;
                    row.innerHTML += `<td rowspan="4">${date}</td>`;
                }

                const time = i < 2 ? "09:00-11:00" : "13:30-15:30";
                row.innerHTML += `<td>${time}</td>`;

                const exam = i < 2 ? morningExams[i] : afternoonExams[i - 2];

                if (exam) {
                    const bg = colors[exam.year] || "#EEE";
                    row.innerHTML += `
                        <td style="background-color: ${bg}">${exam.year}</td>
                        <td style="background-color: ${bg}">${exam.major}</td>
                        <td style="background-color: ${bg}">${exam.professor}</td>
                        <td style="background-color: ${bg}">${exam.type}</td>
                        <td style="background-color: ${bg}">${exam.subject}</td>
                    `;
                } else {
                    row.innerHTML += `<td></td><td></td><td></td><td></td><td></td>`;
                }

                tbody.appendChild(row);
            }
        });
    })
    .catch(error => {
        console.error("❌ خطا در دریافت برنامه امتحانات:", error);
    });
}
  
// Schedule Drag And Drop
function scheduleDragAndDrop() {
    document.querySelectorAll(".time-block").forEach(cell => {
        if (cell.dataset.merged === "true") {
            cell.addEventListener("click", () => {
                document.querySelectorAll(".time-block").forEach(c => c.draggable = false);
                cell.draggable = true;
                cell.ondragstart = dragSubject;
            });
        }
    });
}
function dragSubject(event) {
    let cell = event.target.closest(".time-block");
    event.dataTransfer.setData("subject", cell.dataset.subject);
    event.dataTransfer.setData("professor", cell.dataset.professor);
    event.dataTransfer.setData("colspan", cell.getAttribute("colspan"));
    event.dataTransfer.setData("bgColor", cell.style.backgroundColor);
    event.dataTransfer.setData("oldId", cell.getAttribute("data-id"));
}
function allowDrop(event) {
    event.preventDefault();
}
function dropSubject(event) {
    event.preventDefault();
  
    let targetCell = event.target.closest(".time-block");
    if (!targetCell || targetCell.innerHTML.trim() !== "") return;
  
    let subject = event.dataTransfer.getData("subject");
    let professor = event.dataTransfer.getData("professor");
    let colspan = parseInt(event.dataTransfer.getData("colspan"));
    let bgColor = event.dataTransfer.getData("bgColor");
    let oldId = event.dataTransfer.getData("oldId");
  
    let targetRow = targetCell.parentElement;
    let targetCells = Array.from(targetRow.children);
    let targetIndex = targetCells.indexOf(targetCell);
  
    if (targetIndex + colspan > targetCells.length) return;
  
    let mergedCells = targetCells.slice(targetIndex, targetIndex + colspan);
    if (mergedCells.some(cell => cell.innerHTML.trim() !== "")) return;
  
    let oldCell = document.querySelector(`.time-block[data-id="${oldId}"]`);
    let oldDataId = null;
  
    if (oldCell) {
      oldDataId = oldCell.getAttribute("data-id");
  
      let oldColspan = parseInt(oldCell.getAttribute("colspan")) || 1;
      let oldRow = oldCell.parentElement;
      let oldCells = Array.from(oldRow.children);
      let oldIndex = oldCells.indexOf(oldCell);
      let oldMergedCells = oldCells.slice(oldIndex, oldIndex + oldColspan);
  
      oldMergedCells.forEach(cell => {
        cell.innerHTML = "";
        cell.style.backgroundColor = "#fff";
        cell.removeAttribute("colspan");
        cell.dataset.subject = "";
        cell.dataset.professor = "";
        cell.dataset.merged = "false";
        cell.classList.remove("time-block");
        cell.style.display = "table-cell";
        cell.removeAttribute("data-id");
        cell.draggable = false;
      });
    }
  
    mergedCells.forEach((cell, index) => {
      if (index === 0) {
        cell.innerHTML = `<strong>${subject}</strong><br><small>${professor}</small>`;
        cell.style.backgroundColor = bgColor;
        cell.dataset.subject = subject;
        cell.dataset.professor = professor;
        cell.dataset.merged = "true";
        cell.setAttribute("colspan", colspan);
        cell.classList.add("time-block");
  
        if (oldDataId) {
          cell.setAttribute("data-id", oldDataId);
          cell.setAttribute("dataa-id", oldDataId);
        }
  
        cell.draggable = false;
        cell.addEventListener("click", () => {
          document.querySelectorAll(".time-block").forEach(c => c.draggable = false);
          cell.draggable = true;
          cell.ondragstart = dragSubject;
        });
      } else {
        cell.innerHTML = "";
        cell.style.display = "none";
        cell.removeAttribute("data-id");
      }
    });
}
document.querySelectorAll(".time-block").forEach(cell => {
    cell.addEventListener("dragover", event => {
      event.preventDefault();
  
      let targetCell = event.target.closest(".time-block");
      if (!targetCell) return;
  
      let colspan = parseInt(event.dataTransfer.getData("colspan") || 1);
      let targetRow = targetCell.parentElement;
      let targetCells = Array.from(targetRow.children);
      let targetIndex = targetCells.indexOf(targetCell);
  
      document.querySelectorAll(".time-block").forEach(c => {
        c.classList.remove("drop-allowed", "drop-denied");
      });
  
      if (targetIndex + colspan > targetCells.length) {
        targetCell.classList.add("drop-denied");
        return;
      }
  
      let mergedCells = targetCells.slice(targetIndex, targetIndex + colspan);
      let canDrop = !mergedCells.some(cell => cell.innerHTML.trim() !== "");
  
      if (canDrop) {
        mergedCells.forEach(cell => cell.classList.add("drop-allowed"));
      } else {
        mergedCells.forEach(cell => cell.classList.add("drop-denied"));
      }
    });
  
    cell.addEventListener("dragleave", event => {
      let targetCell = event.target.closest(".time-block");
      if (!targetCell) return;
  
      let colspan = parseInt(event.dataTransfer.getData("colspan") || 1);
      let targetRow = targetCell.parentElement;
      let targetCells = Array.from(targetRow.children);
      let targetIndex = targetCells.indexOf(targetCell);
  
      if (targetIndex + colspan > targetCells.length) return;
  
      let mergedCells = targetCells.slice(targetIndex, targetIndex + colspan);
      mergedCells.forEach(cell => {
        cell.classList.remove("drop-allowed", "drop-denied");
      });
    });
  
    cell.addEventListener("drop", event => {
      event.preventDefault();
      document.querySelectorAll(".time-block").forEach(c => {
        c.classList.remove("drop-allowed", "drop-denied");
      });
      dropSubject(event);
    });
});

// Update Schedule From Table
async function updateSchedule() {
    const tableBody = document.querySelector("#schedule-chart-table tbody");
    const existingRows = Array.from(tableBody.querySelectorAll("tr"));

    const majorMap = new Map();
    existingRows.forEach(row => {
        const subject = row.cells[7]?.textContent.trim();
        const professor = row.cells[5]?.textContent.trim();
        const major = row.cells[6]?.textContent.trim();
        if (subject && professor && major) {
            majorMap.set(`${subject}_${professor}`, major);
        }
    });

    const timeBlocks = document.querySelectorAll(".time-block");

    for (const cell of timeBlocks) {
        if (cell.dataset.merged !== "true") continue;

        const changedId = cell.getAttribute("dataa-id");
        if (!changedId) continue; 

        const idParts = cell.id.split("-");
        const dayIndex = parseInt(idParts[0].replace("day", ""));
        const groupIndex = parseInt(idParts[1].replace("group", ""));
        const timeRange = idParts[2];

        const groupName = ["ورودی اول", "ورودی دوم", "ورودی سوم", "ورودی چهارم"][groupIndex];
        const dayName = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"][dayIndex];

        const [startHourStr, startMinStr] = timeRange.split("-")[0].split(":");
        const startFloat = parseInt(startHourStr) + (parseInt(startMinStr) === 30 ? 0.5 : 0);
        const colspan = parseInt(cell.getAttribute("colspan")) || 1;
        const endFloat = startFloat + (colspan * 0.5);

        const startTime = startFloat.toFixed(1);
        const endTime = endFloat.toFixed(1);

        const subject = cell.dataset.subject;
        const professor = cell.dataset.professor;
        const major = majorMap.get(`${subject}_${professor}`) || "نامشخص";

        const parts = changedId.split("-");
        const oldDayIndex = parseInt(parts[0].replace("day", ""));
        const oldGroupIndex = parseInt(parts[1].replace("group", ""));
        const oldStartStr = parts[2];
        const oldEndStr = parts[3];

        const [h1, m1] = oldStartStr.split(":");
        const oldStartFloat = parseInt(h1) + (parseInt(m1) === 30 ? 0.5 : 0);
        const oldStart = oldStartFloat % 1 === 0 ? parseInt(oldStartFloat) : oldStartFloat.toFixed(1);

        const [h2, m2] = oldEndStr.split(":");
        const oldEndFloat = parseInt(h2) + (parseInt(m2) === 30 ? 0.5 : 0);
        const oldEnd = oldEndFloat % 1 === 0 ? parseInt(oldEndFloat) : oldEndFloat.toFixed(1);

        const oldGroupName = ["ورودی اول", "ورودی دوم", "ورودی سوم", "ورودی چهارم"][oldGroupIndex];
        const oldDayName = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"][oldDayIndex];

        const realId = await fetch("/get_schedule_id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                day: oldDayName,
                group: oldGroupName,
                start: oldStart
            })
        }).then(res => res.json()).then(data => data.id || null);

        if (!realId) continue;

        const oldRow = tableBody.querySelector(`tr[data-id="${realId}"]`);
        if (oldRow) {
            tableBody.removeChild(oldRow);
        }

        const newRow = document.createElement("tr");
        newRow.setAttribute("data-id", realId);
        newRow.setAttribute("data-original-subject", subject);
        newRow.setAttribute("data-original-professor", professor);
        newRow.setAttribute("data-original-major", major);
        newRow.setAttribute("data-original-year", oldGroupName);
        newRow.setAttribute("data-original-day", oldDayName);
        newRow.setAttribute("data-original-start", oldStart);
        newRow.setAttribute("data-original-end", oldEnd);

        newRow.innerHTML = `
            <td>
                <button onclick="scheduleEditRow(this)" title="اصلاح اطلاعات چارت درس">
                    <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                </button>
                <button onclick="deleteRow(this)" title="حذف سطر">
                    <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                </button>
            </td>
            <td>${groupName}</td>
            <td>${endTime}</td>
            <td>${startTime}</td>
            <td>${dayName}</td>
            <td>${professor}</td>
            <td>${major}</td>
            <td>${subject}</td>
        `;

        tableBody.appendChild(newRow);
    }

    alert("✅ فقط سطرهای تغییر یافته با موفقیت جایگزین شدند.");
}

// Solve Schedule Confliction
function solveScheduleConfliction() {
    fetch("/solve_schedule_confliction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            professor_name: professorName
           }) 
    })
    .then(response => response.json())
    .then(result => {
        const data = result.data || [];
        const tbody = document.querySelector('#solve-table tbody');
        tbody.innerHTML = '';

        const seen = new Set();

        if (!data || data.length === 0) {
            const row = tbody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 8;
            cell.style.textAlign = 'center';
            cell.style.fontSize = '16px';
            cell.innerText = '!تداخلی وجود ندارد';
        } else {
            data.forEach(item => {
                const uniqueKey = `${item.conflict}_${item.changed_subject}_${item.day}`;
                if (seen.has(uniqueKey)) return;
                seen.add(uniqueKey);

                if (item.suggested_slots === null) {
                    const row = tbody.insertRow();
                    const cell = row.insertCell(0);
                    cell.colSpan = 6;
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '16px';
                    cell.style.color = 'green';
                    cell.innerText = '!تداخلی وجود ندارد';
                    row.insertCell(1).innerText = item.conflict || "-";
                    return;
                }

                if (Array.isArray(item.suggested_slots) && item.suggested_slots.length === 0) {
                    const row = tbody.insertRow();
                    const cell = row.insertCell(0);
                    cell.colSpan = 6;
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '16px';
                    cell.style.color = 'orange';
                    cell.innerText = item.reason || '!برای این تداخل بازه زمانی مناسبی یافت نشد';
                    row.insertCell(1).innerText = item.conflict || "-";
                    return;
                }

                const row = tbody.insertRow();
                const rangeDisplay = item.suggested_slots.join(", ");

                const actionCell = row.insertCell(0);
                const img = document.createElement("img");
                img.src = "../static/media/icons/checkbox.png";
                img.alt = "تغییر زمان";
                img.title = "تغییر زمان درس به بازه پیشنهادی";
                img.style.cursor = "pointer";
                img.style.width = "27px";
                img.addEventListener("click", () => {
                    handleScheduleConfliction(item);
                });
                actionCell.appendChild(img);

                row.insertCell(1).innerText = rangeDisplay;
                row.insertCell(2).innerText = item.date || "-";
                row.insertCell(3).innerText = item.day || "-";
                row.insertCell(4).innerText = item.changed_subject || "-";
                row.insertCell(5).innerText = item.conflict_type || "-";
                row.insertCell(6).innerText = item.conflict || "-";
            });
        }
    });
}
function handleScheduleConfliction(item) {
    if (!item.suggested_slots || item.suggested_slots.length === 0) return;

    const firstSlot = item.suggested_slots[0]; 
    const [endStr, startStr] = firstSlot.split("-").map(s => s.trim());
    const [hour, minute] = endStr.split(":").map(Number);
    const startHour = hour + (minute / 60);

    const rows = document.querySelectorAll("#schedule-chart-table tbody tr");
    let classDuration = null;
    let matchedRow = null;

    rows.forEach(row => {
        const endTime   = parseFloat(row.cells[2]?.textContent.trim());
        const startTime = parseFloat(row.cells[3]?.textContent.trim());
        const day       = row.cells[4]?.textContent.trim();
        const subject   = row.cells[7]?.textContent.trim();

        const matches = (
            subject === item.changed_subject &&
            day === item.day
        );

        if (matches && classDuration === null) {
            classDuration = endTime - startTime;
            matchedRow = row;
        }
    });

    if (!matchedRow || classDuration === null) {
        alert("ردیف مرتبط با درس یافت نشد.");
        return;
    }

    const newStart = startHour;
    const newEnd = (startHour + classDuration);

    alert("✅ زمان جدید: " + newStart + " تا " + newEnd + " | مدت کلاس: " + classDuration);

    matchedRow.cells[3].textContent = Number.isInteger(newStart) ? newStart : newStart.toFixed(1);
    matchedRow.cells[2].textContent = Number.isInteger(newEnd) ? newEnd : newEnd.toFixed(1);
}

// Solve Examination Confliction
function solveExaminationConfliction() {
    fetch("/solve_examination_confliction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professor_name: professorName })
    })
    .then(response => response.json())
    .then(result => {
        const data = result.data || [];

        if (!Array.isArray(data)) {
            alert("پاسخ دریافتی معتبر نیست.");
            return;
        }

        const tbody = document.querySelector('#solve-table tbody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            const row = tbody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 8;
            cell.style.textAlign = 'center';
            cell.style.fontSize = '16px';
            cell.innerText = '!تداخلی وجود ندارد';
        } else {
            data.forEach(item => {
                if (item.suggested_slots === null) {
                    const row = tbody.insertRow();

                    const cell = row.insertCell(0);
                    cell.colSpan = 6;
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '16px';
                    cell.style.color = 'green';
                    cell.innerText = '!تداخلی وجود ندارد';

                    row.insertCell(1).innerText = item.conflict || "-";
                    return;
                }

                if (Array.isArray(item.suggested_slots) && item.suggested_slots.length === 0 && item.reason) {
                    const row = tbody.insertRow();

                    const mergedCell = row.insertCell(0);
                    mergedCell.colSpan = 6;
                    mergedCell.style.textAlign = 'center';
                    mergedCell.style.fontSize = '16px';
                    mergedCell.style.color = 'orange';
                    mergedCell.innerText = item.reason;

                    row.insertCell(1).innerText = item.conflict || "-";
                    return;
                }

                const row = tbody.insertRow();

                const mergedCell = row.insertCell(0);
                mergedCell.colSpan = 2;
                mergedCell.style.textAlign = 'center';

                if (Array.isArray(item.suggested_slots) && item.suggested_slots.length > 0) {
                    const select = document.createElement('select');
                    select.className = 'conflict-select';
                    select.style.width = '100%';

                    item.suggested_slots.forEach(slot => {
                        const option = document.createElement('option');
                        option.value = slot;
                        option.textContent = slot;
                        select.appendChild(option);
                    });

                    mergedCell.appendChild(select);
                } else if (typeof item.suggested_slots === 'string' && item.suggested_slots.length > 0) {
                    mergedCell.innerText = item.suggested_slots;
                } else {
                    mergedCell.innerText = '-';
                }

                const actionCell = row.insertCell(0);
                const img = document.createElement("img");
                img.src = "../static/media/icons/checkbox.png";  
                img.alt = "تغییر زمان";
                img.title = "تغییر زمان امتحان به بازه پیشنهادی";
                img.style.cursor = "pointer";
                img.style.width = "27px";
                img.addEventListener("click", () => {
                    handleExaminationConfliction(item); 
                });
                actionCell.appendChild(img);

                const cell3 = row.insertCell();
                cell3.innerText = getWeekdayFromJalali(item.date) || "-";

                const cell4 = row.insertCell();
                cell4.innerText = item.changed_subject || "-";

                const cell5 = row.insertCell();
                cell5.innerText = item.conflict_type || "-";

                const cell6 = row.insertCell();
                cell6.innerText = item.conflict || "-";
            });
        }
    });
}
function handleExaminationConfliction(item) {
    const rows = document.querySelectorAll("#examination-chart-table tbody tr");
    let matchedRow = null;

    rows.forEach(row => {
        const subject     = row.cells[8]?.textContent.trim();

        const isMatch =
            subject === item.changed_subject;

        if (isMatch && !matchedRow) {
            matchedRow = row;
        }
    });

    if (!matchedRow) {
        alert("❌ سطر مربوط به این تداخل یافت نشد.");
        return;
    }

    const selects = document.querySelectorAll(".conflict-select");
    let selectedSlot = null;

    selects.forEach(select => {
        if (select.closest("tr").textContent.includes(item.changed_subject)) {
            selectedSlot = select.value;
        }
    });

    if (!selectedSlot) {
        alert("❌ بازه انتخاب‌شده یافت نشد.");
        return;
    }

    const dateMatch = selectedSlot.match(/تاریخ\s+([0-9\/]+)/);
    const timeMatch = selectedSlot.match(/ساعت\s+([0-9:\-]+)/);

    if (!dateMatch || !timeMatch) {
        alert("❌ فرمت بازه انتخابی نامعتبر است.");
        return;
    }

    const newDate = dateMatch[1];        
    const newTime = timeMatch[1];        

    matchedRow.cells[2].textContent = newDate;
    matchedRow.cells[3].textContent = newTime;

    alert(`✅ تاریخ جدید: ${newDate} | زمان جدید: ${newTime}`);
}

// Deletion And Edition
function deleteRow(button) {
    let row = button.closest("tr");
    row.remove();
}
function solveConflict(button) {
    let row = button.closest("tr");
    let cells = row.querySelectorAll("td");

    cells[1].innerText = "رفع شده";
}
function unsolveConflict(button) {
    let row = button.closest("tr");
    let cells = row.querySelectorAll("td");

    cells[1].innerText = "درحال بررسی";
}
function duplicateRow(button) {
    const currentRow = button.closest("tr");
    const newRow = currentRow.cloneNode(true); 
    
    newRow.removeAttribute("data-id");
    newRow.removeAttribute("data-original-professor");
    newRow.removeAttribute("data-original-pronumber");
    newRow.removeAttribute("data-original-day");
    newRow.removeAttribute("data-original-start");
    newRow.removeAttribute("data-original-end");

    currentRow.parentNode.insertBefore(newRow, currentRow.nextSibling);
}
function courseEditRow(button) {
    const row = button.closest("tr");
    const isEditing = row.classList.toggle("editing");

    const icon = button.querySelector("img");

    if (isEditing) {
        icon.src = "../static/media/icons/edit-active.png";

        const fields = [1, 2, 3, 4, 5];
        fields.forEach(i => {
            const cell = row.cells[i];
            const value = cell.innerText.trim();
            cell.setAttribute("data-original", value);
            cell.innerHTML = `
            <input type="text" value="${value}" 
                style="
                width: 50%; 
                padding: 4px 4px;
                direction: rtl;
                text-align: center;
                font-family: 'Vazir', sans-serif;
                font-size: 14px;
                border: 2px dashed green;
                border-radius: 6px;
                background-color:rgb(255, 255, 255);
                outline: none;
                box-sizing: border-box;
                ">
            `;
        });

    } else {
        icon.src = "../static/media/icons/edit.png";
        icon.alt = "ویرایش";

        const fields = [1, 2, 3, 4, 5];
        fields.forEach(i => {
            const cell = row.cells[i];
            const input = cell.querySelector("input");
            if (input) {
                const newValue = input.value.trim();
                cell.innerHTML = newValue;
            }
        });
    }
}
function professorEditRow(button) {
    const row = button.closest("tr");
    const isEditing = row.classList.toggle("editing");

    const icon = button.querySelector("img");

    if (isEditing) {
        icon.src = "../static/media/icons/edit-active.png";

        const fields = [1, 2, 3, 4];
        fields.forEach(i => {
            const cell = row.cells[i];
            const value = cell.innerText.trim();
            cell.setAttribute("data-original", value);
            cell.innerHTML = `
            <input type="text" value="${value}" 
                style="
                width: 60%; 
                padding: 4px 4px;
                text-align: center;
                font-family: 'Vazir', sans-serif;
                font-size: 14px;
                border: 2px dashed green;
                border-radius: 6px;
                background-color:rgb(255, 255, 255);
                outline: none;
                box-sizing: border-box;
                ">
            `;
        });

    } else {
        icon.src = "../static/media/icons/edit.png";
        icon.alt = "ویرایش";

        const fields = [1, 2, 3, 4];
        fields.forEach(i => {
            const cell = row.cells[i];
            const input = cell.querySelector("input");
            if (input) {
                const newValue = input.value.trim();
                cell.innerHTML = newValue;
            }
        });
    }
}
function scheduleEditRow(button) {
    const row = button.closest("tr");
    const isEditing = row.classList.toggle("editing");

    const icon = button.querySelector("img");

    if (isEditing) {
        icon.src = "../static/media/icons/edit-active.png";

        const fields = [1, 2, 3, 4, 5, 6, 7];
        fields.forEach(i => {
            const cell = row.cells[i];
            const value = cell.innerText.trim();
            cell.setAttribute("data-original", value);
            cell.innerHTML = `
            <input type="text" value="${value}" 
                style="
                width: 70%; 
                padding: 4px 4px;
                text-align: center;
                font-family: 'Vazir', sans-serif;
                font-size: 14px;
                border: 2px dashed green;
                border-radius: 6px;
                background-color:rgb(255, 255, 255);
                outline: none;
                box-sizing: border-box;
                ">
            `;
        });

    } else {
        icon.src = "../static/media/icons/edit.png";
        icon.alt = "ویرایش";

        const fields = [1, 2, 3, 4, 5, 6, 7];
        fields.forEach(i => {
            const cell = row.cells[i];
            const input = cell.querySelector("input");
            if (input) {
                const newValue = input.value.trim();
                cell.innerHTML = newValue;
            }
        });
    }
}
function examinationEditRow(button) {
    const row = button.closest("tr");
    const isEditing = row.classList.toggle("editing");

    const icon = button.querySelector("img");

    if (isEditing) {
        icon.src = "../static/media/icons/edit-active.png";

        const fields = [2, 3, 4, 5, 6, 7, 8];
        fields.forEach(i => {
            const cell = row.cells[i];
            const value = cell.innerText.trim();
            cell.setAttribute("data-original", value);
            cell.innerHTML = `
            <input type="text" value="${value}" 
                style="
                width: 70%; 
                padding: 4px 4px;
                text-align: center;
                font-family: 'Vazir', sans-serif;
                font-size: 14px;
                border: 2px dashed green;
                border-radius: 6px;
                background-color:rgb(255, 255, 255);
                outline: none;
                box-sizing: border-box;
                ">
            `;
        });

    } else {
        icon.src = "../static/media/icons/edit.png";
        icon.alt = "ویرایش";

        const fields = [2, 3, 4, 5, 6, 7, 8];
        fields.forEach(i => {
            const cell = row.cells[i];
            const input = cell.querySelector("input");
            if (input) {
                const newValue = input.value.trim();
                cell.innerHTML = newValue;
            }
        });
    }
}
function removeSupport(button, stdNumber) {
    fetch(`/remove_support/${stdNumber}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('نقش پشتیبان با موفقیت حذف شد.');
            let row = button.closest("tr");
            row.remove();
        } else {
            alert('خطا در حذف نقش پشتیبان');
        }
    })
    .catch(error => {
        console.error('خطا در ارسال درخواست:', error);
    });
}

// Loading
window.onload = function () {
  switchTab('schedule');
  loadCourses();
  loadProfessors();
  loadConflicts();
  loadChanges();
  loadSupports();
  loadFacultyContacts();
  loadAvailability();
  loadSchedule();
  showSchedule();
  loadExamination();
  showExamination();
};
