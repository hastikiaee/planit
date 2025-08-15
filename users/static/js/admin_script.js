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
  
    if (tabName === 'information') {
      showSection('side_courses');
    } else if (tabName === 'classification') {
      showSection('side_classes');
    } else if (tabName === 'confliction') {
      showSection('side_confliction');
    } else if (tabName === 'messages') {
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
        id === 'side_courses' || id === 'side_professors' || id === 'side_faculty' || id === 'side_students'
    ) {
      tabSwitch('information');
      tabName = 'information';
    } else if (id === 'side_classes' || id === 'side_classification' || id === 'side_classification_chart' || id === 'side_free_class') {
      tabSwitch('classification');
      tabName = 'classification';
    } else if (id === 'side_confliction') {
      tabSwitch('confliction');
      tabName = 'confliction';
    } else if (id === 'side_messages') {
      tabSwitch('messages');
      tabName = 'messages';
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
        loadAllCourses();
    }
}
function loadAllCourses() {
  fetch('/load_all_courses', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
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
            <td>${courseName}</td>
            <td>${courseType}</td>
            <td>${courseMajor}</td>
            <td>${courseDays}</td>
            <td>${courseLength}</td>
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

// Professors Management
function addProfessor() {
    let professorMajor = document.getElementById("professor_major").value.trim();
    let professorEmail = document.getElementById("professor_email").value.trim();
    let professorNumber = document.getElementById("professor_number").value.trim();
    let professorName = document.getElementById("professor_name").value.trim();

    if (!professorMajor || !professorEmail || !professorNumber || !professorName) {
        alert("لطفاً تمامی فیلدها را پر کنید!");
        return;
    }

    document.getElementById("empty-professors-table").style.display = "none";

    let tableBody = document.querySelector("#professors-table tbody");
    let rows = tableBody.querySelectorAll("tr");

    for (let row of rows) {
        let existingEmail = row.children[2].textContent.trim();
        let existingNumber = row.children[3].textContent.trim();

        if (existingNumber === professorNumber) {
            alert("استادی با این شماره استادی قبلاً ثبت شده است.");
            return;
        }

        if (existingEmail === professorEmail) {
            alert("استادی با این ایمیل قبلاً ثبت شده است.");
            return;
        }   
    }

    let newRow = document.createElement("tr");
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

    document.getElementById("professor_major").value = "";
    document.getElementById("professor_email").value = "";
    document.getElementById("professor_number").value = "";
    document.getElementById("professor_name").value = "";
}
function saveProfessors() {
    const tableRows = document.querySelectorAll("#professors-table tbody tr");

    let updatedRows = [];
    let newRows = [];

    tableRows.forEach(row => {
        const id = row.getAttribute("data-id");

        const current = {
            professorName: row.cells[4].innerText.trim(),
            professorNumber: row.cells[3].innerText.trim(),
            professorEmail: row.cells[2].innerText.trim(),
            professorMajor: row.cells[1].innerText.trim()
        };

        if (id) {
            const original = {
                professorName: row.getAttribute("data-original-name"),
                professorNumber: row.getAttribute("data-original-number"),
                professorEmail: row.getAttribute("data-original-email"),
                professorMajor: row.getAttribute("data-original-major")
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
        fetch("/add_professors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ professors: newRows })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("✅ اساتید جدید با موفقیت ذخیره شدند.");
            } else {
                console.error("❌ خطا در ذخیره اساتید جدید");
            }
        });
    }

    updatedRows.forEach(professor => {
        const url = `/update_professors/${professor.id}`;
        fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(professor)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log(`✅ استاد با ID ${professor.id} بروزرسانی شد.`);
            } else {
                console.error(`❌ خطا در بروزرسانی استاد ${professor.id}`);
            }
        });
    });

    if (newRows.length === 0 && updatedRows.length === 0) {
        alert("هیچ تغییری انجام نشده است.");
    } else {
        alert("✅ ذخیره‌سازی اطلاعات در حال انجام است.");
        loadAllProfessors();
    }
}
function loadAllProfessors() {
    fetch("/load_all_professors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#professors-table tbody');
        tableBody.innerHTML = ''; 

        if(data.length !== 0){
            document.getElementById("empty-professors-table").style.display = "none";
        }

        data.forEach(professor => {
            const row = document.createElement('tr');
            row.setAttribute("data-id", professor.professorId);

            row.innerHTML = `
                <td>
                    <button onclick="professorEditRow(this)" title="اصلاح اطلاعات استاد">
                        <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                    </button>
                    <button onclick="deleteProfessor(this)" title="حذف سطر">
                    <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                    </button>
                </td>
                <td>${professor.professorMajor}</td>
                <td>${professor.professorEmail}</td>
                <td>${professor.professorNumber}</td>
                <td>${professor.professorName}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('خطا در دریافت اساتید', error));
}
function sortProfessors() {
    const table = document.getElementById("professors-table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const sortBy = document.getElementById("sort-professors-select").value;
    let columnIndex = sortBy === "name" ? 4 : 1; 

    rows.sort((a, b) => {
        const textA = a.cells[columnIndex]?.textContent.trim().toLowerCase() || "";
        const textB = b.cells[columnIndex]?.textContent.trim().toLowerCase() || "";
        return textA.localeCompare(textB, 'fa'); 
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}
function deleteProfessor(btn) {
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_professor/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            row.remove();
        } else {
            alert("خطا در حذف استاد");
        }
    })
    .catch(err => {
        console.error("خطا در ارتباط با سرور:", err);
    });
}
document.getElementById("sort-professors-select").addEventListener("change", sortProfessors);

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

// Faculty Management
function searchProfessor() {
    const input = document.getElementById('professor-search-input').value.trim();
    const suggestionBox = document.getElementById('professor-suggestions');
    suggestionBox.innerHTML = '';

    if (input.length === 0) return;

    fetch(`/search_professor?name=${encodeURIComponent(input)}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(professor => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <span class="professor-name">${professor.name} (${professor.number})</span>
                    <button class="faculty-add-btn" onclick="assignFaculty(${professor.id})">افزودن به مدیر گروه</button>
                `;
                suggestionBox.appendChild(li);
            });
        })
        .catch(error => {
            console.error("خطا در دریافت اطلاعات استاد:", error);
        });
}
function assignFaculty(professorId) {
    fetch(`/assign_faculty/${professorId}`, { method: "POST" })
        .then(response => response.json())
        .then(data => {
            if (data.success){
                document.getElementById("empty-faculty-table").style.display = "none";
                loadFaculty();
                alert("✅ استاد به عنوان مدیر گروه ذخیره شد.");
            }    
            else alert("❌ خطا در ذخیره نقش مدیر گروه.");
        })
        .catch(error => alert("خطای ارتباط با سرور."));
}
function loadFaculty() {
    fetch('/load_faculty')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#faculty-table tbody');
            tableBody.innerHTML = ''; 

            if(data.length !== 0){
                document.getElementById("empty-faculty-table").style.display = "none";
            }
  
            data.forEach(faculty => {
                const row = document.createElement('tr');
  
                row.innerHTML = `
                    <td>
                        <button onclick="removeFaculty(this, '${faculty.facultyNumber}')" title="حذف استاد مدیر گروه">
                          <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                        </button>
                    </td>
                    <td>${faculty.facultyEmail}</td>
                    <td>${faculty.facultyMajor}</td>
                    <td>${faculty.facultyNumber}</td>
                    <td>${faculty.facultyName}</td>
                `;
  
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('خطا در دریافت اساتید مدیر گروه', error));
}

// Students Management
function addStudent() {
    let studentYear = document.getElementById("student_year").value;
    let studentMajor = document.getElementById("student_major").value.trim();
    let studentEmail = document.getElementById("student_email").value.trim();
    let studentNumber = document.getElementById("student_number").value.trim();
    let studentName = document.getElementById("student_name").value.trim();

    if (studentYear === "" || studentMajor === "" || studentEmail === "" || studentNumber === "" || studentName === "") {
        alert("لطفاً تمامی فیلدها را پر کنید!");
        return;
    }

    document.getElementById("empty-students-table").style.display = "none";
    
    let tableRows = document.querySelectorAll("#students-table tbody tr");
    for (let row of tableRows) {
        let email = row.cells[3].textContent.trim();
        let number = row.cells[4].textContent.trim();

        if (studentEmail === email) {
            alert("این ایمیل قبلاً ثبت شده است!");
            return;
        }

        if (studentNumber === number) {
            alert("این شماره دانشجویی قبلاً ثبت شده است!");
            return;
        }
    }

    let tableBody = document.querySelector("#students-table tbody");

    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>
            <button onclick="studentEditRow(this)" title="اصلاح اطلاعات دانشجو">
                <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
            </button>
            <button onclick="deleteRow(this)" title="حذف سطر">
                <img src="../static/media/icons/delete.png" alt="حذف" width="20">
            </button>
        </td>
        <td>${studentYear}</td>
        <td>${studentMajor}</td>
        <td>${studentEmail}</td>
        <td>${studentNumber}</td>
        <td>${studentName}</td>
    `;

    tableBody.appendChild(newRow);

    document.getElementById("student_year").value = "";
    document.getElementById("student_major").value = "";
    document.getElementById("student_email").value = "";
    document.getElementById("student_number").value = "";
    document.getElementById("student_name").value = "";
}
function saveStudents() {
    const tableRows = document.querySelectorAll("#students-table tbody tr");
    const newStudents = [];
    const updatedStudents = [];

    for (const row of tableRows) {
        const id = row.getAttribute("data-id");

        const student = {
            name: row.cells[5].innerText.trim(),
            number: row.cells[4].innerText.trim(),
            email: row.cells[3].innerText.trim(),
            major: row.cells[2].innerText.trim(),
            year: row.cells[1].innerText.trim(),
        };

        if (id) {
            const original = {
                name: row.getAttribute("data-original-name"),
                number: row.getAttribute("data-original-number"),
                email: row.getAttribute("data-original-email"),
                major: row.getAttribute("data-original-major"),
                year: row.getAttribute("data-original-year"),
            };

            let changed = false;
            for (let key in original) {
                if (student[key] !== original[key]) {
                    changed = true;
                    break;
                }
            }

            if (changed) {
                updatedStudents.push({ id, ...student });
            }
        } else {
            newStudents.push(student);
        }
    }

    if (newStudents.length > 0) {
        fetch("/add_students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ students: newStudents })
        });
    }

    updatedStudents.forEach(student => {
        fetch(`/update_students/${student.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
    });

    alert("✅ اطلاعات دانشجویان در حال ذخیره‌سازی است.");
    loadAllStudents();
}
function loadAllStudents() {
    fetch("/load_all_students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#students-table tbody');
        tableBody.innerHTML = ''; 

        if(data.length !== 0){
            document.getElementById("empty-students-table").style.display = "none";
        }

        data.forEach(student => {
            const row = document.createElement('tr');
            row.setAttribute("data-id", student.studentId);
            row.setAttribute("data-original-number", student.studentNumber);
            row.setAttribute("data-original-email", student.studentEmail);
            row.setAttribute("data-original-major", student.studentMajor);
            row.setAttribute("data-original-year", student.studentYear);

            row.innerHTML = `
                <td>
                    <button onclick="studentEditRow(this)" title="اصلاح اطلاعات دانشجو">
                        <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                    </button>
                    <button onclick="deleteStudent(this)" title="حذف سطر">
                    <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                    </button>
                </td>
                <td>${student.studentYear}</td>
                <td>${student.studentMajor}</td>
                <td>${student.studentEmail}</td>
                <td>${student.studentNumber}</td>
                <td>${student.studentName}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('خطا در دریافت اساتید', error));
}
function sortStudents() {
    const table = document.querySelector("#students-table tbody");
    const rows = Array.from(table.querySelectorAll("tr")).filter(row => row.cells.length > 1);
  
    const sortBy = document.getElementById("sort-students-select").value;
    const indexMap = {
      "year": 1,
      "major": 2,
      "number": 4,
      "name": 5
    };
  
    const columnIndex = indexMap[sortBy];
  
    rows.sort((a, b) => {
      const textA = a.cells[columnIndex].textContent.trim();
      const textB = b.cells[columnIndex].textContent.trim();
  
      if (sortBy === "year") {
        return parseInt(textA) - parseInt(textB);
      } else {
        return textA.localeCompare(textB, 'fa'); // مقایسه حروف فارسی
      }
    });
  
    table.innerHTML = '';
    rows.forEach(row => table.appendChild(row));
}
function deleteStudent(btn) {
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_student/${id}`, {
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
document.getElementById("sort-students-select").addEventListener("change", sortStudents);

// Import Students CSV 
function parseStudentsCSV(csvData) {
    const lines = csvData.split("\n");
    const tableBody = document.querySelector("#students-table tbody");

    const existingEmails = new Set();
    const existingNumbers = new Set();

    document.getElementById("empty-students-table").style.display = "none";

    document.querySelectorAll("#students-table tbody tr").forEach(row => {
        const number = row.children[4].textContent.trim(); 
        const email = row.children[3].textContent.trim();  
        existingNumbers.add(number);
        existingEmails.add(email);
    });

    const duplicateStudents = [];

    lines.forEach(line => {
        const columns = line.split(",").map(col => col.replaceAll('"', '').trim());

        const [studentName, studentNumber, studentEmail, studentMajor, studentYear] = columns;

        if (studentYear && studentMajor && studentEmail && studentNumber && studentName) {
            const isDuplicateNumber = existingNumbers.has(studentNumber);
            const isDuplicateEmail = existingEmails.has(studentEmail);

            if (!isDuplicateNumber && !isDuplicateEmail) {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>
                        <button onclick="studentEditRow(this)" title="اصلاح اطلاعات دانشجو">
                            <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                        </button>
                        <button onclick="deleteRow(this)" title="حذف سطر">
                            <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                        </button>
                    </td>
                    <td>${studentYear}</td>
                    <td>${studentMajor}</td>
                    <td>${studentEmail}</td>
                    <td>${studentNumber}</td>
                    <td>${studentName}</td>
                `;
                tableBody.appendChild(newRow);

                existingNumbers.add(studentNumber);
                existingEmails.add(studentEmail);
            } else {
                duplicateStudents.push(`${studentName} با شماره دانشجویی ${studentNumber}`);
            }
        }
    });

    if (duplicateStudents.length > 0) {
        alert("دانشجویان تکراری اضافه نشدند:\n\n" + duplicateStudents.join("\n"));
    }
}
document.getElementById("importStudentsCSV").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                parseStudentsCSV(csvData);
            };
            reader.readAsText(file);
        }
    };
    input.click();
});

