const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); // Fix SRV issues on Windows
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]); // Use Google/Cloudflare DNS for Node c-ares resolver

const dotenv = require("dotenv");
dotenv.config(); // Load env FIRST

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoute = require("./routes/subscribeRoute");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("WELCOME TO THE Rabbit API");
});

//API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscribeRoute);

//Admin routes 
app.use("/api/admin", adminRoutes);
app.use("/api/admin", productAdminRoutes);
app.use("/api/admin", adminOrderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
