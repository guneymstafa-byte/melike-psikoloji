'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HeartHandshake, 
  Sparkles, 
  Puzzle, 
  Brain, 
  Calendar, 
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
  BookOpen
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Yüz Yüze Görüşme (Alsancak / İzmir)',
    date: '',
    note: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Dinamik Blog Yazıları (Supabase'den çekilir, yoksa varsayılanlar görünür)
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

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (data && data.length > 0 && !error) {
          setBlogPosts(data);
        }
      } catch (err) {
        console.log('Bloglar yüklenirken statik veriler kullanılıyor.');
      }
    }
    fetchLatestPosts();
  }, []);

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
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Yüz Yüze Görüşme (Alsancak / İzmir)',
          date: '',
          note: ''
        });
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
      title: "Klinik & Gelişim Testleri",
      desc: "MOXO Dikkat Testi, Denver II Gelişimsel Tarama, WISC-R zeka profili ve objektif projektif değerlendirme ölçekleri.",
      tags: ["MOXO Dikkat Testi", "Denver II Gelişim", "Projektif Testler"]
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#192923] font-sans selection:bg-[#D6AFA3] selection:text-white">
      
      {/* ÜST BİLGİ ŞERİDİ */}
      <div className="bg-[#192923] text-[#FAF7F2]/80 text-xs py-2.5 px-4 border-b border-[#FAF7F2]/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D6AFA3]" /> Alsancak, Konak / İzmir &bull; Yüz Yüze & Online Klinik Danışmanlık
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
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#192923]">
              Melike Ermumcu
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#446A5E] font-bold">
              Klinik Psikolog
            </span>
          </Link>

          {/* Masaüstü Menü */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#192923]/80">
            <a href="#hakkimda" className="hover:text-[#446A5E] transition-colors">Hakkımda</a>
            <a href="#uzmanliklar" className="hover:text-[#446A5E] transition-colors">Uzmanlıklar</a>
            <a href="#testler" className="hover:text-[#446A5E] transition-colors">Klinik Testler</a>
            <a href="#blog" className="hover:text-[#446A5E] transition-colors">Yazılar & Blog</a>
            <a href="#sss" className="hover:text-[#446A5E] transition-colors">Sıkça Sorulanlar</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="#randevu"
              className="px-5 py-2.5 rounded-full bg-[#446A5E] hover:bg-[#335047] text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all duration-200"
            >
              Randevu Oluştur
            </a>
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#192923] hover:text-[#446A5E]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobil Menü */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF7F2] border-b border-[#E8DFD8] px-4 pt-2 pb-6 space-y-3">
            <a
              href="#hakkimda"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#192923]"
            >
              Hakkımda
            </a>
            <a
              href="#uzmanliklar"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#192923]"
            >
              Uzmanlıklar
            </a>
            <a
              href="#testler"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#192923]"
            >
              Klinik Testler
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#192923]"
            >
              Yazılar & Blog
            </a>
            <a
              href="#sss"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#192923]"
            >
              Sıkça Sorulanlar
            </a>
            <a
              href="#randevu"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-full bg-[#446A5E] text-white text-xs font-bold"
            >
              Randevu Oluştur
            </a>
          </div>
        )}
      </header>

      {/* HERO BÖLÜMÜ */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5ECE9] border border-[#446A5E]/20 text-[#446A5E] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Akredite & Bilimsel Terapi Ekolleri</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#192923] leading-tight">
                Düşüncelerinizi anlamak, kendinize <span className="text-[#446A5E] italic">güvenli bir alan</span> açmakla başlar.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Yetişkinlerde Bilişsel Davranışçı Terapi (BDT), çocuk ve ergenlerde Oyun Terapisi ile klinik değerlendirme araçlarını harmanlayarak Alsancak&apos;ta ve online ortamda danışanlarıma profesyonel bir yol haritası sunuyorum.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#randevu"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#446A5E] hover:bg-[#335047] text-white text-sm font-semibold shadow-lg shadow-[#446A5E]/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>Randevu Talebi İletin</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://wa.me/905306560632"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F5EAE5] border border-[#D6AFA3] text-[#192923] text-sm font-semibold hover:bg-[#EBDCD6] transition-all text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current text-[#446A5E]" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.122-.516-1.534-.636-2.529-2.186-2.607-2.29-.076-.104-.627-.834-.627-1.59 0-.756.396-1.127.536-1.28.14-.153.307-.191.41-.191.103 0 .205.001.296.006.096.004.225-.036.352.27.13.312.446 1.085.485 1.164.039.079.065.172.013.276-.052.104-.078.169-.155.26-.078.091-.163.203-.233.273-.078.079-.16.165-.069.321.091.156.405.668.87 1.082.599.534 1.104.699 1.26.778.156.078.247.069.338-.035.091-.104.39-.455.494-.611.104-.156.208-.13.351-.078.144.052.91.43 1.066.508.156.078.26.117.299.182.039.065.039.378-.105.783z"/>
                  </svg>
                  WhatsApp ile Danışın
                </a>
              </div>

              {/* Güven Rozetleri */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E8DFD8]">
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-bold text-[#192923]">Klinik Psikoloji</p>
                  <p className="text-xs text-stone-500 font-medium">Yüksek Lisans Derecesi</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-bold text-[#192923]">BDT & Oyun</p>
                  <p className="text-xs text-stone-500 font-medium">Uygulayıcı Sertifikalı</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-bold text-[#192923]">%100</p>
                  <p className="text-xs text-stone-500 font-medium">Gizlilik & Etik İlke</p>
                </div>
              </div>
            </div>

            {/* Fotoğraf Alanı */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-200">
                <Image
                  src="/melike-ermumcu.jpg"
                  alt="Klinik Psikolog Melike Ermumcu"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#192923]/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-white/40 shadow-lg">
                  <p className="text-xs font-bold text-[#192923]">Klinik Psikolog Melike Ermumcu</p>
                  <p className="text-[11px] text-[#446A5E] font-medium">Uzm. Klinik Psikolog &bull; Alsancak, İzmir</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HAKKIMDA BÖLÜMÜ */}
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
                Uluslararası Kıbrıs Üniversitesi Psikoloji lisans programını 3.65 onur derecesiyle tamamladıktan sonra, aynı üniversitede Klinik Psikoloji Yüksek Lisans eğitimimi başarıyla tamamladım. Bilişsel Davranışçı Terapi ekolü çerçevesinde bireylerin düşünce kalıplarını yeniden yapılandırmalarına ve duygusal direnç kazanmalarına eşlik ediyorum.
              </p>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Çocuklarla yürüttüğüm çalışmalarda ise oyunun dönüştürücü ve onarıcı gücünden faydalanıyorum. Seans odasını; yargısız, kabul edici ve tamamen danışanın ritmine göre şekillenen bir güven alanı olarak tasarlıyorum.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-start gap-3">
                  <Award className="w-5 h-5 text-[#446A5E] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#192923]">BDT Uygulayıcısı</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Bilişsel Davranışçı Psikoterapiler Derneği Akreditasyonu</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#D6AFA3] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#192923]">Oyun Terapisi Uzmanlığı</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Çocuk Merkezli ve Deneyimsel Oyun Ekolü</p>
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
                    <p className="text-xs text-stone-600 mt-1">Her danışanın yaşam serüveni biriciktir; terapi haritası kişisel ihtiyaçlara göre özelleştirilir.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#E5ECE9] text-[#446A5E] flex items-center justify-center shrink-0 font-bold text-xs">02</div>
                  <div>
                    <h5 className="text-sm font-bold text-[#192923]">Bilimsel ve Kanıta Dayalı Ekoller</h5>
                    <p className="text-xs text-stone-600 mt-1">Uluslararası geçerliliği kanıtlanmış psikoterapi ekolleri ve geçerli test bataryaları kullanılır.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#E5ECE9] text-[#446A5E] flex items-center justify-center shrink-0 font-bold text-xs">03</div>
                  <div>
                    <h5 className="text-sm font-bold text-[#192923]">Mutlak Gizlilik ve Etik Standartlar</h5>
                    <p className="text-xs text-stone-600 mt-1">Türk Psikologlar Derneği etik yönetmeliği ilkelerine titizlikle bağlı kalınır.</p>
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
            <p className="text-sm text-stone-600">Her yaş grubuna ve ihtiyaca yönelik yapılandırılmış profesyonel seans süreçleri.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-[#E8DFD8] shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-center">
                    {svc.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#192923]">{svc.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{svc.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E8DFD8]/60">
                  {svc.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#FAF7F2] text-stone-600 border border-[#E8DFD8]"
                    >
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
              <span className="text-xs font-bold text-[#D6AFA3] uppercase tracking-widest">Objektif Ölçümleme</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Uygulanan Klinik Değerlendirme & Gelişim Testleri
              </h2>
              <p className="text-sm sm:text-base text-[#FAF7F2]/80 leading-relaxed">
                Tanı ve terapi sürecini desteklemek amacıyla dünya standartlarında kabul görmüş ölçekler ve projektif testler uygulanmaktadır.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="text-sm font-bold text-white">MOXO Dikkat Testi</h4>
                  <p className="text-xs text-[#FAF7F2]/70">Dikkat eksikliği, hiperaktivite ve zamanlama profilini bilgisayarlı görsel/işitsel çeldiricilerle ölçer.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="text-sm font-bold text-white">Denver II Gelişimsel Tarama</h4>
                  <p className="text-xs text-[#FAF7F2]/70">0-6 yaş arası çocukların motor, dil ve sosyal beceri gelişimlerini ayrıntılı olarak raporlar.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="text-sm font-bold text-white">Projektif Çizim & Çocuk Testleri</h4>
                  <p className="text-xs text-[#FAF7F2]/70">Bir İnsan Çiz, Louisa Düss Psikanalitik Hikayeler ve Beier Cümle Tamamlama testleri.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="text-sm font-bold text-white">Objektif Kişilik & Duygu Ölçekleri</h4>
                  <p className="text-xs text-[#FAF7F2]/70">Beck Depresyon ve Anksiyete Ölçekleri ile duygu durum haritalandırması.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG BÖLÜMÜ (CANLI SUPABASE BAĞLANTILI) */}
      <section id="blog" className="py-20 bg-white border-y border-[#E8DFD8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#446A5E] uppercase tracking-widest">Psikoloji Kütüphanesi</span>
              <h2 className="text-3xl font-extrabold text-[#192923]">Yazılar & Makaleler</h2>
              <p className="text-xs sm:text-sm text-stone-500">Ruh sağlığı, çocuk gelişimi ve terapötik farkındalık üzerine yazılar.</p>
            </div>
            <Link
              href="/admin"
              className="text-xs text-[#446A5E] hover:text-[#335047] font-bold underline cursor-pointer"
            >
              Yönetici Paneli (Yazı Ekle) →
            </Link>
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

      {/* SSS BÖLÜMÜ */}
      <section id="sss" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-[#446A5E] uppercase tracking-widest">Merak Edilenler</span>
            <h2 className="text-3xl font-extrabold text-[#192923]">Sıkça Sorulan Sorular</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8DFD8] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer"
                >
                  <span className="text-sm font-bold text-[#192923] flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#446A5E] shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-xl font-bold text-stone-400">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
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
            
            {/* İletişim Bilgileri */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#446A5E] uppercase tracking-widest">İletişim & Randevu</span>
                <h2 className="text-3xl font-extrabold text-[#192923]">İlk Adımı Atın</h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Yüz yüze veya online seans talebi oluşturmak için formu doldurabilir ya da doğrudan iletişim kanallarından ulaşabilirsiniz.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8]">
                  <MapPin className="w-5 h-5 text-[#446A5E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Yüz Yüze Görüşme Adresi</p>
                    <p className="text-xs sm:text-sm font-bold text-[#192923] leading-relaxed">
                      Alsancak Mah. 1476/1 Sk. No:12 Katipoğlu İşmerkezi Daire:4, Alsancak, 35200 Konak / İzmir
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8]">
                  <Phone className="w-5 h-5 text-[#446A5E]" />
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Telefon & WhatsApp</p>
                    <a href="tel:05306560632" className="text-sm font-bold text-[#192923] hover:text-[#446A5E] transition-colors">
                      0530 656 06 32
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8]">
                  <Mail className="w-5 h-5 text-[#446A5E]" />
                  <div>
                    <p className="text-xs text-stone-500 font-medium">E-Posta</p>
                    <a href="mailto:melikeermumcu0@gmail.com" className="text-sm font-bold text-[#192923] hover:text-[#446A5E] transition-colors">
                      melikeermumcu0@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8]">
                  <Clock className="w-5 h-5 text-[#446A5E]" />
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Çalışma Saatleri</p>
                    <p className="text-sm font-bold text-[#192923]">Pazartesi - Cumartesi: 09:00 - 19:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Randevu Formu */}
            <div className="lg:col-span-7 bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#E8DFD8] shadow-sm">
              <h3 className="text-xl font-bold text-[#192923] mb-6">Ön Görüşme & Randevu Formu</h3>

              {formStatus === 'success' && (
                <div className="p-4 mb-6 rounded-2xl bg-[#E5ECE9] border border-[#446A5E]/40 text-[#446A5E] text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Randevu talebiniz başarıyla iletildi. En kısa sürede sizinle iletişime geçilecektir.</span>
                </div>
              )}

              {formStatus === 'error' && (
                <div className="p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  Bir hata oluştu. Lütfen doğrudan e-posta ile iletişime geçiniz.
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
                    <label className="block text-xs font-bold text-[#192923] mb-1">Görüşme Tercihi / Hizmet Alanı *</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                    >
                      <option value="Yüz Yüze Görüşme (Alsancak / İzmir)">Yüz Yüze Görüşme (Alsancak / İzmir)</option>
                      <option value="Online Görüşme">Online Terapi / Görüşme</option>
                      <option value="Bireysel Yetişkin Terapisi">Bireysel Yetişkin Terapisi</option>
                      <option value="Çocuk & Oyun Terapisi">Çocuk & Oyun Terapisi</option>
                      <option value="MOXO Dikkat Testi & Klinik Değerlendirme">MOXO & Klinik Testler</option>
                      <option value="Ebeveyn Danışmanlığı">Ebeveyn Danışmanlığı</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192923] mb-1">Tercih Edilen Gün / Notunuz</label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Görüşmek istediğiniz konu veya uygun olduğunuz gün/saat aralıkları..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8DFD8] text-sm focus:outline-none focus:border-[#446A5E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full py-4 rounded-2xl bg-[#446A5E] hover:bg-[#335047] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
            <Link href="/admin" className="hover:text-white transition-colors text-[#D6AFA3]">Panel Girişi</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}