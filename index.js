const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { join } = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public folder
app.use(express.static(join(__dirname, "public")));

let tasks = [];
let connectedUsers = 0;

io.on("connection", (socket) => {
    connectedUsers++;
    io.emit("userCount", connectedUsers);

    // Send the current tasks to the newly connected user
    socket.emit("updateTasks", tasks);

    socket.on("addTask", (task) => {
        tasks.push({ id: Date.now(), text: task, completed: false });
        io.emit("updateTasks", tasks);
    });

    socket.on("deleteTask", (taskId) => {
        tasks = tasks.filter((task) => task.id !== taskId);
        io.emit("updateTasks", tasks);
    });

    // Listen for marking tasks as completed
    socket.on("toggleComplete", (taskId) => {
        tasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        io.emit("updateTasks", tasks);
});

    socket.on("disconnect", () => {
        connectedUsers--;
        io.emit("userCount", connectedUsers); // Update user count
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
