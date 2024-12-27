const socket = io();

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const tasksList = document.getElementById("tasks");
const userCount = document.getElementById("userCount");

// Listen for user count updates
socket.on("userCount", (count) => {
    userCount.textContent = `Connected Users: ${count}`;
});

// Listen for task updates
socket.on("updateTasks", (tasks) => {
    tasksList.innerHTML = "";
    tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        if (task.completed) taskText.classList.add("completed");

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "actions";

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.className = "complete";
        completeButton.onclick = () => socket.emit("toggleComplete", task.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
        deleteButton.onclick = () => socket.emit("deleteTask", task.id);

        actionsDiv.appendChild(completeButton);
        actionsDiv.appendChild(deleteButton);

        taskItem.appendChild(taskText);
        taskItem.appendChild(actionsDiv);
        tasksList.appendChild(taskItem);
    });
});

// Add task form submission
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
        socket.emit("addTask", taskText);
        taskInput.value = "";
    }
});
