const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");

let editId;
let isEditedTask = false;

let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      if (filter === todo.status || filter === "all") {
        li += `<li class="task">
                <label for="${id}">
                  <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}/>
                  <p class="${completed}">${todo.name}</p>
                </label>
                <div class="settings">
                  <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                  <ul class="task-menu">
                    <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
                    <li onclick="deleteTask(${id}, "${filter}")"><i class="fa-solid fa-trash"></i>Delete</li>
                  </ul>
                </div>
              </li>`;
      }
    });
  }
  taskBox.innerHTML = li || `<span>You don't have any tasks here<span>`;
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length
    ? clearAll.classList.remove("active")
    : clearAll.classList.add("active");
  taskBox.offsetHeight >= 300
    ? taskBox.classList.add("overflow")
    : taskBox.classList.remove("overflow");
}
showTodo("all");

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

function deleteTask(deletedId, filter) {
  isEditedTask = false;
  todos.splice(deletedId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

clearAll.addEventListener("click", () => {
  isEditedTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (event) => {
    if (event.target.tagName != "I" || event.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (event) => {
  let userTask = taskInput.value.trim();
  if (event.key == "Enter" && userTask) {
    if (!isEditedTask) {
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
});
