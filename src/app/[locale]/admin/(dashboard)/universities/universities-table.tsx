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
  country: string | null;
  created_at: string;
}

export function UniversitiesTable({ initialData }: { initialData: University[] }) {
  const [universities, setUniversities] = useState<University[]>(initialData);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const router = useRouter();

  const allSelected = universities.length > 0 && selected.size === universities.length;
  const someSelected = selected.size > 0 && selected.size < universities.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(universities.map(u => u.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

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
      setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
      toast.success('University deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete university:', error);
      toast.error('Failed to delete university');
    }
  };

  const handleBulkDelete = async () => {
    const count = selected.size;
    if (!window.confirm(`Are you sure you want to delete ${count} universities? This will also delete ALL associated programs.`)) {
      return;
    }

    setBulkDeleting(true);
    let deleted = 0;
    let failed = 0;

    const ids = Array.from(selected);
    // Delete in batches of 10
    for (let i = 0; i < ids.length; i += 10) {
      const batch = ids.slice(i, i + 10);
      const { error } = await supabase
        .from('universities')
        .delete()
        .in('id', batch);

      if (error) {
        console.error('Batch delete failed:', error);
        failed += batch.length;
      } else {
        deleted += batch.length;
      }
    }

    setUniversities(unis => unis.filter(u => !selected.has(u.id)));
    setSelected(new Set());
    setBulkDeleting(false);

    if (failed > 0) {
      toast.error(`Deleted ${deleted}, failed ${failed}`);
    } else {
      toast.success(`${deleted} universities deleted successfully`);
    }
    router.refresh();
  };

  return (
    <div className="space-y-2">
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          <span className="text-sm font-medium">
            {selected.size} universit{selected.size === 1 ? 'y' : 'ies'} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {bulkDeleting ? 'Deleting...' : `Delete ${selected.size} selected`}
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {universities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No universities found.
                </TableCell>
              </TableRow>
            ) : (
              universities.map((uni) => (
                <TableRow key={uni.id} className={selected.has(uni.id) ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selected.has(uni.id)}
                      onChange={() => toggleOne(uni.id)}
                      className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{uni.name}</TableCell>
                  <TableCell className="text-muted-foreground">{uni.country || '—'}</TableCell>
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
    </div>
  );
}
