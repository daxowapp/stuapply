import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Languages, Clock, ArrowRight, BookOpen } from 'lucide-react';

export function ProgramCard({ program }: { program: any }) {
  const tProg = useTranslations('Program');
  const locale = useLocale();

  return (
    <article className="group flex flex-col sm:flex-row border-2 border-slate-900 bg-white transition-all duration-300 hover:bg-slate-900 overflow-hidden relative">
      {/* Structural Image Area */}
      <div className="sm:w-1/4 border-b-2 sm:border-b-0 sm:border-r-2 border-slate-900 flex items-center justify-center p-8 bg-slate-50 group-hover:bg-slate-800 transition-colors duration-300">
        <BookOpen className="h-16 w-16 text-slate-300 group-hover:text-slate-100 transition-colors duration-300" strokeWidth={1} />
      </div>
      
      <div className="p-6 sm:p-8 flex-1 flex flex-col h-full group-hover:text-white transition-colors duration-300">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div>
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter leading-none mb-3 group-hover:text-white transition-colors">
              {program.name}
            </h3>
            <div className="flex items-center text-slate-600 text-sm font-bold group-hover:text-slate-300 transition-colors tracking-widest uppercase">
              <span className="truncate">{program.universities?.names_translations?.[locale] || program.universities?.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0 hidden md:flex">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] border-2 border-slate-900 text-slate-900 px-3 py-1.5 group-hover:border-white group-hover:text-white transition-colors bg-white group-hover:bg-transparent">
               {program.level}
             </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-auto mb-8 border-y-2 border-slate-900 py-3 group-hover:border-slate-700 transition-colors">
          <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-white mr-4">
            <Languages className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {program.language}
          </div>
          <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-white">
            <Clock className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {tProg('studyYears')}: 4
          </div>
          <div className="md:hidden flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] border-2 border-slate-900 text-slate-900 px-2 py-0.5 group-hover:border-white group-hover:text-white bg-white group-hover:bg-transparent transition-colors">
               {program.level}
             </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
             {program.discounted_price > 0 ? (
               <div className="flex items-baseline gap-4">
                 <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-400">{tProg('officialPrice')}</span>
                    <span className="text-sm font-bold text-slate-500 line-through decoration-2 group-hover:text-slate-400">
                       {program.official_price} {program.currency}
                    </span>
                 </div>
                 <div className="w-1.5 h-1.5 bg-slate-200 rounded-full group-hover:bg-slate-700 self-center"></div>
                 <div>
                    <span className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1 group-hover:text-white">{tProg('discountedPrice')}</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-white">
                       {program.discounted_price} {program.currency}
                    </span>
                 </div>
               </div>
             ) : (
               <div>
                  <span className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1 group-hover:text-white">{tProg('officialPrice')}</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-white">
                     {program.official_price} {program.currency}
                  </span>
               </div>
             )}
          </div>
          
          <Link href={`/apply?programId=${program.id}`} className="group/btn inline-flex items-center justify-center font-bold tracking-[0.2em] uppercase text-xs h-14 border-2 border-slate-900 bg-[#FAFAFA] text-slate-900 hover:bg-slate-900 hover:text-white group-hover:border-white group-hover:bg-white group-hover:text-slate-900 transition-all px-10 w-full sm:w-auto">
              {tProg('applyBtn')}
              <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover/btn:translate-x-1" strokeWidth={3} />
          </Link>
        </div>
      </div>
    </article>
  );
}
