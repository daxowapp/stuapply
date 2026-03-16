"use client";

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useState } from 'react';
import { MapPin, CheckCircle2, Globe, HeartHandshake, ShieldCheck, Clock, Users, Building, Library, ArrowRight, Star, GraduationCap, Plane, Award } from 'lucide-react';




export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const tHero = useTranslations('Homepage.Hero');
  const tStats = useTranslations('Homepage.Stats');
  const tServices = useTranslations('Homepage.Services');
  const tWhyUs = useTranslations('Homepage.WhyUs');
  const tCTA = useTranslations('Homepage.CTA');
  const tNav = useTranslations('Navigation');

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[90vh] flex flex-col justify-center pb-20 pt-32 lg:pt-40">
        <div className="absolute inset-0 z-0">
          {/* Refined Mesh Gradient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b_0%,#020617_60%)] z-10" />
          {/* Subtle Ambient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen z-10 animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen z-10" />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-5xl mx-auto text-center font-sans tracking-tight">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-10 backdrop-blur-md shadow-2xl">
              <Star className="w-4 h-4 text-blue-400" />
              <span className="tracking-wide uppercase text-xs">{tWhyUs('point2')}</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] text-transparent bg-clip-text bg-linear-to-b from-white via-white to-slate-400 drop-shadow-sm">
              {tHero('title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-14 leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
              {tHero('subtitle')}
            </p>

            <div className="bg-slate-900/40 backdrop-blur-2xl p-2.5 rounded-full flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-white/10 relative transition-all duration-300 focus-within:border-white/20 focus-within:shadow-[0_8px_40px_rgba(37,99,235,0.2)] focus-within:bg-slate-900/60">
              <div className="flex-1 flex items-center bg-transparent rounded-full px-6 py-3">
                <MapPin className="text-blue-500 w-6 h-6 mr-4 shrink-0" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim()) {
                      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                    }
                  }}
                  placeholder={tHero('searchPlaceholder')}
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-lg font-light tracking-wide"
                />
              </div>
              <button 
                onClick={() => {
                  if (searchTerm.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                  } else {
                    router.push('/search');
                  }
                }}
                className="inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 font-medium rounded-full bg-blue-600 hover:bg-blue-500 py-4 px-10 text-lg text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 cursor-pointer"
              >
                {tHero('searchButton')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 font-medium tracking-wide">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-blue-500/80" />
                <span>{tServices('freeService')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-blue-500/80" />
                <span>{tServices('fastProcessing')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flowing Stats - Integrated smoothly with hero */}
      <section className="relative z-30 bg-slate-950 border-t border-white/5 pb-20 pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="flex flex-col items-center py-8">
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-3 drop-shadow-xs">{tStats('students')}</h3>
                <p className="text-slate-400 font-medium text-sm tracking-[0.2em] uppercase">{tStats('studentsLabel')}</p>
              </div>
              <div className="flex flex-col items-center py-8">
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-3 drop-shadow-xs">{tStats('universities')}</h3>
                <p className="text-slate-400 font-medium text-sm tracking-[0.2em] uppercase">{tStats('universitiesLabel')}</p>
              </div>
              <div className="flex flex-col items-center py-8">
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-3 drop-shadow-xs">{tStats('programs')}</h3>
                <p className="text-slate-400 font-medium text-sm tracking-[0.2em] uppercase">{tStats('programsLabel')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Modern Dark Bento */}
      <section className="py-32 bg-[#020617] relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-blue-500 uppercase mb-4">{tServices('title')}</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tighter">{tServices('subtitle')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto cursor-default">
            
            {/* Featured Service (Large Card) */}
            <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] p-10 md:p-14 border border-white/5 hover:bg-slate-800/80 transition-colors duration-500 group relative">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white tracking-tight">{tServices('counseling')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg max-w-xl mb-10 font-light">{tServices('counselingDesc')}</p>
              <div className="flex items-center text-blue-400 font-medium cursor-pointer">
                {tServices('learnMore')} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>

            {/* Application Service */}
            <div className="bg-slate-900 rounded-[2rem] p-10 md:p-12 border border-white/5 hover:bg-slate-800/80 transition-colors duration-500 group">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{tServices('application')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg font-light">{tServices('applicationDesc')}</p>
            </div>

            {/* Fast Processing */}
            <div className="bg-slate-900 rounded-[2rem] p-10 md:p-12 border border-white/5 hover:bg-slate-800/80 transition-colors duration-500 group">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{tServices('fastProcessing')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg font-light">{tServices('fastProcessingDesc')}</p>
            </div>

            {/* Arrival Support */}
            <div className="bg-slate-900 rounded-[2rem] p-10 md:p-12 border border-white/5 hover:bg-slate-800/80 transition-colors duration-500 group">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Plane className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{tServices('arrival')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg font-light">{tServices('arrivalDesc')}</p>
            </div>

            {/* Student Care */}
            <div className="bg-slate-900 rounded-[2rem] p-10 md:p-12 border border-white/5 hover:bg-slate-800/80 transition-colors duration-500 group">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8 border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{tServices('studentCare')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg font-light">{tServices('studentCareDesc')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* Discovery Paths / Why Us - Cinematic Layout */}
      <section className="py-32 bg-[#020617] relative border-t border-white/5">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 lg:gap-28 items-center max-w-7xl mx-auto">
            
            <div className="flex-1 relative order-2 lg:order-1 w-full mt-10 lg:mt-0">
               <div className="aspect-[4/5] md:aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 relative group bg-slate-900 shadow-2xl">
                  <div className="absolute inset-0 bg-linear-to-tr from-[#020617] via-transparent to-transparent z-10 opacity-80" />
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                    alt="Students" 
                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-10 md:p-12 z-20">
                    <div className="flex items-center gap-4 mb-6 backdrop-blur-md bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10">
                      <div className="flex -space-x-3">
                        <div className="w-8 h-8 rounded-full border border-[#020617] bg-slate-800" />
                        <div className="w-8 h-8 rounded-full border border-[#020617] bg-slate-700" />
                        <div className="w-8 h-8 rounded-full border border-[#020617] bg-slate-600" />
                      </div>
                      <span className="font-medium text-slate-300 text-sm tracking-wide">{tWhyUs('community')}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-white">{tWhyUs('confidenceTitle')}</h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-light">{tWhyUs('confidenceDesc')}</p>
                  </div>
               </div>
               
               {/* Minimal Glass Badges */}
               <div className="absolute top-10 -right-4 md:-right-8 backdrop-blur-xl bg-slate-900/60 p-6 rounded-[2rem] border border-white/10 flex items-center gap-5 z-30">
                  <div className="bg-white/5 text-white p-4 rounded-2xl border border-white/10">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mb-1">{tWhyUs('acceptanceRate')}</p>
                    <p className="text-3xl font-black text-white">99.9%</p>
                  </div>
               </div>
               
               <div className="absolute bottom-32 -left-4 md:-left-8 backdrop-blur-xl bg-slate-900/60 p-6 rounded-[2rem] border border-white/10 flex items-center gap-5 z-30">
                  <div className="bg-white/5 text-white p-4 rounded-2xl border border-white/10">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mb-1">{tWhyUs('officialPartners')}</p>
                    <p className="text-3xl font-black text-white">100+</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 space-y-16 order-1 lg:order-2">
              <div>
                <h2 className="text-sm font-semibold tracking-[0.2em] text-blue-500 uppercase mb-4">{tWhyUs('title')}</h2>
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.05]">
                  <span className="text-white block">{tWhyUs('smartestWay')}</span> 
                  <span className="text-slate-500">{tWhyUs('smartestWaySub')}</span>
                </h3>
                <p className="text-xl text-slate-400 leading-relaxed font-light">{tWhyUs('subtitle')}</p>
              </div>

              <ul className="space-y-10">
                <li className="flex gap-6 items-start">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight">{tWhyUs('point1Title')}</h4>
                    <p className="text-slate-400 text-lg leading-relaxed font-light">{tWhyUs('point1')}</p>
                  </div>
                </li>
                <li className="flex gap-6 items-start">
                  <div className="mt-1">
                    <Star className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight">{tWhyUs('point2Title')}</h4>
                    <p className="text-slate-400 text-lg leading-relaxed font-light">{tWhyUs('point2')}</p>
                  </div>
                </li>
                <li className="flex gap-6 items-start">
                  <div className="mt-1">
                    <Globe className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight">{tWhyUs('point3Title')}</h4>
                    <p className="text-slate-400 text-lg leading-relaxed font-light">{tWhyUs('point3')}</p>
                  </div>
                </li>
              </ul>

              <div className="pt-4">
                 <Link href="/apply" className="inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 font-medium rounded-full bg-white hover:bg-slate-200 text-slate-900 px-10 py-4 text-lg active:scale-95 group">
                    {tWhyUs('cta')}
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section - Minimal Deep Vibe */}
      <section className="py-32 md:py-48 relative overflow-hidden bg-[#020617] border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen z-10" />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center text-white">
          <div className="max-w-4xl mx-auto backdrop-blur-xs p-8">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.1]">{tCTA('title')}</h2>
            <p className="text-xl md:text-2xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">{tCTA('desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply" className="inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 font-medium rounded-full bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 text-lg active:scale-95 group shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                 {tNav('applyNow')}
                 <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 font-medium rounded-full bg-slate-900 border border-white/10 hover:bg-slate-800 text-white px-12 py-4 text-lg active:scale-95">
                 {tNav('contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
