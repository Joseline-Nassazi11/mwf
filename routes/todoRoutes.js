const express = require("express");
const router = express.Router();
const Task = require("../models/taskModel");

//  Show the Task Manager Page 
router.get("/todo", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render("todo", { title: "Task Manager", tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Error loading tasks");
  }
});

//  Add New Task 
router.post("/add", async (req, res) => {
  try {
    const newTask = new Task({
      text: req.body.text,
      completed: false,
    });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Failed to add task" });
  }
});

//  Toggle Complete 
router.post("/toggle/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle task" });
  }
});

//  Delete Task 
router.delete("/delete/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
