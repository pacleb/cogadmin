const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

// Get all teams for user
router.get("/", async (req, res) => {
  try {
    const teams = await db("teams")
      .join("team_members", "teams.id", "team_members.team_id")
      .where("team_members.user_id", req.user.id)
      .select("teams.*")
      .distinct();

    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

// Create team
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Team name required" });
    }

    const teamId = uuidv4();
    await db("teams").insert({
      id: teamId,
      name,
      description,
      created_by: req.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Add creator as team owner
    await db("team_members").insert({
      id: uuidv4(),
      team_id: teamId,
      user_id: req.user.id,
      role: "owner",
      joined_at: new Date(),
    });

    const team = await db("teams").where("id", teamId).first();
    res.status(201).json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Failed to create team" });
  }
});

// Get team members
router.get("/:teamId/members", async (req, res) => {
  try {
    const members = await db("team_members")
      .join("users", "team_members.user_id", "users.id")
      .where("team_members.team_id", req.params.teamId)
      .select("users.id", "users.name", "users.email", "team_members.role");

    res.json(members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

// Add member to team
router.post("/:teamId/members", async (req, res) => {
  try {
    const { user_id, role = "member" } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id required" });
    }

    await db("team_members").insert({
      id: uuidv4(),
      team_id: req.params.teamId,
      user_id,
      role,
      joined_at: new Date(),
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error adding team member:", error);
    res.status(500).json({ error: "Failed to add team member" });
  }
});

// Remove member from team
router.delete("/:teamId/members/:userId", async (req, res) => {
  try {
    await db("team_members")
      .where("team_id", req.params.teamId)
      .andWhere("user_id", req.params.userId)
      .delete();

    res.status(204).send();
  } catch (error) {
    console.error("Error removing team member:", error);
    res.status(500).json({ error: "Failed to remove team member" });
  }
});

module.exports = router;
