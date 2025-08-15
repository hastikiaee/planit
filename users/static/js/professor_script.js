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
    } else if (tabName === 'availability') {
        showSection('side_availability');
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
    } else if (id === 'side_availability') {
      tabSwitch('availability');
      tabName = 'availability';
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

// Availability Management
function getProfessor() {
    const tbody = document.querySelector("#availability-table tbody");
    tbody.innerHTML = "";   

    document.getElementById("empty-availability-table").style.display = "none";

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <button onclick="duplicateRow(this)" title="افزودن زمان آزاد جدید">
                <img src="../static/media/icons/add.png" alt="اضافه" width="20">
            </button>
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
        <td class="pronumber">${professorNumber}</td>
        <td class="profname">${professorName}</td>
    `;

    tbody.appendChild(row);
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
            user_type: 'professor'
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
        });
    })
    .catch(error => {
        console.error("خطا در دریافت اطلاعات:", error);
    });
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

// Messages Management
let currentReceiver = null;
function loadProfessorContacts() {
    fetch("/load_professor_contacts", {
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
                localStorage.setItem(contactKey, contact.last_message);
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
            btn.textContent = 'پیام دادن به استاد';
            btn.classList.add('professor-add-btn');

            btn.onclick = (e) => {
                e.stopPropagation();
                suggestionsList.innerHTML = '';
                document.getElementById('professor-search-input').value = '';

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
    loadProfessorContacts();
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
            professor_name: professorName,
            user_type: "professor"
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
            professor_name: professorName,
            user_type: "professor"
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

// Deletion And Edition
function deleteRow(button) {
    let row = button.closest("tr");
    row.remove();
}
function duplicateRow(button) {
    const currentRow = button.closest("tr");
    const newRow = currentRow.cloneNode(true); 
    currentRow.parentNode.insertBefore(newRow, currentRow.nextSibling);
}

// Loading
window.onload = function () {
  switchTab('charts');
  loadChanges();
  loadProfessorContacts();
  fetch('/check_availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ professor_name: professorName })
  })
  .then(response => response.json())
  .then(data => {
    if (data.isEmpty) {
      getProfessor();       
    } else {
      loadAvailability();    
    }
  })
  .catch(error => {
    console.error("خطا در بررسی availability:", error);
    getProfessor(); 
  });
  showSchedule();
  showExamination();
};
