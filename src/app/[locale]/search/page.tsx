"use client";

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FilterSidebar, Filters } from '@/components/search/FilterSidebar';
import { ProgramCard } from '@/components/search/ProgramCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

function SearchContent() {
  const t = useTranslations('Search');
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [filters, setFilters] = useState<Filters>({
    levels: [],
    languages: [],
    university: '',
    minPrice: '',
    maxPrice: ''
  });

  const PAGE_SIZE = 20;

  const SELECTED_COLUMNS = 'id,name,name_translations,level,language,official_price,discounted_price,currency,universities(name,names_translations)';

  const applyFilters = useCallback((query: any) => {
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    if (filters.levels.length > 0) {
      query = query.in('level', filters.levels);
    }

    if (filters.languages.length > 0) {
      query = query.in('language', filters.languages);
    }

    if (filters.university) {
      query = query.ilike('universities.name', `%${filters.university}%`);
    }

    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      query = query.or(`and(discounted_price.gt.0,discounted_price.gte.${min}),and(discounted_price.eq.0,official_price.gte.${min}),and(discounted_price.is.null,official_price.gte.${min})`);
    }

    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      query = query.or(`and(discounted_price.gt.0,discounted_price.lte.${max}),and(discounted_price.eq.0,official_price.lte.${max}),and(discounted_price.is.null,official_price.lte.${max})`);
    }

    return query;
  }, [searchTerm, filters]);

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    setPage(1);
    
    // Single query: fetch data + count in one round-trip
    let query = supabase
      .from('programs')
      .select(SELECTED_COLUMNS, { count: 'exact' })
      .limit(PAGE_SIZE)
      .order('name');
    
    query = applyFilters(query);
    
    const { data, count, error } = await query;
    if (!error && data) {
      setPrograms(data);
      setTotalCount(count ?? 0);
      setHasMore(data.length === PAGE_SIZE);
    } else {
      setPrograms([]);
      setTotalCount(0);
      setHasMore(false);
    }
    setLoading(false);
  }, [applyFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchInitial();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchInitial]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const from = (nextPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('programs')
      .select(SELECTED_COLUMNS)
      .range(from, to)
      .order('name');
    
    query = applyFilters(query);

    const { data, error } = await query;
    if (!error && data) {
      setPrograms(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setPage(nextPage);
    }
    setLoadingMore(false);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 selection:bg-slate-900 selection:text-white">
      {/* Structural Header Banner */}
      <header className="border-b-2 border-slate-900 bg-white pt-32 pb-16 mb-12 relative overflow-hidden">
        {/* Architectual decoration */}
        <div className="absolute top-0 right-10 w-px h-full bg-slate-100 hidden lg:block"></div>
        <div className="absolute top-0 right-40 w-px h-full bg-slate-100 hidden lg:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-6 uppercase">{t('title')}</h1>
            <p className="text-slate-600 text-xs md:text-sm font-bold tracking-[0.2em] max-w-2xl uppercase leading-relaxed border-l-4 border-slate-900 pl-6 py-1">
               {t('subtitle')}
            </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12">
        {/* Filters Sidebar */}
        <div className="w-full md:w-80 shrink-0">
          <FilterSidebar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 border-slate-900 pb-4 gap-4">
             <div className="text-slate-900 font-bold tracking-widest uppercase text-xs">
                {totalCount !== null && (
                  <span>INDEX: {programs.length} / <strong className="font-black text-slate-900">{totalCount}</strong> {t('resultsFound')}</span>
                )}
             </div>
             <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hidden sm:inline">{t('sortLabel')}</span>
                 <select className="text-xs font-bold uppercase tracking-widest border-2 border-slate-900 bg-white px-4 py-2 text-slate-900 outline-none focus:ring-0 cursor-pointer hover:bg-slate-900 hover:text-white transition-colors">
                     <option>{t('sortRecommended')}</option>
                     <option>{t('sortPriceLow')}</option>
                     <option>{t('sortPriceHigh')}</option>
                 </select>
             </div>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 border-2 border-slate-900 border-dashed bg-white">
                 <div className="animate-spin h-10 w-10 border-4 border-slate-200 border-t-slate-900 rounded-none mb-6"></div>
                 <p className="text-slate-900 font-bold tracking-widest uppercase text-xs animate-pulse">{t('loading')}</p>
             </div>
          ) : programs.length === 0 ? (
             <div className="text-center py-32 bg-white border-2 border-slate-900 flex flex-col items-center">
                <SearchIcon className="h-12 w-12 text-slate-300 mb-6" strokeWidth={1} />
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2 uppercase">{t('zeroRecords')}</h3>
                <p className="text-slate-600 max-w-md mx-auto font-bold tracking-[0.2em] uppercase text-[10px] mt-4 leading-relaxed">{t('noResults')}</p>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {programs.map(p => (
                   <ProgramCard key={p.id} program={p} />
                ))}
              </div>
              
              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border-2 border-slate-900 text-slate-900 font-bold uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50 w-full sm:w-auto"
                  >
                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {loadingMore ? t('loadingMore') : t('loadMore')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const t = useTranslations('Search');
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-slate-200 border-t-slate-900 rounded-none mb-6"></div>
        <p className="text-slate-900 font-bold tracking-widest uppercase text-xs animate-pulse">{t('initializing')}</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
