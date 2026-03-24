"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/routing';
import {
  Search,
  MapPin,
  Building2,
  ArrowRight,
  GraduationCap,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  Loader2,
} from 'lucide-react';

export default function UniversitiesPage() {
  const t = useTranslations('Universities');
  const locale = useLocale();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Extract unique countries for the filter
  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    universities.forEach(uni => {
      const country = uni.country;
      if (country) countrySet.add(country);
    });
    return Array.from(countrySet).sort((a, b) => a.localeCompare(b, locale));
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
        const country = (uni.country || '').toLowerCase();
        return name.includes(q) || city.includes(q) || country.includes(q);
      });
    }

    // Country filter
    if (selectedCountry) {
      result = result.filter(uni => uni.country === selectedCountry);
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
  }, [universities, searchTerm, selectedCountry, sortBy, locale]);

  const hasActiveFilters = searchTerm || selectedCountry || sortBy !== 'default';

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSortBy('default');
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 selection:bg-slate-900 selection:text-white">
      {/* Structural Header Banner */}
      <header className="border-b-2 border-slate-900 bg-white pt-32 pb-16 mb-12 relative overflow-hidden">
        {/* Architectural decoration */}
        <div className="absolute top-0 right-10 w-px h-full bg-slate-100 hidden lg:block"></div>
        <div className="absolute top-0 right-40 w-px h-full bg-slate-100 hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-6 uppercase">
            {t('title')}
          </h1>
          <p className="text-slate-600 text-xs md:text-sm font-bold tracking-[0.2em] max-w-2xl uppercase leading-relaxed border-l-4 border-slate-900 pl-6 py-1">
            {t('subtitle')}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12">
        {/* Filters Sidebar */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-[#FAFAFA] p-8 border-2 border-slate-900 sticky top-28 mb-8 md:mb-0">
            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-900">
              <div className="flex items-center gap-3 text-slate-900">
                <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
                <h2 className="text-xl font-black tracking-tighter uppercase">{t('filters')}</h2>
              </div>
            </div>

            <div className="space-y-10">
              {/* Search */}
              <div>
                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-900 mb-4 block">
                  {t('query')}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-900" strokeWidth={1.5} />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-white border-2 border-slate-900 focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:bg-slate-50 h-14 rounded-none text-sm font-bold tracking-wide uppercase placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Country Filter */}
              <div>
                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-900 mb-4 block border-b-2 border-slate-900 pb-2">
                  {t('country')}
                </label>
                <div className="space-y-3 mt-4 max-h-64 overflow-y-auto">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-6 h-6">
                      <input
                        type="radio"
                        name="country"
                        checked={selectedCountry === ''}
                        onChange={() => setSelectedCountry('')}
                        className="peer w-6 h-6 rounded-none border-2 border-slate-900 text-slate-900 focus:ring-slate-900 appearance-none bg-white checked:bg-slate-900 checked:border-slate-900 transition-colors cursor-pointer"
                      />
                      <div className="absolute w-2.5 h-2.5 bg-white pointer-events-none opacity-0 peer-checked:opacity-100"></div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">
                      {t('allCountries')}
                    </span>
                  </label>
                  {countries.map(country => (
                    <label key={country} className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-6 h-6">
                        <input
                          type="radio"
                          name="country"
                          checked={selectedCountry === country}
                          onChange={() => setSelectedCountry(country)}
                          className="peer w-6 h-6 rounded-none border-2 border-slate-900 text-slate-900 focus:ring-slate-900 appearance-none bg-white checked:bg-slate-900 checked:border-slate-900 transition-colors cursor-pointer"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-white pointer-events-none opacity-0 peer-checked:opacity-100"></div>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">
                        {country}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-900 mb-4 block border-b-2 border-slate-900 pb-2">
                  {t('sortBy')}
                </label>
                <div className="relative mt-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full text-xs font-bold uppercase tracking-widest border-2 border-slate-900 bg-white px-4 py-4 text-slate-900 outline-none focus:ring-0 cursor-pointer hover:bg-slate-900 hover:text-white transition-colors appearance-none rounded-none"
                  >
                    <option value="default">{t('sortDefault')}</option>
                    <option value="name-asc">{t('sortNameAsc')}</option>
                    <option value="name-desc">{t('sortNameDesc')}</option>
                    <option value="programs">{t('sortProgramsDesc')}</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full text-xs font-bold uppercase tracking-widest border-2 border-slate-900 bg-slate-900 text-white px-4 py-4 hover:bg-white hover:text-slate-900 transition-colors"
                >
                  {t('clearFilters')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 border-slate-900 pb-4 gap-4">
            <div className="text-slate-900 font-bold tracking-widest uppercase text-xs">
              {!loading && (
                <span>INDEX: {filteredUniversities.length} / <strong className="font-black text-slate-900">{universities.length}</strong> {t('resultsFound')}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hidden sm:inline">{t('sortLabel')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold uppercase tracking-widest border-2 border-slate-900 bg-white px-4 py-2 text-slate-900 outline-none focus:ring-0 cursor-pointer hover:bg-slate-900 hover:text-white transition-colors"
              >
                <option value="default">{t('sortDefault')}</option>
                <option value="name-asc">{t('sortNameAsc')}</option>
                <option value="name-desc">{t('sortNameDesc')}</option>
                <option value="programs">{t('sortProgramsDesc')}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-slate-900 border-dashed bg-white">
              <div className="animate-spin h-10 w-10 border-4 border-slate-200 border-t-slate-900 rounded-none mb-6"></div>
              <p className="text-slate-900 font-bold tracking-widest uppercase text-xs animate-pulse">{t('loading')}</p>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="text-center py-32 bg-white border-2 border-slate-900 flex flex-col items-center">
              <Building2 className="h-12 w-12 text-slate-300 mb-6" strokeWidth={1} />
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2 uppercase">{t('noResults')}</h3>
              <p className="text-slate-600 max-w-md mx-auto font-bold tracking-[0.2em] uppercase text-[10px] mt-4 leading-relaxed">{t('noResultsDesc')}</p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-8 text-xs font-bold uppercase tracking-widest border-2 border-slate-900 bg-slate-900 text-white px-8 py-3 hover:bg-white hover:text-slate-900 transition-colors"
                >
                  {t('clearFilters')}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredUniversities.map(uni => (
                <Link
                  key={uni.id}
                  href={`/universities/${uni.id}`}
                  className="group flex flex-col sm:flex-row border-2 border-slate-900 bg-white transition-all duration-300 hover:bg-slate-900 overflow-hidden relative"
                >
                  {/* Structural Image Area */}
                  <div className="sm:w-1/4 border-b-2 sm:border-b-0 sm:border-r-2 border-slate-900 flex items-center justify-center p-8 bg-slate-50 group-hover:bg-slate-800 transition-colors duration-300">
                    {uni.logo_url ? (
                      <img src={uni.logo_url} alt={uni.name} className="h-16 w-16 object-contain group-hover:brightness-200 transition-all duration-300" />
                    ) : (
                      <Building2 className="h-16 w-16 text-slate-300 group-hover:text-slate-100 transition-colors duration-300" strokeWidth={1} />
                    )}
                  </div>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col h-full group-hover:text-white transition-colors duration-300">
                    {/* Name + Country badge */}
                    <div className="flex justify-between items-start mb-6 gap-4">
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter leading-none mb-3 group-hover:text-white transition-colors">
                          {uni.names_translations?.[locale] || uni.name}
                        </h3>
                        <div className="flex items-center text-slate-600 text-sm font-bold group-hover:text-slate-300 transition-colors tracking-widest uppercase">
                          <MapPin className="h-4 w-4 mr-2" strokeWidth={1.5} />
                          <span className="truncate">{uni.city_names_translations?.[locale] || uni.city || '—'}</span>
                        </div>
                      </div>
                      {uni.country && (
                        <div className="hidden md:flex flex-col items-end shrink-0">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] border-2 border-slate-900 text-slate-900 px-3 py-1.5 group-hover:border-white group-hover:text-white transition-colors bg-white group-hover:bg-transparent">
                            {uni.country}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info row */}
                    <div className="flex flex-wrap gap-4 mt-auto mb-8 border-y-2 border-slate-900 py-3 group-hover:border-slate-700 transition-colors">
                      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-white mr-4">
                        <GraduationCap className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        {uni.programs?.[0]?.count || 0} {t('programs')}
                      </div>
                      {uni.country && (
                        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-white mr-4 md:hidden">
                          <Globe className="h-4 w-4 mr-2" strokeWidth={1.5} />
                          {uni.country}
                        </div>
                      )}
                      {uni.founded_year && (
                        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-white">
                          {t('founded')}: {uni.founded_year}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-end justify-end">
                      <span className="group/btn inline-flex items-center justify-center font-bold tracking-[0.2em] uppercase text-xs h-14 border-2 border-slate-900 bg-[#FAFAFA] text-slate-900 hover:bg-slate-900 hover:text-white group-hover:border-white group-hover:bg-white group-hover:text-slate-900 transition-all px-10">
                        {t('viewDetails')}
                        <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
