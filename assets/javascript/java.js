let tasks = [];
let currentFilter = "all";
let deleteId = null;
let actionType = null;
let renameId = null;

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();
  currentFilter = "all";  
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
      oldMsg.textContent = "Write at least 5 characters.";
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

    row.innerHTML = `
      <td colspan="3" style="display: flex; justify-content: space-between; align-items: center; padding: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <input type="checkbox" onchange="toggleDone(${task.id})" ${checked}>
          <span class="${lineClass}">${task.name}</span>
        </div>
        <div style="display: flex; gap: 10px;">
          <i class="fa-solid fa-pen" onclick="renameTask(${task.id})" 
          title="Edit" style="color: orange; cursor: pointer;"></i>
          <i class="fa-solid fa-trash" onclick="confirmDelete(${task.id})"
           title="Delete" style="color: red; cursor: pointer;"></i>
        </div>
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
  showConfirmBox("Do you want to delete all done tasks?", false);
});

document.querySelectorAll(".btnRed .btn")[1].addEventListener("click", () => {
  actionType = "deleteAll";
  showConfirmBox("Do you want to delete all tasks?", false);
});

function showConfirmBox(message, isRename) {
  const box = document.getElementById("confirmBox");
  box.style.display = "flex";

  document.getElementById("confirmMessage").textContent = message;
  const input = document.getElementById("renameInput");

  if (isRename) {
    input.style.display = "block";
    input.value = tasks.find(t => t.id === renameId)?.name || "";
    input.focus();
  } else {
    input.style.display = "none";
    input.value = "";
  }
}

document.getElementById("confirmYes").addEventListener("click", function () {
  if (actionType === "rename") {
    const newName = document.getElementById("renameInput").value.trim();
    if (newName.length < 5) {
      alert("The name must be at least 5 characters.");
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

  actionType = null;
  document.getElementById("confirmBox").style.display = "none";
  renderTasks(currentFilter);
});

document.getElementById("confirmNo").addEventListener("click", function () {
  actionType = null;
  deleteId = null;
  renameId = null;
  document.getElementById("confirmBox").style.display = "none";
});

const filterButtons = document.querySelectorAll(".grid button");
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.textContent.trim().toLowerCase();
    if (["all", "done", "todo"].includes(text)) {
      currentFilter = text;
      renderTasks(currentFilter);
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    }
  });
});

renderTasks();
