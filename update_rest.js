const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  console.log('Starting update via REST API...');
  const sql = fs.readFileSync('update_universities.sql', 'utf8');
  const updates = sql.split('UPDATE universities SET ').slice(1);
  let success = 0, errors = 0;
  
  for (let block of updates) {
    const idMatch = block.match(/WHERE id = '([^']+)'/);
    if (!idMatch) continue;
    const id = idMatch[1];
    
    let payload = {};
    
    const descRegex = /description = (NULL|'.*?')(?:, cover_image_url|, website_url|, city|, founded_year| WHERE)/s;
    const descMatch = block.match(descRegex);
    if (descMatch) {
      payload.description = descMatch[1] === 'NULL' ? null : descMatch[1].replace(/^'|'$/g, '').replace(/''/g, "'");
    }
    
    const coverRegex = /cover_image_url = (NULL|'.*?')(?:, description|, website_url|, city|, founded_year| WHERE)/s;
    const coverMatch = block.match(coverRegex);
    if (coverMatch) {
      payload.cover_image_url = coverMatch[1] === 'NULL' ? null : coverMatch[1].replace(/^'|'$/g, '').replace(/''/g, "'");
    }
    
    const webRegex = /website_url = (NULL|'.*?')(?:, description|, cover_image_url|, city|, founded_year| WHERE)/s;
    const webMatch = block.match(webRegex);
    if (webMatch) {
      payload.website_url = webMatch[1] === 'NULL' ? null : webMatch[1].replace(/^'|'$/g, '').replace(/''/g, "'");
    }
    
    const cityRegex = /city = (NULL|'.*?')(?:, description|, cover_image_url|, website_url|, founded_year| WHERE)/s;
    const cityMatch = block.match(cityRegex);
    if (cityMatch) {
      payload.city = cityMatch[1] === 'NULL' ? null : cityMatch[1].replace(/^'|'$/g, '').replace(/''/g, "'");
    }

    const { error } = await supabase.from('universities').update(payload).eq('id', id);
    if (error) {
      console.error('Error on', id, error);
      errors++;
    } else {
      success++;
      if (success % 50 === 0) process.stdout.write(success.toString() + ' ');
    }
  }
  console.log('\\nDone!', success, 'successful updates,', errors, 'errors.');
}

run();
