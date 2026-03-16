const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchWikiData(uniName) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(uniName + " Turkey")}&format=json&utf8=1`;
    const searchRes = await axios.get(searchUrl, { 
      timeout: 10000,
      headers: { 'User-Agent': 'StudentApplyBot/1.0 (contact@example.com)' }
    });
    const searchData = searchRes.data;
    
    if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
      return null;
    }
    
    const title = searchData.query.search[0].title;
    const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|info&inprop=url&exintro=1&explaintext=1&titles=${encodeURIComponent(title)}&format=json&pithumbsize=800`;
    const detailRes = await axios.get(detailUrl, { 
      timeout: 10000,
      headers: { 'User-Agent': 'StudentApplyBot/1.0 (contact@example.com)' }
    });
    const detailData = detailRes.data;
    const pages = detailData.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId === '-1') return null;

    const page = pages[pageId];
    return {
      description: page.extract || null,
      cover_image_url: page.thumbnail ? page.thumbnail.source : null,
      website_url: page.fullurl || null
    };
  } catch (err) {
    console.error(`Error fetching for ${uniName}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('Fetching universities from Supabase...');
  const { data: rows, error } = await supabase.from('universities').select('id, name');
  
  if (error || !rows) {
    console.error('Error fetching from Supabase:', error);
    return;
  }
  
  console.log(`Found ${rows.length} universities to process.`);

  let sqlOutput = `
-- 1. Add required columns
ALTER TABLE universities ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS founded_year INTEGER;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS city TEXT;

-- 2. Update existing universities with Wikipedia data
`;

  let processed = 0;
  for (const row of rows) {
    console.log(`Fetching info for: ${row.name}`);
    const data = await fetchWikiData(row.name);
    
    if (data && data.description) {
      const desc = data.description.replace(/'/g, "''"); // escape single quotes for SQL
      const cover = data.cover_image_url ? `'${data.cover_image_url.replace(/'/g, "''")}'` : 'NULL';
      const website = data.website_url ? `'${data.website_url.replace(/'/g, "''")}'` : 'NULL';

      sqlOutput += `UPDATE universities SET description = '${desc}', cover_image_url = ${cover}, website_url = ${website} WHERE id = '${row.id}';\n`;
      console.log(`-> Prepared SQL for ${row.name}`);
    } else {
      console.log(`-> No good data found for ${row.name}`);
    }

    processed++;
    if (processed % 10 === 0) console.log(`Processed ${processed}/${rows.length}`);
    await delay(300); // 300ms delay to avoid rate limiting
  }

  fs.writeFileSync('./update_universities.sql', sqlOutput);
  console.log('Done! Generated update_universities.sql');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
