
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

    if (tabName === 'charts') {
        showSection('side_schedule');
    } else if (tabName === 'conflicts') {
        showSection('side_confliction');
    } else if (tabName === 'communication') {
        showSection('side_changes');
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
  
    if (id === 'side_schedule' || id === 'side_examination') {
      tabSwitch('charts');
      tabName = 'charts';
    } else if (id === 'side_confliction') {
      tabSwitch('conflicts');
      tabName = 'conflicts';
    } else if (id === 'side_changes' || id === 'side_messages') {
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
document.addEventListener("DOMContentLoaded", function () {
    showSection('side_schedule'); 
});

// Show Charts
function renderScheduleTable() {
    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"];
    const groups = ["ورودی اول", "ورودی دوم", "ورودی سوم", "ورودی چهارم"];
    const pad = n => n.toString().padStart(2, "0");
  
    const tbody = document.getElementById("schedule-body");
    tbody.innerHTML = ""; // پاکسازی
  
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
    fetch("/show_schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            student_name: studentName,
            user_type: "student"
        })  
    })
    .then(response => response.json())
    .then(data => {        
        const hasInvalidData = data.some(item => !item.day || item.day === null || item.day.trim() === "");

        if (data.length === 0 || hasInvalidData) {
            const tableBody = document.querySelector('#schedule-table tbody');
            tableBody.innerHTML = ''; 
            document.getElementById("empty-schedule-table").style.display = "block";

            document.querySelectorAll(".time-block").forEach(cell => {
                cell.innerHTML = "";
                cell.style.backgroundColor = "#fff";
                cell.removeAttribute("colspan");
                cell.dataset.subject = "";
                cell.dataset.professor = "";
                cell.dataset.merged = "false";
                cell.style.display = "table-cell";
            });

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

        data.forEach((item, index) => {  
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
        });
    })
    .catch(error => {
        console.error("❌ خطا در ارتباط با سرور:", error);
    });
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
function showExamination() {
    fetch("/show_examination", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            student_name: studentName,
            user_type: "student"
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
    deleteButton.innerHTML = '<img src="{% static "media/icons/delete.png" %}" alt="حذف" width="20">';
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
            conflictReporter: studentName
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
                        <img src="{% static 'media/icons/delete.png' %}" alt="حذف" width="20">
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
            alert("❌ خطا در حذف تداخل");
        }
    })
    .catch(err => {
        console.error("خطا در ارتباط با سرور:", err);
    });
}

// Deletion
function deleteRow(button) {
    let row = button.closest("tr");
    row.remove();
}

// Recently Changes
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
    
                messageDiv.appendChild(messageContent);
                messageDiv.appendChild(messageInfo);
                container.appendChild(messageDiv);
            });
        });
}

