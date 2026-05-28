const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// ===== ENVIRONMENT CHECK =====
const NODE_ENV = process.env.NODE_ENV || "development";

// JWT Secret fallback for development only
if (!process.env.JWT_SECRET) {
  if (NODE_ENV === "development") {
    console.warn(
      "⚠ JWT_SECRET not found. Using temporary development secret.".yellow
    );

    process.env.JWT_SECRET = "dev_jwt_secret_change_me";
  } else {
    console.error(
      "JWT_SECRET is required in production.".red
    );
    process.exit(1);
  }
}

// ===== DATABASE CONNECTION =====
connectDB();

// ===== MIDDLEWARES =====
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      // Allow any *.vercel.app subdomain (covers preview + production deployments)
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /^http:\/\/localhost/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle pre-flight OPTIONS for all routes
app.options("*", cors());

// Morgan only in development
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "API is running successfully 🚀",
    environment: NODE_ENV,
  });
});

// API Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/request", require("./routes/requestRoutes"));

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({
    success: false,
    message: err.message || "Internal Server Error",
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ===== SERVER =====
const PORT = process.env.PORT || 8080;

// Vercel does not use app.listen()
if (NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${NODE_ENV} mode on port ${PORT}`.bgBlue.white
    );
  });
}

// Export app for Vercel
module.exports = app;