// File: js/app.js
// Student: arwa awwad (12442120)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
  API ENDPOINTS (already implemented on the server):

  Base URL:
    https://portal.almasar101.com/assignment/api

  1) Add task  (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }

  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY

  3) Delete task (GET)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
*/

// Configuration
const STUDENT_ID = "12442120";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// DOM elements
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

// Show status message
function setStatus(message, isError = false) {
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#ff4d4f" :"gray";
}

// Load tasks when page loads
document.addEventListener("DOMContentLoaded", function () {
  setStatus("Loading tasks...");
  fetch(API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      list.innerHTML = "";
      if (data.tasks) {
        data.tasks.forEach(function (task) {
          renderTask(task);
        });
        setStatus("");
      } else {
        setStatus("No tasks found");
      }
    })
    .catch(function () {
      setStatus("Error loading tasks", true);
    });
});

// Add new task
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = input.value.trim();
    if (title === "") return;

    setStatus("Adding task...");

    fetch(API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.task) {
          renderTask(data.task);
          input.value = "";
          setStatus("Task added");
        } else {
          setStatus("Error adding task", true);
        }
      })
      .catch(function () {
        setStatus("Error adding task", true);
      });
  });
}

// Render task with delete button
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.textContent = task.title;

  const btn = document.createElement("button");
  btn.textContent = "Delete";
  btn.style.backgroundColor = "#ff4d4f"  ;
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "6px";  // 
  btn.style.padding = "7px 10px";
  btn.style.cursor = "pointer";

  btn.addEventListener("click", function () {
    if (!confirm("Delete this task?")) return;

    fetch(
      API_BASE +
        "/delete.php?stdid=" +
        STUDENT_ID +
        "&key=" +
        API_KEY +
        "&id=" +
        task.id
    )
      .then(function () {
        li.remove();
        setStatus("Task deleted");
      })
      .catch(function () {
        setStatus("Error deleting task", true);
      });
  });

  li.appendChild(span);
  li.appendChild(btn);
  list.appendChild(li);
}