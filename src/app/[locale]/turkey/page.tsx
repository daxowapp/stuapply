import { useTranslations } from 'next-intl';
import { Map, Coffee, BookOpen, Currency, Building2, ChevronRight, GraduationCap } from 'lucide-react';
import { Link } from '@/i18n/routing';

import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'Turkey' });
  return { title: t('title') };
}


export default function TurkeyPage() {
  const t = useTranslations('Turkey');

  const benefits = [
    {
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      title: t('quality'),
      description: t('qualityDesc')
    },
    {
      icon: <Currency className="h-6 w-6 text-emerald-500" />,
      title: t('affordable'),
      description: t('affordableDesc')
    },
    {
      icon: <Map className="h-6 w-6 text-indigo-500" />,
      title: t('strategicLocation'),
      description: t('strategicLocationDesc')
    },
    {
      icon: <Coffee className="h-6 w-6 text-amber-500" />,
      title: t('vibrantCulture'),
      description: t('vibrantCultureDesc')
    }
  ];

  const cities = [
    {
      id: "istanbul",
      name: t('istanbul'),
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800",
      description: t('istanbulDesc'),
      tag: t('istanbulTag'),
      universities: "50+"
    },
    {
      id: "ankara",
      name: t('ankara'),
      image: "https://images.unsplash.com/photo-1589030343991-69ea1433b941?auto=format&fit=crop&q=80&w=800",
      description: t('ankaraDesc'),
      tag: t('ankaraTag'),
      universities: "15+"
    },
    {
      id: "izmir",
      name: t('izmir'),
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800",
      description: t('izmirDesc'),
      tag: t('izmirTag'),
      universities: "9+"
    },
    {
      id: "eskisehir",
      name: t('eskisehir'),
      image: "https://images.unsplash.com/photo-1549419137-b6f79be96ebd?auto=format&fit=crop&q=80&w=800",
      description: t('eskisehirDesc'),
      tag: t('eskisehirTag'),
      universities: "3"
    },
    {
      id: "antalya",
      name: t('antalya'),
      image: "https://images.unsplash.com/photo-1542051812871-75ec466c1417?auto=format&fit=crop&q=80&w=800",
      description: t('antalyaDesc'),
      tag: t('antalyaTag'),
      universities: "4+"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-blue-500/30">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-200 text-sm font-medium mb-8 backdrop-blur-md">
            <Map className="w-4 h-4" />
            <span>{t('discoverDestination')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Why Turkey Grid */}
      <div className="container mx-auto px-4 max-w-7xl -mt-12 relative z-20 mb-24">
         <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-200/50">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('whyTurkey')}</h2>
               <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {benefits.map((benefit, i) => (
                 <div key={i} className="text-center p-8 bg-slate-50/50 hover:bg-slate-50 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                   <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                   <p className="text-slate-600 text-[15px] leading-relaxed">{benefit.description}</p>
                 </div>
              ))}
            </div>
         </div>
      </div>

      {/* Cities Section */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
           <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('cities')}</h2>
              <p className="text-lg text-slate-600 max-w-2xl">{t('citiesDesc')}</p>
           </div>
           <Link href="/universities" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow-md transition-all">
              {t('viewAllUniversities')}
              <ChevronRight className="ml-2 h-5 w-5" />
           </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {cities.map((city, i) => (
             <Link 
               href={`/turkey/${city.id}`} 
               key={i} 
               className={`group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-white border border-slate-200/60 block relative flex flex-col h-full ${i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
               style={{ animationDelay: `${i * 100}ms` }}
             >
                <div className={`${i === 0 ? 'h-80 md:h-96' : 'h-64'} overflow-hidden relative`}>
                   <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                   <img 
                     src={city.image} 
                     alt={city.name} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className="absolute top-6 left-6 z-20 flex flex-wrap gap-2">
                     <div className="bg-white/95 backdrop-blur-md text-sm font-bold px-4 py-2 rounded-full text-slate-900 shadow-sm flex items-center gap-2">
                       <Map className="w-4 h-4 text-blue-600" />
                       {city.tag}
                     </div>
                   </div>
                </div>
                <div className="p-8 flex-1 flex flex-col relative z-20 bg-white">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{city.name}</h3>
                     <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                       <ChevronRight className="w-6 h-6" />
                     </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6 text-[15px] flex-1">
                    {city.description}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-auto">
                     <div className="flex items-center text-slate-900 font-medium bg-blue-50/50 px-4 py-2 rounded-xl">
                       <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                       <span>{city.universities} {t('universities')}</span>
                     </div>
                  </div>
                </div>
             </Link>
           ))}
        </div>
      </div>
    </div>
  );
}
