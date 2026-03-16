import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const t = useTranslations('Navigation');

  return (
    <footer className="bg-slate-900 pt-16 pb-8 text-slate-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-linear-to-br from-blue-600 to-purple-600 text-white p-1.5 rounded-lg shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Student Apply
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Your Gateway to Higher Education in Turkey. Fast acceptance, comprehensive support, and free counseling.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold mb-6 tracking-wide">Company</h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li>
                <Link href="/search" className="hover:text-white transition-colors">Find a Program</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Our Services</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Degrees & Programs */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold mb-6 tracking-wide">Study in Turkey</h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li>
                <Link href="/search?level=bachelor" className="hover:text-white transition-colors">Bachelor's Degrees</Link>
              </li>
              <li>
                <Link href="/search?level=master" className="hover:text-white transition-colors">Master's Degrees</Link>
              </li>
              <li>
                <Link href="/search?level=phd" className="hover:text-white transition-colors">PhD Programs</Link>
              </li>
              <li>
                <Link href="/search?language=english" className="hover:text-white transition-colors">English Taught Programs</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold mb-6 tracking-wide">Get in Touch</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  STUDENT APPLY EĞİTİM TEKNOLOJİ DANIŞMANLIK LİMİTED ŞİRKETİ BAŞAKŞEHİR ŞUBESİ<br/>
                  ZİYA GÖKALP MAH. SÜLEYMAN DEMİREL BUL. THE OFFICE NO: 7E İÇ KAPI NO: 116 / BAŞAKŞEHİR - İSTANBUL
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Phone className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">+90 545 308 1000<br/>+90 212 916 1616</span>
              </li>
              <li className="flex gap-3 items-start">
                <Mail className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">support@stuapply.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Student Apply. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
