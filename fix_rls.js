const { Client } = require('pg');

const client = new Client({
  user: 'postgres.prtpmohrikfdasfmzvyt',
  password: 'LYAHEG!5G7gKe&qe',
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to DB");
    
    // Add delete policies
    await client.query(`CREATE POLICY "Allow anonymous deletes on universities" ON universities FOR DELETE TO anon USING (true);`);
    console.log("Added delete policy on universities");

    await client.query(`CREATE POLICY "Allow anonymous deletes on programs" ON programs FOR DELETE TO anon USING (true);`);
    console.log("Added delete policy on programs");
  } catch(e) {
    if (e.message.includes('already exists')) {
      console.log('Policy already exists, ignoring.');
    } else {
      console.error("Error:", e.message);
    }
  } finally {
    await client.end();
  }
}
run();
