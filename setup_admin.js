const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const client = new Client({
  user: 'postgres.prtpmohrikfdasfmzvyt',
  password: 'LYAHEG!5G7gKe&qe',
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
});

async function run() {
  try {
    console.log('1. Signing up admin user...');
    const email = 'admin@studentapply.com';
    const password = 'AdminTopSecret123!';
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError && authError.message !== 'User already registered') {
      console.error('Error signing up admin:', authError);
      return;
    }
    console.log('Admin user signed up or already exists.');

    console.log('2. Connecting to database directly to confirm email and set RLS policies...');
    await client.connect();
    
    // Auto-confirm the user
    await client.query(`UPDATE auth.users SET email_confirmed_at = now() WHERE email = $1`, [email]);
    console.log('Admin email confirmed.');

    // Apply RLS policies for authenticated users
    const policies = [
      `CREATE POLICY "Allow authenticated full access on student_applications" ON student_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);`,
      `CREATE POLICY "Allow authenticated full access on universities" ON universities FOR ALL TO authenticated USING (true) WITH CHECK (true);`,
      `CREATE POLICY "Allow authenticated full access on programs" ON programs FOR ALL TO authenticated USING (true) WITH CHECK (true);`
    ];

    for (const policy of policies) {
      try {
        await client.query(policy);
        console.log('Applied policy:', policy.substring(0, 70) + '...');
      } catch (e) {
        if (e.message.includes('already exists')) {
          console.log('Policy already exists, skipping.');
        } else {
          console.error('Error applying policy:', e.message);
        }
      }
    }

    console.log('Setup finished successfully!');

  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.end();
  }
}

run();
