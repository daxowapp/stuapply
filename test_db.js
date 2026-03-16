const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://prtpmohrikfdasfmzvyt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydHBtb2hyaWtmZGFzZm16dnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NzEzMjcsImV4cCI6MjA4OTE0NzMyN30.QAATS5e1NhZYcyeU4rVHupHMLefjczIr6_niGUrrgF4'
);

async function test() {
  const { data, error } = await supabase.from('universities').select('id, name, slug, city_id').limit(5);
  console.log('Error:', error);
  console.log('Universities:', data);
}
test();
