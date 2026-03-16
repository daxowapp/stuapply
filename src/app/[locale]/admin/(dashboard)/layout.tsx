import { Link } from '@/i18n/routing';
import { Home, Users, GraduationCap, BookOpen, LogOut } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from './logout-button';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/applications" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            <Users className="w-5 h-5" />
            <span>Applications</span>
          </Link>
          <Link href="/admin/universities" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            <GraduationCap className="w-5 h-5" />
            <span>Universities</span>
          </Link>
          <Link href="/admin/programs" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            <BookOpen className="w-5 h-5" />
            <span>Programs</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <LogoutButton locale={locale} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-neutral-50 overflow-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
