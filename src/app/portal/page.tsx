'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { 
  Calendar, 
  Clock, 
  User, 
  LogOut, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  PlusCircle,
  Loader2
} from 'lucide-react';

export default function ClientPortal() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Randevular & Mesajlar State
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Yeni Randevu Talep Formu State
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '10:00',
    service: 'Yüz Yüze Görüşme (Alsancak / İzmir)',
    note: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function loadUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/giris');
        return;
      }

      setUser(session.user);

      // Profil Bilgisi
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (prof) setProfile(prof);

      // Danışanın Randevuları
      const { data: appts } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_id', session.user.id)
        .order('appointment_date', { ascending: true });
      
      if (appts) setAppointments(appts);

      // İdari Notlar / Mesajlar
      const { data: msgs } = await supabase
        .from('portal_messages')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (msgs) setMessages(msgs);

      setLoading(false);
    }

    loadUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/giris');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSendingMsg(true);
    const senderName = profile?.full_name || user.user_metadata?.full_name || user.email || 'Danışan';

    const { data, error } = await supabase
      .from('portal_messages')
      .insert([
        {
          sender_id: user.id,
          sender_name: senderName,
          sender_role: 'client',
          message: newMessage.trim()
        }
      ])
      .select();

    if (!error && data) {
      setMessages((prev) => [...prev, data[0]]);
      setNewMessage('');
    } else if (error) {
      console.error('Mesaj iletilemedi:', error.message);
      alert('Mesaj gönderilemedi: ' + error.message);
    }
    setSendingMsg(false);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('loading');

    const senderName = profile?.full_name || user.user_metadata?.full_name || user.email || 'Danışan';
    const senderPhone = profile?.phone || user.user_metadata?.phone || '';

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          client_id: user.id,
          client_name: senderName,
          client_phone: senderPhone,
          appointment_date: bookingData.date,
          appointment_time: bookingData.time,
          service_type: bookingData.service,
          status: 'pending',
          note: bookingData.note
        }
      ])
      .select();

    if (!error && data) {
      setAppointments([...appointments, data[0]]);
      setBookingStatus('success');
      setTimeout(() => {
        setShowBooking(false);
        setBookingStatus('idle');
      }, 1500);
    } else {
      setBookingStatus('error');
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
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg text-[#192923]">
            Melike Ermumcu <span className="text-xs text-[#446A5E] font-medium block sm:inline">| Danışan Portalı</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-stone-600 hidden sm:inline">
              {profile?.full_name || user?.user_metadata?.full_name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-red-50 text-stone-700 hover:text-red-700 text-xs font-semibold border border-[#E8DFD8] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* Sol Kolon: Randevu Takvimi & Randevu Talebi */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#192923]">Randevularım</h2>
              <p className="text-xs text-stone-500">Planlanan seanslarınız ve durumları</p>
            </div>
            <button
              onClick={() => setShowBooking(!showBooking)}
              className="px-4 py-2 rounded-xl bg-[#446A5E] hover:bg-[#335047] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> {showBooking ? 'Kapat' : 'Yeni Randevu İste'}
            </button>
          </div>

          {/* Randevu İsteme Formu */}
          {showBooking && (
            <div className="bg-white p-6 rounded-3xl border border-[#446A5E]/30 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#192923]">Yeni Seans Tarihi Seçin</h3>

              {bookingStatus === 'success' && (
                <div className="p-3 rounded-xl bg-[#E5ECE9] text-[#446A5E] text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Randevu talebiniz iletildi, onay bekleniyor.
                </div>
              )}

              <form onSubmit={handleBookAppointment} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1">Tarih</label>
                    <input
                      type="date"
                      required
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1">Saat</label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                    >
                      {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Görüşme Şekli</label>
                  <select
                    value={bookingData.service}
                    onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                  >
                    <option value="Yüz Yüze Görüşme (Alsancak / İzmir)">Yüz Yüze Görüşme (Alsancak / İzmir)</option>
                    <option value="Online Görüşme">Online Görüşme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">İletmek İstediğiniz Not (Opsiyonel)</label>
                  <textarea
                    rows={2}
                    value={bookingData.note}
                    onChange={(e) => setBookingData({ ...bookingData, note: e.target.value })}
                    placeholder="Seans öncesi belirtmek istediğiniz bir konu..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingStatus === 'loading'}
                  className="w-full py-2.5 rounded-xl bg-[#446A5E] hover:bg-[#335047] text-white font-bold text-xs transition-all cursor-pointer"
                >
                  {bookingStatus === 'loading' ? 'İletiliyor...' : 'Talebi Oluştur'}
                </button>
              </form>
            </div>
          )}

          {/* Randevu Listesi */}
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-[#E8DFD8] text-center text-stone-500 text-xs">
                Kayıtlı bir randevunuz bulunmamaktadır. Yukarıdaki butondan yeni seans talebi oluşturabilirsiniz.
              </div>
            ) : (
              appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white p-5 rounded-2xl border border-[#E8DFD8] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#192923]">
                        {appt.appointment_date}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E5ECE9] text-[#446A5E]">
                        {appt.appointment_time}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">{appt.service_type}</p>
                    {appt.note && <p className="text-[11px] text-stone-400 italic">&quot;{appt.note}&quot;</p>}
                  </div>

                  <div>
                    {appt.status === 'confirmed' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                        Onaylandı
                      </span>
                    )}
                    {appt.status === 'pending' && (
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
                        Onay Bekliyor
                      </span>
                    )}
                    {appt.status === 'cancelled' && (
                      <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 font-bold text-xs border border-red-200">
                        İptal Edildi
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sağ Kolon: İdari İletişim / Notlar */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-sm flex flex-col h-[560px]">
          <div className="border-b border-[#E8DFD8] pb-4 mb-4">
            <h3 className="font-bold text-sm text-[#192923] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#446A5E]" /> İdari İletişim & Notlar
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Randevu değişiklikleri ve idari konular için mesaj iletebilirsiniz.
            </p>
          </div>

          {/* Mesaj Akışı */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
            {messages.length === 0 ? (
              <p className="text-center text-stone-400 pt-12">Henüz iletilen bir not bulunmuyor.</p>
            ) : (
              messages.map((m) => {
                const isMe = m.sender_id === user?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-stone-400 mb-0.5 font-medium">
                      {isMe ? 'Siz' : m.sender_name}
                    </span>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] ${
                        isMe
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

          {/* Mesaj Gönderme Formu */}
          <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-[#E8DFD8] flex gap-2">
            <input
              type="text"
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="İdari bir not yazın..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#446A5E]"
            />
            <button
              type="submit"
              disabled={sendingMsg}
              className="p-2.5 rounded-xl bg-[#446A5E] hover:bg-[#335047] text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </main>

    </div>
  );
}