// Classes Management
function addClass() {
    let classFloor = document.getElementById("class_floor").value.trim();
    let classBuilding = document.getElementById("class_building").value.trim();
    let classCapacity = document.getElementById("class_capacity").value.trim();
    let classType = document.getElementById("class_type").value.trim();
    let className = document.getElementById("class_name").value.trim();

    if (classFloor === "" || classBuilding === "" || classCapacity === "" || classType === "" || className === "") {
        alert("لطفاً تمامی فیلدها را پر کنید!");
        return;
    }

    document.getElementById("empty-classes-table").style.display = "none";
    
    let tableBody = document.querySelector("#classes-table tbody");
    let rows = tableBody.querySelectorAll("tr");

    for (let row of rows) {
        let cells = row.querySelectorAll("td");
        let floor = cells[1].textContent.trim();
        let building = cells[2].textContent.trim();
        let capacity = cells[3].textContent.trim();
        let type = cells[4].textContent.trim();
        let name = cells[5].textContent.trim();

        if (
            floor === classFloor &&
            building === classBuilding &&
            capacity === classCapacity &&
            type === classType &&
            name === className
        ) {
            alert("کلاسی با همین مشخصات قبلاً ثبت شده است!");
            return;
        }
    }

    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>
            <button onclick="classEditRow(this)" title="اصلاح اطلاعات کلاس">
                <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
            </button>
            <button onclick="deleteRow(this)" title="حذف سطر">
                <img src="../static/media/icons/delete.png" alt="حذف" width="20">
            </button>
        </td>
        <td>${classFloor}</td>
        <td>${classBuilding}</td>
        <td>${classCapacity}</td>
        <td>${classType}</td>
        <td>${className}</td>
    `;

    tableBody.appendChild(newRow);

    document.getElementById("class_floor").value = "";
    document.getElementById("class_building").value = "";
    document.getElementById("class_capacity").value = "";
    document.getElementById("class_type").selectedIndex = 0;
    document.getElementById("class_name").value = "";
}
function saveClasses() {
    const rows = document.querySelectorAll("#classes-table tbody tr");
    const newRows = [];
    const updatedRows = [];

    for (const row of rows) {
        const id = row.getAttribute("data-id");

        const classItem = {
            name: row.cells[5].innerText.trim(),
            type: row.cells[4].innerText.trim(),
            capacity: parseInt(row.cells[3].innerText),
            building: row.cells[2].innerText.trim(),
            floor: parseInt(row.cells[1].innerText)
        };

        if (!classItem.name || !classItem.type || !classItem.building || isNaN(classItem.capacity) || isNaN(classItem.floor)) {
            alert("اطلاعات برخی از کلاس‌ها ناقص است.");
            return;
        }

        if (id) {
            const original = {
                name: row.getAttribute("data-original-name"),
                type: row.getAttribute("data-original-type"),
                capacity: parseInt(row.getAttribute("data-original-capacity")),
                building: row.getAttribute("data-original-building"),
                floor: parseInt(row.getAttribute("data-original-floor"))
            };

            let changed = false;
            for (let key in original) {
                if (classItem[key] !== original[key]) {
                    changed = true;
                    break;
                }
            }

            if (changed) {
                updatedRows.push({ id, ...classItem });
            }
        } else {
            newRows.push(classItem);
        }
    }

    if (newRows.length > 0) {
        fetch("/add_classes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ classes: newRows })
        });
    }

    updatedRows.forEach(item => {
        fetch(`/update_classes/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });
    });

    alert("✅ اطلاعات کلاس‌ها در حال ذخیره‌سازی هستند.");
    loadClasses();
}
function loadClasses() {
  fetch('/load_classes')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.querySelector('#classes-table tbody');
          tableBody.innerHTML = ''; 

          if(data.length !== 0){
            document.getElementById("empty-classes-table").style.display = "none";
          }

          data.forEach(cls => {
              const row = document.createElement('tr');
              row.setAttribute("data-id", cls.classId);
              row.setAttribute("data-original-name", cls.className);
              row.setAttribute("data-original-type", cls.classType);
              row.setAttribute("data-original-capacity", parseInt(cls.classCapacity));
              row.setAttribute("data-original-building", cls.classBuilding);
              row.setAttribute("data-original-floor", parseInt(cls.classFloor));

              row.innerHTML = `
                  <td>
                      <button onclick="classEditRow(this)" title="اصلاح اطلاعات کلاس">
                          <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                      </button>
                      <button onclick="deleteClass(this)" title="حذف سطر">
                        <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                      </button>
                  </td>
                  <td>${cls.classFloor}</td>
                  <td>${cls.classBuilding}</td>
                  <td>${cls.classCapacity}</td>
                  <td>${cls.classType}</td>
                  <td>${cls.className}</td>
              `;

              tableBody.appendChild(row);
          });
      })
      .catch(error => console.error('خطا در دریافت دروس', error));
}
function deleteClass(btn) {
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_class/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            row.remove();
        } else {
            alert("خطا در حذف کلاس");
        }
    })
    .catch(err => {
        console.error("خطا در ارتباط با سرور:", err);
    });
}

