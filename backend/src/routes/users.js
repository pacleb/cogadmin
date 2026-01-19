const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    const user = await db("users").where("id", req.user.id).first();
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Search users
router.get("/search/:query", async (req, res) => {
  try {
    const users = await db("users")
      .where("email", "like", `%${req.params.query}%`)
      .orWhere("name", "like", `%${req.params.query}%`)
      .limit(10)
      .select("id", "name", "email");

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
});

module.exports = router;
