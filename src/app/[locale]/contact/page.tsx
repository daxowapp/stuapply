"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';




export default function ContactPage() {
  const t = useTranslations('Contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Contact Details Widget - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden h-full">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-600 rounded-full blur-3xl opacity-40 z-0" />
              
              <div className="relative z-10 space-y-10">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
                  <p className="text-slate-400">Our team is available 24/7 to assist you with your application journey.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl shrink-0">
                      <MapPin className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{t('office')}</h4>
                      <p className="text-slate-400 mt-1">
                        STUDENT APPLY EĞİTİM TEKNOLOJİ DANIŞMANLIK LİMİTED ŞİRKETİ BAŞAKŞEHİR ŞUBESİ<br/>
                        ZİYA GÖKALP MAH. SÜLEYMAN DEMİREL BUL. THE OFFICE NO: 7E İÇ KAPI NO: 116 / BAŞAKŞEHİR - İSTANBUL
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl shrink-0">
                      <Phone className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Phone / WhatsApp</h4>
                      <p className="text-slate-400 mt-1">+90 545 308 1000<br/>+90 212 916 1616</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl shrink-0">
                      <Mail className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Email</h4>
                      <p className="text-slate-400 mt-1">support@stuapply.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - 3 cols */}
          <div className="lg:col-span-3">
             <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-200">
               {status === 'success' ? (
                 <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                    <p className="text-slate-600">{t('success')}</p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="mt-8 text-blue-600 font-medium hover:underline"
                    >
                      Send another message
                    </button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t('name')}</label>
                        <Input required placeholder="John Doe" className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t('email')}</label>
                        <Input required type="email" placeholder="john@example.com" className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Subject (Optional)</label>
                      <Input placeholder="How can we help?" className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">{t('message')}</label>
                      <textarea 
                        required 
                        rows={5}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Write your message here..."
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70"
                    >
                      {status === 'loading' ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Sending...</>
                      ) : (
                        <><Send className="mr-2 h-5 w-5"/> {t('send')}</>
                      )}
                    </button>
                 </form>
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
