const express = require("express");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
const usersRoutes = require("./routes/api/users-routes");
const authRoutes = require("./routes/api/auth-routes");
const profilesRoutes = require("./routes/api/profile-routes");
const postsRoutes = require("./routes/api/posts-routes");
const HttpError = require("./util/error-model");

const app = express();

// connect db
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

//
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// define routes
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profilesRoutes);
app.use("/api/posts", postsRoutes);

app.get("/", (req, res) => res.send("API is running..."));

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.listen(PORT, () => console.log(`This app started on port ${PORT}`));