// Import Classes CSV 
function parseClassesCSV(csvData) {
    const lines = csvData.split("\n");
    const classTableBody = document.querySelector("#classes-table tbody");

    const existingRows = Array.from(classTableBody.querySelectorAll("tr"));
    const existingClasses = existingRows.map(row => {
        const cells = row.querySelectorAll("td");
        return {
            name: cells[5]?.innerText.trim(),
            type: cells[4]?.innerText.trim(),
            capacity: cells[3]?.innerText.trim(),
            building: cells[2]?.innerText.trim(),
            floor: cells[1]?.innerText.trim(),
        };
    });
    
    document.getElementById("empty-classes-table").style.display = "none";

    const duplicates = [];

    lines.forEach((line) => {
        const columns = line.split(",").map(col => col.replaceAll('"', '').trim());

        if (columns.length >= 5 && columns[0] && columns[1] && columns[2] && columns[3] && columns[4]) {
            const className = columns[0];
            const classType = columns[1];
            const classCapacity = columns[2];
            const classBuilding = columns[3];
            const classFloor = columns[4];

            const isDuplicate = existingClasses.some(cls =>
                cls.name === className &&
                cls.type === classType &&
                cls.capacity === classCapacity &&
                cls.building === classBuilding &&
                cls.floor === classFloor
            );

            if (isDuplicate) {
                duplicates.push(`${className} با ظرفیت ${classCapacity}`);
            } else {
                existingClasses.push({
                    name: className,
                    type: classType,
                    capacity: classCapacity,
                    building: classBuilding,
                    floor: classFloor,
                });

                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>
                        <button onclick="classEditRow(this)" title="اصلاح اطلاعات کلاس">
                            <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                        </button>
                        <button onclick="deleteRow(this)" title="حذف سطر">
                            <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                        </button>
                    </td>
                    <td>${classFloor}</td>
                    <td>${classBuilding}</td>
                    <td>${classCapacity}</td>
                    <td>${classType}</td>
                    <td>${className}</td>
                `;

                classTableBody.appendChild(newRow);
            }
        }
    });

    if (duplicates.length > 0) {
        alert("کلاس‌های تکراری اضافه نشدند:\n\n" + duplicates.join("\n"));
    }
}
document.getElementById("importClassesCSV").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                parseClassesCSV(csvData); 
            };
            reader.readAsText(file);
        }
    };
    input.click(); 
});

// Conflicts Management
async function addConflict() {
    let conflictType = document.getElementById("conflict_type").value.trim();
    let conflictDays = document.getElementById("conflict_days").value.trim();
    let conflictSubjectTwo = document.getElementById("conflict_subject_two").value.trim();
    let conflictSubjectOne = document.getElementById("conflict_subject_one").value.trim();

    if (!conflictSubjectOne || !conflictSubjectTwo || !conflictType || !conflictDays) {
        alert("لطفاً همه فیلدها را پر کنید!");
        return;
    }

    document.getElementById("empty-conflicts-table").style.display = "none";

    let table = document.getElementById("conflicts-table").getElementsByTagName("tbody")[0];
    let rows = table.getElementsByTagName("tr");

    for (let row of rows) {
        let existingSubjectOne = row.cells[5].textContent.trim();
        let existingSubjectTwo = row.cells[4].textContent.trim();
        let existingDays = row.cells[3].textContent.trim();
        let existingType = row.cells[2].textContent.trim();

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
    let cellType = newRow.insertCell(2);
    let cellDays = newRow.insertCell(3);
    let cellSubjectTwo = newRow.insertCell(4);
    let cellSubjectOne = newRow.insertCell(5);

    cellStatus.innerText = status;
    cellType.innerText = conflictType;
    cellDays.innerText = conflictDays;
    cellSubjectTwo.innerText = conflictSubjectTwo;
    cellSubjectOne.innerText = conflictSubjectOne;

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<img src="../static/media/icons/delete.png" alt="حذف" width="20">';
    deleteButton.onclick = function () {
        newRow.remove();
    };
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
            conflictReporter: 'امور آموزش'
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
    loadConflicts();
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
                        <button onclick="deleteConflict(this)">
                            <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                        </button>
                    </td>
                    <td>${conflict.conflictSolve}</td>
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
            alert("خطا در حذف تداخل");
        }
    })
    .catch(err => {
        console.error("خطا در ارتباط با سرور:", err);
    });
}

// Messages Management
let currentReceiver = null;
function loadAdminContacts() {
    fetch("/load_admin_contacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            admin_name: 'امور آموزش',
            user_type: 'admin'
        })
    })
    .then(res => res.json())
    .then(contacts => {
        const container = document.getElementById("contacts-list"); 
        container.innerHTML = "";

        contacts.forEach(contact => {
            const box = document.createElement("div");
            box.classList.add("message-box");

            box.innerHTML = `
                <div class="message-title">
                    ${contact.name}
                    ${contact.has_unread ? `<span class="unread-badge">${getUnreadText(contact.name)}</span>` : ""}
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
    fetch("/mark_seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sender: receiverName,
            receiver: adminName  
        })
    });

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

    let sender = 'امور آموزش';

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
        });

    messageInput.value = "";
    loadAdminContacts();
}
function getPrivateMessages(receiverName) {
    fetch("/get_private_messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sender: 'امور آموزش',
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

            if (msg.sender !== 'امور آموزش') {
                messageDiv.classList.add("contact-message");
            }

            let deleteBtn = null;
            if (msg.sender === 'امور آموزش') {
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

// Show Schedule
function showSchedule() {
    fetch("/show_schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_type: "admin"
        })
    })
    .then(response => response.json())
    .then(data => {
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
        const majorColors = {
            "مهندسی کامپیوتر": "#AFF8DB",
            "مهندسی صنایع": "#FFFF9F",
            "مهندسی شیمی": "#CBEAFF",
            "مهندسی نفت": "#FFC1C1"
        };
        const groupMap = {
            0: "ورودی اول",
            1: "ورودی دوم",
            2: "ورودی سوم",
            3: "ورودی چهارم"
        };
        const pad = n => n.toString().padStart(2, "0");

        data.forEach(item => {
            const dayIndex = days.indexOf(item.day.trim());
            const groupIndex = item.group_index;
            const majorIndex = item.major_index;

            if (dayIndex === -1 || groupIndex === -1 || majorIndex === -1) return;

            const start = parseFloat(item.start);
            const end = parseFloat(item.end);
            const totalBlocks = Math.round((end - start) * 2);

            let firstCell = null;

            for (let i = 0; i < totalBlocks; i++) {
                const timeSlot = start + i * 0.5;
                const blockStartHour = Math.floor(timeSlot);
                const blockStartMin = (timeSlot % 1 === 0) ? "00" : "30";
                const blockEndHour = (blockStartMin === "00") ? blockStartHour : blockStartHour + 1;
                const blockEndMin = (blockStartMin === "00") ? "30" : "00";

                const cellId = `day${dayIndex}-group${groupIndex}-major${majorIndex}-${pad(blockStartHour)}:${blockStartMin}-${pad(blockEndHour)}:${blockEndMin}`;
                const cell = document.getElementById(cellId);
                if (!cell) continue;

                if (i === 0) {
                    cell.innerHTML = `<strong>${item.subject}</strong><br><small>${item.professor}</small>`;
                    cell.style.backgroundColor = majorColors[item.major] || "#EEE";
                    cell.dataset.subject = item.subject;
                    cell.dataset.professor = item.professor;
                    cell.dataset.group = groupMap[item.group_index];     
                    cell.dataset.major = item.major;   
                    cell.classList.add("schedule-cell");
                    cell.dataset.merged = "true";
                    firstCell = cell;
                } else {
                    cell.style.display = "none";
                }
            }

            if (firstCell) {
                firstCell.setAttribute("colspan", totalBlocks);
            }
        });
        filterSchedule();
    })
    .catch(error => {
        console.error("❌ خطا در دریافت اطلاعات:", error);
    });
}
function filterSchedule() {
    const groupFilter = document.getElementById("sort-entry-select").value;
    const majorFilter = document.getElementById("sort-major-select").value;

    document.querySelectorAll(".schedule-cell").forEach(cell => {
        const cellGroup = cell.dataset.group;
        const cellMajor = cell.dataset.major;

        let match = true;

        if (groupFilter !== "all-entry") {
            const groupMap = {
                "first": "ورودی اول",
                "second": "ورودی دوم",
                "third": "ورودی سوم",
                "forth": "ورودی چهارم"
            };
            if (cellGroup !== groupMap[groupFilter]) {
                match = false;
            }
        }

        if (majorFilter !== "all-major") {
            const majorMap = {
                "computer": "مهندسی کامپیوتر",
                "industrial": "مهندسی صنایع",
                "chemical": "مهندسی شیمی",
                "petroleum": "مهندسی نفت"
            };
            if (cellMajor !== majorMap[majorFilter]) {
                match = false;
            }
        }

        if (match) {
            cell.style.filter = "grayscale(0%)";
        } else {
            cell.style.filter = "grayscale(100%)";
        }
    });
}
document.getElementById("sort-entry-select").addEventListener("change", filterSchedule);
document.getElementById("sort-major-select").addEventListener("change", filterSchedule);

