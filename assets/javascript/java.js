let tasks = [];
let currentFilter = "all";
let deleteId = null;
let actionType = null;
let renameId = null;

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  saveTask();
});