// scripts/import_excel.js
const xlsx = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

// We use the anon key. Because the table has RLS, if we want to bypass RLS for importing,
// we'd typically use the service_role key. Since we only have the anon key but we want
// to seed the DB, we might need to rely on the fact that we run this as a trusted user or
// our RLS policies are permissive enough. Let's assume we can INSERT given the user's setup,
// OR we might need to modify RLS to allow anon inserts temporarily.
// The user provided the ANON key explicitly. Let's try!
const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  console.log('Loading Excel file...');
  const workbook = xlsx.readFile('./ProgsOTAS.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  console.log(`Found ${data.length} rows. Processing...`);

  // 1. Extract Unique Universities
  const universitiesMap = new Map();
  for (const row of data) {
    if (row.University) {
      const name = String(row.University).trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!universitiesMap.has(name)) {
        universitiesMap.set(name, slug);
      }
    }
  }

  const universitiesToInsert = Array.from(universitiesMap.entries()).map(([name, slug]) => ({
    name,
    slug
  }));

  console.log(`Extracted ${universitiesToInsert.length} unique universities. Inserting...`);
  
  // Insert universities and get their IDs
  // To deal with potential duplicates, we might want to do it in chunks or handle conflicts.
  // Using upsert on slug
  const { data: insertedUniversities, error: uniError } = await supabase
    .from('universities')
    .upsert(universitiesToInsert, { onConflict: 'slug' })
    .select();

  if (uniError) {
    console.error('Error inserting universities:', uniError);
    return;
  }
  
  console.log(`Successfully inserted ${insertedUniversities.length} universities.`);

  // Create a lookup map for university IDs
  const uniIdMap = new Map();
  insertedUniversities.forEach(u => uniIdMap.set(u.slug, u.id));

  // 2. Prepare Programs
  const programsToInsert = data.map(row => {
    const uniName = String(row.University || '').trim();
    const slug = uniName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const uniId = uniIdMap.get(slug);
    
    // Default prices to 0 if not present or unparseable
    const parsePrice = (val) => {
        if (!val) return 0;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
    };
    
    // Default years to 0
    const parseYears = (val) => {
        if (!val) return 0;
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? 0 : parsed;
    };

    return {
      university_id: uniId,
      name: String(row.Program || '').trim() || 'Unknown Program',
      level: String(row.Level || '').trim() || null,
      language: String(row.Language || '').trim() || null,
      official_price: parsePrice(row.Official),
      discounted_price: parsePrice(row.Discounted),
      currency: String(row.Currency || '').trim() || null,
      unit: String(row.Unit || '').trim() || null,
      study_years: parseYears(row.study_years),
      field: String(row.Field || '').trim() || null,
      speciality: String(row.Speciality || '').trim() || null
    };
  }).filter(p => p.university_id); // Only insert if we mapped a university

  console.log(`Prepared ${programsToInsert.length} programs for insertion.`);

  // Insert programs in batches of 500
  const BATCH_SIZE = 500;
  let insertedCount = 0;
  for (let i = 0; i < programsToInsert.length; i += BATCH_SIZE) {
    const batch = programsToInsert.slice(i, i + BATCH_SIZE);
    const { error: progError } = await supabase
      .from('programs')
      .insert(batch);
      
    if (progError) {
      console.error(`Error inserting programs batch ${i}-${i + BATCH_SIZE}:`, progError);
      return;
    }
    insertedCount += batch.length;
    console.log(`Inserted ${insertedCount} / ${programsToInsert.length} programs...`);
  }

  console.log('✅ Data import completed successfully!');
}

importData().catch(console.error);