// Messages Management
let currentReceiver = null;
function loadStudentContacts() {
    fetch("/load_student_contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            student_name: studentName,
            user_type: 'student'
        })
    })
    .then(res => res.json())
    .then(contacts => {
        const container = document.getElementById("contacts-list");
        container.innerHTML = ""; 

        contacts.forEach(contact => {
            const lastSender = contact.last_message.split(":")[0];
            const contactKey = `seen_${contact.name}`;
            const isSeen = localStorage.getItem(contactKey) === contact.last_message;

            const box = document.createElement("div");
            box.classList.add("message-box");

            box.innerHTML = `
                <div class="message-title">
                    ${contact.name}
                    ${!isSeen ? `<span class="unread-badge">${getUnreadText(contact.name)}</span>` : ""}
                </div>
                <p>${contact.last_message}</p>
            `;

            box.addEventListener("click", () => {
                localStorage.setItem(contactKey, contact.last_message);

                document.getElementById("side_public").style.display = "none";
                document.getElementById("side_private").style.display = "none";

                if (contact.name === 'چت روم') {
                    document.getElementById("publicChatContainer").style.display = "block";
                    document.getElementById("privateChatContainer").style.display = "none";
                    document.querySelector("#publicChatContainer .chat-header").innerText = `چت دانشجویی`;
                    openPublicChat("چت دانشجویی");
                } else {
                    document.getElementById("privateChatContainer").style.display = "block";
                    document.getElementById("publicChatContainer").style.display = "none";
                    document.querySelector("#privateChatContainer .chat-header").innerText = `چت با ${contact.name}`;
                    document.getElementById("messageInputPrivate").dataset.receiver = contact.name;
                    openPrivateChat(contact.name);
                }

                loadStudentContacts(); 
            });

            container.appendChild(box);
        });
    });
}
function getUnreadText(name) {
    return "پیام جدید"; 
}
function openPublicChat(receiverName) {
    document.getElementById("side_private").style.display = "none";
    document.getElementById("side_public").style.display = "block";
  
    document.querySelector(".chat-header").innerText = `${receiverName}`;
    document.getElementById("messageInputPublic").dataset.receiver = receiverName;
  
    currentReceiver = receiverName;

    getPublicMessages(receiverName); 
}
function openPrivateChat(receiverName) {
    document.getElementById("side_private").style.display = "block";
    document.getElementById("side_public").style.display = "none";
  
    document.querySelector(".chat-header").innerText = `چت با ${receiverName}`;
    document.getElementById("messageInputPrivate").dataset.receiver = receiverName;
  
    currentReceiver = receiverName;

    getPrivateMessages(receiverName); 
}
function sendPublicMessage() {
    let messageInput = document.getElementById("messageInputPublic");
    let chatBox = document.getElementById("public");
    let messageText = messageInput.value.trim();

    if (messageText === "") return;

    let timeStamp = new Date();
    let formattedTime = timeStamp.getHours().toString().padStart(2, "0") + ":" + timeStamp.getMinutes().toString().padStart(2, "0");
    let formattedDate = timeStamp.getFullYear() + "-" + (timeStamp.getMonth() + 1).toString().padStart(2, "0") + "-" + timeStamp.getDate().toString().padStart(2, "0");

    let sender = studentName || "کاربر ناشناس";

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user-message");

    let messageContent = document.createElement("span");
    messageContent.textContent = messageText;

    let messageInfo = document.createElement("div");
    messageInfo.classList.add("message-info");
    messageInfo.textContent = `👤 ${sender}  | 🕒 ${formattedTime}  | 📅 ${formattedDate}`;

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<img src="{% static 'media/icons/delete.png' %}" alt="حذف" width="16" height="16">`;
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = function () {
        chatBox.removeChild(messageDiv);
    };

    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(deleteBtn);
    messageDiv.appendChild(messageInfo);

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    fetch("/send_public_message", {
        method: "POST",
        body: JSON.stringify({
            message: messageText,
            sender: sender,
            getter: "چت روم",
            type: "public"
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
    loadStudentContacts();
}
function getPublicMessages() {
    fetch("/get_public_messages")
        .then(response => response.json())
        .then(messages => {
            let chatBox = document.getElementById("public");
            chatBox.innerHTML = "";

            messages.forEach(msg => {
                let messageDiv = document.createElement("div");
                messageDiv.classList.add("message", "user-message");

                let messageContent = document.createElement("span");
                messageContent.textContent = msg.message;

                let messageInfo = document.createElement("div");
                messageInfo.classList.add("message-info");
                messageInfo.textContent = `👤 ${msg.sender}  | 🕒 ${msg.time}  | 📅 ${msg.date}`;

                if (msg.sender != studentName){
                    messageDiv.classList.add("contact-message");
                }

                let deleteBtn = null;
                if (msg.sender === studentName) {
                    deleteBtn = document.createElement("button");
                    deleteBtn.innerHTML = `<img src="{% static 'media/icons/delete.png' %}" alt="حذف" width="16" height="16">`;
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
                if (deleteBtn) {
                    messageDiv.appendChild(deleteBtn);
                }
                messageDiv.appendChild(messageInfo);

                chatBox.appendChild(messageDiv);
            });

            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
            console.error("خطا در دریافت پیام‌ها:", error);
        });
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

    let sender = studentName || "کاربر ناشناس";

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user-message");

    let messageContent = document.createElement("span");
    messageContent.textContent = messageText;

    let messageInfo = document.createElement("div");
    messageInfo.classList.add("message-info");
    messageInfo.textContent = `👤 ${sender}  | 🕒 ${formattedTime}  | 📅 ${formattedDate}`;

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<img src="{% static 'media/icons/delete.png' %}" alt="حذف" width="16" height="16">`;
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
            console.log(data);
            if (!data.success) {
                alert("خطا در ذخیره پیام‌ها: " + data.error);
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
    loadStudentContacts();
}
function getPrivateMessages(receiverName) {
    fetch("/get_private_messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sender: studentName,   
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

            if (msg.sender !== studentName) {
                messageDiv.classList.add("contact-message");
            }

            let deleteBtn = null;
            if (msg.sender === studentName) {
                deleteBtn = document.createElement("button");
                deleteBtn.innerHTML = `<img src="{% static 'media/icons/delete.png' %}" alt="حذف" width="16" height="16">`;
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

window.onload = function () {
    switchTab('charts');
    showSchedule();
    showExamination();
    loadConflicts();
    loadChanges();
    loadStudentContacts();
};
