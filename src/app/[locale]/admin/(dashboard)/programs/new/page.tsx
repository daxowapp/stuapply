import { ProgramForm } from '../program-form';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function NewProgramPage() {
  const supabase = await createClient();
  const { data: universities } = await supabase
    .from('universities')
    .select('id, name')
    .order('name');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/programs" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New Program</h1>
      </div>
      
      <ProgramForm universities={universities || []} />
    </div>
  );
}
