require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");

const authRoutes = require("./routes/auth.routes"); 
const candidateRoutes = require("./routes/candid.route");


const app = express();
const prisma = new PrismaClient();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'add your local-link here'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  credentials: true,
  exposedHeaders: ['Set-Cookie']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes); 
app.use("/api/candidates", candidateRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("Evangelism API is running...");
});

// Function to check DB connection
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected!");
  } catch (error) {
    console.error("❌ Database connection failed!", error);
  }
}

// Start Server & Check DB
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  await checkDatabaseConnection();
});