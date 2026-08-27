'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

interface PostData {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  read_time?: string;
  created_at?: string;
}

export default function BlogPostDetail() {
  const params = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!params?.slug) return;
      const slugVal = Array.isArray(params.slug) ? params.slug[0] : params.slug;

      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slugVal)
        .single();

      if (data) {
        setPost(data as PostData);
      }
      setLoading(false);
    }
    fetchPost();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#192923]">
        <p className="text-sm font-medium">Yazı yükleniyor...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center text-[#192923] p-4 font-sans">
        <h2 className="text-xl font-bold mb-2">Makale Bulunamadı</h2>
        <p className="text-xs text-stone-500 mb-4">Aradığınız makale mevcut olmayabilir veya yayından kaldırılmış olabilir.</p>
        <Link href="/" className="text-xs text-[#446A5E] font-semibold underline">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#192923] font-sans selection:bg-[#D6AFA3]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#446A5E] hover:text-[#335047] mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>

        <article className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8DFD8] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
            <span className="px-3 py-1 rounded-full bg-[#E5ECE9] text-[#446A5E] font-bold">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.read_time || '4 dk okuma'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#192923] leading-tight">
            {post.title}
          </h1>

          <div className="p-4 rounded-2xl bg-[#F5EAE5] border border-[#D6AFA3]/40 text-stone-700 italic text-sm">
            {post.excerpt}
          </div>

          <div className="text-stone-700 text-base leading-relaxed whitespace-pre-line pt-4 border-t border-[#E8DFD8]">
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
}