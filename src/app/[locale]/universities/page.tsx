"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Search, MapPin, Building2, ChevronRight, GraduationCap, SlidersHorizontal, X, ChevronDown, Calendar } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function UniversitiesPage() {
  const t = useTranslations('Universities');
  const locale = useLocale();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all universities once on mount
  useEffect(() => {
    async function fetchUniversities() {
      setLoading(true);
      const { data, error } = await supabase.from('universities').select(`
        *,
        programs (count)
      `);
      if (!error && data) {
        setUniversities(data);
      }
      setLoading(false);
    }
    fetchUniversities();
  }, []);

  // Extract unique cities for the filter dropdown
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    universities.forEach(uni => {
      const city = uni.city_names_translations?.[locale] || uni.city;
      if (city && city !== 'Turkey') citySet.add(city);
    });
    return Array.from(citySet).sort((a, b) => a.localeCompare(b, locale));
  }, [universities, locale]);

  // Client-side filter + sort
  const filteredUniversities = useMemo(() => {
    let result = [...universities];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(uni => {
        const name = (uni.names_translations?.[locale] || uni.name || '').toLowerCase();
        const city = (uni.city_names_translations?.[locale] || uni.city || '').toLowerCase();
        return name.includes(q) || city.includes(q);
      });
    }

    // City filter
    if (selectedCity) {
      result = result.filter(uni => {
        const city = uni.city_names_translations?.[locale] || uni.city;
        return city === selectedCity;
      });
    }

    // Sort
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => (a.names_translations?.[locale] || a.name || '').localeCompare(b.names_translations?.[locale] || b.name || '', locale));
        break;
      case 'name-desc':
        result.sort((a, b) => (b.names_translations?.[locale] || b.name || '').localeCompare(a.names_translations?.[locale] || a.name || '', locale));
        break;
      case 'programs':
        result.sort((a, b) => (b.programs?.[0]?.count || 0) - (a.programs?.[0]?.count || 0));
        break;
    }

    return result;
  }, [universities, searchTerm, selectedCity, sortBy, locale]);

  const hasActiveFilters = searchTerm || selectedCity || sortBy !== 'default';

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSortBy('default');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-blue-500/30">
      {/* Hero Section */}
      <div className="relative pt-32 pb-28 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
            {t('title')} <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">{t('titleHighlight')}</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
            {t('subtitle')}
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative group">
             <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                 <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             </div>
             <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full h-16 pl-14 pr-6 bg-white/10 hover:bg-white/15 focus:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-white placeholder-slate-400 outline-none ring-0 focus:ring-4 focus:ring-blue-500/30 transition-all text-lg shadow-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             {searchTerm && (
               <button
                 onClick={() => setSearchTerm('')}
                 className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-white transition-colors"
               >
                 <X className="h-5 w-5" />
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-20">
        {/* Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl -mt-8 rounded-2xl border border-slate-200/60 shadow-lg px-6 py-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 text-slate-600 font-medium text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('filters')}
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className={`flex flex-col md:flex-row md:items-center gap-4 flex-1 ${showFilters ? '' : 'hidden md:flex'}`}>
              {/* City Filter */}
              <div className="relative flex-shrink-0">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all cursor-pointer min-w-[180px]"
                >
                  <option value="">{t('allCities')}</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative flex-shrink-0">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all cursor-pointer min-w-[180px]"
                >
                  <option value="default">{t('sortDefault')}</option>
                  <option value="name-asc">{t('sortNameAsc')}</option>
                  <option value="name-desc">{t('sortNameDesc')}</option>
                  <option value="programs">{t('sortProgramsDesc')}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Results count + Clear */}
              <div className="flex items-center gap-3">
                {!loading && (
                  <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                    {t('showingResults', { count: filteredUniversities.length })}
                  </span>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors whitespace-nowrap"
                  >
                    <X className="h-3.5 w-3.5" />
                    {t('clearFilters')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
                  <Search className="h-3 w-3" />
                  &ldquo;{searchTerm}&rdquo;
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-900 ml-0.5"><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedCity && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-100">
                  <MapPin className="h-3 w-3" />
                  {selectedCity}
                  <button onClick={() => setSelectedCity('')} className="hover:text-emerald-900 ml-0.5"><X className="h-3 w-3" /></button>
                </span>
              )}
              {sortBy !== 'default' && (
                <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-100">
                  <SlidersHorizontal className="h-3 w-3" />
                  {sortBy === 'name-asc' ? t('sortNameAsc') : sortBy === 'name-desc' ? t('sortNameDesc') : t('sortProgramsDesc')}
                  <button onClick={() => setSortBy('default')} className="hover:text-indigo-900 ml-0.5"><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-32 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm">
                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mb-4 shadow-sm"></div>
                 <p className="text-slate-500 font-medium animate-pulse">{t('loading')}</p>
             </div>
        ) : filteredUniversities.length === 0 ? (
           <div className="flex justify-center w-full">
             <div className="text-center py-32 bg-white/60 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300 w-full max-w-lg">
                 <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <Building2 className="h-10 w-10 text-slate-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('noResults')}</h3>
                 <p className="text-slate-500 max-w-sm mx-auto mb-6">{t('noResultsDesc')}</p>
                 {hasActiveFilters && (
                   <button
                     onClick={clearAllFilters}
                     className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                   >
                     <X className="h-4 w-4" />
                     {t('clearFilters')}
                   </button>
                 )}
             </div>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
             {filteredUniversities.map((uni, idx) => (
                <Link 
                  key={uni.id} 
                  href={`/universities/${uni.id}`}
                  className="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  {/* Card Header with gradient accent */}
                  <div className="relative h-2 bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Logo + Name */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-14 h-14 bg-slate-50 overflow-hidden rounded-xl flex items-center justify-center border border-slate-100 shrink-0 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                        {uni.logo_url ? (
                          <img src={uni.logo_url} alt={uni.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <Building2 className="h-7 w-7 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{uni.names_translations?.[locale] || uni.name}</h3>
                      </div>
                    </div>
                    
                    {/* Info Badges */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-100/50">
                         <MapPin className="h-3.5 w-3.5" />
                         {uni.city_names_translations?.[locale] || uni.city || 'Turkey'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-100/50">
                         <GraduationCap className="h-3.5 w-3.5" />
                         {uni.programs?.[0]?.count || 0} {t('programs')}
                      </span>
                      {uni.founded_year && (
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-100/50">
                           <Calendar className="h-3.5 w-3.5" />
                           {t('founded')} {uni.founded_year}
                        </span>
                      )}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />
                    
                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                       <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">{t('viewDetails')}</span>
                       <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                       </div>
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
