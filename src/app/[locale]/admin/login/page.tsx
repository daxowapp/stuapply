"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/${locale}/admin`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Access</h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to manage StudentApply</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <Input 
              type="email" 
              placeholder="admin@studentapply.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-12 bg-slate-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-12 bg-slate-50"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Log In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
