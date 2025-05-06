import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

// Function to run the database push
async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    console.log('Pushing schema to database...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    
    console.log('Schema successfully pushed to the database!');
    await pool.end();
  } catch (error) {
    console.error('Error pushing schema to database:', error);
    process.exit(1);
  }
}

main();