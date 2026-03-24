import { useTranslations } from 'next-intl';
import { GraduationCap, FileText, Home, Plane, Building, Library } from 'lucide-react';
import { Link } from '@/i18n/routing';

import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'Services' });
  return { title: t('title') };
}


export default function ServicesPage() {
  const t = useTranslations('Services');

  const services = [
    {
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      title: t('admission'),
      description: t('admissionDesc'),
      color: "bg-blue-50"
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      title: t('visa'),
      description: t('visaDesc'),
      color: "bg-purple-50"
    },
    {
      icon: <Home className="h-8 w-8 text-emerald-500" />,
      title: t('housing'),
      description: t('housingDesc'),
      color: "bg-emerald-50"
    },
    {
      icon: <Plane className="h-8 w-8 text-amber-500" />,
      title: t('airport'),
      description: t('airportDesc'),
      color: "bg-amber-50"
    },
    {
      icon: <Building className="h-8 w-8 text-rose-500" />,
      title: t('tours'),
      description: t('toursDesc'),
      color: "bg-rose-50"
    },
    {
      icon: <Library className="h-8 w-8 text-indigo-500" />,
      title: t('equivalency'),
      description: t('equivalencyDesc'),
      color: "bg-indigo-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      {/* Header */}
      <div className="container mx-auto px-4 max-w-5xl mb-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          {t('title')}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 max-w-6xl mb-24">
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6`}>
                   {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>
            ))}
         </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-50 py-24 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('ctaTitle')}</h2>
           <p className="text-xl text-slate-600 mb-10">{t('ctaDesc')}</p>
           <Link href="/search" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 h-14 bg-blue-600 text-white hover:bg-blue-700 shadow-lg rounded-full px-10">
               {t('ctaButton')}
           </Link>
        </div>
      </div>
    </div>
  );
}
