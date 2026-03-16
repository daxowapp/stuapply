import { createClient } from '@/lib/supabase/server';
import { ApplicationsTable } from './applications-table';

export const revalidate = 0; // Disable static rendering

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: applications, error } = await supabase
    .from('student_applications')
    .select(`
      *,
      programs (
        name,
        universities (name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return <div>Error loading applications</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Student Applications</h1>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <ApplicationsTable initialData={applications || []} />
      </div>
    </div>
  );
}
