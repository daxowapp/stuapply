import { createClient } from '@/lib/supabase/server';
import { ProgramsTable } from './programs-table';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const revalidate = 0;

export default async function ProgramsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const limit = 50;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  const { data: programs, count, error } = await supabase
    .from('programs')
    .select(`
      *,
      universities (
        name
      )
    `, { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('Error fetching programs:', error);
    return <div>Error loading programs</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
         <Link href="/admin/programs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Program
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <ProgramsTable 
          initialData={programs || []} 
          page={page} 
          totalCount={count || 0} 
          limit={limit} 
        />
      </div>
    </div>
  );
}
