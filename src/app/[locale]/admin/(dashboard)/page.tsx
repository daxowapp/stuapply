import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen } from 'lucide-react';

export const revalidate = 0; // Disable static rendering for the dashboard

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { count: applicationsCount } = await supabase
    .from('student_applications')
    .select('*', { count: 'exact', head: true });

  const { count: universitiesCount } = await supabase
    .from('universities')
    .select('*', { count: 'exact', head: true });

  const { count: programsCount } = await supabase
    .from('programs')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Applications (Leads)</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicationsCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Universities</CardTitle>
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{universitiesCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programsCount || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
