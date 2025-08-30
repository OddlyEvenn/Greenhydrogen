// backend/src/db.js
const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/green_h2";
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("MongoDB connected");
}
module.exports = connectDB;