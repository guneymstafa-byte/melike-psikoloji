'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Send, 
  LogOut, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Plus
} from 'lucide-react';

export default function PortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Randevular & Mesajlar
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageSending, setMessageSending] = useState(false);

  // Yeni Randevu Talebi Formu
  const [showNewApt, setShowNewApt] = useState(false);
  const [aptForm, setAptForm] = useState({
    date: '',
    time: '10:00',
    service: 'Bireysel Yetişkin Terapisi',
    note: ''
  });
  const [aptLoading, setAptLoading] = useState(false);

  useEffect(() => {
    async function loadPortalData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/giris');
        return;
      }
      setUser(user);

      // Profil çek
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(prof || { full_name: user.email });

      // Danışanın randevularını çek
      const { data: apts } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_id', user.id)
        .order('appointment_date', { ascending: true });
      setAppointments(apts || []);

      // İdari mesajları çek
      const { data: msgs } = await supabase
        .from('portal_messages')
        .select('*')
        .order('created_at', { ascending: true });
      setMessages(msgs || []);

      setLoading(false);
    }

    loadPortalData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAptLoading(true);

    try {
      const { error } = await supabase.from('appointments').insert({
        client_id: user.id,
        client_name: profile?.full_name || user.email,
        client_phone: profile?.phone || '',
        appointment_date: aptForm.date,
        appointment_time: aptForm.time,
        service_type: aptForm.service,
        note: aptForm.note,
        status: 'pending'
      });

      if (error) throw error;

      // Listeyi tazele
      const { data: updatedApts } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_id', user.id)
        .order('appointment_date', { ascending: true });
      setAppointments(updatedApts || []);

      setShowNewApt(false);
      setAptForm({ date: '', time: '10:00', service: 'Bireysel Yetişkin Terapisi', note: '' });
    } catch (err: any) {
      alert('Randevu talebi oluşturulamadı: ' + err.message);
    } finally {
      setAptLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessageSending(true);

    try {
      const { error } = await supabase.from('portal_messages').insert({
        sender_id: user.id,
        sender_name: profile?.full_name || user.email,
        sender_role: 'client',
        message: newMessage.trim()
      });

      if (error) throw error;

      // Mesajları tazele
      const { data: updatedMsgs } = await supabase
        .from('portal_messages')
        .select('*')
        .order('created_at', { ascending: true });
      setMessages(updatedMsgs || []);
      setNewMessage('');
    } catch (err: any) {
      alert('Mesaj gönderilemedi: ' + err.message);
    } finally {
      setMessageSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#192923]">
        <Loader2 className="w-6 h-6 animate-spin text-[#446A5E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#192923] font-sans selection:bg-[#D6AFA3]">
      
      {/* Üst Çubuk */}
      <header className="bg-white border-b border-[#E8DFD8] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-base text-[#192923]">
              Melike Ermumcu
            </Link>
            <span className="text-stone-300">|</span>
            <span className="text-xs font-semibold text-[#446A5E] bg-[#E5ECE9] px-2.5 py-1 rounded-full">
              Danışan Portalı
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-stone-600 hidden sm:inline">
              Hoş geldiniz, <strong>{profile?.full_name || user.email}</strong>
            </span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg border border-[#E8DFD8] text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* Sol Alan: Randevular */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#192923]">Randevularım & Seanslarım</h2>
              <p className="text-xs text-stone-500">Planlanmış veya onay bekleyen seanslarınız.</p>
            </div>
            <button
              onClick={() => setShowNewApt(!showNewApt)}
              className="px-4 py-2 rounded-xl bg-[#446A5E] text-white text-xs font-semibold hover:bg-[#335047] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Yeni Seans Talebi
            </button>
          </div>

          {/* Yeni Randevu Formu Açılır Kutu */}
          {showNewApt && (
            <form onSubmit={handleCreateAppointment} className="p-5 bg-white rounded-2xl border border-[#E8DFD8] shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#192923] uppercase tracking-wider">Randevu Saati Belirleyin</h3>
              
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Tarih *</label>
                  <input
                    type="date"
                    required
                    value={aptForm.date}
                    onChange={(e) => setAptForm({ ...aptForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] bg-[#FAF7F2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Saat *</label>
                  <select
                    value={aptForm.time}
                    onChange={(e) => setAptForm({ ...aptForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] bg-[#FAF7F2] text-xs"
                  >
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Hizmet Türü</label>
                <select
                  value={aptForm.service}
                  onChange={(e) => setAptForm({ ...aptForm, service: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] bg-[#FAF7F2] text-xs"
                >
                  <option value="Bireysel Yetişkin Terapisi (Alsancak)">Bireysel Yetişkin Terapisi (Alsancak)</option>
                  <option value="Çocuk & Oyun Terapisi (Alsancak)">Çocuk & Oyun Terapisi (Alsancak)</option>
                  <option value="Online Terapi">Online Terapi</option>
                  <option value="Psikolojik Değerlendirme & Test">Psikolojik Değerlendirme & Test</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Kısa Not / Talep</label>
                <input
                  type="text"
                  value={aptForm.note}
                  onChange={(e) => setAptForm({ ...aptForm, note: e.target.value })}
                  placeholder="İletmek istediğiniz özel bir durum..."
                  className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] bg-[#FAF7F2] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewApt(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#E8DFD8] text-xs text-stone-600"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={aptLoading}
                  className="px-4 py-1.5 rounded-lg bg-[#446A5E] text-white text-xs font-semibold hover:bg-[#335047]"
                >
                  {aptLoading ? 'Kaydediliyor...' : 'Talebi İlet'}
                </button>
              </div>
            </form>
          )}

          {/* Randevu Kartları */}
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-[#E8DFD8] text-center">
                <Calendar className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500">Henüz planlanmış bir randevunuz bulunmuyor.</p>
              </div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="p-5 bg-white rounded-2xl border border-[#E8DFD8] shadow-sm flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#192923] block">{apt.service_type}</span>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#446A5E]" /> {apt.appointment_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#446A5E]" /> {apt.appointment_time}
                      </span>
                    </div>
                    {apt.note && <p className="text-[11px] text-stone-400 italic mt-1">{apt.note}</p>}
                  </div>

                  <div>
                    {apt.status === 'confirmed' && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Onaylandı
                      </span>
                    )}
                    {apt.status === 'pending' && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold rounded-full">
                        Onay Bekliyor
                      </span>
                    )}
                    {apt.status === 'cancelled' && (
                      <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold rounded-full">
                        İptal Edildi
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sağ Alan: İdari Mesajlaşma / Sekreterya İletişimi */}
        <div className="lg:col-span-5 space-y-4 flex flex-col h-[520px]">
          <div>
            <h2 className="text-lg font-bold text-[#192923]">İdari İletişim & Notlar</h2>
            <p className="text-xs text-stone-500">Randevu erteleme veya idari konular için mesaj iletebilirsiniz.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E8DFD8] shadow-sm flex-1 flex flex-col justify-between overflow-hidden">
            {/* Mesaj Listesi */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 mb-3">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-xs text-stone-400">
                  Henüz bir mesaj bulunmuyor.
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender_id === user.id;
                  return (
                    <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-stone-400 mb-0.5">{m.sender_name}</span>
                      <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${isMe ? 'bg-[#446A5E] text-white' : 'bg-[#FAF7F2] border border-[#E8DFD8] text-stone-800'}`}>
                        {m.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Mesaj Gönderme Kutusu */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#E8DFD8]">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
              />
              <button
                type="submit"
                disabled={messageSending}
                className="p-2.5 rounded-xl bg-[#446A5E] text-white hover:bg-[#335047] transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </main>

    </div>
  );
}