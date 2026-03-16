import { ProgramForm } from '../program-form';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  
  const [
    { data: program, error: programError },
    { data: universities }
  ] = await Promise.all([
    supabase
      .from('programs')
      .select('*')
      .eq('id', resolvedParams.id)
      .single(),
    supabase
      .from('universities')
      .select('id, name')
      .order('name')
  ]);

  if (programError || !program) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/programs" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Program</h1>
      </div>
      
      <ProgramForm initialData={program} universities={universities || []} />
    </div>
  );
}
