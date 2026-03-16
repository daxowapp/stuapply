'use client';

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { toast } from 'sonner';

interface University {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export function UniversitiesTable({ initialData }: { initialData: University[] }) {
  const [universities, setUniversities] = useState<University[]>(initialData);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will also delete all associated programs.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setUniversities(unis => unis.filter(u => u.id !== id));
      toast.success('University deleted successfully');
      router.refresh(); // Refresh the data to update counts if necessary
    } catch (error) {
      console.error('Failed to delete university:', error);
      toast.error('Failed to delete university');
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {universities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No universities found.
              </TableCell>
            </TableRow>
          ) : (
            universities.map((uni) => (
              <TableRow key={uni.id}>
                <TableCell className="font-medium">{uni.name}</TableCell>
                <TableCell className="text-muted-foreground">{uni.slug}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {new Date(uni.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/universities/${uni.id}`}>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(uni.id, uni.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