// Show Examination
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
function showExamination() {
    fetch("/show_examination", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_type: "admin" }) 
    })
    .then(response => response.json())
    .then(data => {
        const exams = data.exams;
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
            "مهندسی کامپیوتر": "#AFF8DB",
            "مهندسی صنایع": "#FFFF9F",
            "مهندسی شیمی": "#CBEAFF",
            "مهندسی نفت": "#FFC1C1"
        };

        const examDays = getExamDates(startDate, endDate);

        examDays.forEach(({ day, date }) => {
            const dailyExams = exams.filter(e => e.date === date);

            let morningExams = dailyExams.filter(e => e.time === "09:00-11:00");
            let afternoonExams = dailyExams.filter(e => e.time === "13:30-15:30");

            morningExams = morningExams.concat(Array(8 - morningExams.length).fill(null));
            afternoonExams = afternoonExams.concat(Array(8 - afternoonExams.length).fill(null));

            for (let i = 0; i < 16; i++) {
                const row = document.createElement("tr");

                if (i === 0) {
                    row.innerHTML += `<td rowspan="16">${day}</td>`;
                    row.innerHTML += `<td rowspan="16">${date}</td>`;
                }

                const isMorning = i < 8;
                const time = isMorning ? "09:00-11:00" : "13:30-15:30";
                row.innerHTML += `<td>${time}</td>`;

                const exam = isMorning ? morningExams[i] : afternoonExams[i - 8];

                if (exam) {
                    const bg = colors[exam.major] || "#EEE";
                    row.dataset.group = exam.year;
                    row.dataset.major = exam.major;
                    row.classList.add("examination-cell");
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

        filterExamination();
    })
    .catch(error => {
        console.error("❌ خطا در دریافت برنامه امتحانات:", error);
    });
}
function filterExamination() {
    const groupFilter = document.getElementById("sort-exam-entry-select").value;
    const majorFilter = document.getElementById("sort-exam-major-select").value;

    const groupMap = {
        "exam-first": "ورودی اول",
        "exam-second": "ورودی دوم",
        "exam-third": "ورودی سوم",
        "exam-forth": "ورودی چهارم"
    };

    const majorMap = {
        "exam-computer": "مهندسی کامپیوتر",
        "exam-industrial": "مهندسی صنایع",
        "exam-chemical": "مهندسی شیمی",
        "exam-petroleum": "مهندسی نفت"
    };

    document.querySelectorAll(".examination-cell").forEach(row => {
        const rowGroup = row.dataset.group;
        const rowMajor = row.dataset.major;

        const matchGroup = (groupFilter === "exam-all-entry") || (rowGroup === groupMap[groupFilter]);
        const matchMajor = (majorFilter === "exam-all-major") || (rowMajor === majorMap[majorFilter]);

        const isMatch = matchGroup && matchMajor;

        const cells = row.querySelectorAll("td");
        cells.forEach((cell, index) => {
            if (index >= 1) {
                cell.style.filter = isMatch ? "grayscale(0%)" : "grayscale(100%)";
            } else {
                cell.style.filter = "none"; 
            }
        });
    });
}
document.getElementById("sort-exam-entry-select").addEventListener("change", filterExamination);
document.getElementById("sort-exam-major-select").addEventListener("change", filterExamination);

// Classification Management
function saveClassification() {
    let tableRows = document.querySelectorAll("#classification-chart-table tbody tr");
    let newRows = [];
    let updatedRows = [];

    tableRows.forEach(row => {
        const id = row.getAttribute("data-id");

        const subject = row.cells[6].innerText.trim();
        const professor = row.cells[5].innerText.trim();
        const className = row.cells[4].innerText.trim();
        const day = row.cells[3].innerText.trim();
        const start = row.cells[2].innerText.trim();
        const end = row.cells[1].innerText.trim();

        if (!subject || !professor || !className || !day || !start || !end) return;

        const item = { subject, professor, class: className, day, start, end };

        if (id) {
            const original = {
                subject: row.getAttribute("data-original-subject"),
                professor: row.getAttribute("data-original-professor"),
                class: row.getAttribute("data-original-class"),
                day: row.getAttribute("data-original-day"),
                start: row.getAttribute("data-original-start"),
                end: row.getAttribute("data-original-end"),
            };

            let changed = false;
            for (let key in original) {
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
    });

    if (newRows.length > 0) {
        fetch("/add_classification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: newRows })
        });
    }

    updatedRows.forEach(item => {
        fetch(`/update_classification/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });
    });

    alert("✅ اطلاعات در حال ذخیره‌سازی هستند.");
}
function loadClassification() {
    fetch("/load_classification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#classification-chart-table tbody');
        tableBody.innerHTML = ''; 

        data.forEach(classification => {
            const row = document.createElement('tr');
            row.setAttribute("data-id", classification.classificationId);
            row.setAttribute("data-original-subject", classification.classificationSubject);
            row.setAttribute("data-original-professor", classification.classificationProfessor);
            row.setAttribute("data-original-class", classification.classificationClass);
            row.setAttribute("data-original-day", classification.classificationDay);
            row.setAttribute("data-original-start", classification.classificationStart);
            row.setAttribute("data-original-end", classification.classificationEnd);

            row.innerHTML = `
                <td>
                    <button onclick="classificationEditRow(this)" title="اصلاح اطلاعات چارت درس">
                        <img src="../static/media/icons/edit.png" alt="ویرایش" width="24">
                    </button>
                    <button onclick="deleteClassification(this)" title="حذف سطر">
                    <img src="../static/media/icons/delete.png" alt="حذف" width="20">
                    </button>
                </td>
                <td>${classification.classificationEnd}</td>
                <td>${classification.classificationStart}</td>
                <td>${classification.classificationDay}</td>
                <td>${classification.classificationClass}</td>
                <td>${classification.classificationProfessor}</td>
                <td>${classification.classificationSubject}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('خطا در دریافت چارت کلاس بندی', error));
}
function sortClassification(sortBy) {
    const tbody = document.querySelector("#classification-chart-table tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const sortMap = {
        "day": 3,
        "class": 4,
        "professor": 5,
        "subject": 6
    };

    const colIndex = sortMap[sortBy];

    const daysOrder = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

    rows.sort((a, b) => {
        const valA = a.children[colIndex]?.textContent.trim() || "";
        const valB = b.children[colIndex]?.textContent.trim() || "";

        if (sortBy === "day") {
            const indexA = daysOrder.indexOf(valA);
            const indexB = daysOrder.indexOf(valB);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        }

        if (sortBy === "class") {
            const isNumA = !isNaN(parseInt(valA));
            const isNumB = !isNaN(parseInt(valB));

            if (isNumA && isNumB) {
                return parseInt(valA) - parseInt(valB);
            } else if (isNumA) {
                return -1; 
            } else if (isNumB) {
                return 1;  
            } else {
                return valA.localeCompare(valB, "fa");
            }
        }

        return valA.localeCompare(valB, "fa");
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}
function findClass() {
  const day = document.getElementById("target-day").value;
  const capacity = document.getElementById("target-capacity").value;

  fetch("/find_class", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ day: day, capacity: capacity })
  })
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector("#find-class-table tbody");
    tbody.innerHTML = "";

    data.forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.slots[2]}</td>
        <td>${item.slots[1]}</td>
        <td>${item.slots[0]}</td>
        <td>${day}</td>
        <td>${item.capacity}</td>
        <td>${item.class}</td>
      `;

      tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error("خطا در دریافت کلاس‌ها:", err);
  });
}
function deleteClassification(btn) {
    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (!id) {
        alert("شناسه در دسترس نیست.");
        return;
    }

    fetch(`/delete_classification/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            row.remove();
        } else {
            alert("❌ خطا در حذف ردیف دسته‌بندی");
        }
    })
    .catch(err => {
        console.error("⚠️ خطا در ارتباط با سرور:", err);
    });
}
document.getElementById('sort-classification-select').addEventListener('change', (event) => {
    const sortBy = event.target.value; 
    sortClassification(sortBy);
});

