// let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// renderTasks();

// function addTask() {
//   const input = document.getElementById("taskInput");
//   const taskText = input.value.trim();

//   if (taskText === "") return alert("Please enter a task!");

//   tasks.push({ text: taskText, completed: false });
//   localStorage.setItem("tasks", JSON.stringify(tasks));
//   input.value = "";
//   renderTasks();
// }

// function renderTasks() {
//   const list = document.getElementById("taskList");
//   list.innerHTML = "";

//   tasks.forEach((task, index) => {
//     const li = document.createElement("li");
//     li.className = task.completed ? "completed" : "";

//     li.innerHTML = `
//       ${task.text}
//       <div class="task-actions">
//         <button class="complete" onclick="toggleComplete(${index})">
//           ${task.completed ? "Undo" : "Done"}
//         </button>
//         <button class="delete" onclick="deleteTask(${index})">Delete</button>
//       </div>
//     `;

//     list.appendChild(li);
//   });
// }

// function toggleComplete(index) {
//   tasks[index].completed = !tasks[index].completed;
//   localStorage.setItem("tasks", JSON.stringify(tasks));
//   renderTasks();
// }

// function deleteTask(index) {
//   tasks.splice(index, 1);
//   localStorage.setItem("tasks", JSON.stringify(tasks));
//   renderTasks();
// }

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
