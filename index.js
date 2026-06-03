require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 5004;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

app.use("/uploads", express.static("uploads"));
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log(err));

app.use((err, req, res, next) => {
  console.log("🔥 GLOBAL ERROR:", err);
  console.log("🔥 STACK:", err.stack);

  res.status(500).json({
    msg: err.message || "Server error"
  });
});
app.listen(PORT, ()=>console.log(`🚀 Server running on port ${PORT}`));

