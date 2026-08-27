'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Menu,
  X,
  ArrowRight,
  Clock,
  MapPin,
  GraduationCap,
  Sparkles,
  Check,
  Phone,
  Mail,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Brain,
  Baby,
  FileText,
  HelpCircle,
  ChevronDown,
  Award
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Yüz Yüze Görüşme (Alsancak / İzmir)',
    datePreference: '',
    note: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Bir hata olustu.');
      }

      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        type: 'Yüz Yüze Görüşme (Alsancak / İzmir)',
        datePreference: '',
        note: ''
      });
    } catch (err: unknown) {
      setStatus('error');
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Randevu talebi iletilemedi. Lutfen telefon veya WhatsApp ile ulasiniz.');
      }
    }
  };

  const faqs = [
    {
      q: "İlk terapi seansında beni neler bekliyor?",
      a: "İlk seans kapsamlı bir tanışma ve değerlendirme sürecidir. Yaşadığınız güçlüklerin geçmişi, terapiye başvuru amacınız ve beklentileriniz ele alınarak size özel terapi hedefleri belirlenir."
    },
    {
      q: "Seanslar ne kadar sürüyor ve görüşme sıklığı nedir?",
      a: "Tüm seanslar 45 dakika sürmektedir. Görüşme sıklığı danışanın ihtiyacına göre genellikle haftada bir veya iki haftada bir olarak planlanır."
    },
    {
      q: "Online terapi ile yüz yüze terapi arasında etki farkı var mıdır?",
      a: "Yapılan bilimsel araştırmalar, etik kurallara ve uygun tekniklere bağlı kalındığında Bilişsel Davranışçı Terapi ekolünün online ortamda da yüz yüze görüşmeler kadar etkili olduğunu göstermektedir."
    },
    {
      q: "Psikolojik testler nasıl uygulanır ve tanı konur mu?",
      a: "Uygulanan gelişim, dikkat ve kişilik testleri tek başına tanı koyma aracı değildir. Test bulguları, ayrıntılı klinik görüşme ve gözlem süreci ile sentezlenerek yol haritası çizilir."
    }
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#192923] min-h-screen font-sans selection:bg-[#D6AFA3] selection:text-[#192923]">
      
      {/* 1. Üst Bilgi Şeridi */}
      <div className="bg-[#192923] text-[#FAF7F2] text-xs py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#84A98C] animate-pulse"></span>
            <span>Alsancak, İzmir &bull; Yüz Yüze & Online Klinik Danışmanlık</span>
          </div>
          <div className="flex items-center gap-4 text-stone-300">
            <a href="tel:05306560632" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D6AFA3]" /> 0530 656 06 32
            </a>
            <span className="opacity-40">|</span>
            <span>Pzt – Cmt: 09:00 – 19:00</span>
          </div>
        </div>
      </div>

      {/* 2. Header / Navigasyon */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex flex-col group">
            <span className="text-2xl font-bold tracking-tight text-[#192923] group-hover:text-[#446A5E] transition-colors">
              Melike Ermumcu
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#446A5E] font-semibold">
              Klinik Psikolog
            </span>
          </a>

          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-stone-700">
            <a href="#hakkimda" className="hover:text-[#446A5E] transition-colors">Hakkımda</a>
            <a href="#calisma-alanlari" className="hover:text-[#446A5E] transition-colors">Çalışma Alanları</a>
            <a href="#testler" className="hover:text-[#446A5E] transition-colors">Test & Değerlendirme</a>
            <a href="#surec" className="hover:text-[#446A5E] transition-colors">Terapi Süreci</a>
            <a href="#egitimler" className="hover:text-[#446A5E] transition-colors">Eğitimler</a>
            <a href="#sss" className="hover:text-[#446A5E] transition-colors">SSS</a>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#randevu"
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#446A5E] text-white hover:bg-[#335047] shadow-md hover:shadow-lg transition-all"
            >
              Randevu Oluştur
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#192923]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobil Menü */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-6 pt-3 pb-6 bg-[#FAF7F2] border-b border-[#E8DFD8] space-y-3">
            <a href="#hakkimda" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-800">Hakkımda</a>
            <a href="#calisma-alanlari" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-800">Çalışma Alanları</a>
            <a href="#testler" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-800">Test & Değerlendirme</a>
            <a href="#surec" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-800">Terapi Süreci</a>
            <a href="#egitimler" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-800">Eğitimler</a>
            <a href="#sss" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-stone-800">SSS</a>
            <a href="#randevu" onClick={() => setMobileMenuOpen(false)} className="block text-center py-3 rounded-xl bg-[#446A5E] text-white font-medium">Randevu Oluştur</a>
          </div>
        )}
      </header>

      {/* 3. Hero Bölümü (Profesyonel Fotoğraf Odaklı Tasarım) */}
      <section className="relative overflow-hidden pt-10 pb-20 md:py-20 border-b border-[#E8DFD8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Sol İçerik */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5ECE9] border border-[#446A5E]/20 text-[#446A5E] text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Bilimsel & Kanıta Dayalı Ekoller
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#192923] leading-[1.18]">
                Düşüncelerinizi anlamak, <br />
                <span className="text-[#446A5E] underline decoration-[#D6AFA3] decoration-4 underline-offset-8">
                  kendinize güvenli bir alan
                </span> açmakla başlar.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                Yetişkinlerde <strong>Bilişsel Davranışçı Terapi (BDT)</strong>, çocuk ve ergenlerde <strong>Oyun Terapisi</strong> ve klinik değerlendirme araçlarıyla Alsancak’ta ve online ortamda profesyonel danışmanlık sunuyorum.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href="#randevu"
                  className="px-7 py-4 rounded-xl bg-[#446A5E] text-white font-semibold hover:bg-[#335047] shadow-lg shadow-[#446A5E]/20 transition-all flex items-center gap-2"
                >
                  Randevu Talebi İletin
                  <ArrowRight className="w-4 h-4" />
                </a>
                
                <a
                  href="https://wa.me/905306560632"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-4 rounded-xl bg-[#F5EAE5] border border-[#D6AFA3] text-[#192923] font-semibold hover:bg-[#EBDCD6] transition-all flex items-center gap-2.5"
                >
                  <svg className="w-5 h-5 fill-current text-[#446A5E]" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.122-.516-1.534-.636-2.529-2.186-2.607-2.29-.076-.104-.627-.834-.627-1.59 0-.756.396-1.127.536-1.28.14-.153.307-.191.41-.191.103 0 .205.001.296.006.096.004.225-.036.352.27.13.312.446 1.085.485 1.164.039.079.065.172.013.276-.052.104-.078.169-.155.26-.078.091-.163.203-.233.273-.078.079-.16.165-.069.321.091.156.405.668.87 1.082.599.534 1.104.699 1.26.778.156.078.247.069.338-.035.091-.104.39-.455.494-.611.104-.156.208-.13.351-.078.144.052.91.43 1.066.508.156.078.26.117.299.182.039.065.039.378-.105.783z"/>
                  </svg>
                  WhatsApp ile Danışın
                </a>
              </div>
            </div>

            {/* Sağ Profesyonel Görsel & Floating Badges */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                
                {/* Arka Plan Dekoratif Halka */}
                <div className="absolute -inset-3 bg-gradient-to-br from-[#446A5E]/20 via-[#F5EAE5] to-[#D6AFA3]/30 rounded-3xl transform rotate-2"></div>
                
                {/* Ana Fotoğraf Kartı */}
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-stone-100">
                  <Image
                    src="/melike-ermumcu.jpg"
                    alt="Klinik Psikolog Melike Ermumcu"
                    width={460}
                    height={640}
                    priority
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Fotoğraf Üzeri Alt İsim Etiketi */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#192923]/90 via-[#192923]/50 to-transparent p-5 text-white">
                    <h3 className="text-lg font-bold">Melike Ermumcu</h3>
                    <p className="text-xs text-[#D6AFA3] font-medium">Uzm. Klinik Psikolog &bull; Oda Psikoloji</p>
                  </div>
                </div>

                {/* Floating Badge: Seans Bilgisi */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm border border-[#E8DFD8] py-2.5 px-4 rounded-2xl shadow-lg flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#E5ECE9] text-[#446A5E]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold text-[#192923] block">Seans Süresi</span>
                    <span className="text-stone-500">45 Dakika</span>
                  </div>
                </div>

                {/* Floating Badge: Onur Derecesi */}
                <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm border border-[#E8DFD8] py-2.5 px-4 rounded-2xl shadow-lg flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#F5EAE5] text-[#446A5E]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold text-[#192923] block">Lisans & YL</span>
                    <span className="text-stone-500">Yüksek Onur Derecesi</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Dört Temel İlke Şeridi */}
      <section className="py-12 bg-[#E5ECE9] border-b border-[#446A5E]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#446A5E] text-white shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#192923]">Koşulsuz Kabul</h4>
                <p className="text-xs text-stone-600 mt-1">Yargılanmadığınız, tamamen güvenli ve samimi terapi ortamı.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#446A5E] text-white shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#192923]">BDT Ekolü</h4>
                <p className="text-xs text-stone-600 mt-1">Düşünce, duygu ve davranış döngüsünü hedefleyen kanıta dayalı teknikler.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#446A5E] text-white shrink-0">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#192923]">Oyun Terapisi</h4>
                <p className="text-xs text-stone-600 mt-1">Çocukların duygularını doğal dili olan oyunla ifade etme süreci.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#446A5E] text-white shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#192923]">Akredite Yetkinlik</h4>
                <p className="text-xs text-stone-600 mt-1">Türk Psikologlar Derneği ve DATEM onaylı sertifikalı uzmanlık.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Hakkımda & Akademik Geçmiş */}
      <section id="hakkimda" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#446A5E]">Özgeçmiş & Yaklaşım</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#192923]">
              Her bireyin deneyimi kendine özgüdür.
            </h2>
            <div className="p-6 rounded-2xl bg-[#F5EAE5] border border-[#D6AFA3] text-stone-800 text-sm leading-relaxed italic">
              &quot;Terapi sürecinde kişinin yaşadığı güçlükleri anlamasına, düşünce ve duygu süreçlerini fark etmesine ve günlük yaşamda daha işlevsel baş etme becerileri geliştirmesine destek oluyorum.&quot;
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              Uluslararası Kıbrıs Üniversitesi Psikoloji lisans programını 3.65 onur derecesiyle tamamladıktan sonra, aynı üniversitede Klinik Psikoloji Yüksek Lisans eğitimimi başarıyla tamamladım.
            </p>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              Klinik çalışmalarımda yetişkin danışanlarla <strong>Bilişsel Davranışçı Terapi (BDT)</strong> çerçevesinde çalışırken; çocuk ve ergen danışanlarımla gelişim düzeylerine uygun olarak <strong>Çocuk Merkezli Oyun Terapisi</strong> ve projektif/bilişsel test bataryaları doğrultusunda ilerlemekteyim.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#E5ECE9] text-[#446A5E]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#446A5E]">2023 - 2025</span>
                    <h4 className="font-bold text-sm text-[#192923]">Klinik Psikoloji (YL)</h4>
                  </div>
                </div>
                <p className="text-xs text-stone-500">Uluslararası Kıbrıs Üniversitesi &bull; GPA: 3.53 / 4.00</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#E5ECE9] text-[#446A5E]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#446A5E]">2018 - 2022</span>
                    <h4 className="font-bold text-sm text-[#192923]">Psikoloji (Lisans)</h4>
                  </div>
                </div>
                <p className="text-xs text-stone-500">Uluslararası Kıbrıs Üniversitesi &bull; GPA: 3.65 / 4.00</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Çalışma Alanları */}
      <section id="calisma-alanlari" className="py-20 bg-white border-y border-[#E8DFD8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#446A5E]">Hizmet Detayları</span>
            <h2 className="text-3xl font-extrabold text-[#192923] mt-1">Uzmanlık ve Çalışma Alanlarım</h2>
            <p className="text-sm text-stone-600 mt-2">
              Bireysel ihtiyaçlara göre yapılandırılmış yüz yüze ve online terapi programları.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Yetişkin */}
            <div className="rounded-3xl bg-[#FAF7F2] p-8 border border-[#E8DFD8] flex flex-col justify-between hover:border-[#446A5E] transition-all group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#E5ECE9] text-[#446A5E] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#192923] mb-3">Yetişkin Bireysel Terapi</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Yetişkinlerle Bilişsel Davranışçı Terapi (BDT) ilkeleri ışığında çalışılmaktadır. Kişinin düşünce-duygu kalıplarını keşfetmesi ve yaşamında karşılaştığı zorluklarla baş etme becerilerini güçlendirmesi hedeflenir.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Panik Bozukluk', 'Sosyal Kaygı', 'OKB', 'TSSB', 'Depresyon', 'Uyum Güçlükleri'].map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-stone-700 border border-[#E8DFD8]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DFD8] text-xs font-semibold text-[#446A5E] flex items-center gap-1.5">
                <Check className="w-4 h-4" /> BDT Temelli Kanıta Dayalı Müdahale Teknikleri
              </div>
            </div>

            {/* Çocuk & Ergen */}
            <div className="rounded-3xl bg-[#FAF7F2] p-8 border border-[#E8DFD8] flex flex-col justify-between hover:border-[#D6AFA3] transition-all group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F5EAE5] text-[#192923] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Baby className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#192923] mb-3">Çocuk & Ergen Terapisi</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Çocukların gelişimsel düzeyine uygun olarak <strong>Çocuk Merkezli Oyun Terapisi</strong> ile duygusal, davranışsal ve sosyal güçlükler ele alınır; ebeveyn danışmanlığı ile süreç desteklenir.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Kaygı & Korkular', 'Öfke Kontrolü', 'DEHB & Odaklanma', 'Okul Olgunluğu', 'Özgüven Gelişimi', 'Sosyal Güçlükler'].map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-stone-700 border border-[#E8DFD8]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DFD8] text-xs font-semibold text-[#446A5E] flex items-center gap-1.5">
                <Check className="w-4 h-4" /> TPD Sertifikalı Çocuk Merkezli Oyun Terapisi
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Psikolojik Testler ve Bataryalar */}
      <section id="testler" className="py-20 bg-[#F5EAE5] border-b border-[#D6AFA3]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#446A5E]">Kapsamlı Değerlendirme</span>
            <h2 className="text-3xl font-extrabold text-[#192923] mt-1">Psikolojik Testler & Klinik Envanterler</h2>
            <div className="mt-3 inline-block px-4 py-1.5 bg-white/80 rounded-full border border-[#D6AFA3] text-xs text-stone-700 font-medium">
              * Testler tanı koymak için tek başına kullanılmaz; klinik görüşme bulgularıyla birleştirilir.
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-[#D6AFA3]/60 shadow-sm">
              <span className="px-2.5 py-1 rounded bg-[#E5ECE9] text-[#446A5E] text-[11px] font-bold">Gelişim</span>
              <h4 className="font-bold text-base text-[#192923] mt-2">AGTE</h4>
              <p className="text-xs text-[#446A5E] font-medium">Ankara Gelişim Tarama Envanteri</p>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                0-6 yaş arası çocukların dil-bilişsel, ince-kaba motor ve sosyal gelişim basamaklarının tespiti.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D6AFA3]/60 shadow-sm">
              <span className="px-2.5 py-1 rounded bg-[#E5ECE9] text-[#446A5E] text-[11px] font-bold">Dikkat</span>
              <h4 className="font-bold text-base text-[#192923] mt-2">d2 Dikkat Testi</h4>
              <p className="text-xs text-[#446A5E] font-medium">Seçici Dikkat & Odaklanma</p>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Psikomotor hız, odaklanma süresi ve dikkat dağınıklığının objektif ölçümü.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D6AFA3]/60 shadow-sm">
              <span className="px-2.5 py-1 rounded bg-[#E5ECE9] text-[#446A5E] text-[11px] font-bold">Okul Çağı</span>
              <h4 className="font-bold text-base text-[#192923] mt-2">Metropolitan</h4>
              <p className="text-xs text-[#446A5E] font-medium">Okul Olgunluğu Testi</p>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Çocuğun 1. sınıfa başlama zihinsel, işitsel ve motor hazırlığının kapsamlı değerlendirmesi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D6AFA3]/60 shadow-sm">
              <span className="px-2.5 py-1 rounded bg-[#E5ECE9] text-[#446A5E] text-[11px] font-bold">Projektif</span>
              <h4 className="font-bold text-base text-[#192923] mt-2">Projektif Çizim Testleri</h4>
              <p className="text-xs text-[#446A5E] font-medium">Duygusal İfade Araçları</p>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Çocuğun aile algısı, içsel çatışmaları ve duygusal dünyasını anlamaya yönelik çizim analizleri.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D6AFA3]/60 shadow-sm">
              <span className="px-2.5 py-1 rounded bg-[#E5ECE9] text-[#446A5E] text-[11px] font-bold">Yetişkin</span>
              <h4 className="font-bold text-base text-[#192923] mt-2">MMPI</h4>
              <p className="text-xs text-[#446A5E] font-medium">Çokyönlü Kişilik Envanteri</p>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Yetişkinlerde kişilik örüntüleri, savunma mekanizmaları ve klinik semptomların standart analizi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm">
              <span className="px-2.5 py-1 rounded bg-[#E5ECE9] text-[#446A5E] text-[11px] font-bold">Ölçekler</span>
              <h4 className="font-bold text-base text-[#192923] mt-2">Duygu Durum Ölçekleri</h4>
              <p className="text-xs text-[#446A5E] font-medium">Semptom & Belirti Taraması</p>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Kaygı, depresyon, öfke ve davranış ölçekleriyle klinik tablonun şiddetini belirleme.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Terapi Süreci (Koyu Kontrast Bölümü) */}
      <section id="surec" className="py-20 bg-[#192923] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D6AFA3]">Adım Adım İlerleme</span>
            <h2 className="text-3xl font-extrabold text-[#FAF7F2] mt-1">Danışmanlık Süreci Nasıl İşler?</h2>
            <p className="text-sm text-stone-300 mt-2">
              Şeffaf, etik ilkelere bağlı ve danışan odaklı üç aşamalı terapi protokolü.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            
            <div className="p-8 rounded-3xl bg-[#233830] border border-[#446A5E]/40 relative">
              <div className="text-3xl font-extrabold text-[#D6AFA3] mb-4">01</div>
              <h3 className="text-lg font-bold text-white mb-2">Randevu & Ön Değerlendirme</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Web sitesi veya WhatsApp üzerinden talebinizi iletirsiniz. Yüz yüze veya online görüşme tercihine göre en uygun gün ve saat belirlenir.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#233830] border border-[#446A5E]/40 relative">
              <div className="text-3xl font-extrabold text-[#D6AFA3] mb-4">02</div>
              <h3 className="text-lg font-bold text-white mb-2">İlk Görüşme & Vaka Analizi</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                45 dakikalık ilk seansta mevcut güçlükler, gelişim öyküsü ve beklentiler detaylıca dinlenir; gerekli psikolojik ölçekler planlanır.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#233830] border border-[#446A5E]/40 relative">
              <div className="text-3xl font-extrabold text-[#D6AFA3] mb-4">03</div>
              <h3 className="text-lg font-bold text-white mb-2">Terapi Planı & Kazanımlar</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Bilişsel Davranışçı Terapi veya Oyun Terapisi hedefleri belirlenir. Düzenli seanslarla işlevsel baş etme mekanizmaları geliştirilir.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Sertifikalar & Akreditasyonlar */}
      <section id="egitimler" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#446A5E]">Mesleki Yetkinlik</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#192923] mt-1">Alınan Eğitimler & Sertifikalar</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-[#192923]">Bilişsel ve Davranışsal Terapiler Eğitimi (BDT)</h4>
              <p className="text-xs text-stone-500 mt-1">DATEM, BİKTEP &bull; Prof. Dr. Ebru Şalcıoğlu</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Sertifika No: BDT2301-A03005</p>
            </div>
            <span className="px-3 py-1 bg-[#E5ECE9] text-[#446A5E] font-bold text-xs rounded-full shrink-0">2023</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-[#192923]">Çocuk Merkezli Oyun Terapisi</h4>
              <p className="text-xs text-stone-500 mt-1">Türk Psikologlar Derneği &bull; Doç. Dr. Cihat Çelik</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Belge No: 2026/3014</p>
            </div>
            <span className="px-3 py-1 bg-[#E5ECE9] text-[#446A5E] font-bold text-xs rounded-full shrink-0">2026</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-[#192923]">Çocuk Değerlendirme Paketi Eğitimi</h4>
              <p className="text-xs text-stone-500 mt-1">Türk Psikologlar Derneği &bull; Doç. Dr. Cihat Çelik</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Belge No: 2026/3425</p>
            </div>
            <span className="px-3 py-1 bg-[#E5ECE9] text-[#446A5E] font-bold text-xs rounded-full shrink-0">2026</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-[#192923]">MMPI Uygulama ve Yorumlama Eğitimi</h4>
              <p className="text-xs text-stone-500 mt-1">Türk Psikologlar Derneği &bull; Doç. Dr. Merve Muazzez Avcıoğlu</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Belge No: 1919 / 2025</p>
            </div>
            <span className="px-3 py-1 bg-[#E5ECE9] text-[#446A5E] font-bold text-xs rounded-full shrink-0">2025</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-[#192923]">Portage Erken Çocukluk Eğitimi</h4>
              <p className="text-xs text-stone-500 mt-1">Dr. Ender Uzundemir Marangoz (Özel Eğitim Uzmanı)</p>
            </div>
            <span className="px-3 py-1 bg-[#E5ECE9] text-[#446A5E] font-bold text-xs rounded-full shrink-0">2024</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-[#192923]">Çocuk İstismarı ve İhmali Eğitimi</h4>
              <p className="text-xs text-stone-500 mt-1">Paradoks Psikoloji</p>
            </div>
            <span className="px-3 py-1 bg-[#E5ECE9] text-[#446A5E] font-bold text-xs rounded-full shrink-0">2022</span>
          </div>

        </div>
      </section>

      {/* 10. Sıkça Sorulan Sorular (SSS) */}
      <section id="sss" className="py-20 bg-white border-y border-[#E8DFD8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#446A5E]">Merak Edilenler</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#192923] mt-1">Sıkça Sorulan Sorular</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#E8DFD8] bg-[#FAF7F2] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#192923]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#446A5E] transition-transform shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#E8DFD8] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. Randevu & İletişim Formu */}
      <section id="randevu" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Sol İletişim Kartı */}
          <div id="iletisim" className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#446A5E]">İletişim & Konum</span>
              <h2 className="text-3xl font-extrabold text-[#192923] mt-1">Randevu Oluşturun</h2>
              <p className="text-sm text-stone-600 mt-2">
                Terapi süreciyle ilgili sorularınız veya seans planlaması için formu doldurabilir ya da doğrudan arayabilirsiniz.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DFD8]">
                <div className="p-2.5 rounded-xl bg-[#E5ECE9] text-[#446A5E] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#192923] block text-sm">Yüz Yüze Görüşme Adresi</span>
                  <span className="text-stone-600">Alsancak Mah. 1476/1 Sk. No:12 Katipoğlu İşmerkezi Daire:4, Konak / İzmir (Oda Psikoloji)</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DFD8]">
                <div className="p-2.5 rounded-xl bg-[#E5ECE9] text-[#446A5E] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#192923] block text-sm">Telefon & WhatsApp</span>
                  <a href="tel:05306560632" className="text-stone-600 hover:text-[#446A5E] font-medium">0530 656 06 32</a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DFD8]">
                <div className="p-2.5 rounded-xl bg-[#E5ECE9] text-[#446A5E] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#192923] block text-sm">E-Posta</span>
                  <a href="mailto:melikeermumcu0@gmail.com" className="text-stone-600 hover:text-[#446A5E] font-medium">melikeermumcu0@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DFD8]">
                <div className="p-2.5 rounded-xl bg-[#E5ECE9] text-[#446A5E] shrink-0">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#192923] block text-sm">Instagram</span>
                  <a href="https://instagram.com/uzm.psk.melikeermumcu" target="_blank" rel="noreferrer" className="text-stone-600 hover:text-[#446A5E] font-medium">@uzm.psk.melikeermumcu</a>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Randevu Formu */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E8DFD8] shadow-lg">
            <h3 className="text-xl font-bold text-[#192923] mb-2">Randevu Talebi Formu</h3>
            <p className="text-xs text-stone-500 mb-6">Bilgileriniz etik ve gizlilik ilkeleri çerçevesinde korunmaktadır.</p>

            {status === 'success' ? (
              <div className="p-8 rounded-2xl bg-[#E5ECE9] border border-[#446A5E]/40 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-[#446A5E] mx-auto" />
                <h4 className="text-lg font-bold text-[#192923]">Talebiniz Başarıyla İletildi!</h4>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Randevu talebiniz Klinik Psikolog Melike Ermumcu&apos;ya ulaştı[cite: 1]. En kısa sürede sizinle iletişime geçilecektir.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#446A5E] text-white text-xs font-semibold hover:bg-[#335047]"
                >
                  Yeni Bir Talep Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1.5">Ad Soyad *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Adınız ve Soyadınız"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1.5">Telefon Numarası *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05XX XXX XX XX"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1.5">E-Posta Adresi</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ornek@mail.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#192923] mb-1.5">Görüşme Tercihi *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E] transition-colors text-stone-800"
                    >
                      <option value="Yüz Yüze Görüşme (Alsancak / İzmir)">Yüz Yüze Görüşme (Alsancak / İzmir)</option>
                      <option value="Online Görüşme">Online Görüşme</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1.5">Tercih Ettiğiniz Gün ve Saat Aralığı</label>
                  <input
                    type="text"
                    value={formData.datePreference}
                    onChange={(e) => setFormData({ ...formData, datePreference: e.target.value })}
                    placeholder="Örn: Hafta içi öğleden sonra veya Çarşamba 14:00"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1.5">Kısaca Başvuru Nedeniniz</label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Görüşmek istediğiniz konuyu özetleyebilirsiniz..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#446A5E] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 rounded-xl bg-[#446A5E] text-white font-bold text-sm hover:bg-[#335047] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      İletiliyor...
                    </>
                  ) : (
                    'Randevu Talebini Gönder'
                  )}
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* 12. Footer */}
      <footer className="bg-[#192923] text-stone-400 py-12 border-t border-[#446A5E]/30 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <span className="text-lg font-bold text-[#FAF7F2] block">Klinik Psikolog Melike Ermumcu[cite: 1]</span>
              <span className="text-stone-400 text-xs">Oda Psikoloji &bull; Alsancak, İzmir & Online Danışmanlık</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#hakkimda" className="hover:text-white transition-colors">Hakkımda</a>
              <a href="#calisma-alanlari" className="hover:text-white transition-colors">Hizmetler</a>
              <a href="#testler" className="hover:text-white transition-colors">Testler</a>
              <a href="#randevu" className="hover:text-white transition-colors">Randevu</a>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6 text-center text-stone-500 text-[11px]">
            &copy; 2026 Klinik Psikolog Melike Ermumcu. Tüm hakları saklıdır. Bu sitede yer alan içerikler bilgilendirme amaçlı olup hekim tanısı yerine geçmez[cite: 1].
          </div>
        </div>
      </footer>

    </div>
  );
}