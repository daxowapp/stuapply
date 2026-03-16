const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error, count } = await supabase.from('programs')
    .select('*:count', { count: 'exact', head: true })
    .order('name');
  console.log("Error count:", error);
  const { data: d2, error: e2 } = await supabase.from('programs')
    .select('*, universities!inner(name, names_translations)')
    .limit(1)
    .order('name');
  console.log("Error data:", e2);
  if (e2) console.log("Details:", e2.details, e2.message, e2.hint);
}
test();
