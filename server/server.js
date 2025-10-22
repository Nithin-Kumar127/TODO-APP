const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");
require('dotenv').config();
const jwt = require("jsonwebtoken");



// create an instance of express
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

// connect mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/mern-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(err));

// create schema
const todoSchema = new mongoose.Schema({
  title: { required: true, type: String },
  description: String,
  completed: { type: Boolean, default: false },
});

// create model
const todoModel = mongoose.model("Todo", todoSchema);

// Create a new todo item
app.post("/todos", async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const newTodo = new todoModel({
      title,
      description,
      completed: completed || false,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all items
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    // Always return an array
    res.json(Array.isArray(todos) ? todos : []);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update a todo item
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a todo item
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// start server
const port = 8000;
app.listen(port, () => console.log("Server listening on port " + port));
