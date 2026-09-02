'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  Sparkles, 
  Puzzle, 
  Brain, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Menu, 
  X,
  Send,
  HelpCircle,
  GraduationCap,
  Award,
  BookOpen,
  MessageSquare,
  Calendar,
  Check,
  LogOut,
  User,
  Lock,
  PlusCircle,
  AlertCircle,
  ChevronLeft,
  Target,
  KeyRound,
  CheckSquare,
  Square,
  ListTodo
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Auth & Drawer State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Form State (Auth)
  const [authForm, setAuthForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: ''
  });

  // Şifre Değiştirme (Hesabım Sekmesi)
  const [newPassword, setNewPassword] = useState('');
  const [changePassStatus, setChangePassStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [changePassMsg, setChangePassMsg] = useState('');

  // Danışan & Admin Sekmeleri
  const [clientTab, setClientTab] = useState<'appointments' | 'journey' | 'account' | 'messages'>('appointments');
  const [adminTab, setAdminTab] = useState<'appointments' | 'messages' | 'tasks' | 'posts'>('appointments');

  // Danışan Verileri
  const [myAppointments, setMyAppointments] = useState<any[]>([]);
  const [myMessages, setMyMessages] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [clientNewMsg, setClientNewMsg] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '10:00',
    service: 'Yüz Yüze Görüşme (Alsancak / İzmir)',
    note: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Yönetici Verileri
  const [adminAppointments, setAdminAppointments] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [adminTasks, setAdminTasks] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const [adminReply, setAdminReply] = useState('');

  // Admin Görev/Ödev Ekleme Formu
  const [taskForm, setTaskForm] = useState({
    clientId: '',
    title: '',
    description: '',
    type: 'homework'
  });

  // Blog Ekleme State
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    category: 'Yetişkin Terapisi',
    excerpt: '',
    content: '',
    read_time: '4 dk okuma'
  });
  const [blogStatus, setBlogStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Ziyaretçi Randevu Formu State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Yüz Yüze Görüşme (Alsancak / İzmir)',
    date: '',
    note: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Dinamik Blog Yazıları
  const [blogPosts, setBlogPosts] = useState<any[]>([
    {
      id: '1',
      slug: 'kaygiyi-anlamak-ve-yonetmek',
      title: 'Kaygıyı Anlamak ve Yönetmek: Bilişsel Bir Bakış',
      excerpt: 'Sürekli endişe ve kaygı halinde zihnimizin ürettiği otomatik düşünceleri fark etmek, kaygıyla başa çıkmanın ilk adımıdır.',
      category: 'Yetişkin Terapisi',
      read_time: '4 dk okuma'
    },
    {
      id: '2',
      slug: 'oyun-terapisi-cocuklarin-dili',
      title: 'Çocukların Doğal Dili: Oyun Terapisi Neden Önemlidir?',
      excerpt: 'Yetişkinler duygularını kelimelerle ifade ederken, çocuklar dünyayı ve içsel çatışmalarını oyunlar ve oyuncaklar aracılığıyla anlatır.',
      category: 'Çocuk & Oyun',
      read_time: '5 dk okuma'
    },
    {
      id: '3',
      slug: 'psikolojik-testler-ne-soyler',
      title: 'Psikolojik Testler Bize Ne Söyler, Ne Söylemez?',
      excerpt: 'MMPI ve gelişim testleri bir etiket değil; bireyi daha derinlemesine tanıyıp doğru bir terapi haritası çizmenin araçlarıdır.',
      category: 'Klinik Değerlendirme',
      read_time: '3 dk okuma'
    }
  ]);

  const isAdmin = currentUser?.email === 'melikeermumcu0@gmail.com';

  useEffect(() => {
    fetchSession();
    fetchLatestPosts();
  }, []);

  async function fetchSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setCurrentUser(session.user);
      loadUserData(session.user);
    }
  }

  async function loadUserData(user: any) {
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (prof) setProfile(prof);

    if (user.email === 'melikeermumcu0@gmail.com') {
      const { data: appts } = await supabase.from('appointments').select('*').order('appointment_date', { ascending: true });
      if (appts) setAdminAppointments(appts);

      const { data: msgs } = await supabase.from('portal_messages').select('*').order('created_at', { ascending: true });
      if (msgs) setAdminMessages(msgs);

      const { data: tsks } = await supabase.from('client_tasks').select('*').order('created_at', { ascending: false });
      if (tsks) setAdminTasks(tsks);
    } else {
      const { data: appts } = await supabase.from('appointments').select('*').eq('client_id', user.id).order('appointment_date', { ascending: true });
      if (appts) setMyAppointments(appts);

      const { data: msgs } = await supabase
        .from('portal_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},client_id.eq.${user.id}`)
        .order('created_at', { ascending: true });
      if (msgs) setMyMessages(msgs);

      const { data: tsks } = await supabase
        .from('client_tasks')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      if (tsks) setMyTasks(tsks);
    }
  }

  async function fetchLatestPosts() {
    try {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0 && !error) setBlogPosts(data);
    } catch {
      console.log('Bloglar yüklendi');
    }
  }

  // Auth İşlemleri
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setResetSent(false);

    try {
      if (authView === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authForm.email.trim().toLowerCase(),
          password: authForm.password
        });
        if (error) throw error;
        if (data.user) {
          setCurrentUser(data.user);
          loadUserData(data.user);
          setAuthForm({ fullName: '', phone: '', email: '', password: '' });
        }
      } else if (authView === 'register') {
        const cleanEmail = authForm.email.trim().toLowerCase();
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: authForm.password,
          options: {
            data: { full_name: authForm.fullName, phone: authForm.phone }
          }
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from('profiles').insert([
            {
              id: data.user.id,
              full_name: authForm.fullName,
              phone: authForm.phone,
              role: cleanEmail === 'melikeermumcu0@gmail.com' ? 'admin' : 'client'
            }
          ]);
          setCurrentUser(data.user);
          loadUserData(data.user);
          setAuthForm({ fullName: '', phone: '', email: '', password: '' });
        }
      } else if (authView === 'forgot') {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setProfile(null);

        const redirectUrl = typeof window !== 'undefined' 
          ? `${window.location.origin}/sifre-yenile` 
          : 'https://melike-psikoloji-rhjm.vercel.app/sifre-yenile';

        const cleanEmail = authForm.email.trim().toLowerCase();
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: redirectUrl
        });

        if (error) throw error;
        setResetSent(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message === 'Invalid login credentials' ? 'E-posta adresi veya şifre hatalı.' : err.message);
      } else {
        setAuthError('İşlem yapılırken bir hata oluştu.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setProfile(null);
    setDrawerOpen(false);
  };

  // Danışan Kendi Şifresini Değiştirme
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setChangePassMsg('Şifre en az 6 karakter olmalıdır.');
      setChangePassStatus('error');
      return;
    }
    setChangePassStatus('loading');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setChangePassStatus('error');
      setChangePassMsg(error.message);
    } else {
      setChangePassStatus('success');
      setChangePassMsg('Şifreniz başarıyla güncellendi.');
      setNewPassword('');
      setTimeout(() => setChangePassStatus('idle'), 3000);
    }
  };

  // Danışan Ev Ödevi Tamamlandı İşareti
  const toggleTaskCompleted = async (taskId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('client_tasks')
      .update({ is_completed: !currentStatus })
      .eq('id', taskId);

    if (!error) {
      setMyTasks(myTasks.map(t => t.id === taskId ? { ...t, is_completed: !currentStatus } : t));
    }
  };

  // Danışan Randevu Talebi
  const handleClientBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setBookingStatus('loading');

    try {
      const senderName = profile?.full_name || currentUser.user_metadata?.full_name || currentUser.email || 'Danışan';
      const senderPhone = profile?.phone || currentUser.user_metadata?.phone || '';

      const { data, error } = await supabase.from('appointments').insert([
        {
          client_id: currentUser.id,
          client_name: senderName,
          client_phone: senderPhone,
          appointment_date: bookingData.date,
          appointment_time: bookingData.time,
          service_type: bookingData.service,
          status: 'pending',
          note: bookingData.note
        }
      ]).select();

      if (error) {
        alert('Randevu oluşturulamadı: ' + error.message);
        setBookingStatus('idle');
        return;
      }

      if (data && data.length > 0) {
        setMyAppointments((prev) => [...prev, data[0]]);
        setBookingStatus('success');
        setBookingData({
          date: '',
          time: '10:00',
          service: 'Yüz Yüze Görüşme (Alsancak / İzmir)',
          note: ''
        });
        setTimeout(() => {
          setShowBooking(false);
          setBookingStatus('idle');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setBookingStatus('idle');
    }
  };

  // Danışan Mesaj Gönderme
  const handleClientSendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientNewMsg.trim() || !currentUser) return;
    const senderName = profile?.full_name || currentUser.user_metadata?.full_name || currentUser.email || 'Danışan';

    const { data, error } = await supabase.from('portal_messages').insert([
      {
        sender_id: currentUser.id,
        client_id: currentUser.id,
        sender_name: senderName,
        sender_role: 'client',
        message: clientNewMsg.trim()
      }
    ]).select();

    if (!error && data) {
      setMyMessages([...myMessages, data[0]]);
      setClientNewMsg('');
    }
  };

  // Yönetici Randevu İşlemleri
  const handleUpdateApptStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (!error) {
      setAdminAppointments(adminAppointments.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  // Yönetici Seçili Danışana Özel Yanıt Gönderme
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReply.trim() || !selectedClient) return;

    const { data, error } = await supabase.from('portal_messages').insert([
      {
        sender_id: currentUser.id,
        client_id: selectedClient.id,
        sender_name: 'Melike Ermumcu (Klinik Psikolog)',
        sender_role: 'admin',
        message: adminReply.trim()
      }
    ]).select();

    if (!error && data) {
      setAdminMessages([...adminMessages, data[0]]);
      setAdminReply('');
    }
  };

  // Admin Danışana Görev/Hedef Ekleme
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.clientId || !taskForm.title) return;

    const { data, error } = await supabase.from('client_tasks').insert([
      {
        client_id: taskForm.clientId,
        title: taskForm.title,
        description: taskForm.description,
        type: taskForm.type,
        is_completed: false
      }
    ]).select();

    if (!error && data) {
      setAdminTasks([data[0], ...adminTasks]);
      setTaskForm({ clientId: '', title: '', description: '', type: 'homework' });
      alert('Ödev/Hedef danışana başarıyla tanımlandı.');
    }
  };

  // Instagram Tarzı Mesaj Kutusu: Danışanları Gruplama
  const clientConversations = useMemo(() => {
    const conversationsMap = new Map<string, { id: string; name: string; lastMessage: string; lastTime: string }>();

    adminMessages.forEach((msg) => {
      const clientId = msg.sender_role === 'client' ? msg.sender_id : msg.client_id;
      if (!clientId) return;

      const clientName = msg.sender_role === 'client' ? msg.sender_name : 'Danışan';

      conversationsMap.set(clientId, {
        id: clientId,
        name: (conversationsMap.get(clientId)?.name && conversationsMap.get(clientId)!.name !== 'Danışan') 
          ? conversationsMap.get(clientId)!.name 
          : clientName,
        lastMessage: msg.message,
        lastTime: new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });

    return Array.from(conversationsMap.values());
  }, [adminMessages]);

  // Admin İçin Danışan Listesi (Hedef/Ödev Ataması Yapabilmek İçin)
  const uniqueClients = useMemo(() => {
    const map = new Map<string, string>();
    adminAppointments.forEach(a => { if (a.client_id) map.set(a.client_id, a.client_name); });
    clientConversations.forEach(c => { map.set(c.id, c.name); });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [adminAppointments, clientConversations]);

  const generateSlug = (text: string) => {
    return text.toLowerCase().trim()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogStatus('loading');
    const { data, error } = await supabase.from('posts').insert([blogForm]).select();

    if (!error && data) {
      setBlogPosts([data[0], ...blogPosts]);
      setBlogStatus('success');
      setBlogForm({ title: '', slug: '', category: 'Yetişkin Terapisi', excerpt: '', content: '', read_time: '4 dk okuma' });
      setTimeout(() => setBlogStatus('idle'), 2000);
    } else {
      setBlogStatus('error');
    }
  };

  // Genel Ziyaretçi Randevu Formu
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', service: 'Yüz Yüze Görüşme (Alsancak / İzmir)', date: '', note: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const services = [
    {
      icon: <Brain className="w-8 h-8 text-[#446A5E]" />,
      title: "Bireysel Yetişkin Terapisi",
      desc: "Bilişsel Davranışçı Terapi (BDT) ekolüyle kaygı, depresyon, ilişki dinamikleri ve yaşam krizleri üzerine birebir çözüm odaklı çalışma.",
      tags: ["BDT Ekolü", "Kaygı & Panik", "Duygusal Dayanıklılık"]
    },
    {
      icon: <Puzzle className="w-8 h-8 text-[#D6AFA3]" />,
      title: "Çocuk & Oyun Terapisi",
      desc: "Çocukların iç dünyalarını oyun diliyle ifade etmelerine olanak tanıyan, gelişimsel ve davranışsal sorunları çözen güvenli alan.",
      tags: ["Deneyimsel Oyun", "Davranış Problemleri", "Kardeş Kıskançlığı"]
    },
    {
      icon: <Sparkles className="w-8 h-8 text-[#8C7A6B]" />,
      title: "Psikolojik Değerlendirme & Testler",
      desc: "Çocuk ve ergenlerin gelişimsel, bilişsel, dikkat ve duygusal süreçlerini belirlemeye yönelik standart klinik ölçekler.",
      tags: ["AGTE", "d2 Dikkat", "Okul Olgunluğu", "Çizim Testleri"]
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-[#446A5E]" />,
      title: "Ebeveyn Danışmanlığı",
      desc: "Çocukluk ve ergenlik geçişlerinde ebeveyn-çocuk bağını güçlendiren, sınır koyma ve iletişim becerilerini geliştiren rehberlik.",
      tags: ["Pozitif Ebeveynlik", "İletişim Yönetimi", "Sınır Eğitimi"]
    }
  ];

  const faqs = [
    {
      q: "İlk seans süreci nasıl işler?",
      a: "İlk seans genel bir tanışma ve değerlendirme oturumudur. Yaşadığınız zorlukların haritası çıkarılır, terapi hedefleriniz belirlenir ve size en uygun çalışma planı oluşturulur."
    },
    {
      q: "Oyun terapisi hangi yaş grubu için uygundur?",
      a: "Oyun terapisi genellikle 2.5 - 12 yaş arasındaki çocuklarda uygulanır. Çocuğun duygularını, korkularını ve iç dünyasını oyun simgeleriyle dışa vurmasını sağlar."
    },
    {
      q: "Seans sıklığı ve süreci ne kadardır?",
      a: "Tüm seanslar 45 dakika sürmektedir. Görüşme sıklığı danışanın ihtiyacına göre genellikle haftada bir veya iki haftada bir olarak planlanır."
    },
    {
      q: "Görüşmelerde gizlilik nasıl korunur?",
      a: "Klinik psikoloji etik kuralları çerçevesinde seans odasında paylaşılan tüm bilgiler tam bir gizlilik ve güven altındadır."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#192923] font-sans selection:bg-[#D6AFA3] selection:text-white relative">
      
      {/* ÜST BİLGİ ŞERİDİ */}
      <div className="bg-[#192923] text-[#FAF7F2]/80 text-xs py-2.5 px-4 border-b border-[#FAF7F2]/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D6AFA3]" /> Alsancak, Konak / İzmir &bull; Yüz Yüze & Online Danışmanlık
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D6AFA3]" /> Pzt - Cmt: 09:00 - 19:00
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:05306560632" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D6AFA3]" /> 0530 656 06 32
            </a>
            <span className="opacity-40">|</span>
            <a href="mailto:melikeermumcu0@gmail.com" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D6AFA3]" /> melikeermumcu0@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#192923]">
              Melike Ermumcu
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#446A5E] font-bold">
              Klinik Psikolog
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#192923]/80">
            <a href="#hakkimda" className="hover:text-[#446A5E] transition-colors">Hakkımda</a>
            <a href="#uzmanliklar" className="hover:text-[#446A5E] transition-colors">Uzmanlıklar</a>
            <a href="#testler" className="hover:text-[#446A5E] transition-colors">Klinik Testler</a>
            <a href="#blog" className="hover:text-[#446A5E] transition-colors">Yazılar</a>
            <a href="#sss" className="hover:text-[#446A5E] transition-colors">Sıkça Sorulanlar</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => setDrawerOpen(true)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isAdmin 
                    ? 'bg-[#192923] text-[#D6AFA3] border border-[#D6AFA3]/30 hover:bg-black' 
                    : 'bg-[#FAF7F2] text-[#446A5E] border border-[#446A5E]/40 hover:bg-[#E5ECE9]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Yönetici Paneli' : (profile?.full_name || currentUser.user_metadata?.full_name || 'Hesabım')}</span>
              </button>
            ) : (
              <button
                onClick={() => { setAuthView('login'); setDrawerOpen(true); }}
                className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#E5ECE9] text-[#446A5E] border border-[#446A5E]/30 text-xs font-semibold tracking-wide transition-all cursor-pointer"
              >
                Giriş Yap / Kayıt
              </button>
            )}

            {!isAdmin && (
              <a
                href="#randevu"
                className="px-5 py-2.5 rounded-full bg-[#446A5E] hover:bg-[#335047] text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all"
              >
                Randevu Oluştur
              </a>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#192923]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF7F2] border-b border-[#E8DFD8] px-4 pt-2 pb-6 space-y-3">
            <a href="#hakkimda" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#192923]">Hakkımda</a>
            <a href="#uzmanliklar" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#192923]">Uzmanlıklar</a>
            <a href="#testler" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#192923]">Klinik Testler</a>
            <a href="#blog" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#192923]">Yazılar</a>
            <a href="#sss" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#192923]">Sıkça Sorulanlar</a>
            <button
              onClick={() => { setMobileMenuOpen(false); setAuthView('login'); setDrawerOpen(true); }}
              className="block w-full text-center py-2.5 rounded-full bg-[#446A5E] text-white text-xs font-bold cursor-pointer"
            >
              {currentUser ? (isAdmin ? 'Yönetici Paneli' : 'Hesabım') : 'Giriş Yap / Kayıt Ol'}
            </button>
          </div>
        )}
      </header>

      {/* HERO BÖLÜMÜ */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E5ECE9] border border-[#446A5E]/20 text-[#446A5E] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Akredite & Bilimsel Terapi Ekolleri</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#192923] leading-tight">
            Düşüncelerinizi anlamak, kendinize <span className="text-[#446A5E] italic">güvenli bir alan</span> açmakla başlar.
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Yetişkinlerde Bilişsel Davranışçı Terapi (BDT), çocuk ve ergenlerde Oyun Terapisi ile klinik değerlendirme araçlarını harmanlayarak Alsancak&apos;ta ve online ortamda danışanlarıma profesyonel bir yol haritası sunuyorum.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {!isAdmin && (
              <a
                href="#randevu"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#446A5E] hover:bg-[#335047] text-white text-sm font-semibold shadow-lg shadow-[#446A5E]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Randevu Talebi İletin</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
            <a
              href="https://wa.me/905306560632"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F5EAE5] border border-[#D6AFA3] text-[#192923] text-sm font-semibold hover:bg-[#EBDCD6] transition-all text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#446A5E]" />
              WhatsApp ile Danışın
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E8DFD8] max-w-2xl mx-auto">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#192923]">Klinik Psikoloji</p>
              <p className="text-xs text-stone-500 font-medium">Yüksek Lisans Derecesi</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#192923]">BDT & Oyun</p>
              <p className="text-xs text-stone-500 font-medium">Uygulayıcı Sertifikalı</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#192923]">%100</p>
              <p className="text-xs text-stone-500 font-medium">Gizlilik & Etik İlke</p>
            </div>
          </div>
        </div>
      </section>

      {/* HAKKIMDA */}
      <section id="hakkimda" className="py-20 bg-white border-y border-[#E8DFD8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EAE5] text-[#8C7A6B] text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-[#D6AFA3]" />
                <span>Akademik Geçmiş & Vizyon</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#192923] leading-tight">
                Her bireyin ve çocuğun kendi iyileşme potansiyeli vardır.
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Uluslararası Kıbrıs Üniversitesi Psikoloji lisans programını 3.65 onur derecesiyle tamamladıktan sonra, aynı üniversitede Klinik Psikoloji Yüksek Lisans eğitimimi başarıyla tamamladım. Bilişsel Davranışçı Terapi ekolü çerçevesinde bireylerin düşünce kalıplarını yeniden yapılandırmalarına eşlik ediyorum.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-start gap-3">
                  <Award className="w-5 h-5 text-[#446A5E] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#192923]">BDT Uygulayıcısı</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Bilişsel Davranışçı Psikoterapiler Derneği</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#D6AFA3] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#192923]">Oyun Terapisi</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Çocuk Merkezli & Deneyimsel Oyun Ekolü</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#E8DFD8] space-y-6">
              <h3 className="text-xl font-bold text-[#192923]">Çalışma İlkelerim</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#E5ECE9] text-[#446A5E] flex items-center justify-center shrink-0 font-bold text-xs">01</div>
                  <div>
                    <h5 className="text-sm font-bold text-[#192923]">Bireye Özgü Yaklaşım</h5>
                    <p className="text-xs text-stone-600 mt-1">Terapi haritası tamamen kişinin ihtiyaçlarına göre özelleştirilir.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#E5ECE9] text-[#446A5E] flex items-center justify-center shrink-0 font-bold text-xs">02</div>
                  <div>
                    <h5 className="text-sm font-bold text-[#192923]">Bilimsel ve Kanıta Dayalı Ekoller</h5>
                    <p className="text-xs text-stone-600 mt-1">Uluslararası geçerliliği kanıtlanmış psikoterapi modelleri kullanılır.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#E5ECE9] text-[#446A5E] flex items-center justify-center shrink-0 font-bold text-xs">03</div>
                  <div>
                    <h5 className="text-sm font-bold text-[#192923]">Mutlak Gizlilik</h5>
                    <p className="text-xs text-stone-600 mt-1">Türk Psikologlar Derneği etik yönetmeliği ilkelerine titizlikle uyulur.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UZMANLIK ALANLARI */}
      <section id="uzmanliklar" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#446A5E] uppercase tracking-widest">Hizmet Alanları</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#192923]">Klinik Hizmetler & Terapi Alanları</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((svc, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-[#E8DFD8] shadow-sm space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-center">
                    {svc.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#192923]">{svc.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{svc.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E8DFD8]/60">
                  {svc.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#FAF7F2] text-stone-600 border border-[#E8DFD8]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KLİNİK TESTLER */}
      <section id="testler" className="py-20 bg-[#FAF7F2] border-t border-[#E8DFD8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#192923] text-white rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="text-xs font-bold text-[#D6AFA3] uppercase tracking-widest">Klinik Ölçümleme</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">Psikolojik Değerlendirme ve Testler</h2>
              <p className="text-sm sm:text-base text-[#FAF7F2]/80 leading-relaxed">
                Çocuk ve ergenlerin gelişimsel, bilişsel, dikkat ve duygusal özelliklerini daha kapsamlı değerlendirmek amacıyla, ihtiyaç doğrultusunda çeşitli psikolojik değerlendirme araçlarından yararlanıyorum.
              </p>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D6AFA3]">Uygulanan Klinik Değerlendirme & Gelişim Testleri:</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                    <h4 className="text-sm font-bold text-white">Ankara Gelişim Tarama Envanteri (AGTE)</h4>
                    <p className="text-xs text-[#FAF7F2]/75">Gelişimsel değerlendirme</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                    <h4 className="text-sm font-bold text-white">d2 Dikkat Testi</h4>
                    <p className="text-xs text-[#FAF7F2]/75">Dikkat ve seçici dikkat süreçlerinin değerlendirilmesi</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                    <h4 className="text-sm font-bold text-white">Metropolitan Okul Olgunluğu Testi</h4>
                    <p className="text-xs text-[#FAF7F2]/75">Okula hazırlık ve okul olgunluğunun değerlendirilmesi</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                    <h4 className="text-sm font-bold text-white">Çizim Testleri</h4>
                    <p className="text-xs text-[#FAF7F2]/75">Projektif gelişimsel ve duygusal değerlendirme</p>
                  </div>
                  <div className="sm:col-span-2 bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                    <h4 className="text-sm font-bold text-white">Duygu Durumu Değerlendirme Ölçekleri</h4>
                    <p className="text-xs text-[#FAF7F2]/75">Çocuk ve ergenlerde duygu durumu ve psikolojik belirtilerin değerlendirilmesi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-20 bg-white border-y border-[#E8DFD8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-12">
            <span className="text-xs font-bold text-[#446A5E] uppercase tracking-widest">Psikoloji Kütüphanesi</span>
            <h2 className="text-3xl font-extrabold text-[#192923]">Yazılar & Makaleler</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug || post.id}`}
                className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#E8DFD8] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-stone-500">
                    <span className="font-bold text-[#446A5E] bg-[#E5ECE9] px-2.5 py-1 rounded-full text-[10px]">
                      {post.category || 'Psikoloji'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.read_time || '4 dk okuma'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#192923] group-hover:text-[#446A5E] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#E8DFD8] flex items-center justify-between text-xs font-bold text-[#446A5E]">
                  <span>Makaleyi Oku</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-[#446A5E] uppercase tracking-widest">Merak Edilenler</span>
            <h2 className="text-3xl font-extrabold text-[#192923]">Sıkça Sorulanlar</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#E8DFD8] overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer"
                >
                  <span className="text-sm font-bold text-[#192923] flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#446A5E] shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-xl font-bold text-stone-400">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#FAF7F2] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RANDEVU FORMU VE İLETİŞİM */}
      <section id="randevu" className="py-20 bg-white border-t border-[#E8DFD8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#446A5E] uppercase tracking-widest">İletişim & Randevu</span>
                <h2 className="text-3xl font-extrabold text-[#192923]">İlk Adımı Atın</h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Yüz yüze veya online seans talebi oluşturmak için formu doldurabilirsiniz.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8]">
                  <MapPin className="w-5 h-5 text-[#446A5E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Yüz Yüze Görüşme Adresi</p>
                    <p className="text-xs sm:text-sm font-bold text-[#192923]">
                      Alsancak Mah. 1476/1 Sk. No:12 Katipoğlu İşmerkezi Daire:4, Alsancak, Konak / İzmir
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8]">
                  <Phone className="w-5 h-5 text-[#446A5E]" />
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Telefon & WhatsApp</p>
                    <a href="tel:05306560632" className="text-sm font-bold text-[#192923] hover:text-[#446A5E]">0530 656 06 32</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8]">
                  <Mail className="w-5 h-5 text-[#446A5E]" />
                  <div>
                    <p className="text-xs text-stone-500 font-medium">E-Posta</p>
                    <a href="mailto:melikeermumcu0@gmail.com" className="text-sm font-bold text-[#192923] hover:text-[#446A5E]">melikeermumcu0@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#E8DFD8] shadow-sm">
              <h3 className="text-xl font-bold text-[#192923] mb-6">Ön Görüşme & Randevu Formu</h3>
              {formStatus === 'success' && (
                <div className="p-4 mb-6 rounded-2xl bg-[#E5ECE9] border border-[#446A5E]/40 text-[#446A5E] text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Randevu talebiniz başarıyla iletildi. En kısa sürede sizinle iletişime geçilecektir.</span>
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Örn: Ayşe Yılmaz"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1">Telefon Numaranız *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05xx xxx xx xx"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1">E-Posta Adresiniz *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ornek@mail.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1">Hizmet Alanı *</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                    >
                      <option value="Yüz Yüze Görüşme (Alsancak / İzmir)">Yüz Yüze Görüşme (Alsancak / İzmir)</option>
                      <option value="Online Görüşme">Online Görüşme</option>
                      <option value="Bireysel Yetişkin Terapisi">Bireysel Yetişkin Terapisi</option>
                      <option value="Çocuk & Oyun Terapisi">Çocuk & Oyun Terapisi</option>
                      <option value="Psikolojik Değerlendirme ve Testler">Psikolojik Değerlendirme ve Testler</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Notunuz</label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Görüşmek istediğiniz konu..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full py-4 rounded-2xl bg-[#446A5E] hover:bg-[#335047] text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{formStatus === 'loading' ? 'İletiliyor...' : 'Randevu Talebini Gönder'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#192923] text-[#FAF7F2] py-12 border-t border-[#FAF7F2]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <div>
            <p className="text-base font-bold">Klinik Psikolog Melike Ermumcu</p>
            <p className="text-xs text-[#FAF7F2]/60 mt-1">Alsancak, İzmir & Online Danışmanlık &bull; &copy; 2026 Tüm Hakları Saklıdır.</p>
          </div>
          <div className="flex gap-6 text-xs text-[#FAF7F2]/70 font-medium">
            <a href="#hakkimda" className="hover:text-white transition-colors">Hakkımda</a>
            <a href="#uzmanliklar" className="hover:text-white transition-colors">Hizmetler</a>
            <a href="#testler" className="hover:text-white transition-colors">Testler</a>
            <a href="#blog" className="hover:text-white transition-colors">Yazılar</a>
            <a href="#randevu" className="hover:text-white transition-colors">İletişim</a>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* SAĞDAN AÇILAN HESAP & YÖNETİCİ ÇEKMECESİ (DRAWER) */}
      {/* ============================================================ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-4 bg-[#192923] text-[#FAF7F2] flex items-center justify-between border-b border-[#FAF7F2]/10">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#D6AFA3]" />
                <div>
                  <h3 className="text-sm font-extrabold">
                    {currentUser 
                      ? (isAdmin ? 'Psikolog Yönetici Paneli' : (profile?.full_name || currentUser.user_metadata?.full_name || 'Danışan Hesabı'))
                      : (authView === 'login' ? 'Danışan Girişi' : authView === 'register' ? 'Yeni Danışan Kaydı' : 'Şifremi Unuttum')}
                  </h3>
                  {currentUser && <p className="text-[10px] text-[#FAF7F2]/60">{currentUser.email}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentUser && (
                  <button onClick={handleLogout} title="Çıkış Yap" className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-stone-300 hover:text-red-300 transition-colors cursor-pointer">
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Çekmece İçeriği */}
            <div className="flex-1 overflow-y-auto p-5 text-xs">
              
              {/* 1. GİRİŞ YAPILMAMIŞSA (AUTH FORMLARI) */}
              {!currentUser && (
                <div className="space-y-4 pt-4">
                  {authError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {resetSent && (
                    <div className="p-4 rounded-2xl bg-[#E5ECE9] border border-[#446A5E]/40 text-[#446A5E] text-xs space-y-1">
                      <p className="font-bold">Sıfırlama bağlantısı gönderildi!</p>
                      <p className="text-stone-600">Lütfen e-posta kutunuzu kontrol edip gelen linke tıklayın.</p>
                    </div>
                  )}

                  <form onSubmit={handleAuth} className="space-y-3">
                    {authView === 'register' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-[#192923] mb-1">Ad Soyad</label>
                          <input
                            type="text"
                            required
                            value={authForm.fullName}
                            onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                            placeholder="Adınız ve Soyadınız"
                            className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#192923] mb-1">Telefon</label>
                          <input
                            type="tel"
                            required
                            value={authForm.phone}
                            onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                            placeholder="05xx xxx xx xx"
                            className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#192923] mb-1">E-Posta Adresi</label>
                      <input
                        type="email"
                        required
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        placeholder="ornek@mail.com"
                        className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs"
                      />
                    </div>

                    {authView !== 'forgot' && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-[#192923]">Şifre</label>
                          {authView === 'login' && (
                            <button
                              type="button"
                              onClick={() => { setAuthView('forgot'); setAuthError(''); setResetSent(false); }}
                              className="text-[11px] text-[#446A5E] font-medium hover:underline cursor-pointer"
                            >
                              Şifremi Unuttum
                            </button>
                          )}
                        </div>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={authForm.password}
                          onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                          placeholder="En az 6 karakter"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 rounded-xl bg-[#446A5E] hover:bg-[#335047] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                    >
                      {authLoading ? 'İşlem yapılıyor...' : (
                        authView === 'login' ? 'Giriş Yap' :
                        authView === 'register' ? 'Kayıt Ol ve Başla' : 'Sıfırlama Linki Gönder'
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-4 border-t border-[#E8DFD8] space-y-2">
                    {authView === 'login' && (
                      <button
                        onClick={() => { setAuthView('register'); setAuthError(''); }}
                        className="text-xs text-[#446A5E] font-bold underline cursor-pointer"
                      >
                        Hesabınız yok mu? Hemen Kayıt Olun
                      </button>
                    )}
                    {authView === 'register' && (
                      <button
                        onClick={() => { setAuthView('login'); setAuthError(''); }}
                        className="text-xs text-[#446A5E] font-bold underline cursor-pointer"
                      >
                        Zaten hesabınız var mı? Giriş Yapın
                      </button>
                    )}
                    {authView === 'forgot' && (
                      <button
                        onClick={() => { setAuthView('login'); setAuthError(''); setResetSent(false); }}
                        className="text-xs text-[#446A5E] font-bold underline cursor-pointer"
                      >
                        Giriş Ekranına Geri Dön
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 2. DANIŞAN GİRİŞİ YAPILDIYSA (YENİ 4'LÜ MİMARİ) */}
              {currentUser && !isAdmin && (
                <div className="space-y-4">
                  {/* Danışan Sekme Butonları */}
                  <div className="grid grid-cols-4 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8DFD8] text-[10px] font-bold text-center">
                    <button
                      onClick={() => setClientTab('appointments')}
                      className={`py-2 rounded-lg transition-all ${clientTab === 'appointments' ? 'bg-[#446A5E] text-white' : 'text-stone-600'}`}
                    >
                      Seanslar ({myAppointments.length})
                    </button>
                    <button
                      onClick={() => setClientTab('journey')}
                      className={`py-2 rounded-lg transition-all ${clientTab === 'journey' ? 'bg-[#446A5E] text-white' : 'text-stone-600'}`}
                    >
                      Sürecim
                    </button>
                    <button
                      onClick={() => setClientTab('messages')}
                      className={`py-2 rounded-lg transition-all ${clientTab === 'messages' ? 'bg-[#446A5E] text-white' : 'text-stone-600'}`}
                    >
                      Mesajlar
                    </button>
                    <button
                      onClick={() => setClientTab('account')}
                      className={`py-2 rounded-lg transition-all ${clientTab === 'account' ? 'bg-[#446A5E] text-white' : 'text-stone-600'}`}
                    >
                      Hesabım
                    </button>
                  </div>

                  {/* SEKME 1: RANDEVULAR */}
                  {clientTab === 'appointments' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#192923]">Seans Geçmişi & Plan</span>
                        <button
                          onClick={() => setShowBooking(!showBooking)}
                          className="px-3 py-1.5 rounded-lg bg-[#446A5E] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> {showBooking ? 'Kapat' : 'Yeni Randevu'}
                        </button>
                      </div>

                      {showBooking && (
                        <form onSubmit={handleClientBook} className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] space-y-2">
                          <p className="font-bold text-[#192923] text-[11px]">Tarih ve Saat Seçin</p>
                          {bookingStatus === 'success' && <p className="text-emerald-700 font-bold text-[10px]">Talebiniz iletildi!</p>}
                          <div className="grid grid-cols-2 gap-2">
                            <input type="date" required value={bookingData.date} onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} className="p-2 bg-white rounded-lg border text-xs" />
                            <select value={bookingData.time} onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })} className="p-2 bg-white rounded-lg border text-xs">
                              {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <select value={bookingData.service} onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })} className="w-full p-2 bg-white rounded-lg border text-xs">
                            <option value="Yüz Yüze Görüşme (Alsancak / İzmir)">Yüz Yüze Görüşme (Alsancak / İzmir)</option>
                            <option value="Online Görüşme">Online Görüşme</option>
                          </select>
                          <button type="submit" disabled={bookingStatus === 'loading'} className="w-full py-2 bg-[#446A5E] text-white font-bold rounded-lg text-xs cursor-pointer">
                            {bookingStatus === 'loading' ? 'İletiliyor...' : 'Randevu İste'}
                          </button>
                        </form>
                      )}

                      {myAppointments.length === 0 ? (
                        <p className="text-center text-stone-400 py-6">Kayıtlı randevunuz bulunmuyor.</p>
                      ) : (
                        myAppointments.map(appt => (
                          <div key={appt.id} className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] flex justify-between items-center">
                            <div>
                              <p className="font-bold text-[#192923]">{appt.appointment_date} &bull; {appt.appointment_time}</p>
                              <p className="text-[10px] text-stone-500">{appt.service_type}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              appt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {appt.status === 'confirmed' ? 'Onaylandı' : appt.status === 'pending' ? 'Onay Bekliyor' : 'İptal'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* SEKME 2: TERAPİ YOLCULUĞUM (SÜRECİM) */}
                  {clientTab === 'journey' && (
                    <div className="space-y-4">
                      {/* Seans İlerleme Özeti */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#192923] to-[#2B453B] text-white space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#D6AFA3]">Klinik Yolculuk</span>
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                            {myAppointments.filter(a => a.status === 'confirmed').length} Seans Tamamlandı
                          </span>
                        </div>
                        <p className="text-sm font-extrabold">{profile?.full_name || 'Danışan'}</p>
                        <p className="text-[11px] text-stone-300 leading-relaxed">
                          Psikoloğunuzla birlikte belirlediğiniz hedefler ve seans arası pekiştirme uygulamalarınız burada listelenir.
                        </p>
                      </div>

                      {/* Ödevler ve Hedefler Listesi */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#192923]">
                          <ListTodo className="w-4 h-4 text-[#446A5E]" />
                          <span>Seans Arası Uygulamalar & Hedefler</span>
                        </div>

                        {myTasks.length === 0 ? (
                          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] text-center text-stone-400 space-y-1">
                            <Target className="w-6 h-6 mx-auto opacity-40 text-[#446A5E]" />
                            <p className="font-bold text-xs text-stone-600">Henüz tanımlanmış ödev bulunmuyor.</p>
                            <p className="text-[10px]">İlk görüşmenizin ardından psikoloğunuz buraya size özel çalışmalar ekleyecektir.</p>
                          </div>
                        ) : (
                          myTasks.map((t) => (
                            <div 
                              key={t.id} 
                              onClick={() => toggleTaskCompleted(t.id, t.is_completed)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                t.is_completed 
                                  ? 'bg-[#E5ECE9]/50 border-[#446A5E]/30 opacity-75' 
                                  : 'bg-white border-[#E8DFD8] hover:border-[#446A5E]'
                              }`}
                            >
                              <div className="mt-0.5">
                                {t.is_completed ? (
                                  <CheckSquare className="w-4 h-4 text-[#446A5E]" />
                                ) : (
                                  <Square className="w-4 h-4 text-stone-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className={`font-bold text-xs ${t.is_completed ? 'line-through text-stone-500' : 'text-[#192923]'}`}>
                                    {t.title}
                                  </p>
                                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#FAF7F2] border text-stone-500">
                                    {t.type === 'homework' ? 'Ev Ödevi' : 'Hedef'}
                                  </span>
                                </div>
                                {t.description && (
                                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                                    {t.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* SEKME 3: MESAJLAR */}
                  {clientTab === 'messages' && (
                    <div className="flex flex-col h-[450px]">
                      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                        {myMessages.length === 0 ? (
                          <p className="text-center text-stone-400 pt-8">Henüz mesaj iletilmedi.</p>
                        ) : (
                          myMessages.map(m => {
                            const isMe = m.sender_role === 'client';
                            return (
                              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <span className="text-[9px] text-stone-400 mb-0.5">{isMe ? 'Siz' : m.sender_name}</span>
                                <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs ${isMe ? 'bg-[#446A5E] text-white rounded-br-xs' : 'bg-[#FAF7F2] border border-[#E8DFD8] text-stone-800 rounded-bl-xs'}`}>
                                  {m.message}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <form onSubmit={handleClientSendMsg} className="pt-2 border-t border-[#E8DFD8] flex gap-2">
                        <input type="text" required value={clientNewMsg} onChange={(e) => setClientNewMsg(e.target.value)} placeholder="İdari bir not yazın..." className="flex-1 px-3 py-2 bg-[#FAF7F2] rounded-xl border text-xs" />
                        <button type="submit" className="p-2 bg-[#446A5E] text-white rounded-xl cursor-pointer"><Send className="w-3.5 h-3.5" /></button>
                      </form>
                    </div>
                  )}

                  {/* SEKME 4: HESABIM & GÜVENLİK */}
                  {clientTab === 'account' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-2">
                        <span className="text-[10px] font-bold text-[#446A5E] uppercase tracking-wider">Hesap Bilgileri</span>
                        <div>
                          <p className="text-xs font-bold text-[#192923]">{profile?.full_name || 'Danışan'}</p>
                          <p className="text-[11px] text-stone-500">{currentUser.email}</p>
                          <p className="text-[11px] text-stone-500 mt-0.5">{profile?.phone || 'Telefon belirtilmemiş'}</p>
                        </div>
                      </div>

                      {/* Şifre Değiştirme */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E8DFD8] space-y-3">
                        <div className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-[#446A5E]" />
                          <h4 className="font-bold text-xs text-[#192923]">Şifre Değiştir</h4>
                        </div>

                        {changePassMsg && (
                          <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                            changePassStatus === 'success' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}>
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{changePassMsg}</span>
                          </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-2.5">
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Yeni şifreniz (en az 6 karakter)"
                            className="w-full px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] text-xs focus:outline-none focus:border-[#446A5E]"
                          />
                          <button
                            type="submit"
                            disabled={changePassStatus === 'loading'}
                            className="w-full py-2.5 rounded-xl bg-[#446A5E] hover:bg-[#335047] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                          >
                            {changePassStatus === 'loading' ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                          </button>
                        </form>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full py-3 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Hesaptan Güvenli Çıkış Yap</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* 3. YÖNETİCİ (MELİKE ERMUMCU) GİRİŞİ */}
              {currentUser && isAdmin && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8DFD8] text-[10px] font-bold text-center">
                    <button
                      onClick={() => setAdminTab('appointments')}
                      className={`py-2 rounded-lg transition-all ${adminTab === 'appointments' ? 'bg-[#446A5E] text-white' : 'text-stone-600'}`}
                    >
                      Randevular ({adminAppointments.filter(a => a.status === 'pending').length})
                    </button>
                    <button
                      onClick={() => setAdminTab('messages')}
                      className={`py-2 rounded-lg transition-all ${adminTab === 'messages' ? 'bg-[#446A5E] text-white' : 'text-stone-600'}`}
                    >
                      Mesajlar ({clientConversations.length})
                    </button>
                    <button
                      onClick={() => setAdminTab('tasks')}
                      className={`py-2 rounded-lg transition-all ${adminTab === 'tasks' ? 'bg-[#446A5E] text-white' : 'text-stone-600'}`}
                    >
                      Ödev/Hedef
                    </button>
                    <button
                      onClick={() => setAdminTab('posts')}
                      className={`py-2 rounded-lg transition-all ${adminTab === 'posts' ? 'bg-[#446A5E] text-white' : 'text-stone-600'}`}
                    >
                      Yazı Ekle
                    </button>
                  </div>

                  {/* SEKME 1: RANDEVULAR */}
                  {adminTab === 'appointments' && (
                    <div className="space-y-3">
                      <p className="font-bold text-[#192923]">Danışan Randevu Talepleri</p>
                      {adminAppointments.length === 0 ? (
                        <p className="text-center text-stone-400 py-6">Kayıtlı randevu bulunmuyor.</p>
                      ) : (
                        adminAppointments.map(appt => (
                          <div key={appt.id} className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-[#192923] text-sm">{appt.client_name}</p>
                                <p className="text-[11px] text-[#446A5E]">{appt.client_phone || 'Tel yok'}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                appt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {appt.status === 'confirmed' ? 'Onaylı' : appt.status === 'pending' ? 'Bekliyor' : 'İptal'}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600">{appt.appointment_date} &bull; <strong>{appt.appointment_time}</strong> &bull; {appt.service_type}</p>
                            {appt.note && <p className="text-[11px] text-stone-500 italic bg-white p-2 rounded-lg border">&quot;{appt.note}&quot;</p>}
                            <div className="flex gap-2 pt-1">
                              {appt.status !== 'confirmed' && (
                                <button onClick={() => handleUpdateApptStatus(appt.id, 'confirmed')} className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer">
                                  <Check className="w-3 h-3" /> Onayla
                                </button>
                              )}
                              {appt.status !== 'cancelled' && (
                                <button onClick={() => handleUpdateApptStatus(appt.id, 'cancelled')} className="flex-1 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer">
                                  <X className="w-3 h-3" /> İptal
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* SEKME 2: INSTAGRAM DM FORMATINDA ADMIN MESAJ KUTUSU */}
                  {adminTab === 'messages' && (
                    <div className="flex flex-col h-[460px]">
                      {!selectedClient ? (
                        <div className="space-y-2">
                          <p className="font-bold text-[#192923] text-xs pb-1">Gelen Danışan Kutuları</p>
                          {clientConversations.length === 0 ? (
                            <div className="text-center text-stone-400 py-12">
                              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                              <p>Henüz danışan mesajı bulunmuyor.</p>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {clientConversations.map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => setSelectedClient({ id: c.id, name: c.name })}
                                  className="w-full p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#E5ECE9] border border-[#E8DFD8] text-left transition-all flex items-center justify-between cursor-pointer group"
                                >
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-9 h-9 rounded-full bg-[#446A5E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                      {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="truncate">
                                      <p className="font-bold text-xs text-[#192923] group-hover:text-[#446A5E] transition-colors">{c.name}</p>
                                      <p className="text-[11px] text-stone-500 truncate mt-0.5">{c.lastMessage}</p>
                                    </div>
                                  </div>
                                  <span className="text-[10px] text-stone-400 ml-2 shrink-0">{c.lastTime}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col h-full">
                          <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-[#E8DFD8]">
                            <button
                              onClick={() => setSelectedClient(null)}
                              className="p-1.5 rounded-lg hover:bg-[#E5ECE9] text-stone-600 transition-colors cursor-pointer"
                              title="Mesaj Listesine Dön"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="w-7 h-7 rounded-full bg-[#446A5E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {selectedClient.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-xs text-[#192923]">{selectedClient.name}</p>
                              <p className="text-[9px] text-[#446A5E] font-medium">Birebir Görüşme</p>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
                            {adminMessages
                              .filter(m => (m.sender_role === 'client' && m.sender_id === selectedClient.id) || (m.sender_role === 'admin' && m.client_id === selectedClient.id))
                              .map((m) => {
                                const isMe = m.sender_role === 'admin';
                                return (
                                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[9px] text-stone-400 mb-0.5">{isMe ? 'Siz' : selectedClient.name}</span>
                                    <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs ${isMe ? 'bg-[#446A5E] text-white rounded-br-xs' : 'bg-[#FAF7F2] border border-[#E8DFD8] text-stone-800 rounded-bl-xs'}`}>
                                      {m.message}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          <form onSubmit={handleSendAdminReply} className="pt-2 border-t border-[#E8DFD8] flex gap-2">
                            <input
                              type="text"
                              required
                              value={adminReply}
                              onChange={(e) => setAdminReply(e.target.value)}
                              placeholder={`${selectedClient.name} danışanına yanıt yazın...`}
                              className="flex-1 px-3 py-2 bg-[#FAF7F2] rounded-xl border text-xs focus:outline-none focus:border-[#446A5E]"
                            />
                            <button type="submit" className="p-2 bg-[#446A5E] text-white rounded-xl cursor-pointer hover:bg-[#335047] transition-colors">
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SEKME 3: DANIŞANA ÖDEV / HEDEF TANIMLAMA */}
                  {adminTab === 'tasks' && (
                    <div className="space-y-4">
                      <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] space-y-3">
                        <p className="font-bold text-[#192923] text-xs">Danışana Yeni Ödev/Hedef Tanımla</p>
                        <form onSubmit={handleCreateTask} className="space-y-2">
                          <select
                            required
                            value={taskForm.clientId}
                            onChange={(e) => setTaskForm({ ...taskForm, clientId: e.target.value })}
                            className="w-full p-2 bg-white rounded-lg border text-xs"
                          >
                            <option value="">Danışan Seçin...</option>
                            {uniqueClients.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>

                          <input
                            type="text"
                            required
                            placeholder="Başlık (Örn: Otomatik Düşünce Kayıt Formu)"
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            className="w-full p-2 bg-white rounded-lg border text-xs"
                          />

                          <textarea
                            rows={2}
                            placeholder="Açıklama / Danışana Not (Örn: Hafta içi kaygı hissettiğiniz 2 anı not edin)"
                            value={taskForm.description}
                            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                            className="w-full p-2 bg-white rounded-lg border text-xs"
                          />

                          <div className="flex gap-2">
                            <select
                              value={taskForm.type}
                              onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value })}
                              className="flex-1 p-2 bg-white rounded-lg border text-xs"
                            >
                              <option value="homework">Ev Ödevi</option>
                              <option value="goal">Terapi Hedefi</option>
                            </select>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-[#446A5E] text-white font-bold rounded-lg text-xs cursor-pointer hover:bg-[#335047]"
                            >
                              Kaydet ve Ata
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Önceden Tanımlananlar */}
                      <div className="space-y-2">
                        <p className="font-bold text-[#192923] text-xs">Atanan Ödevler ({adminTasks.length})</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {adminTasks.map((t) => (
                            <div key={t.id} className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] text-[11px] flex justify-between items-start">
                              <div>
                                <p className="font-bold text-[#192923]">{t.title}</p>
                                <p className="text-stone-500 text-[10px] mt-0.5">{t.description}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${t.is_completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {t.is_completed ? 'Tamamlandı' : 'Bekliyor'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SEKME 4: BLOG YAZISI EKLEME */}
                  {adminTab === 'posts' && (
                    <div className="space-y-3">
                      <p className="font-bold text-[#192923]">Yeni Blog Yazısı Ekle</p>
                      {blogStatus === 'success' && <p className="text-emerald-700 font-bold text-[10px]">Yazı yayınlandı!</p>}
                      <form onSubmit={handleSavePost} className="space-y-2">
                        <input type="text" required value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value, slug: generateSlug(e.target.value) })} placeholder="Başlık" className="w-full p-2 bg-[#FAF7F2] rounded-lg border text-xs" />
                        <select value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full p-2 bg-[#FAF7F2] rounded-lg border text-xs">
                          <option value="Yetişkin Terapisi">Yetişkin Terapisi</option>
                          <option value="Çocuk & Oyun">Çocuk & Oyun</option>
                          <option value="Klinik Değerlendirme">Klinik Değerlendirme</option>
                        </select>
                        <textarea rows={2} required value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} placeholder="Kısa Özet" className="w-full p-2 bg-[#FAF7F2] rounded-lg border text-xs" />
                        <textarea rows={4} required value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="İçerik..." className="w-full p-2 bg-[#FAF7F2] rounded-lg border text-xs" />
                        <button type="submit" disabled={blogStatus === 'loading'} className="w-full py-2 bg-[#446A5E] text-white font-bold rounded-lg text-xs cursor-pointer">
                          {blogStatus === 'loading' ? 'Kaydediliyor...' : 'Yayınla'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}