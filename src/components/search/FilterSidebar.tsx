import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

export interface Filters {
  levels: string[];
  languages: string[];
  university: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterSidebarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function FilterSidebar({ searchTerm, setSearchTerm, filters, setFilters }: FilterSidebarProps) {
  const t = useTranslations('Search');
  
  const toggleLevel = (level: string) => {
    setFilters(prev => ({
      ...prev,
      levels: prev.levels.includes(level) 
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level]
    }));
  };

  const toggleLanguage = (lang: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang) 
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  return (
    <div className="bg-[#FAFAFA] p-8 border-2 border-slate-900 sticky top-28 mb-8 md:mb-0">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center gap-3 text-slate-900">
            <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
            <h2 className="text-xl font-black tracking-tighter uppercase">{t('filters') || 'FILTERS'}</h2>
        </div>
      </div>
      
      <div className="space-y-10">
        <div>
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-900 mb-4 block">Query</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-900" strokeWidth={1.5} />
            <Input 
              placeholder={t('placeholder') || 'SEARCH CATALOG'} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white border-2 border-slate-900 focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:bg-slate-50 h-14 rounded-none text-sm font-bold tracking-wide uppercase placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-900 mb-4 block">Institution</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-900" strokeWidth={1.5} />
            <Input 
              placeholder="E.G. ISTANBUL UNIVERSITY" 
              value={filters.university}
              onChange={(e) => setFilters(prev => ({ ...prev, university: e.target.value }))}
              className="pl-12 bg-white border-2 border-slate-900 focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:bg-slate-50 h-14 rounded-none text-sm font-bold tracking-wide uppercase placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
           <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-900 mb-4 block border-b-2 border-slate-900 pb-2">Level</label>
          <div className="space-y-4 mt-4">
            {['Associate', 'Bachelor', 'Master', 'Phd'].map(level => (
              <label key={level} className="flex items-center gap-4 cursor-pointer group">
                <div className="relative flex items-center justify-center w-6 h-6">
                    <input 
                      type="checkbox" 
                      checked={filters.levels.includes(level)}
                      onChange={() => toggleLevel(level)}
                      className="peer w-6 h-6 rounded-none border-2 border-slate-900 text-slate-900 focus:ring-slate-900 appearance-none bg-white checked:bg-slate-900 checked:border-slate-900 transition-colors cursor-pointer" 
                    />
                    <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-900 mb-4 block border-b-2 border-slate-900 pb-2">Instruction</label>
          <div className="space-y-4 mt-4">
            {['English', 'Turkish'].map(lang => (
              <label key={lang} className="flex items-center gap-4 cursor-pointer group">
                 <div className="relative flex items-center justify-center w-6 h-6">
                    <input 
                      type="checkbox" 
                      checked={filters.languages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="peer w-6 h-6 rounded-none border-2 border-slate-900 text-slate-900 focus:ring-slate-900 appearance-none bg-white checked:bg-slate-900 checked:border-slate-900 transition-colors cursor-pointer" 
                    />
                    <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">{lang}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-900 mb-4 block border-b-2 border-slate-900 pb-2">Max Price ($)</label>
          <div className="relative mt-4">
            <Input 
              type="number"
              placeholder="E.G. 5000" 
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="bg-white border-2 border-slate-900 focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:bg-slate-50 h-14 rounded-none text-sm font-bold tracking-wide uppercase placeholder:text-slate-400"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
