import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = postgres(url, {
  max: 1,
  idle_timeout: 5,
  connect_timeout: 15,
  ssl: "require",
});

try {
  const [row] = await sql`
    select
      current_database() as database,
      current_user as username,
      version() as version,
      now() as server_time
  `;
  console.log(JSON.stringify(row, null, 2));
} finally {
  await sql.end({ timeout: 5 });
}
