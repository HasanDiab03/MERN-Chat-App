const express = require("express");
const app = express();
const colors = require("colors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("./config/db")(); // connect to db
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const path = require("path");
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

// ---------------- Deployment -----------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running Successfully");
  });
}

// ---------------- Deployment ----------------
app.use(notFound);
app.use(errorHandler);
const server = app.listen(
  port,
  console.log(`App is listening on port ${port}...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
}); // ping timeout is used to automatically close the connection after a certain time if the connection is not being used to save bandwidth

io.on("connection", (socket) => {
  // console.log(socket);
  // console.log(`connected to socket.io`.italic);
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  }); // to connect the users to their own rooms, so we can send them messages.

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  }); // set up socket for joining rooms

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat; // to know to which room this message belongs to (since the room is basically the chat id)
    if (!chat.users) {
      return console.log(`chat.users is not defined`);
    }
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
