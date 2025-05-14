const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { randomUUID } = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

function getRandomColor() {
    const colors = ["red", "blue", "green", "purple", "orange", "teal", "pink"];
    return colors[Math.floor(Math.random() * colors.length)];
}

io.on("connection", (socket) => {
    console.log("🟢 A user connected");

    // Give the user a random username and color
    const user = {
        id: randomUUID(),
        name: "Guest" + Math.floor(Math.random() * 1000),
        color: getRandomColor(),
        avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=Guest${Math.floor(
            Math.random() * 1000
        )}`,
    };

    user.avatar = `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.name}`;

    socket.emit("user info", user);

    socket.on("chat message", (msg) => {
        if (!msg || typeof msg !== "string") return; // prevent empty messages

        io.emit("chat message", {
            user: user?.name || "Guest",
            color: user?.color || "#888",
            avatar:
                user?.avatar ||
                "https://api.dicebear.com/7.x/thumbs/svg?seed=Guest",
            text: msg,
            timestamp: new Date().toLocaleTimeString(),
        });
    });

    socket.on("disconnect", () => {
        console.log("🔴 A user disconnected");
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
