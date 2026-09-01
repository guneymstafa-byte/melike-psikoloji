'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, User, Phone, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
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
      if (isLogin) {
        // Giriş Yap
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;

        // Admin veya Danışan kontrolü
        if (data.user?.email === 'melikeermumcu0@gmail.com') {
          router.push('/admin');
        } else {
          router.push('/portal');
        }
      } else {
        // Kayıt Ol
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone
            }
          }
        });

        if (error) throw error;

        // Profiles tablosuna kullanıcı detayını ekle
        if (data.user) {
          await supabase.from('profiles').insert([
            {
              id: data.user.id,
              full_name: formData.fullName,
              phone: formData.phone,
              role: formData.email === 'melikeermumcu0@gmail.com' ? 'admin' : 'client'
            }
          ]);
        }

        router.push('/portal');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message === 'Invalid login credentials' ? 'E-posta adresi veya şifre hatalı.' : err.message);
      } else {
        setErrorMsg('İşlem sırasında bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#192923] font-sans flex flex-col justify-center items-center p-4 selection:bg-[#D6AFA3]">
      <div className="w-full max-w-md">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#446A5E] hover:text-[#335047] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-[#E8DFD8] shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-[#192923]">
              {isLogin ? 'Danışan Portalı Girişi' : 'Yeni Danışan Kaydı'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {isLogin ? 'Randevularınızı ve idari notlarınızı yönetin' : 'Randevu oluşturmak için hızlıca kayıt olun'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Ad Soyad</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Adınız ve Soyadınız"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Telefon Numarası</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05xx xxx xx xx"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#192923] mb-1">E-Posta Adresi</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ornek@mail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E]"
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
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="En az 6 karakter"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#446A5E] hover:bg-[#335047] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  İşlem yapılıyor...
                </>
              ) : isLogin ? (
                'Giriş Yap'
              ) : (
                'Kayıt Ol ve Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E8DFD8] text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
              }}
              className="text-xs text-[#446A5E] hover:text-[#335047] font-semibold transition-colors cursor-pointer"
            >
              {isLogin ? 'Hesabınız yok mu? Hemen Kayıt Olun' : 'Zaten hesabınız var mı? Giriş Yapın'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}