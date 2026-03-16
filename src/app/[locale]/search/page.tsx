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

  const buildQuery = useCallback((isCount = false) => {
    let query = supabase.from('programs').select(
      isCount ? '*:count' : '*, universities!inner(name)', 
      isCount ? { count: 'exact', head: true } : {}
    );

    if (searchTerm) {
      // Create a search string looking in multiple columns:
      // Program name or University name.
      query = query.or(`name.ilike.%${searchTerm}%,universities.name.ilike.%${searchTerm}%`);
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
    
    // Get total count
    const countQuery = buildQuery(true);
    const { count } = await countQuery;
    setTotalCount(count || 0);

    // Get first page
    const query = buildQuery(false)
      .limit(PAGE_SIZE)
      .order('name');
    
    const { data, error } = await query;
    if (!error && data) {
      setPrograms(data);
      setHasMore(data.length === PAGE_SIZE);
    } else {
      setPrograms([]);
      setHasMore(false);
    }
    setLoading(false);
  }, [buildQuery]);

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

    const query = buildQuery(false)
      .range(from, to)
      .order('name');

    const { data, error } = await query;
    if (!error && data) {
      setPrograms(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setPage(nextPage);
    }
    setLoadingMore(false);
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      {/* Search Header Banner */}
      <div className="bg-slate-900 text-white pt-24 pb-12 mb-8 relative">
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/50 to-purple-900/50 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">{t('title')}</h1>
            <p className="text-slate-300 text-lg max-w-2xl">Browse thousands of programs across top universities to find your perfect fit.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8">
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
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-slate-600 font-medium">
                {totalCount !== null && (
                  <span>Showing {programs.length} of <strong className="text-slate-900">{totalCount}</strong> {t('resultsFound') || 'results'}</span>
                )}
             </div>
             <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-800 outline-none focus:border-blue-500 cursor-pointer">
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                </select>
             </div>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600 mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Loading programs...</p>
             </div>
          ) : programs.length === 0 ? (
             <div className="text-center py-32 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
               <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <SearchIcon className="h-8 w-8 text-slate-400" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">No programs found</h3>
               <p className="text-slate-500 max-w-md mx-auto">{t('noResults')}</p>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5">
                {programs.map(p => (
                   <ProgramCard key={p.id} program={p} />
                ))}
              </div>
              
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {loadingMore ? 'Loading...' : 'Load More Programs'}
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
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
