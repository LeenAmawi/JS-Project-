let tasks = [];
let currentFilter = "all";
let deleteId = null;
let actionType = null;
let renameId = null;

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  saveTask();
});
function saveTask() {
const input = document.getElementById("txtItem");
const value = input.value.trim();
let oldMsg = document.getElementById("errorMsg");
if (value.length < 5) {
if (!oldMsg) {
  oldMsg = document.createElement("div");
oldMsg.id = "errorMsg";
oldMsg.textContent = "Please enter at least 5 characters.";
oldMsg.style.color = "red";
oldMsg.style.marginTop = "5px";
oldMsg.style.fontSize = "14px";
const parent = input.closest(".flex") || input.parentNode;
parent.appendChild(oldMsg);
    }
    return;
  }

  if (oldMsg) oldMsg.remove();
  tasks.push({ name: value, done: false, id: Date.now() });
  input.value = "";
  renderTasks(currentFilter);
}
function renderTasks(filter = "all") {
  const tbody = document.getElementById("taskList");
  tbody.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "done") filteredTasks = tasks.filter(t => t.done);
  else if (filter === "todo") filteredTasks = tasks.filter(t => !t.done);
  filteredTasks.forEach(task => {
    const checked = task.done ? "checked" : "";
    const lineClass = task.done ? "line-through" : "";

    const row = document.createElement("tr");
        row.style.border = "1px solid #ccc";
        row.style.borderRadius = "6px";
    row.style.backgroundColor = "#fff";
    row.innerHTML = `
      <td style="width: 5%; text-align: center; vertical-align: middle;">
        <input type="checkbox" onchange="toggleDone(${task.id})" ${checked} style="cursor: pointer;">
      </td>
      <td class="${lineClass}" style="width: 75%; padding: 8px; vertical-align: middle;">
        ${task.name}
      </td>
      <td class="actions" style="width: 20%; text-align: right; vertical-align: middle; display: flex; align-items: center; gap: 10px;">
        <i class="fa-solid fa-pen" onclick="renameTask(${task.id})" title="edit"
        <i class="fa-solid fa-trash" onclick="confirmDelete(${task.id})" title="delete" style="color: red; cursor: pointer; font-size: 18px;"></i>
      </td>
    `;
    tbody.appendChild(row);
  });
}

