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
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { toast } from 'sonner';

interface Program {
  id: string;
  name: string;
  level: string;
  language: string;
  field: string;
  universities?: {
    name: string;
  };
}

export function ProgramsTable({ 
  initialData, 
  page, 
  totalCount, 
  limit 
}: { 
  initialData: Program[];
  page: number;
  totalCount: number;
  limit: number;
}) {
  const [programs, setPrograms] = useState<Program[]>(initialData);
  const router = useRouter();

  const totalPages = Math.ceil(totalCount / limit);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPrograms(progs => progs.filter(p => p.id !== id));
      toast.success('Program deleted successfully');
      router.refresh(); 
    } catch (error) {
      console.error('Failed to delete program:', error);
      toast.error('Failed to delete program');
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program Name</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Level / Language</TableHead>
            <TableHead>Field</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No programs found.
              </TableCell>
            </TableRow>
          ) : (
            programs.map((prog) => (
              <TableRow key={prog.id}>
                <TableCell className="font-medium">{prog.name}</TableCell>
                <TableCell>{prog.universities?.name}</TableCell>
                <TableCell>
                  <div className="text-sm">{prog.level}</div>
                  <div className="text-xs text-muted-foreground">{prog.language}</div>
                </TableCell>
                <TableCell>{prog.field}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/programs/${prog.id}`}>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(prog.id, prog.name)}
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
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/programs?page=${Math.max(1, page - 1)}`}>
              <Button variant="outline" size="sm" disabled={page === 1}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            </Link>
            <Link href={`/admin/programs?page=${Math.min(totalPages, page + 1)}`}>
              <Button variant="outline" size="sm" disabled={page === totalPages}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
