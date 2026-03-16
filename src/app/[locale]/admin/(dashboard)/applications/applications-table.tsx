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
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { toast } from 'sonner';

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  programs?: {
    name: string;
    universities?: {
      name: string;
    };
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  contacted: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  accepted: 'bg-green-100 text-green-800 hover:bg-green-200',
  rejected: 'bg-red-100 text-red-800 hover:bg-red-200',
};

const STATUS_OPTIONS = ['pending', 'contacted', 'accepted', 'rejected'];

export function ApplicationsTable({ initialData }: { initialData: Application[] }) {
  const [applications, setApplications] = useState<Application[]>(initialData);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('student_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setApplications(apps => 
        apps.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="whitespace-nowrap">
                  {new Date(app.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{app.first_name} {app.last_name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{app.email}</div>
                  <div className="text-sm text-muted-foreground">{app.phone}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{app.programs?.name || 'Unknown Program'}</div>
                  <div className="text-xs text-muted-foreground">
                    {app.programs?.universities?.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-800'}>
                      {app.status || 'pending'}
                    </Badge>
                    <Select
                      disabled={updating === app.id}
                      value={app.status || 'pending'}
                      onValueChange={(val) => handleStatusChange(app.id, val!)}
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status} value={status}>
                            Set {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
