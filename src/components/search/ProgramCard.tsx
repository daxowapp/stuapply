import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import { MapPin, GraduationCap, Languages, Clock, ArrowRight } from 'lucide-react';

export function ProgramCard({ program }: { program: any }) {
  const tProg = useTranslations('Program');
  const locale = useLocale();

  return (
    <Card className="overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-slate-200 group flex flex-col sm:flex-row">
      {/* Decorative Image Placeholder */}
      <div className="sm:w-1/3 bg-slate-100 relative overflow-hidden hidden sm:block">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-purple-600/10 flex items-center justify-center">
            <GraduationCap className="h-16 w-16 text-blue-600/20 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-700 transition-colors">
              {program.name}
            </h3>
            <div className="flex items-center text-slate-500 text-sm gap-1.5 font-medium">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate">{program.universities?.names_translations?.[locale] || program.universities?.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
             <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-semibold px-3 py-1">
               {program.level}
             </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 mt-auto mb-6">
          <Badge variant="outline" className="text-slate-600 bg-slate-50 border-slate-200 py-1.5 px-3 font-medium">
            <Languages className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            {program.language}
          </Badge>
          <Badge variant="outline" className="text-slate-600 bg-slate-50 border-slate-200 py-1.5 px-3 font-medium">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            {tProg('studyYears')}: 4
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-slate-100 gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
             {program.discounted_price > 0 ? (
               <>
                 <div>
                    <span className="block text-[11px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">{tProg('officialPrice')}</span>
                    <span className="text-sm font-semibold text-slate-400 line-through decoration-slate-300">
                       {program.official_price} {program.currency}
                    </span>
                 </div>
                 <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                 <div>
                    <span className="block text-[11px] text-emerald-600 uppercase tracking-wider font-bold mb-0.5">{tProg('discountedPrice')}</span>
                    <span className="text-xl md:text-2xl font-black text-emerald-600">
                       {program.discounted_price} {program.currency}
                    </span>
                 </div>
               </>
             ) : (
               <div>
                  <span className="block text-[11px] text-emerald-600 uppercase tracking-wider font-bold mb-0.5">{tProg('officialPrice')}</span>
                  <span className="text-xl md:text-2xl font-black text-emerald-600">
                     {program.official_price} {program.currency}
                  </span>
               </div>
             )}
          </div>
          
          <Link href={`/apply?programId=${program.id}`} className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 text-sm font-semibold h-11 sm:h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-6 w-full sm:w-auto">
              {tProg('applyBtn')}
              <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