// Generate and Show Classification
function generateClassification() {
    fetch("/generate_classification", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("✅ موفقیت: " + data.message);
        loadClassification();
        showClassification();
      } else {
        alert("❌ خطا: " + data.message);
      }
    })
    .catch(error => alert("⚠️ مشکلی پیش آمد: " + error));
}
function showClassification() {
    fetch("/show_classification", { method: "POST", headers: { "Content-Type": "application/json" } })
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById("classification-table-body");
      tbody.innerHTML = "";
  
      const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"];
      const pad = n => n.toString().padStart(2, "0");
      const timeSlots = [];
  
      for (let i = 8; i < 18; i += 0.5) {
        const hour = Math.floor(i);
        const min = i % 1 === 0 ? "00" : "30";
        const endHour = min === "00" ? hour : hour + 1;
        const endMin = min === "00" ? "30" : "00";
        timeSlots.push(`${pad(hour)}:${min}-${pad(endHour)}:${endMin}`);
      }
  
      const classColors = {};
      const colors = [
        "#FFB3BA", 
        "#FFDFBA", 
        "#FFFFBA", 
        "#BAFFC9", 
        "#BAE1FF", 
        "#D7BAFF",
        "#E7BAFF", 
        "#FFBAED", 
        "#BAFFD9",
        "#FFF5BA"  
      ];
      let colorIndex = 0;
  
      days.forEach(day => {
        const dayItems = data.filter(item => item.day.trim() === day);
        if (dayItems.length === 0) return;
  
        const dayRows = [];
  
        dayItems.forEach(item => {
          const row = Array(timeSlots.length).fill("");
          const start = parseFloat(item.start);
          const end = parseFloat(item.end);
          const startIndex = Math.round((start - 8) * 2);
          const endIndex = Math.round((end - 8) * 2);
  
          let overlapFound = false;
          for (let existingRow of dayRows) {
            let canInsert = true;
            for (let i = startIndex; i < endIndex; i++) {
              if (existingRow[i] !== "") {
                canInsert = false;
                break;
              }
            }
            if (canInsert) {
              for (let i = startIndex; i < endIndex; i++) {
                existingRow[i] = { subject: item.subject, class: item.class };
              }
              overlapFound = true;
              break;
            }
          }
  
          if (!overlapFound) {
            const newRow = Array(timeSlots.length).fill("");
            for (let i = startIndex; i < endIndex; i++) {
              newRow[i] = { subject: item.subject, class: item.class };
            }
            dayRows.push(newRow);
          }
  
          if (!classColors[item.class]) {
            classColors[item.class] = colors[colorIndex % colors.length];
            colorIndex++;
          }
        });
  
        dayRows.forEach((rowData, rowIndex) => {
          const tr = document.createElement("tr");
  
          if (rowIndex === 0) {
            const dayCell = document.createElement("td");
            dayCell.textContent = day;
            dayCell.rowSpan = dayRows.length;
            tr.appendChild(dayCell);
          }
  
          for (let i = 0; i < rowData.length; i++) {
            if (rowData[i] === "") {
              const td = document.createElement("td");
              tr.appendChild(td);
              continue;
            }
          
            const item = rowData[i];
            let colspan = 1;
          
            while (i + colspan < rowData.length && JSON.stringify(rowData[i + colspan]) === JSON.stringify(item)) {
              colspan++;
            }
          
            for (let j = 0; j < colspan; j++) {
              const td = document.createElement("td");
          
              if (j === 0) {
                td.innerHTML = `<strong>${item.subject}</strong><br><small>${item.class}</small>`;
                td.style.backgroundColor = classColors[item.class];
                td.classList.add("class-block");
                td.id = `cell-${day}-${rowIndex}-${i}`;
                td.setAttribute("colspan", colspan);
              } else {
                td.style.display = "none";
              }
          
              tr.appendChild(td);
            }
          
            i += colspan - 1;  
          }
  
          tbody.appendChild(tr);
        });
  
        classificationDragAndDrop();
        attachDragDropHandlers();
      });
    })
    .catch(error => {
      console.error("❌ خطا در دریافت چارت کلاس‌ها:", error);
    });
}

