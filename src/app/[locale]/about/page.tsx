import { useTranslations } from 'next-intl';
import { Target, Lightbulb, Users, CheckCircle2 } from 'lucide-react';

import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'About' });
  return { title: t('title') };
}


export default function AboutPage() {
  const t = useTranslations('About');

  const values = [
    {
      icon: <Target className="h-6 w-6 text-blue-500" />,
      title: "Mission-Driven",
      description: "Dedicated to eliminating barriers to international education.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      title: "Transparent & Free",
      description: "No hidden fees. Our placement services are 100% sponsored by universities.",
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-500" />,
      title: "Student-First",
      description: "From application to graduation, the student's success is our core focus.",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      {/* Hero Section */}
      <div className="container mx-auto px-4 max-w-5xl mb-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          {t('title')}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="container mx-auto px-4 max-w-6xl mb-24">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 rounded-l-3xl"></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('mission')}
            </p>
          </div>
          
          {/* Vision */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 rounded-l-3xl"></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
             <p className="text-lg text-slate-600 leading-relaxed">
              {t('vision')}
            </p>
          </div>
        </div>
      </div>

      {/* Why Trust Us Section */}
      <div className="bg-white border-y border-slate-200 py-24 mb-24">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('whyTrustUs')}</h2>
             <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
             {values.map((v, i) => (
                <div key={i} className="text-center p-6">
                  <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                     {v.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
                  <p className="text-slate-600">{v.description}</p>
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* Stats / Final CTA Area */}
      <div className="container mx-auto px-4 max-w-4xl text-center">
         <div className="bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-30 z-0" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of international students who have successfully placed into top Turkish universities through Student Apply.
              </p>
              <a href="/apply" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 h-12 bg-white text-slate-900 hover:bg-slate-100 shadow-md hover:shadow-lg rounded-full px-8">
                Apply Now For Free
              </a>
            </div>
         </div>
      </div>

    </div>
  );
}
