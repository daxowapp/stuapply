"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { CheckCircle2, User, Mail, Phone, GraduationCap, MapPin, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';




export default function ApplyPage() {
  const searchParams = useSearchParams();
  const programId = searchParams?.get('programId');
  const t = useTranslations('Application');
  const tNav = useTranslations('Navigation');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate network delay for better UX flow
    await new Promise(resolve => setTimeout(resolve, 800));

    const { error } = await supabase
      .from('student_applications')
      .insert({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        program_id: programId || null,
        status: 'pending'
      });

    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-24">
        <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
               <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{t('success')}</h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
               {t('successDesc')}
            </p>
            <Link href="/" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 h-12 bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg rounded-full px-8 w-full sm:w-auto">
               {t('returnHome')}
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        
        {/* Left Sidebar - Information & Why Us */}
        <div className="w-full lg:w-[400px] xl:w-[480px] bg-slate-900 text-white p-8 lg:p-12 flex flex-col relative overflow-hidden">
           <div className="absolute inset-0 bg-linear-to-b from-blue-900/50 to-purple-900/50 mix-blend-multiply z-0" />
           <div className="absolute -left-24 -top-24 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-30 z-0" />
           
           <div className="relative z-10 flex-1 flex flex-col">
              <div className="mb-12">
                <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight leading-tight">{t('sidebarTitle')}</h1>
                <p className="text-slate-300 text-lg">{t('sidebarDesc')}</p>
              </div>

              {/* Dynamic Program Display if selected */}
              {programId && (
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 mb-10">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-300">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-blue-300 font-bold mb-1">{t('targetProgram')}</div>
                        <div className="font-semibold text-white leading-snug">Computer Engineering (B.Sc.)</div>
                        <div className="flex items-center text-sm text-slate-300 mt-2 gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> Altinbas University
                        </div>
                      </div>
                    </div>
                 </div>
              )}

              {/* Why Apply Through Us */}
              <div className="space-y-6 mt-auto">
                <h3 className="uppercase tracking-widest text-sm font-bold text-slate-400 mb-6">{t('whyApply')}</h3>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('freeProcessing')}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{t('freeProcessingDesc')}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-purple-500/20 text-purple-400 p-2 rounded-lg shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('guaranteedAcceptance')}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{t('guaranteedAcceptanceDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 bg-white p-8 lg:p-12 xl:p-16 flex flex-col justify-center shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] relative z-10 w-full">
           
           <div className="max-w-xl w-full mx-auto">
              {/* Progress Steps Indicator */}
              <div className="flex items-center mb-10 border-b border-slate-100 pb-8">
                 <div className="flex items-center text-blue-600 font-semibold gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm">1</div>
                    <span>{t('step1')}</span>
                 </div>
                 <div className="w-10 h-px bg-slate-200 mx-4"></div>
                 <div className="flex items-center text-slate-400 font-medium gap-2">
                    <div className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-sm">2</div>
                    <span>{t('step2')}</span>
                 </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('title')}</h2>
                <p className="text-slate-500">{t('formSubtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">{t('firstName')}</label>
                     <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                         <User className="h-4 w-4" />
                       </div>
                       <Input 
                         required 
                         placeholder={t('firstNamePlaceholder')}
                         className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 h-12 rounded-xl text-base"
                         value={formData.first_name}
                         onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">{t('lastName')}</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                         <User className="h-4 w-4 opacity-0" />
                       </div>
                       <Input 
                         required 
                         placeholder={t('lastNamePlaceholder')}
                         className="pl-4 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 h-12 rounded-xl text-base"
                         value={formData.last_name}
                         onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                       />
                     </div>
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">{t('email')}</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                         <Mail className="h-4 w-4" />
                       </div>
                     <Input 
                       required 
                       type="email" 
                       placeholder={t('emailPlaceholder')}
                       className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 h-12 rounded-xl text-base"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">{t('phone')}</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                         <Phone className="h-4 w-4" />
                       </div>
                     <Input 
                       type="tel" 
                       placeholder={t('phonePlaceholder')}
                       className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 h-12 rounded-xl text-base"
                       value={formData.phone}
                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                     />
                   </div>
                 </div>
                 
                 {status === 'error' && (
                   <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium p-4 rounded-xl flex items-start gap-3">
                     <CheckCircle2 className="h-5 w-5 shrink-0" />
                     <div>
                       <h4 className="font-bold mb-1">{t('errorTitle')}</h4>
                       <p>{t('error')}</p>
                     </div>
                   </div>
                 )}

                 <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
                       {t('terms')}
                    </p>
                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 text-base font-bold h-12 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                      {status === 'loading' ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> {t('processing')}</>
                      ) : (
                        <>{t('submit')} <ArrowRight className="ml-2 h-5 w-5" /></>
                      )}
                    </button>
                 </div>
              </form>
            </div>
            
        </div>
      </div>
    </div>
  );
}
