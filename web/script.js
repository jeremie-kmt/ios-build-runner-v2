let tasks = [];
let currentFilter = "all";

async function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  render();
}

function render() {
  const list = document.getElementById("task-list");
  const filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });
  list.innerHTML = filtered
    .map(
      (t) => `
    <li class="task-item ${t.done ? "done" : ""}" data-id="${t._id || t.id}">
      <div class="task-check" onclick="toggleTask('${t._id || t.id}')">${t.done ? "✓" : ""}</div>
      <span class="task-text">${t.text}</span>
      <span class="priority-dot ${t.priority}"></span>
      <button class="task-delete" onclick="deleteTask('${t._id || t.id}')">×</button>
    </li>
  `,
    )
    .join("");
  const active = tasks.filter((t) => !t.done).length;
  document.getElementById("count").textContent = active + " tache(s) restante(s)";
}
function saveLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
async function toggleTask(id) {
  const t = tasks.find((t) => t.id === id);
  if (t) {
    t.done = !t.done;
    saveLocal();
    render();
  }
}

async function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveLocal();
  render();
}

document.getElementById("add-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("task-input");
  const priority = document.getElementById("priority").value;

  tasks.unshift({ id: Date.now().toString(), text: input.value, done: false, priority });
  input.value = "";
  saveLocal();
  render();
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

document.getElementById("clear-done").addEventListener("click", async () => {
  tasks = tasks.filter((t) => !t.done);
  saveLocal();
  render();
});

loadTasks();
