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