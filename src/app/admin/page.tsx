'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Users,
  Check,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'posts' | 'appointments' | 'messages'>('appointments');
  
  // Blog State
  const [posts, setPosts] = useState<any[]>([]);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    category: 'Yetişkin Terapisi',
    excerpt: '',
    content: '',
    read_time: '4 dk okuma'
  });
  const [blogStatus, setBlogStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Randevular & Mesajlar State
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [adminReply, setAdminReply] = useState('');

  const loadData = async () => {
    // 1. Bloglar
    const { data: p } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (p) setPosts(p);

    // 2. Randevular
    const { data: a } = await supabase.from('appointments').select('*').order('appointment_date', { ascending: true });
    if (a) setAppointments(a);

    // 3. Mesajlar
    const { data: m } = await supabase.from('portal_messages').select('*').order('created_at', { ascending: true });
    if (m) setMessages(m);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Slug Oluşturucu
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBlogForm({
      ...blogForm,
      title: val,
      slug: generateSlug(val)
    });
  };

  // Blog Kaydet
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogStatus('loading');

    const { data, error } = await supabase.from('posts').insert([blogForm]).select();

    if (!error && data) {
      setPosts([data[0], ...posts]);
      setBlogStatus('success');
      setBlogForm({
        title: '',
        slug: '',
        category: 'Yetişkin Terapisi',
        excerpt: '',
        content: '',
        read_time: '4 dk okuma'
      });
      setTimeout(() => setBlogStatus('idle'), 2000);
    } else {
      setBlogStatus('error');
    }
  };

  // Blog Sil
  const handleDeletePost = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  // Randevu Durumu Güncelle (Onayla / İptal Et)
  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (!error) {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  // Admin Mesaj Yanıtla
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReply.trim()) return;

    const { data, error } = await supabase
      .from('portal_messages')
      .insert([
        {
          sender_id: null,
          sender_name: 'Melike Ermumcu (Klinik Psikolog)',
          sender_role: 'admin',
          message: adminReply.trim()
        }
      ])
      .select();

    if (!error && data) {
      setMessages([...messages, data[0]]);
      setAdminReply('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#192923] font-sans selection:bg-[#D6AFA3]">
      
      {/* Üst Bar */}
      <header className="bg-white border-b border-[#E8DFD8] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold text-[#446A5E] hover:text-[#335047] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Siteye Dön
            </Link>
            <span className="opacity-30">|</span>
            <h1 className="text-sm font-extrabold text-[#192923]">Psikolog Yönetici Paneli</h1>
          </div>

          {/* Sekmeler */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'appointments' ? 'bg-[#446A5E] text-white' : 'bg-[#FAF7F2] text-stone-600'
              }`}
            >
              Randevular ({appointments.filter(a => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'messages' ? 'bg-[#446A5E] text-white' : 'bg-[#FAF7F2] text-stone-600'
              }`}
            >
              İdari Notlar
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'posts' ? 'bg-[#446A5E] text-white' : 'bg-[#FAF7F2] text-stone-600'
              }`}
            >
              Blog Yazıları
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* 1. SEKME: RANDEVULAR */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-[#192923]">Danışan Randevu Talepleri</h2>
                <p className="text-xs text-stone-500">Portaldan ve siteden gelen tüm randevu kayıtları</p>
              </div>
            </div>

            {appointments.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-[#E8DFD8] text-center text-xs text-stone-500">
                Henüz kayıtlı bir randevu bulunmamaktadır.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm text-[#192923]">{appt.client_name}</span>
                        <span className="text-xs text-stone-500">({appt.client_phone || 'Tel yok'})</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          appt.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {appt.status === 'confirmed' ? 'Onaylandı' : appt.status === 'pending' ? 'Onay Bekliyor' : 'İptal'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        {appt.appointment_date} &bull; <strong className="text-[#446A5E]">{appt.appointment_time}</strong> &bull; {appt.service_type}
                      </p>
                      {appt.note && <p className="text-xs text-stone-500 italic bg-[#FAF7F2] p-2 rounded-lg mt-1">&quot;{appt.note}&quot;</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {appt.status !== 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Onayla
                        </button>
                      )}
                      {appt.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> İptal Et
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. SEKME: İDARİ NOTLAR / MESAJLAR */}
        {activeTab === 'messages' && (
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-sm flex flex-col h-[600px]">
            <div className="border-b border-[#E8DFD8] pb-4 mb-4">
              <h2 className="text-base font-extrabold text-[#192923] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#446A5E]" /> Danışan İdari Notları
              </h2>
              <p className="text-xs text-stone-500">Danışanların portal üzerinden ilettiği notlar ve yanıtlarınız</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
              {messages.length === 0 ? (
                <p className="text-center text-stone-400 pt-16">Henüz gelen bir idari not bulunmuyor.</p>
              ) : (
                messages.map((m) => {
                  const isAdmin = m.sender_role === 'admin';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-stone-400 mb-0.5 font-medium">
                        {m.sender_name}
                      </span>
                      <div
                        className={`p-3 rounded-2xl max-w-[80%] ${
                          isAdmin
                            ? 'bg-[#446A5E] text-white rounded-br-none'
                            : 'bg-[#FAF7F2] border border-[#E8DFD8] text-stone-800 rounded-bl-none'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendAdminReply} className="mt-4 pt-3 border-t border-[#E8DFD8] flex gap-2">
              <input
                type="text"
                required
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder="Danışanlara genel/idari bir yanıt yazın..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#446A5E] hover:bg-[#335047] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Yanıtla
              </button>
            </form>
          </div>
        )}

        {/* 3. SEKME: BLOG YÖNETİMİ */}
        {activeTab === 'posts' && (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-[#192923]">Yeni Blog Yazısı Ekle</h2>

              {blogStatus === 'success' && (
                <div className="p-3 rounded-xl bg-[#E5ECE9] text-[#446A5E] text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Yazı başarıyla yayınlandı!
                </div>
              )}

              <form onSubmit={handleSavePost} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Makale Başlığı</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={handleTitleChange}
                    placeholder="Örn: Kaygıyı Anlamak ve Yönetmek"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1">Kategori</label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                    >
                      <option value="Yetişkin Terapisi">Yetişkin Terapisi</option>
                      <option value="Çocuk & Oyun">Çocuk & Oyun</option>
                      <option value="Klinik Değerlendirme">Klinik Değerlendirme</option>
                      <option value="Ebeveyn Rehberi">Ebeveyn Rehberi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1">Okuma Süresi</label>
                    <input
                      type="text"
                      value={blogForm.read_time}
                      onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })}
                      placeholder="Örn: 4 dk okuma"
                      className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Kısa Özet (Excerpt)</label>
                  <textarea
                    rows={2}
                    required
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    placeholder="Ana sayfada görünecek 1-2 cümlelik özet..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Makale İçeriği</label>
                  <textarea
                    rows={6}
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="Yazının tüm detayları..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={blogStatus === 'loading'}
                  className="w-full py-2.5 rounded-xl bg-[#446A5E] hover:bg-[#335047] text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {blogStatus === 'loading' ? 'Yayınlanıyor...' : 'Yazıyı Yayınla'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <h2 className="text-base font-extrabold text-[#192923]">Yayındaki Yazılar ({posts.length})</h2>
              {posts.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#E8DFD8] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#446A5E] bg-[#E5ECE9] px-2 py-0.5 rounded-full">{p.category}</span>
                    <h4 className="font-bold text-xs text-[#192923] mt-1">{p.title}</h4>
                  </div>
                  <button
                    onClick={() => handleDeletePost(p.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}