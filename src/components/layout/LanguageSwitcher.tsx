"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: 'en' | 'tr') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 h-9 w-9 px-0 border border-slate-200 rounded-md">
        <Globe className="h-4 w-4 text-slate-700" />
        <span className="sr-only">Toggle language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage('en')} className={locale === 'en' ? 'bg-slate-100 font-medium' : ''}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('tr')} className={locale === 'tr' ? 'bg-slate-100 font-medium' : ''}>
          Türkçe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
