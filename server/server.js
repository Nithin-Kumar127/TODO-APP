const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// --------------------
// Middleware: Auth
// --------------------
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// --------------------
// App setup
// --------------------
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

// --------------------
// MongoDB Connection
// --------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/mern-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(err));

// --------------------
// Todo Schema & Model
// --------------------
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Associate with user
  },
  { timestamps: true }
);

const todoModel = mongoose.model("Todo", todoSchema);

// --------------------
// Todo Routes (Protected)
// --------------------

// Create a new todo
app.post("/todos", authMiddleware, async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const newTodo = new todoModel({
      title,
      description,
      completed: completed || false,
      user: req.user.id, // attach logged-in user
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all todos for logged-in user
app.get("/todos", authMiddleware, async (req, res) => {
  try {
    const todos = await todoModel.find({ user: req.user.id });
    res.json(Array.isArray(todos) ? todos : []);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update a todo (only if it belongs to user)
app.put("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const id = req.params.id;

    const todo = await todoModel.findOne({ _id: id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.title = title;
    todo.description = description;
    todo.completed = completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a todo (only if it belongs to user)
app.delete("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await todoModel.findOneAndDelete({ _id: id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// --------------------
// Start Server
// --------------------
const port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server listening on port " + port));