// Classification Drag And Drop
function classificationDragAndDrop() {
    document.querySelectorAll(".class-block").forEach(cell => {
      cell.draggable = false;
    });
  
    document.querySelectorAll(".class-block").forEach(cell => {
      if ((cell.colSpan || 1) > 1) {
        cell.addEventListener("click", () => {
          document.querySelectorAll(".class-block").forEach(c => c.draggable = false);
          cell.draggable = true;
          cell.ondragstart = dragClass;
        });
      }
    });
}
function dragClass(event) {
    const cell = event.target;
    if (!cell.id) {
      cell.id = `cell-${Math.random().toString(36).substring(2, 9)}`;
    }
    event.dataTransfer.setData("subject", cell.dataset.subject || cell.querySelector("strong")?.textContent || "");
    event.dataTransfer.setData("class", cell.dataset.class || cell.querySelector("small")?.textContent || "");
    event.dataTransfer.setData("colspan", cell.colSpan || 1);
    event.dataTransfer.setData("bgColor", cell.style.backgroundColor || "");
    event.dataTransfer.setData("oldId", cell.id);
}
function allowDrop(event) {
    event.preventDefault();
}
function dropClass(event) {
    event.preventDefault();
  
    let targetCell = event.target.closest("td");
    if (!targetCell) return;
    if (targetCell.innerHTML.trim() !== "" || targetCell.style.display === "none") return;
  
    const subject = event.dataTransfer.getData("subject");
    const className = event.dataTransfer.getData("class");
    const colspan = parseInt(event.dataTransfer.getData("colspan"));
    const bgColor = event.dataTransfer.getData("bgColor");
    const oldId = event.dataTransfer.getData("oldId");
  
    const targetRow = targetCell.parentElement;
    const targetCells = Array.from(targetRow.children);
    const targetIndex = targetCells.indexOf(targetCell);
  
    if (targetIndex + colspan > targetCells.length) return;
  
    const mergeCells = targetCells.slice(targetIndex, targetIndex + colspan);
    if (mergeCells.some(cell => cell.innerHTML.trim() !== "" || cell.style.display === "none")) return;
  
    let oldCell = document.getElementById(oldId);
    if (oldCell) {
        let oldColspan = parseInt(oldCell.getAttribute("colspan")) || 1;
        const oldRow = oldCell.parentElement;
        const oldCells = Array.from(oldRow.children);
        const oldIndex = oldCells.indexOf(oldCell);
      
        oldCell.removeAttribute("colspan");
        oldCell.innerHTML = "";
        oldCell.style.backgroundColor = "";
        oldCell.dataset.subject = "";
        oldCell.dataset.class = "";
        oldCell.style.display = "table-cell";
        oldCell.draggable = false;
        oldCell.classList.remove("class-block");
        oldCell.classList.add("empty-cell");
      
        for (let i = 1; i < oldColspan; i++) {
          const after = oldCells[oldIndex + i];
          if (after) {
            after.style.display = "table-cell";
            after.innerHTML = "";
            after.style.backgroundColor = "";
            after.dataset.subject = "";
            after.dataset.class = "";
            after.classList.remove("class-block");
            after.classList.add("empty-cell");
            after.draggable = false;
          } else {
            const td = document.createElement("td");
            td.classList.add("empty-cell");
            td.style.display = "table-cell";
            td.draggable = false;
            oldRow.insertBefore(td, oldRow.children[oldIndex + i] || null);
          }
        }
    }
  
    mergeCells.forEach((cell, index) => {
      if (index === 0) {
        cell.innerHTML = `<strong>${subject}</strong><br><small>${className}</small>`;
        cell.style.backgroundColor = bgColor;
        cell.colSpan = colspan;
        cell.dataset.subject = subject;
        cell.dataset.class = className;
        cell.classList.add("class-block");
        cell.id = `cell-${Math.random().toString(36).substring(2, 9)}`;
        cell.draggable = false;
      } else {
        cell.innerHTML = "";
        cell.style.display = "none";
      }
    });
  
    classificationDragAndDrop(); 
}
function attachDragDropHandlers() {
    document.querySelectorAll("td").forEach(cell => {
      cell.ondragover = allowDrop;
      cell.ondrop = dropClass;
    });
}

// Deletion And Edition
function deleteRow(button) {
    let row = button.closest("tr");
    row.remove();
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
function studentEditRow(button) {
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
function classEditRow(button) {
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
function removeFaculty(button, proNumber) {
    fetch(`/remove_faculty/${proNumber}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('نقش مدیر گروه با موفقیت حذف شد.');
            let row = button.closest("tr");
            row.remove();
        } else {
            alert('خطا در حذف نقش مدیر گروه');
        }
    })
    .catch(error => {
        console.error('خطا در ارسال درخواست:', error);
    });
}

window.onload = function () {
    switchTab('information');
    loadAllCourses();
    loadAllProfessors();
    loadAllStudents();
    loadAdminContacts();
    loadFaculty();
    loadClasses();
    showSchedule();
    showExamination();
    loadClassification();
    showClassification();
    loadConflicts();
};
