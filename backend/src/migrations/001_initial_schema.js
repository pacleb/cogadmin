exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.string("name").notNullable();
      table.string("avatar_url").nullable();
      table.timestamp("created_at");
      table.timestamp("updated_at");
    })
    .createTable("teams", (table) => {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("description").nullable();
      table.uuid("created_by").notNullable();
      table.timestamp("created_at");
      table.timestamp("updated_at");
      table.foreign("created_by").references("users.id");
    })
    .createTable("team_members", (table) => {
      table.uuid("id").primary();
      table.uuid("team_id").notNullable();
      table.uuid("user_id").notNullable();
      table.enum("role", ["owner", "admin", "member"]).defaultTo("member");
      table.timestamp("joined_at");
      table.unique(["team_id", "user_id"]);
      table.foreign("team_id").references("teams.id").onDelete("CASCADE");
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
    })
    .createTable("tasks", (table) => {
      table.uuid("id").primary();
      table.string("title").notNullable();
      table.text("description").nullable();
      table.uuid("team_id").notNullable();
      table.uuid("created_by").notNullable();
      table
        .enum("status", ["todo", "in_progress", "in_review", "done"])
        .defaultTo("todo");
      table
        .enum("priority", ["low", "medium", "high", "urgent"])
        .defaultTo("medium");
      table.date("due_date").nullable();
      table.timestamp("created_at");
      table.timestamp("updated_at");
      table.foreign("team_id").references("teams.id").onDelete("CASCADE");
      table.foreign("created_by").references("users.id");
    })
    .createTable("task_assignments", (table) => {
      table.uuid("id").primary();
      table.uuid("task_id").notNullable();
      table.uuid("user_id").notNullable();
      table.timestamp("assigned_at");
      table.unique(["task_id", "user_id"]);
      table.foreign("task_id").references("tasks.id").onDelete("CASCADE");
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
    })
    .createTable("task_comments", (table) => {
      table.uuid("id").primary();
      table.uuid("task_id").notNullable();
      table.uuid("user_id").notNullable();
      table.text("content").notNullable();
      table.timestamp("created_at");
      table.timestamp("updated_at");
      table.foreign("task_id").references("tasks.id").onDelete("CASCADE");
      table.foreign("user_id").references("users.id");
    })
    .createTable("activity_logs", (table) => {
      table.uuid("id").primary();
      table.uuid("team_id").notNullable();
      table.uuid("user_id").notNullable();
      table.string("action").notNullable();
      table.string("entity_type").notNullable();
      table.uuid("entity_id").notNullable();
      table.json("changes").nullable();
      table.timestamp("created_at");
      table.foreign("team_id").references("teams.id").onDelete("CASCADE");
      table.foreign("user_id").references("users.id");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("activity_logs")
    .dropTableIfExists("task_comments")
    .dropTableIfExists("task_assignments")
    .dropTableIfExists("tasks")
    .dropTableIfExists("team_members")
    .dropTableIfExists("teams")
    .dropTableIfExists("users");
};
