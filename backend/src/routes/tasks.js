const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

// Get all tasks for user
router.get("/", async (req, res) => {
  try {
    const tasks = await db("tasks")
      .join("task_assignments", "tasks.id", "task_assignments.task_id")
      .where("task_assignments.user_id", req.user.id)
      .select("tasks.*")
      .orderBy("tasks.created_at", "desc");

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get tasks by team
router.get("/team/:teamId", async (req, res) => {
  try {
    const tasks = await db("tasks")
      .where("team_id", req.params.teamId)
      .orderBy("created_at", "desc");

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching team tasks:", error);
    res.status(500).json({ error: "Failed to fetch team tasks" });
  }
});

// Create task
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      team_id,
      status = "todo",
      priority = "medium",
    } = req.body;

    if (!title || !team_id) {
      return res.status(400).json({ error: "Title and team_id required" });
    }

    const taskId = uuidv4();
    await db("tasks").insert({
      id: taskId,
      title,
      description,
      team_id,
      status,
      priority,
      created_by: req.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Assign task to creator
    await db("task_assignments").insert({
      id: uuidv4(),
      task_id: taskId,
      user_id: req.user.id,
      assigned_at: new Date(),
    });

    const task = await db("tasks").where("id", taskId).first();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update task
router.put("/:taskId", async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    await db("tasks").where("id", req.params.taskId).update({
      title,
      description,
      status,
      priority,
      updated_at: new Date(),
    });

    const task = await db("tasks").where("id", req.params.taskId).first();
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/:taskId", async (req, res) => {
  try {
    await db("tasks").where("id", req.params.taskId).delete();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Assign task to user
router.post("/:taskId/assign", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id required" });
    }

    await db("task_assignments").insert({
      id: uuidv4(),
      task_id: req.params.taskId,
      user_id,
      assigned_at: new Date(),
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Failed to assign task" });
  }
});

// Add comment to task
router.post("/:taskId/comments", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content required" });
    }

    const commentId = uuidv4();
    await db("task_comments").insert({
      id: commentId,
      task_id: req.params.taskId,
      user_id: req.user.id,
      content,
      created_at: new Date(),
    });

    const comment = await db("task_comments").where("id", commentId).first();
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

module.exports = router;
