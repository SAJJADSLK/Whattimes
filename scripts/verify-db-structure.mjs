import postgres from "postgres";

const required = {
  users: ["id", "openId", "name", "email", "loginMethod", "role", "theme", "defaultTimezone", "createdAt", "updatedAt", "lastSignedIn"],
  cities: ["id", "name", "country", "timezone", "latitude", "longitude", "utcOffsetMinutes", "region", "searchKeywords", "population", "createdAt"],
  userFavoriteCities: ["id", "userId", "cityId", "order", "createdAt"],
  teamDashboards: ["id", "userId", "name", "description", "cityIds", "isDefault", "createdAt", "updatedAt"],
  meetingInvites: ["id", "userId", "inviteCode", "title", "description", "cityIds", "meetingTimeUtc", "createdAt", "expiresAt"],
  countdownTimers: ["id", "userId", "countdownCode", "title", "targetTimeUtc", "timezone", "isPublic", "createdAt", "expiresAt"],
};

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
  const columns = await sql`
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
    order by table_name, ordinal_position
  `;

  const byTable = new Map();
  for (const row of columns) {
    if (!byTable.has(row.table_name)) byTable.set(row.table_name, []);
    byTable.get(row.table_name).push(row.column_name);
  }

  const report = Object.fromEntries(
    Object.entries(required).map(([table, cols]) => {
      const actual = byTable.get(table) ?? [];
      return [table, {
        exists: byTable.has(table),
        missingColumns: cols.filter((col) => !actual.includes(col)),
        actualColumns: actual,
      }];
    }),
  );

  console.log(JSON.stringify(report, null, 2));

  const hasMissing = Object.values(report).some((entry) => !entry.exists || entry.missingColumns.length > 0);
  process.exitCode = hasMissing ? 1 : 0;
} finally {
  await sql.end({ timeout: 5 });
}
