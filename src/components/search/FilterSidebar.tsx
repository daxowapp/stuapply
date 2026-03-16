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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-28">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">{t('filters') || 'Filters'}</h2>
        </div>
      </div>
      
      <div className="space-y-8">
        <div>
          <label className="text-sm font-bold text-slate-900 mb-3 block">Search Programs</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder={t('placeholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 h-11 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-900 mb-3 block">University Name</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="e.g. Istanbul University" 
              value={filters.university}
              onChange={(e) => setFilters(prev => ({ ...prev, university: e.target.value }))}
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 h-11 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-900 mb-3 block">Degree Level</label>
          <div className="space-y-3">
            {['Associate', 'Bachelor', 'Master', 'Phd'].map(level => (
              <label key={level} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                    <input 
                      type="checkbox" 
                      checked={filters.levels.includes(level)}
                      onChange={() => toggleLevel(level)}
                      className="peer w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 appearance-none bg-slate-50 checked:bg-blue-600 checked:border-blue-600 transition-colors" 
                    />
                    <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-900 mb-3 block">Language of Instruction</label>
          <div className="space-y-3">
            {['English', 'Turkish'].map(lang => (
              <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                 <div className="relative flex items-center justify-center w-5 h-5">
                    <input 
                      type="checkbox" 
                      checked={filters.languages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="peer w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 appearance-none bg-slate-50 checked:bg-blue-600 checked:border-blue-600 transition-colors" 
                    />
                    <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{lang}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-900 mb-3 block">Max Price / Year ($)</label>
          <div className="relative">
            <Input 
              type="number"
              placeholder="e.g. 5000" 
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 h-11 rounded-xl text-sm"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
