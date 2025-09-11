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

// uploads image
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
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
