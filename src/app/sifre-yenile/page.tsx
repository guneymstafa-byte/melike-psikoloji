'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function SifreYenilePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Şifre güncellenirken bir hata oluştu.');
      } else {
        setError('Şifre güncellenirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#192923] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E8DFD8] shadow-sm space-y-6">
        
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-[#446A5E] hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Ana Sayfaya Dön
          </Link>
          <h1 className="text-xl font-extrabold text-[#192923]">Yeni Şifre Belirleyin</h1>
          <p className="text-xs text-stone-500 mt-1">
            Lütfen hesabınız için kullanmak istediğiniz yeni şifrenizi girin.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-2xl bg-[#E5ECE9] border border-[#446A5E]/30 text-[#446A5E] text-xs space-y-2 text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto" />
            <p className="font-bold text-sm">Şifreniz başarıyla güncellendi!</p>
            <p className="text-stone-600">Ana sayfaya yönlendiriliyorsunuz...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#192923] mb-1">Yeni Şifre</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192923] mb-1">Yeni Şifre (Tekrar)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#446A5E] hover:bg-[#335047] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Güncelleniyor...' : 'Şifreyi Kaydet'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}