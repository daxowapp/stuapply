const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '../src/app/[locale]/admin/(dashboard)');
const clientPattern = "import { supabase } from '@/lib/supabase';";
const serverReplacement = "import { createClient } from '@/lib/supabase/server';";
const clientReplacement = "import { createClient } from '@/lib/supabase/client';";

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(adminDir, (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(clientPattern)) return;
  
  const isServerComponent = !content.includes("'use client'") && !content.includes('"use client"');
  
  if (isServerComponent) {
    // Only handles cases where the page just passes the ID to a form, meaning `supabase` isn't actually used
    content = content.replace(clientPattern, serverReplacement);
    // If it's a page that actually uses supabase.from, we handled the main ones already, 
    // but for [id]/page.tsx they just didn't use supabase directly, or wait, do they?
    // Let's replace 'supabase.from' with 'await (await createClient()).from' just in case.
    content = content.replace(/supabase\.from/g, '(await createClient()).from');
  } else {
    // For client components, we replace the import and add a local declaration
    content = content.replace(clientPattern, clientReplacement);
    // Inside the component, insert `const supabase = createClient();` at the beginning of the function
    // A simple hack is just substituting `supabase.` calls, but we also pass `supabase` around maybe?
    content = content.replace(/supabase\.from/g, 'createClient().from');
    content = content.replace(/supabase\.storage/g, 'createClient().storage');
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', filePath);
});
