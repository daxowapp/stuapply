"use client"

import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Building2, ChevronRight, GraduationCap } from 'lucide-react';
import { Link } from '@/i18n/routing';




const validCities = ['istanbul', 'ankara', 'izmir', 'eskisehir', 'antalya'];

export default function CityPage({ params }: { params: Promise<{ locale: string, city: string }> }) {
  const resolvedParams = use(params);
  const t = useTranslations('Turkey');
  
  if (!validCities.includes(resolvedParams.city)) {
    notFound();
  }

  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cityName = t(resolvedParams.city as 'istanbul' | 'ankara' | 'izmir' | 'eskisehir' | 'antalya');
  const cityDesc = t(`${resolvedParams.city}Desc` as any);

  useEffect(() => {
    async function fetchUniversities() {
      setLoading(true);
      
      let query = supabase.from('universities').select(`
        *,
        programs (count)
      `).ilike('city', `%${cityName}%`);

      const { data, error } = await query;
      if (!error && data) {
        setUniversities(data);
      }
      setLoading(false);
    }
    
    fetchUniversities();
  }, [cityName]);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-blue-500/30">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <Link href="/turkey" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium mb-8 backdrop-blur-md">
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>{t('backToTurkey')}</span>
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
            {t('studyIn')} <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">{cityName}</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
            {cityDesc}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">
        <div className="text-center mb-8">
           <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('universitiesIn')} {cityName}</h2>
           <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Results */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-32 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-slate-200/50 shadow-sm mt-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mb-4 shadow-sm"></div>
                <p className="text-slate-500 font-medium animate-pulse">{t('loadingUniversities')}</p>
             </div>
        ) : universities.length === 0 ? (
             <div className="text-center py-32 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-300 mt-8">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Building2 className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('noUniversitiesFound')}</h3>
                <p className="text-slate-500 max-w-sm mx-auto">{t('noUniversitiesDesc', { city: cityName })}</p>
             </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
             {universities.map((uni, idx) => (
                <Link 
                  key={uni.id} 
                  href={`/universities/${uni.id}`}
                  className="group bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Decorative background accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-white overflow-hidden rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {uni.logo_url ? (
                          <img src={uni.logo_url} alt={uni.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <Building2 className="h-8 w-8 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{uni.names_translations?.[resolvedParams.locale] || uni.name}</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                         <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                         <span className="font-medium text-[15px]">{uni.city_names_translations?.[resolvedParams.locale] || uni.city || cityName || 'Turkey'}</span>
                      </div>
                      <div className="flex items-center text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                         <GraduationCap className="h-5 w-5 mr-3 text-indigo-500" />
                         <span className="font-medium text-[15px]">{uni.programs?.[0]?.count || 0} {t('programsAvailable')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                     <span className="text-slate-500 text-sm font-medium">{t('exploreCampus')}</span>
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                       <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                     </div>
                  </div>
                </Link>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
