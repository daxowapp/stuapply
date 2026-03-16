import { UniversityForm } from '../university-form';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

export default function NewUniversityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/universities" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New University</h1>
      </div>
      
      <UniversityForm />
    </div>
  );
}
