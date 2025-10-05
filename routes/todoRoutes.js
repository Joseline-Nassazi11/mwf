const express = require("express");
const router = express.Router();
const Task = require("../models/taskModel");

// Render the page
router.get("/todo", (req, res) => {
  res.render("todo"); // shows the Pug file
});

// Get all tasks (AJAX)
router.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// Add task
router.post("/api/tasks", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Task text is required" });

  const newTask = new Task({ text });
  await newTask.save();
  res.json(newTask);
});

// Toggle complete
router.put("/api/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Delete
router.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
