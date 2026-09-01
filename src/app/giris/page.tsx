'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, User, Phone, Loader2, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        // Kayıt Ol
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.fullName,
              phone: form.phone
            }
          }
        });

        if (error) throw error;

        // Profil tablosuna ekle
        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: form.fullName,
            phone: form.phone,
            role: 'client'
          });
        }

        router.push('/portal');
      } else {
        // Giriş Yap
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        });

        if (error) throw error;
        router.push('/portal');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 font-sans selection:bg-[#D6AFA3]">
      <div className="max-w-md w-full">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#446A5E] hover:text-[#335047] mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E8DFD8] shadow-lg">
          <div className="text-center mb-8">
            <span className="text-[11px] uppercase tracking-widest text-[#446A5E] font-bold">Danışan Portalı</span>
            <h1 className="text-2xl font-extrabold text-[#192923] mt-1">
              {isSignUp ? 'Yeni Danışan Kaydı' : 'Danışan Girişi'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {isSignUp ? 'Seanslarınızı ve randevularınızı takip etmek için kayıt olun.' : 'Randevu ve seans bilgilerinize erişmek için giriş yapın.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Ad Soyad</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Adınız Soyadınız"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Telefon</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="05XX XXX XX XX"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#192923] mb-1">E-Posta</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ornek@mail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192923] mb-1">Şifre</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#446A5E] text-white font-bold text-sm hover:bg-[#335047] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  İşlem yapılıyor...
                </>
              ) : isSignUp ? (
                'Kayıt Ol ve Giriş Yap'
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E8DFD8] text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
              className="text-xs text-[#446A5E] hover:underline font-semibold"
            >
              {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Yeni kayıt oluşturun'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}