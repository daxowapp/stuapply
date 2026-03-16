const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '../src/app/[locale]/admin/(dashboard)');

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
  
  // FIX CLIENT COMPONENTS
  if (content.includes("import { createClient } from '@/lib/supabase/client';")) {
    if (!content.includes('const supabase = createClient();')) {
       content = content.replace(
         "import { createClient } from '@/lib/supabase/client';", 
         "import { createClient } from '@/lib/supabase/client';\nconst supabase = createClient();"
       );
    }
    // Revert the previous script's hacky inline replace
    content = content.replace(/createClient\(\)\.from/g, 'supabase.from');
    content = content.replace(/createClient\(\)\.storage/g, 'supabase.storage');
  }

  // FIX SERVER COMPONENTS EXCEPT layout.tsx which we already fixed
  if (content.includes("import { createClient } from '@/lib/supabase/server';") && !filePath.includes('layout.tsx')) {
    // Revert the previous hacky inline replace
    content = content.replace(/\(await createClient\(\)\)\.from/g, 'supabase.from');
    
    // Add const supabase = await createClient(); inside the component
    if (!content.includes('const supabase = await createClient();')) {
       content = content.replace(/export default async function [A-Za-z0-9_]+\([^)]*\) \{/, (match) => {
         return match + "\n  const supabase = await createClient();";
       });
    }
    
    // Fix params for Next.js 15
    // `params: { id: string }` -> `params: Promise<{ id: string }>`
    // `params: { locale: string }` -> `params: Promise<{ locale: string }>`
    content = content.replace(/\{ params \}: \{ params: \{ ([^}]+) \} \}/g, '{ params }: { params: Promise<{ $1 }> }');
    // If it's capturing params we need to await it
    if (content.includes('{ params }: { params: Promise<{')) {
       if (!content.includes('const resolvedParams = await params;')) {
         content = content.replace(/const supabase = await createClient\(\);/g, "const resolvedParams = await params;\n  const supabase = await createClient();");
         // replace params.id with resolvedParams.id
         content = content.replace(/params\.id/g, 'resolvedParams.id');
         content = content.replace(/params\.locale/g, 'resolvedParams.locale');
         // fix layout.tsx type params destructuring if not done
       }
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
});

// Also fix layout.tsx manually since we skipped it
const layoutPath = path.join(adminDir, 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(
  /export default async function AdminLayout\(\{\n  children,\n  params: \{ locale \}\n\}: \{\n  children: React\.ReactNode;\n  params: \{ locale: string \};\n\}\) \{/g,
  `export default async function AdminLayout({\n  children,\n  params\n}: {\n  children: React.ReactNode;\n  params: Promise<{ locale: string }>;\n}) {\n  const { locale } = await params;`
);
fs.writeFileSync(layoutPath, layoutContent, 'utf8');

console.log('Fixed supabase and params references!');
