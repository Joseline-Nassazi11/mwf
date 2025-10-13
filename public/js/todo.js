let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  // Highlight the 'All' button on load
  document.querySelector(".filter-btn").classList.add("active");
});

//  Core Task Management Functions 

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (text !== "") {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false,
      timestamp: new Date().toLocaleString(),
    };
    tasks.push(newTask);
    input.value = ""; // Clear input
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleCompletion(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

//  Rendering and Filtering 

function setFilter(filter) {
  currentFilter = filter;

  // Update active button styling
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .querySelector(`.filters button[onclick="setFilter('${filter}')"]`)
    .classList.add("active");

  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear the current list

  const filteredTasks = tasks
    .filter((task) => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true; // 'all'
    })
    .sort((a, b) => b.id - a.id); // Sort newest first

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li class="empty-message">No tasks found for the '${currentFilter}' view.</li>`;
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" 
                       id="task-${task.id}" 
                       ${task.completed ? "checked" : ""} 
                       onclick="toggleCompletion(${task.id})">
                <label for="task-${task.id}" class="task-text">${
      task.text
    }</label>
                <span class="task-timestamp">Created: ${
                  task.timestamp.split(",")[0]
                }</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="bi bi-x-lg"></i>
            </button>
        `;
    taskList.appendChild(li);
  });
}
