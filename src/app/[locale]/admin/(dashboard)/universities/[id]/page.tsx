import { UniversityForm } from '../university-form';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function EditUniversityPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  
  const { data: university, error } = await supabase
    .from('universities')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !university) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/universities" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit University</h1>
      </div>
      
      <UniversityForm initialData={university} />
    </div>
  );
}
