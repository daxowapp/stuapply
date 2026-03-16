import { createClient } from '@/lib/supabase/server';
import { UniversitiesTable } from './universities-table';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const revalidate = 0; // Disable static rendering

export default async function UniversitiesPage() {
  const supabase = await createClient();
  const { data: universities, error } = await supabase
    .from('universities')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching universities:', error);
    return <div>Error loading universities</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
        <Link href="/admin/universities/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add University
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <UniversitiesTable initialData={universities || []} />
      </div>
    </div>
  );
}
