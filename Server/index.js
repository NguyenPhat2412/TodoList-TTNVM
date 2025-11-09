require("dotenv").config();
const allowedOrigins = process.env.LOCALHOST.split(",");
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Array users
let users = {};
const io = require("socket.io")(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import routes
const clientRoutes = require("./routes/client/todo");
app.use("/api", clientRoutes);

// admin routes
const adminRoutes = require("./routes/admin/admin");
app.use("/api/admin", adminRoutes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// set up socket.io admin connect for real-time online users.
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.emit("welcome", { message: "Welcome to the Socket.io server!" });

  // client send userId after connect
  socket.on("register", (userId) => {
    console.log("User registered with ID:", socket.id);

    socket.data.userId = userId;
    users[socket.id] = userId;

    io.emit("users_status", { status: "online", userId });
  });
  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (userId) {
      console.log("User disconnected:", socket.id);
      delete users[socket.id];
      io.emit("users_status", {
        status: "offline",
        userId,
      });
    }
  });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
