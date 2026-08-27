'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Lock, PlusCircle, Trash2, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PostItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  read_time?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Yetişkin Terapisi');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('4 dk okuma');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput === 'melikeermumcu0@gmail.com' && passwordInput === 'Melike2026!') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Hatalı e-posta veya şifre girdiniz.');
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPosts(data as PostItem[]);
    setLoadingPosts(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const slug = title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4);

    const { error } = await supabase.from('posts').insert([
      {
        title,
        slug,
        category,
        excerpt,
        content,
        read_time: readTime,
        published: true
      }
    ]);

    setSaving(false);

    if (!error) {
      setSaveSuccess(true);
      setTitle('');
      setExcerpt('');
      setContent('');
      fetchPosts();
    } else {
      alert('Hata: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8DFD8] shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#E5ECE9] text-[#446A5E] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-center text-[#192923]">Blog Yönetim Paneli</h2>
          <p className="text-xs text-center text-stone-500 mb-6 mt-1">Sadece yetkili kullanıcılar erişebilir.</p>

          {authError && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#192923] mb-1">E-Posta Adresi</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="melikeermumcu0@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#192923] mb-1">Yönetici Şifresi</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#446A5E] text-white font-semibold rounded-xl text-sm hover:bg-[#335047] transition-all cursor-pointer"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#192923] p-6 lg:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[#E8DFD8]">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl bg-white border border-[#E8DFD8] text-stone-600 hover:text-[#446A5E]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#192923]">Blog Yönetim Paneli</h1>
              <p className="text-xs text-stone-500">Klinik Psikolog Melike Ermumcu</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 font-semibold transition-colors cursor-pointer"
          >
            Çıkış Yap
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E8DFD8] shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-[#446A5E] font-bold text-lg">
            <PlusCircle className="w-5 h-5" />
            <span>Yeni Makale Yayınla</span>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-[#E5ECE9] border border-[#446A5E]/40 text-[#446A5E] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Makaleniz başarıyla yayınlandı ve web sitesine eklendi!</span>
            </div>
          )}

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1">Makale Başlığı *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Sınav Kaygısı ile Başa Çıkma Yolları"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Kategori *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                >
                  <option value="Yetişkin Terapisi">Yetişkin Terapisi</option>
                  <option value="Çocuk & Oyun Terapisi">Çocuk & Oyun Terapisi</option>
                  <option value="Klinik Değerlendirme">Klinik Değerlendirme</option>
                  <option value="Farkındalık & Ruh Sağlığı">Farkındalık & Ruh Sağlığı</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1">Kısa Özet *</label>
                <input
                  type="text"
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Kart üzerinde görünecek 1-2 cümlelik kısa özet"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Okuma Süresi</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="4 dk okuma"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Makale İçeriği *</label>
              <textarea
                rows={8}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Makalenizin tam metnini buraya yazabilirsiniz..."
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E] leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#446A5E] text-white font-semibold text-xs rounded-xl hover:bg-[#335047] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              Makaleyi Sitede Yayınla
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E8DFD8] shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-[#192923]">Yayındaki Makaleler ({posts.length})</h2>

          {loadingPosts ? (
            <p className="text-xs text-stone-500">Yükleniyor...</p>
          ) : posts.length === 0 ? (
            <p className="text-xs text-stone-500">Henüz eklenmiş bir yazı yok. Yukarıdan ilk yazınızı ekleyebilirsiniz.</p>
          ) : (
            <div className="divide-y divide-[#E8DFD8]">
              {posts.map((post) => (
                <div key={post.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E5ECE9] text-[#446A5E]">
                      {post.category}
                    </span>
                    <h4 className="font-bold text-sm text-[#192923] mt-1">{post.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{post.excerpt}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}