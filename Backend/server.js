const mongoose = require("mongoose");
const routes = require("./routes");
const express = require("express");
const backend = express();
const cors = require("cors");
const createDefaultAdmin = require("./controller/Auth/DefaultAdmin.js");
const path = require("path");

backend.use(express.json());

backend.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  })
);

backend.get("/", (req, res) => {
  res.send("Welcome to the Real Estate Platform API");
});

backend.use(routes);
backend.use("/upload", express.static(path.join(__dirname, "./uploads")));
let isConnected = false;
async function connectMongo() {
  if (isConnected) return;
  await mongoose.connect("mongodb+srv://...your_url...");
  console.log("Mongo Connected");
  await createDefaultAdmin();
  isConnected = true;
}

module.exports = async (req, res) => {
  await connectMongo();
  return backend(req, res); 
};
