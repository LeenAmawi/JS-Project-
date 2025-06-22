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
function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    renderTasks(currentFilter);
  }
}
function renameTask(id) {
  actionType = "rename";
  renameId = id;
showConfirmBox("Enter a new name (at least 5 characters):", true);
}
function confirmDelete(id) {
  actionType = "deleteSingle";
  deleteId = id;
  showConfirmBox("Are you sure you want to delete this task?", false);
}
document.querySelectorAll(".btnRed .btn")[0].addEventListener("click", () => {
  actionType = "deleteDone";
  showConfirmBox("Do you want to delete the completed tasks?", false);
});
document.querySelectorAll(".btnRed .btn")[1].addEventListener("click", () => {
  actionType = "deleteAll";
  showConfirmBox("Do you want to delete all tasks?", false);
});
function showConfirmBox(message, isRename) {
  const box = document.getElementById("confirmBox");
  box.style.display = "flex";

  const p = box.querySelector("p");
  p.textContent = message;

  const inputRename = box.querySelector("#renameInput");
  if (isRename) {
    inputRename.style.display = "block";
    inputRename.value = tasks.find(t => t.id === renameId)?.name || "";
    inputRename.focus();
  } else {
    inputRename.style.display = "none";
    inputRename.value = "";
  }
}
document.getElementById("confirmYes").addEventListener("click", function () {
  if (actionType === "rename") {
    const newName = document.getElementById("renameInput").value.trim();
    if (newName.length < 5) {
      alert("The name must be at least 5 characters long.");
      return;
    }
 const task = tasks.find(t => t.id === renameId);
    if (task) task.name = newName;
    renameId = null;
  } else if (actionType === "deleteSingle") {
    tasks = tasks.filter(t => t.id !== deleteId);
    deleteId = null;
  } else if (actionType === "deleteDone") {
    tasks = tasks.filter(t => !t.done);
  } else if (actionType === "deleteAll") {
    tasks = [];
  }

