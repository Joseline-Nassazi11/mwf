let currentFilter = "all";

async function loadTasks() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks;
  if (currentFilter === "active") {
    filtered = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = tasks.filter((t) => t.completed);
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      ${task.text}
      <div class="task-actions">
        <button class="complete" onclick="toggleComplete('${task._id}')">
          ${task.completed ? "Undo" : "Done"}
        </button>
        <button class="delete" onclick="deleteTask('${
          task._id
        }')">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });

  highlightActiveFilter();
}

function setFilter(filter) {
  currentFilter = filter;
  loadTasks();
}

function highlightActiveFilter() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase() === currentFilter) {
      btn.classList.add("active");
    }
  });
}
