import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ProgramCard } from '@/components/search/ProgramCard';
import { MapPin, Building2, Globe, GraduationCap, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export const revalidate = 3600; // revalidate every hour

export async function generateMetadata({ params }: { params: Promise<{ id: string, locale: string }> }): Promise<Metadata> {
  const { id, locale } = await params;
  const { data } = await supabase.from('universities').select('name, names_translations, city, city_names_translations').eq('id', id).single();
  if (!data) return { title: 'Not Found' };
  
  return {
    title: `${data.names_translations?.[locale] || data.name} | Study in Turkey`,
    description: `Explore programs and apply to ${data.names_translations?.[locale] || data.name} located in ${data.city_names_translations?.[locale] || data.city || 'Turkey'}.`,
  };
}

export default async function UniversityDetailPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;

  // Fetch university details and its programs
  const { data: uni, error } = await supabase
    .from('universities')
    .select(`
      *,
      programs (*)
    `)
    .eq('id', id)
    .single();

  if (error || !uni) {
    notFound();
  }

  // programs array is available as uni.programs
  const programs = uni.programs || [];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-blue-500/30">
      {/* Immersive Hero Header */}
      <div className="relative pt-32 pb-40 overflow-hidden bg-slate-950">
         {/* Beautiful Ambient Background */}
         {uni.cover_image_url ? (
           <>
             <img src={uni.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
             <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />
             <div className="absolute inset-0 bg-linear-to-b from-slate-950/40 to-transparent" />
           </>
         ) : (
           <>
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
             {/* Decorative glowing orbs */}
             <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />
           </>
         )}

         {/* Grid Pattern Overlay */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />

         <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <Link 
              href="/universities" 
              className="group inline-flex items-center text-sm font-semibold text-slate-300 hover:text-white mb-8 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
              Back to Universities
            </Link>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-end">
              {/* Logo Card */}
              <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/20 p-2 shadow-2xl shrink-0 relative flex items-center justify-center isolate overflow-hidden group">
                 <div className="absolute inset-0 bg-white shadow-[inset_0_0_20px_rgba(255,255,255,0.8)] opacity-90 transition-opacity group-hover:opacity-100" />
                 <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-white flex items-center justify-center">
                    {uni.logo_url ? (
                       <img src={uni.logo_url} alt={uni.name} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                       <Building2 className="h-16 w-16 text-slate-300" />
                    )}
                 </div>
              </div>
              
              {/* Details */}
              <div className="flex-1 pb-2">
                 <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-blue-200 text-sm font-medium tracking-wide">
                       <MapPin className="w-4 h-4 mr-1.5" />
                       {uni.city_names_translations?.[locale] || uni.city || 'Turkey'}
                    </span>
                    {uni.founded_year && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-200 text-sm font-medium tracking-wide">
                         <Building2 className="w-4 h-4 mr-1.5" />
                         Est. {uni.founded_year}
                      </span>
                    )}
                 </div>
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4 drop-shadow-sm">
                   {uni.names_translations?.[locale] || uni.name}
                 </h1>
              </div>
            </div>
         </div>
      </div>

      {/* Main Content overlap */}
      <div className="container mx-auto px-4 max-w-7xl relative z-20 -mt-16 pb-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
           
           {/* Sidebar Info */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24 ring-1 ring-slate-900/5">
                 
                 {/* Quick Stats */}
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-linear-to-br from-slate-50 to-white rounded-2xl p-5 border border-slate-100/80 transition-shadow hover:shadow-md group">
                      <div className="text-blue-500 mb-3 bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                         <GraduationCap className="h-5 w-5" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-1">{programs.length}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Programs</div>
                    </div>
                    
                    <div className="bg-linear-to-br from-slate-50 to-white rounded-2xl p-5 border border-slate-100/80 transition-shadow hover:shadow-md group">
                      <div className="text-indigo-500 mb-3 bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Building2 className="h-5 w-5" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-1">{uni.city_names_translations?.[locale] || uni.city || 'TR'}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</div>
                    </div>
                 </div>

                 <div className="mb-8">
                   <h3 className="text-lg font-extrabold text-slate-900 flex items-center mb-4">
                     <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
                       About the University
                     </span>
                   </h3>
                   <p className="text-slate-600 leading-relaxed text-[15px]">
                     {uni.description || `${uni.names_translations?.[locale] || uni.name} is a leading educational institution located in ${uni.city_names_translations?.[locale] || uni.city || 'Turkey'}. Recognized for its academic excellence, it offers a wide range of undergraduate and postgraduate programs designed to prepare students for global careers.`}
                   </p>
                 </div>
                 
                 {/* Highlights */}
                 <div className="space-y-3 mb-8">
                    <div className="flex items-start text-slate-700 font-medium text-[15px] p-3 rounded-xl hover:bg-slate-50 transition-colors">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-0.5 mr-3 shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       Modern campus facilities
                    </div>
                    <div className="flex items-start text-slate-700 font-medium text-[15px] p-3 rounded-xl hover:bg-slate-50 transition-colors">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-0.5 mr-3 shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       International student support
                    </div>
                    <div className="flex items-start text-slate-700 font-medium text-[15px] p-3 rounded-xl hover:bg-slate-50 transition-colors">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-0.5 mr-3 shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       Strong industry connections
                    </div>
                 </div>

                 {/* CTA */}
                 {uni.website_url && (
                    <a href={uni.website_url} target="_blank" rel="noreferrer" className="group flex items-center justify-center w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white text-[15px] font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-slate-200">
                       Visit Official Website
                       <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </a>
                 )}
              </div>
           </div>

           {/* Programs List */}
           <div className="lg:col-span-8 mt-4 lg:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-slate-200/60">
                 <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Academic Programs</h2>
                    <p className="text-slate-500 font-medium">Discover your next degree from {uni.names_translations?.[locale] || uni.name}</p>
                 </div>
                 <div className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
                    {programs.length} {programs.length === 1 ? 'Program' : 'Programs'} Available
                 </div>
              </div>

              {programs.length === 0 ? (
                 <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-300">
                    <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                       <GraduationCap className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">No programs listed yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">We are currently updating our database. Programs for this university will appear here soon.</p>
                 </div>
              ) : (
                 <div className="grid gap-6">
                    {programs.map((prog: any, idx: number) => (
                       <div 
                         key={prog.id} 
                         className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                         style={{ animationDelay: `${idx * 100}ms` }}
                       >
                          <ProgramCard program={{...prog, universities: { name: uni.names_translations?.[locale] || uni.name }}} />
                       </div>
                    ))}
                 </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}
