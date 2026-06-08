import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

try {
  const result = await sql`SELECT COUNT(*) as count, COUNT(DISTINCT country) as countries FROM cities`;
  console.log(JSON.stringify(result[0], null, 2));
} finally {
  await sql.end();
}
