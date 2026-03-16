'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface University {
  id?: string;
  name: string;
  slug: string;
}

export function UniversityForm({ initialData }: { initialData?: University }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<University>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: initialData ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        // Update
        const { error } = await supabase
          .from('universities')
          .update({ name: formData.name, slug: formData.slug })
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('University updated successfully');
      } else {
        // Insert
        const { error } = await supabase
          .from('universities')
          .insert([{ name: formData.name, slug: formData.slug }]);

        if (error) throw error;
        toast.success('University created successfully');
      }

      router.push('/admin/universities');
      router.refresh();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save university');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="name">University Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="e.g. Istanbul University"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL friendly name)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g. istanbul-university"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update University' : 'Create University'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/universities')} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
