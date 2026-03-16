'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton({ locale }: { locale: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
    >
      <LogOut className="w-5 h-5" />
      <span>Sign out</span>
    </button>
  );
}
