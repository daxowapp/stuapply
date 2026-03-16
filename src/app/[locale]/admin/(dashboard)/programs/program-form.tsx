'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Program {
  id?: string;
  university_id: string;
  name: string;
  level: string;
  language: string;
  official_price?: number;
  discounted_price?: number;
  currency?: string;
  unit?: string;
  study_years?: number;
  field?: string;
  speciality?: string;
}

interface University {
  id: string;
  name: string;
}

export function ProgramForm({ 
  initialData, 
  universities 
}: { 
  initialData?: Program, 
  universities: University[] 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Program>>(initialData || {
    university_id: '',
    name: '',
    level: '',
    language: '',
    official_price: undefined,
    discounted_price: undefined,
    currency: 'USD',
    unit: 'year',
    study_years: 4,
    field: '',
    speciality: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        // Update
        const { error } = await supabase
          .from('programs')
          .update(formData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Program updated successfully');
      } else {
        // Insert
        const { error } = await supabase
          .from('programs')
          .insert([formData]);

        if (error) throw error;
        toast.success('Program created successfully');
      }

      router.push('/admin/programs');
      router.refresh();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-white p-6 rounded-lg border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Select 
            value={formData.university_id} 
            onValueChange={(val) => setFormData({ ...formData, university_id: val! })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a university" />
            </SelectTrigger>
            <SelectContent>
              {universities.map(uni => (
                <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Program Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Computer Engineering"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Input
            id="level"
            value={formData.level || ''}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            placeholder="e.g. Bachelor"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            value={formData.language || ''}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            placeholder="e.g. English"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="study_years">Study Years</Label>
          <Input
            id="study_years"
            type="number"
            value={formData.study_years || ''}
            onChange={(e) => setFormData({ ...formData, study_years: parseInt(e.target.value) || undefined })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field">Field</Label>
          <Input
            id="field"
            value={formData.field || ''}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            placeholder="e.g. Engineering"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="speciality">Speciality</Label>
          <Input
            id="speciality"
            value={formData.speciality || ''}
            onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
            placeholder="Optional detailed speciality"
          />
        </div>

        <div className="space-y-2">
          <Label >Pricing</Label>
          <div className="flex gap-2">
             <Input
                type="number"
                placeholder="Official"
                value={formData.official_price || ''}
                onChange={(e) => setFormData({ ...formData, official_price: parseFloat(e.target.value) || undefined })}
             />
             <Input
                type="number"
                placeholder="Discounted"
                value={formData.discounted_price || ''}
                onChange={(e) => setFormData({ ...formData, discounted_price: parseFloat(e.target.value) || undefined })}
             />
             <Input
                className="w-20"
                placeholder="Currency"
                value={formData.currency || ''}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
             />
          </div>
        </div>

      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Program' : 'Create Program'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/programs')} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
