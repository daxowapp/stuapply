import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

export function Header() {
  const t = useTranslations('Navigation');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-linear-to-br from-blue-600 to-purple-600 text-white p-1.5 rounded-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-700 to-purple-700">
            Student Apply
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
             {t('home')}
          </Link>
          <Link href="/universities" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            {t('universities')}
          </Link>
          <Link href="/search" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            {t('programs')}
          </Link>
          <Link href="/services" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
             {t('services')}
          </Link>
          <Link href="/turkey" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
             {t('turkey')}
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
             {t('about')}
          </Link>
          <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
             {t('contact')}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <Link href="/apply" className="hidden sm:inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 h-9 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg rounded-full px-6">
            {t('applyNow')}
          </Link>
        </div>

      </div>
    </header>
  );
}
